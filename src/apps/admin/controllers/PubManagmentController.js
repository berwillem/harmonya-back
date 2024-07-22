const { arrayify } = require("../../../helpers/utilities");
const PubManagment = require("../models/PubManagment");

exports.createOrUpdatePubManagment = async (req, res) => {
  try {
    const titre_principale = arrayify(req.body.titresPrincipales)
    const titre_secondaire = arrayify(req.body.titresSecondaires)
    const link = arrayify(req.body.links)

    const image = req.imageURL;
    const images = [...arrayify(req.body.images), ...arrayify(req.images)];

    console.log(images)
    let pubManagment = await PubManagment.findOne();

    if (!pubManagment) {
      pubManagment = new PubManagment({
        slides: images.map((image, index)=> ({
          images: image,
          titre_principale: titre_principale[index],
          titre_secondaire: titre_secondaire[index],
          link: link[index],
        }))
      });
    } else {
      pubManagment.slides =images.map((image, index)=> ({
        images: image,
        titre_principale: titre_principale[index],
        titre_secondaire: titre_secondaire[index],
        link: link[index],
      }))
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
