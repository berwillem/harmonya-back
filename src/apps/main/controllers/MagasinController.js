const Magasin = require("../models/Magasin");

exports.getAllMagasin = (req, res) => {
  Magasin.find({})
    .limit(req.body.num ? req.body.num : 4)
    .then((magasins) => {
      res.send(magasins.map((magasin) => ({ name: magasin.magasinName })));
    });
};
