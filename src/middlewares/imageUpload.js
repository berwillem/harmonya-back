const multer = require("multer");
const upload = require("../config/multer");
const cloudinary = require("../config/cloudinaryConfig");
const Magasin = require("../apps/main/models/Magasin");
const Subscription = require("../apps/main/models/Subscription");

const uploadToCloudinary = async (file) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream((error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result.secure_url);
        }
      })
      .end(file.buffer);
  });
};
exports.imageUpload = (req, res, next) => {
  upload.single("image")(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).send("Multer error: " + err.message);
    } else if (err) {
      return res.status(500).send("Error: " + err.message);
    }
    if (req.file) {
      uploadToCloudinary(req.file).then(
        (res) => {
          req.imageURL = res;
          next();
        }
      ).catch((error)=> {
        console.error(error);
        return res.status(500).send("Error uploading image");
      })
    } else {
      return res.status(400).send("No file provided.");
    }
  });
};

exports.multipleImageUpload = (req, res, next) => {
  upload.array("images", req.uploadLimit)(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      console.log(err);
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
      return uploadToCloudinary(file)
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

exports.dynamicImageUpload = async (req, res, next) => {
  

  upload.any()(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      console.log(err);
      return res.status(400).json({ message: "Multer error: " + err.message });
    } else if (err) {
      return res.status(500).json({ message: "Error: " + err.message });
    }
    try {
      const uploadPromises = {};

      // Iterate over each file to upload to Cloudinary
      for (const file of req.files) {
          if (!uploadPromises[file.fieldname]) {
              uploadPromises[file.fieldname] = [];
          }
          uploadPromises[file.fieldname].push(uploadToCloudinary(file).catch((error) => {
              console.error(error);
          }));
      }

      // Resolve all upload promises
      for (const field in uploadPromises) {
          req[field] = await Promise.all(uploadPromises[field]);
      }

      // Proceed to the next middleware or route handler
      next();
  } catch (error) {
      res.status(500).send('Error uploading to Cloudinary.');
  }
  });
};



exports.imageUploadLimit = async (req, res, next) => {
  try {
    const { magasinId } = req.params;
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
        uploadLimit = 3;
        break;
      case "standard":
        uploadLimit = 4;
        break;
      case "premium":
        uploadLimit = 5;
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
