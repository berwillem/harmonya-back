const Magasin = require("../models/Magasin");
const Service = require("../models/Service");

exports.getAllMagasins = async (req, res) => {
  try {
    const magasins = await Magasin.find(); 

    return res.status(200).json(magasins);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};
exports.setMagasinInfo = async (req, res) => {
  const { id, info } = req.body;
  console.log(req.body);
  try {
    await Magasin.findByIdAndUpdate(
      id,
      { infos: info },
      { new: true, runValidators: true }
    );

    return res.status(201).json({ message: "Update Successful" });
  } catch (err) {
    console.log(err);
  }
};

exports.getMagasinServices = async (req, res) => {
  const { magasinId } = req.query;
  try {
    const { services } = await Magasin.findOne({ _id: magasinId });
    return res.status(201).json(await Service.find({ _id: { $in: services } }));
  } catch (error) {
    return res.status(400).json({ message: "mouchkil" });
  }
};

exports.getMagasinInfos = async (req, res) => {
  const { magasinId } = req.query;
  try {
    const { infos } = await Magasin.findOne({ _id: magasinId });
    return res.status(201).json(infos);
  } catch (error) {
    return res.status(400).json({ message: "mouchkil" });
  }
};
