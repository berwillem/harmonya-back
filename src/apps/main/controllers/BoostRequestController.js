const Boost = require("../models/Boost");
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
    await BoostRequest.findByIdAndUpdate(requestId, {
      $set: { validation: true },
    });
    return res.status(201).json({ message: "Request Validated Successfuly" });
  } catch (error) {
    console.log(error);
    return res.status(500).json("Internal Server Error");
  }
};

exports.invalidateBoostRequest = async (req, res) => {
  const { requestId } = req.body;
  try {
    await BoostRequest.findByIdAndUpdate(requestId, {
      $set: { validation: false },
    });
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
    if (!deletedReq) {
      return res.status(404).json({ message: "Request Not found." });
    }
    return res.status(201).json({ message: "Request removed Successfuly." });
  } catch (error) {
    console.log(error);
    return res.status(500).json("Internal Server Error.");
  }
};

exports.prepareBoostRequest = async (req, res) => {
  const { requestId } = req.body
  try {
    const boostRequest = await BoostRequest.findById(requestId)
    if (!boostRequest) {
      return res.status(404).json({ message: "Request Not found." })
    }
    boostRequest.ready = true
    await boostRequest.save()
    return res.status(200).json(boostRequest)
  }catch(err){
    console.log(err)
    return res.status(500).json("Internal Server Error.")
  }
}
exports.unprepareBoostRequest = async (req, res) => {
  const { requestId } = req.body
  try {
    const boostRequest = await BoostRequest.findById(requestId)
    if (!boostRequest) {
      return res.status(404).json({ message: "Request Not found." })
    }
    boostRequest.ready = false
    await boostRequest.save()
    return res.status(200).json(boostRequest)
  }catch(err){
    console.log(err)
    return res.status(500).json("Internal Server Error.")
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

exports.getAllBoostRequests = async (req, res) => {
  try {
    const page = req.query.page || 1;
    const pageSize = req.query.pageSize || 15
    const totalCount = await BoostRequest.countDocuments();
    const totalPages = Math.ceil( totalCount / pageSize)
    const boostRequests = await BoostRequest.find({}).populate("magasin")
    .skip((page-1) * pageSize)
    .limit(pageSize)
    
    return res.status(200).json({boostRequests, totalPages})
  } catch (err) {
    res.status(400).send(err);
  }
};

exports.getallBoosts = async (req, res) => {
  try {
    const boost = await Boost.find();
    res.send(boost);
  } catch (err) {
    res.status(400).send(err);
  }
};
exports.getBoostsReqByIdMagasian = async (req, res) => {
  const { magasinid } = req.params;
  try {

    const boosts = await BoostRequest.find({magasin:magasinid})
     

    return res.status(200).json({ boosts });
  } catch (err) {
    res.status(400).send(err);
  }
};
