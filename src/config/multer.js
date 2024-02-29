const multer = require("multer");

// Multer configuration
const storage = multer.diskStorage({});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    // Check if the file type is allowed (e.g., image)
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image files are allowed!"), false);
    }
    cb(null, true);
  },
});

module.exports = upload;
