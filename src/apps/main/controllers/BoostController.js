const Boost = require("../models/Boost");
const Magasin = require("../models/Magasin");
const BoostRequest = require("../models/BoostRequest");

exports.createBoostFromRequest = async (req, res) => {
  const { requestId } = req.body;
  let request;
  try {
    request = await BoostRequest.findById(requestId);
  } catch (error) {
    console.log(error);
  }
  if (request) {
    if (request.validation) {
      const boost = new Boost({
        boostType: request.boostType,
        magasin: request.magasin,
      });
      try {
        await boost.save();
        await request.deleteOne();
        //autres traitements
        return res.status(201).json({ message: "Boost created successfully." });
      } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Failed to create boost." });
      }
    } else {
      console.log(request);
      return res.status(403).json({ message: "Request is not validated." });
    }
  } else {
    return res.status(404).json({ message: "Request not found." });
  }
};

// Version without express request
const createBoostFromRequestFunction = async (requestId) => {
  let request;
  try {
    request = await BoostRequest.findById(requestId);
  } catch (error) {
    console.log(error);
  }
  if (request) {
    if (request.validation) {
      const boost = new Boost({
        boostType: request.boostType,
        magasin: request.magasin,
      });
      try {
        await boost.save();
        await request.deleteOne();
        //autres traitements
        return true;
      } catch (error) {
        console.log(error);
        return false;
      }
    } else {
      console.log(request);
      return false;
    }
  } else {
    return false;
  }
};

// Boost event listener, ki y'inseri boost jdid yzidlou f score
// ki yetna77a boost, yekhlas wella yetsupprima je ne sais kifeh, yna77i score li nzad
// ou y'activi automatiquement le prochain boost li raw yestenna fih
exports.BoostEventListeners = async () => {
  const changeStream = Boost.watch();
  changeStream.on("change", (change) => {
    if (change.operationType === "insert") {
      const magasinId = change.fullDocument.magasin;

      const scoreIncrease = change.fullDocument.boostType === "mega" ? 16 : 8;
      Magasin.findByIdAndUpdate(magasinId, {
        $inc: { score: scoreIncrease },
        $set: { activeBoost: { boost: change.fullDocument._id } },
      })
        .then(() => console.log("Boost applied to magasin successfully"))
        .catch((err) => {
          console.log(err);
        });
    } else if (
      change.operationType === "expire" ||
      change.operationType === "delete"
    ) {
      Magasin.findOne({ "activeBoost.boost": change.documentKey._id })
        .then(async (magasin) => {
          console.log("Boost removed from magasin successfully");
          if (magasin.requests.length > 0) {
            let request = magasin.requests.shift();
            magasin.activeBoost = { boostType: null, boost: null };
            magasin.score %= 8;
            await magasin.save();
            await createBoostFromRequestFunction(request);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  });
};
