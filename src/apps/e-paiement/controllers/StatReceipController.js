const Receip = require("../../e-paiement/models/Receipt");
const mongoose = require("mongoose");
exports.getRevenusByMagasain = async (req, res) => {
  const { IdMagasain } = req.params;
  const { year, month } = req.query;

  try {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;

    const filter = { magasin: IdMagasain };

    if (year) {
      if (!/^\d{4}$/.test(year)) {
        return res.status(400).json({ error: "Invalid year format" });
      }
      const startYear = new Date(`${year}-01-01T00:00:00.000Z`);
      const endYear = new Date(`${parseInt(year) + 1}-01-01T00:00:00.000Z`);

      filter.Date = {
        $gte: startYear,
        $lt: endYear,
      };
    } else {
      const startYear = new Date(`${currentYear}-01-01T00:00:00.000Z`);
      const endYear = new Date(`${currentYear + 1}-01-01T00:00:00.000Z`);

      filter.Date = {
        $gte: startYear,
        $lt: endYear,
      };
    }

    if (month) {
      if (!/^\d{2}$/.test(month) || month < 1 || month > 12) {
        return res.status(400).json({ error: "Invalid month format" });
      }
      const startMonth = new Date(
        `${year}-${month.padStart(2, "0")}-01T00:00:00.000Z`
      );
      const endMonth = new Date(startMonth);
      endMonth.setMonth(endMonth.getMonth() + 1);

      filter.Date = {
        $gte: startMonth,
        $lt: endMonth,
      };
    } else if (!year) {
      const startMonth = new Date(
        `${currentYear}-${currentMonth
          .toString()
          .padStart(2, "0")}-01T00:00:00.000Z`
      );
      const endMonth = new Date(startMonth);
      endMonth.setMonth(endMonth.getMonth() + 1);

      filter.Date = {
        $gte: startMonth,
        $lt: endMonth,
      };
    }

    const receipts = await Receip.find(filter);
    let totalRevenus = receipts.reduce(
      (total, receipt) =>
        total +
        receipt.custom +
        receipt.services.reduce(
          (sTotal, service) => sTotal + service.prix * service.quantity,
          0
        ),
      0
    );

    return res.status(200).json({ totalRevenus });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ error: error.message });
  }
};
exports.getTopServices = async (req, res) => {
  const { IdMagasain } = req.params;
//copyright_wassim
  try {
    const topServices = await Receip.aggregate([
        {
          '$match': {
            'magasin': new mongoose.Types.ObjectId('667720cf1d4ea506b5e6c28d')
          }
        }, {
          '$unwind': {
            'path': '$services'
          }
        }, {
          '$group': {
            '_id': '$services._id', 
            'totalQuantity': {
              '$sum': '$services.quantity'
            }, 
            'totalRevenue': {
              '$sum': {
                '$multiply': [
                  '$services.prix', '$services.quantity'
                ]
              }
            }
          }
        }, {
          '$lookup': {
            'from': 'services', 
            'localField': '_id', 
            'foreignField': '_id', 
            'as': 'serviceDetails'
          }
        }, {
          '$unwind': {
            'path': '$serviceDetails'
          }
        },
        { $sort: { totalQuantity: -1 } },
        { $limit: 4 },
      ]);

    return res.status(200).json(topServices);
  } catch (error) {
    console.error(error);
    return res.status(400).json({ error: error.message });
  }
};
exports.countReciep = async (req, res) => {
    const { IdMagasain } = req.params;
    try {
      const totalCount = await Receip.countDocuments({magasain:IdMagasain});
      return res.status(200).json({totalCount})
    } catch (err) {
      res.status(400).send(err);
    }
  }

  
  const calculateTotalRevenue = (services, custom) => {
    let total = custom;
    for (let service of services) {
      total += service.prix * service.quantity;
    }
    return total;
  };
  
  // Contrôleur pour obtenir les revenus mensuels
  exports.getMonthlyRevenues = async (req, res) => {
    try {
      const { magasinId, year } = req.params;
  
      // Convertir l'année en nombres pour les plages de dates
      const startDate = new Date(`${year}-01-01`);
      const endDate = new Date(`${year}-12-31`);
  
      // Rechercher tous les reçus pour le magasin et l'année donnés
      const receipts = await Receip.find({
        magasin: magasinId,
        Date: { $gte: startDate, $lte: endDate }
      });
  
      // Initialiser un tableau pour les revenus mensuels
      const monthlyRevenues = Array(12).fill(0);
  
      // Calculer les revenus mensuels
      receipts.forEach(receipt => {
        const month = receipt.Date.getMonth(); // Mois de 0 (janvier) à 11 (décembre)
        const totalRevenue = calculateTotalRevenue(receipt.services, receipt.custom);
        monthlyRevenues[month] += totalRevenue;
      });
  
      // Retourner les revenus mensuels
      res.json(monthlyRevenues);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Une erreur est survenue' });
    }
  };
  

