const Magasin = require("../models/Magasin");
const Service = require("../models/Service");
const Category = require("../models/Category");
const { filterObject } = require("../../../helpers/utilities");

exports.getAllMagasins = async (req, res) => {
  try {
    const page = req.query.page || 1;
    const pageSize = req.query.pageSize || 10;

    const magasins = await Magasin.find({})
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .sort({ score: -1 });

    const formattedMagasins = magasins.map((magasin) => ({
      name: magasin.magasinName,
      id: magasin._id,
    }));

    return res.status(200).json({ magasins: formattedMagasins });
  } catch (error) {
    console.error("Error fetching magasins:", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
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

exports.getMagasinsByCategory = async (req, res) => {
  const { id } = req.params;

  try {
    const magasins = await Magasin.find({ category: id });
    return res
      .status(201)
      .json(
        magasins.map((magasin) =>
          filterObject(magasin, ["magasinName", "services", "stores"])
        )
      );
  } catch (error) {
    return res.status(400).json({ message: "mouchkil" });
  }
};

exports.getMagasinStores = async (req, res) => {
  const { id } = req.params;

  try {
    const magasin = await Magasin.findById(id).select("stores").populate("stores")
    if(!magasin){
      return res.status(400).json({message:"Magasin not found."})
    }
    return res.status(200).json(magasin.stores)
  }catch(error){
    console.error(error)
    return res.status(500).json({message:"Interal Server Error"})
  }
}