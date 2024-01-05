const BoostRequest = require("../models/BoostRequest");
const Magasin = require("../models/Magasin");

exports.createBoostRequest = async (req, res) => {
  const { type, magasinId } = req.body;
  const magasin = await Magasin.findById(magasinId);
  if (!magasin) {
    console.log("Magasin not found");
    return res.status(404).json({ message: "Magasin not found." });
  }
  const boostreq = new BoostRequest({
    boostType: type,
    magasin: magasinId,
  });
  try {
    await boostreq.save();

    return res.status(201).json({ message: "Request created successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Couldn't create Boost Request" });
  }
};

exports.validateBoostRequest = async (req, res) => {
  const { requestId } = req.body;
  try {
    await BoostRequest.findByIdAndUpdate(requestId, { $set: {validation:true} });
    return res.status(201).json({ message: "Request Validated Successfuly" });
  } catch (error) {
    console.log(error);
    return res.status(500).json("Internal Server Error");
  }
};

exports.cancelBoostRequest = async (req, res) => {
  const { requestId } = req.params;
  try {
    const deletedReq = await BoostRequest.findByIdAndDelete(requestId);
    if(!deletedReq){
      return res.status(404).json({message:"Request Not found."})
    }
    return res.status(201).json({ message: "Request removed Successfuly." });
  }catch(error){
    console.log(error)
    return res.status(500).json("Internal Server Error.");
  }
}

exports.BoostRequestEventListeners = () => {
  const changeStream = BoostRequest.watch();
  changeStream.on("change", (change) => {
    console.log(change.fullDocument);
    if (change.operationType === "insert") {
      const magasinId = change.fullDocument.magasin;
      const id = change.fullDocument._id;
      Magasin.findByIdAndUpdate(magasinId, { $push: { requests: id } })
        .then(() => console.log("Request added to magasin successfully"))
        .catch((err) => {
          console.log(err);
        });
    } else if (change.operationType === "delete") {
      const id = change.documentKey._id;
      Magasin.findOneAndUpdate({ requests: id }, { $pull: { requests: id } })
        .then(() => console.log("Request removed from magasin successfully"))
        .catch((err) => {
          console.log(err);
        });
    }
  });
};
