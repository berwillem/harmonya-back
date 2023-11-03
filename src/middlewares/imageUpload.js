const cloudinary = require("../config/cloudinaryConfig");
const Magasin = require("../apps/main/models/Magasin");

exports.uploadImage = async (req, res, next) => {
  const image = req.file.path;
  try {
    const result = await cloudinary.uploader.upload(image);
    console.log(result);
    res
      .status(200)
      .json({ success: true, message: "Image uploaded successfully" });
  } catch (error) {
    console.error("Error uploading image:", error);
    res.status(500).json({ success: false, message: "Image upload failed" });
  }
  next();
};

exports.uploadImages = async (req, res, next) => {
  const images = req.files.map((file) => file.path);
  try {
    for (const image of images) {
      const result = await cloudinary.uploader.upload(image);
      console.log(result);
    }
    res
      .status(200)
      .json({ success: true, message: "Images uploaded successfully" });
  } catch (error) {
    console.error("Error uploading images:", error);
    res.status(500).json({ success: false, message: "Images upload failed" });
  }
  next();
};
exports.uploadImagesWithSubscription = async (req, res, next) => {
  try {
    const magasinId = req.params.magasinId;
    const magasin = await Magasin.findById(magasinId).populate("subscription");

    if (!magasin) {
      return res
        .status(404)
        .json({ success: false, message: "Magasin not found" });
    }

    if (!magasin.subscription) {
      return res.status(400).json({
        success: false,
        message: "Magasin does not have a subscription",
      });
    }

    // Check if the subscription is active
    if (!magasin.subscription.active) {
      return res
        .status(400)
        .json({ success: false, message: "Subscription is not active" });
    }

    // Determine the allowed number of images based on the subscription type
    let allowedImages = 0;
    switch (magasin.subscription.type) {
      case "standard":
        allowedImages = 4;
        break;
      case "premium":
        allowedImages = 6;
        break;
      case "gold":
        allowedImages = 10;
        break;
      default:
        allowedImages = 0; // Default to 0 for unknown subscription types
    }

    // Check if the number of uploaded images exceeds the allowed limit
    if (req.files.length > allowedImages) {
      return res.status(400).json({
        success: false,
        message: `You can upload a maximum of ${allowedImages} images`,
      });
    }

    uploadImages(req, res, next);
  } catch (error) {
    console.error("Error in uploadImagesWithSubscription:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
