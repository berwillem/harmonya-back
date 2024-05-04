const multer = require("multer");
const upload = require("../config/multer");
const cloudinary = require("../config/cloudinaryConfig");
const Magasin = require("../apps/main/models/Magasin");
const Subscription = require("../apps/main/models/Subscription");
exports.imageUpload = (req, res, next) => {
  upload.single("image")(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).send("Multer error: " + err.message);
    } else if (err) {
      return res.status(500).send("Error: " + err.message);
    }
    if (req.file) {
      cloudinary.uploader.upload(req.file.path, (error, result) => {
        if (error) {
          console.error(error);
          return res.status(500).send("Error uploading image to Cloudinary");
        }
        req.imageURL = result.secure_url;
        return next();
      });
    } else {
      return res.status(400).send("No file provided.");
    }
  });
};

exports.multipleImageUpload = (req, res, next) => {
  upload.array("images", req.uploadLimit)(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ message: "Multer error: " + err.message });
    } else if (err) {
      return res.status(500).json({ message: "Error: " + err.message });
    }
    if (!req.files || req.files.length === 0) {
      return next();
    }
    if (req.files.length > req.uploadLimit) {
      return res
        .status(400)
        .json({ message: "Upload limit exceeded for this subscription." });
    }

    const uploadedImages = [];
    const uploadPromises = req.files.map((file) => {
      return cloudinary.uploader
        .upload(file.path)
        .then((result) => uploadedImages.push(result.secure_url))
        .catch((error) => {
          console.error(error);
          throw new Error("Error uploading image to Cloudinary");
        });
    });
    Promise.all(uploadPromises)
      .then(() => {
        req.imageURLs = uploadedImages;
        next();
      })
      .catch((error) => {
        console.error("Error in Cloudinary upload:", error);
        res.status(500).json({ message: "Internal server error." });
      });
  });
};

exports.imageUploadLimit = async (req, res, next) => {
  try {
    const magasinId = req.body.magasinId;
    const magasin = await Magasin.findById(magasinId);

    if (!magasin) {
      return res.status(404).json({ message: "Magasin not found." });
    }

    const subscription = await Subscription.findOne({
      magasin: magasinId,
      active: true,
    });
    if (!subscription) {
      return res.status(400).json({ message: "No active subscription found." });
    }
    let uploadLimit;
    switch (subscription.type) {
      case "trial":
        uploadLimit = 2;
        break;
      case "standard":
        uploadLimit = 3;
        break;
      case "premium":
        uploadLimit = 4;
        break;
      case "gold":
        uploadLimit = 6;
        break;
      default:
        return res.status(400).json({ message: "Unknown subscription type." });
    }

    req.uploadLimit = uploadLimit;

    next();
  } catch (error) {
    console.error("Error in imageUploadLimit middleware:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};
