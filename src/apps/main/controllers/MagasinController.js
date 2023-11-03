const Magasin = require("../models/Magasin");

exports.getAllMagasin = (req, res) => {
  Magasin.find({})
    .limit(req.query.num ? req.query.num : 4)
    .then((magasins) => {
      res.send(magasins.map((magasin) => ({ name: magasin.magasinName })));
    });
};
