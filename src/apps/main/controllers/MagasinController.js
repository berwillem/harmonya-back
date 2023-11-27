const Magasin = require("../models/Magasin");
const Service = require("../models/Service");

exports.getAllMagasin = (req, res) => {
  Magasin.find({})
    .limit(req.query.num ? req.query.num : 4)
    .then((magasins) => {
      res.send(magasins.map((magasin) => ({ name: magasin.magasinName, id: magasin._id })));
    });
};
exports.setMagasinInfo = async (req, res) => {
  const { id, info } = req.body;
  console.log(req.body)
  try {

    await Magasin.findByIdAndUpdate(
      id,
      { infos:info },
      { new: true, runValidators: true },
      );
    
    return res.status(201).json({message: "Update Successful"})
  }
  catch(err) {
    console.log(err)
  }
};

exports.getMagasinServices = async (req, res) => {
  const {magasinId} = req.query
  try{

    const {services} = await Magasin.findOne({_id:magasinId})
    return res.status(201).json(await Service.find({_id:{$in:services}}))
    
  }catch(error){
    return res.status(400).json({message:"mouchkil"})
  }
  


}

exports.getMagasinInfos = async (req, res) => {
  const {magasinId} = req.query
  try{

    const {infos} = await Magasin.findOne({_id:magasinId})
    return res.status(201).json(infos)
    
  }catch(error){
    return res.status(400).json({message:"mouchkil"})
  }
  


}


