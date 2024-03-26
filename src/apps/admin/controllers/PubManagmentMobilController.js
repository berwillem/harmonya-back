const PubManagmentMobil = require("../models/PubManagmentMobil");

exports.createOrUpdatePubManagmentMobil = async (req, res) => {
  try {
    const { image, titre_principale, titre_secondaire, link } = req.body;

    let pubManagment = await PubManagmentMobil.findOne();

    if (!pubManagment) {
      pubManagment = new PubManagmentMobil({
        slides: [
          {
            images: image,
            titre_principale: titre_principale,
            titre_secondaire: titre_secondaire,
            link: link,
          },
        ],
      });
    } else {
      pubManagment.slides.push({
        images: image,
        titre_principale: titre_principale,
        titre_secondaire: titre_secondaire,
        link: link,
      });
    }

    const savedPubManagment = await pubManagment.save();

    res.status(201).json(savedPubManagment);
  } catch (error) {
    console.error("Error creating or updating PubManagment:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
exports.getAllPubManagmentMobil = async (req, res) => {
  try {
    const allPubs = await PubManagmentMobil.find();
    res.status(200).json(allPubs);
  } catch (error) {
    console.error("Error getting all PubManagment:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
