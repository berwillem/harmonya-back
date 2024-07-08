const mongoose = require("mongoose");
const Magasin = require("../models/Magasin");
const Service = require("../models/Service");
const Store = require("../models/Store");

exports.getStatMagasin = async (req, res) => {
  try {
    const { id } = req.params;
  

    // Vérifiez si l'ID est un ObjectId valide
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }

    const stats = await Magasin.aggregate([
      {
        $match: { _id: new mongoose.Types.ObjectId(id) }
      },
      {
        $project: {
          _id: 1,
          totalVisits: {
            $sum: {
              $map: {
                input: "$data.visits.auth",
                as: "auth",
                in: { $sum: "$$auth.days" }
              }
            }
          },
          totalNoAuthVisits: {
            $sum: {
              $map: {
                input: "$data.visits.noAuth",
                as: "noAuth",
                in: { $sum: "$$noAuth.days" }
              }
            }
          },
          totalBookings: "$data.bookings",
          totalBookmarks: "$data.bookmarks"
        }
      },
      {
        $addFields: {
          totalVisits: { $add: ["$totalVisits", "$totalNoAuthVisits"] }
        }
      },
      {
        $project: {
          _id: 1,
          totalVisits: 1,
          totalBookings: 1,
          totalBookmarks: 1
        }
      }
    ]);

  

    res.json(stats[0] || { totalVisits: 0, totalBookings: 0, totalBookmarks: 0 });
  } catch (err) {
    console.error("Error get stat:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};


exports.getAllServicesStat = async (req, res) => {
  try {
    const { idMag } = req.params;

    if (!mongoose.Types.ObjectId.isValid(idMag)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }

  
    const objectId = new mongoose.Types.ObjectId(idMag);

  
    const services = await Service.aggregate([
      {
        $match: { 'magasin': objectId }
      },
      {
        $lookup: {
          from: 'bookingrequests',
          localField: '_id',
          foreignField: 'service',
          as: 'bookingRequests'
        }
      },
      {
        $lookup: {
          from: 'categories', 
          localField: 'category',
          foreignField: '_id',
          as: 'category'
        }
      },
      {
        $project: {
          _id: 1,
          Name: 1,
          time: 1,
          category: { $arrayElemAt: ['$category.categoryName', 0] }, 
          numberOfBookingRequests: { $size: '$bookingRequests' },
          'data.visits': 1 
        }
      }
    ]);
console.log(services);
    res.json(services);
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques des services:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des statistiques des services' });
  }
};
  exports.getAllStoresStat = async (req, res) => {
    try {
      const { idMagasin } = req.params;
  
      // Valider l'ID du magasin
      if (!mongoose.Types.ObjectId.isValid(idMagasin)) {
        return res.status(400).json({ error: "Invalid ID format" });
      }
  
      // Utilisez new mongoose.Types.ObjectId pour créer une instance d'ObjectId
      const objectId = new mongoose.Types.ObjectId(idMagasin);
  
      // Effectuer l'agrégation MongoDB pour récupérer les stores avec les informations nécessaires
      const stores = await Store.aggregate([
        {
          $match: { owner: objectId } // Filtrer par le propriétaire du magasin
        },
        {
          $lookup: {
            from: 'bookingrequests', // Nom de la collection de BookingRequest
            localField: '_id',
            foreignField: 'store',
            as: 'bookingRequests'
          }
        },
        {
          $project: {
            _id: 1,
            storeName: 1,
            location: 1,
            'infos.Adresse': 1, // Accéder à l'adresse du magasin à travers les infos du magasin
            owner: 1, // Inclure l'ID du propriétaire du magasin
            'infos.numero': 1, // Accéder au numéro de téléphone à travers les infos du magasin
            numberOfBookingRequests: { $size: '$bookingRequests' } // Calcul du nombre de demandes de réservation
          }
        }
      ]);
  
      res.json(stores);
    } catch (error) {
      console.error('Erreur lors de la récupération des stores:', error);
      res.status(500).json({ message: 'Erreur lors de la récupération des stores' });
    }
  };