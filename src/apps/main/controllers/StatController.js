const mongoose = require("mongoose");
const Magasin = require("../models/Magasin");
const Service = require("../models/Service");
const Store = require("../models/Store");
const BookingRequest = require("../models/BookingRequest");

exports.getStatMagasin = async (req, res) => {
  try {
    const { id } = req.params;

    // Vérifiez si l'ID est un ObjectId valide
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }

    const stats = await Magasin.aggregate([
      {
        $match: { _id: new mongoose.Types.ObjectId(id) },
      },
      {
        $project: {
          _id: 1,
          totalVisits: {
            $sum: {
              $map: {
                input: "$data.visits.auth",
                as: "auth",
                in: { $sum: "$$auth.days" },
              },
            },
          },
          totalNoAuthVisits: {
            $sum: {
              $map: {
                input: "$data.visits.noAuth",
                as: "noAuth",
                in: { $sum: "$$noAuth.days" },
              },
            },
          },
          totalBookings: "$data.bookings",
          totalBookmarks: "$data.bookmarks",
        },
      },
      {
        $addFields: {
          totalVisits: { $add: ["$totalVisits", "$totalNoAuthVisits"] },
        },
      },
      {
        $project: {
          _id: 1,
          totalVisits: 1,
          totalBookings: 1,
          totalBookmarks: 1,
        },
      },
    ]);

    res.json(
      stats[0] || { totalVisits: 0, totalBookings: 0, totalBookmarks: 0 }
    );
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
        $match: { magasin: objectId },
      },
      {
        $lookup: {
          from: "bookingrequests",
          localField: "_id",
          foreignField: "service",
          as: "bookingRequests",
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "category",
        },
      },
      {
        $project: {
          _id: 1,
          Name: 1,
          time: 1,
          category: { $arrayElemAt: ["$category.categoryName", 0] },
          numberOfBookingRequests: {
            $size: {
              $filter: {
                input: "$bookingRequests",
                as: "bookingRequest",
                cond: { $eq: ["$$bookingRequest.confirmed", true] },
              },
            },
          },
          "data.visits": 1,
        },
      },
    ]);

    res.json(services);
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des statistiques des services:",
      error
    );
    res.status(500).json({
      message: "Erreur lors de la récupération des statistiques des services",
    });
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
        $match: { owner: objectId }, // Filtrer par le propriétaire du magasin
      },
      {
        $lookup: {
          from: "bookingrequests", // Nom de la collection de BookingRequest
          localField: "_id",
          foreignField: "store",
          as: "bookingRequests",
        },
      },
      {
        $project: {
          _id: 1,
          storeName: 1,
          location: 1,
          "infos.Adresse": 1, // Accéder à l'adresse du magasin à travers les infos du magasin
          owner: 1, // Inclure l'ID du propriétaire du magasin
          "infos.numero": 1, // Accéder au numéro de téléphone à travers les infos du magasin
          numberOfBookingRequests: {
            $size: {
              $filter: {
                input: "$bookingRequests",
                as: "bookingRequest",
                cond: { $eq: ["$$bookingRequest.confirmed", true] },
              },
            },
          }, // Calcul du nombre de demandes de réservation
        },
      },
    ]);

    res.json(stores);
  } catch (error) {
    console.error("Erreur lors de la récupération des stores:", error);
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération des stores" });
  }
};
exports.getBookingStat = async (req, res) => {
  try {
    const { idMagas } = req.params;

    if (!mongoose.Types.ObjectId.isValid(idMagas)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }

    const objectId = new mongoose.Types.ObjectId(idMagas);

    // Trouver tous les stores appartenant au magasin donné
    const stores = await Store.find({ owner: objectId }).select("_id").exec();
    const storeIds = stores.map((store) => store._id);

    const results = await BookingRequest.aggregate([
      {
        // Filtre pour les `BookingRequest` confirmés des stores appartenant au magasin donné
        $match: {
          store: { $in: storeIds },
          confirmed: true,
        },
      },
      {
        // Extrait l'année et le mois du champ `date`
        $project: {
          year: { $year: "$date" },
          month: { $month: "$date" },
        },
      },
      {
        // Groupe par année et mois, et compte le nombre de documents dans chaque groupe
        $group: {
          _id: { year: "$year", month: "$month" },
          count: { $sum: 1 },
        },
      },
      {
        // Trie les résultats par année puis par mois
        $sort: { "_id.year": 1, "_id.month": 1 },
      },
      {
        // Optionnel: formate les résultats
        $project: {
          _id: 0,
          year: "$_id.year",
          month: "$_id.month",
          count: "$count",
        },
      },
    ]);

    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getGenderStats = async (req, res) => {
  try {
    const statistics = await BookingRequest.aggregate([
      {
        $match: { confirmed: true },
      },
      {
        $lookup: {
          from: "services",
          localField: "service",
          foreignField: "_id",
          as: "serviceDetails",
        },
      },
      {
        $unwind: "$serviceDetails",
      },
      {
        $group: {
          _id: "$serviceDetails.cible",
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          gender: "$_id",
          count: 1,
          _id: 0,
        },
      },
    ]);

    res.status(200).json(statistics);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
