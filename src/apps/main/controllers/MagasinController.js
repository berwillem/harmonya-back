const Magasin = require("../models/Magasin");

exports.getAllMagasin = (req, res) => {
  Magasin.find({})
    .limit(req.query.num ? req.query.num : 4)
    .then((magasins) => {
      res.send(magasins.map((magasin) => ({ name: magasin.magasinName })));
    });
};
exports.getMagasinById = (req, res) => {
  const magasinId = req.params.id;
  Magasin.findById(magasinId)
    .select("-password")
    .then((magasin) => {
      if (!magasin) {
        return res.status(404).json({ message: "Magasin not found" });
      }

      res.send(magasin);
    })
    .catch((err) => {
      console.error("Error retrieving Magasin by ID:", err);
      res.status(500).json({ message: "Internal server error" });
    });
};
