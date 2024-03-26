const PubManagment = require("../models/PubManagment");

exports.createOrUpdatePubManagment = async (req, res) => {
  try {
    const { titre_principale, titre_secondaire, link } = req.body;
    const image = req.imageURL;

    let pubManagment = await PubManagment.findOne();

    if (!pubManagment) {
      pubManagment = new PubManagment({
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
exports.getAllPubManagment = async (req, res) => {
  try {
    const allPubs = await PubManagment.find();
    res.status(200).json(allPubs);
  } catch (error) {
    console.error("Error getting all PubManagment:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
