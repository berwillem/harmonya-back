const jwt = require("jsonwebtoken");
const User = require("../apps/main/models/User");
const Magasin = require("../apps/main/models/Magasin");
const Admin = require("../apps/admin/models/Admin");

exports.verifyToken = (req, res, next) => {
  const cookies = req.headers.cookie;
  const token = cookies.split("=")[1];
  if (!token) {
    return res.status(404).json({ message: "token not found" });
  }

  jwt.verify(String(token), process.env.JWT_SECRET_KEY, (err, user) => {
    if (err) {
      console.log(err);
      return res.status(401).json({ message: "Invalide token" });
    }
    req.id = user.id;
  });
  next();
};

exports.checkUserAccess = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    if (user) {
      req.role = "User";
      next();
    } else {
      return res.status(403).json({
        message: "Access denied. You don't have permission for this action.",
      });
    }
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.checkMagasinAccess = async (req, res, next) => {
  try {
    const magasin = await Magasin.findById(req.body.magasin);
    if (magasin) {
      req.role = "Magasin";
      next();
    } else {
      return res.status(403).json({
        message: "Access denied. You don't have permission for this action.",
      });
    }
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.checkAdminAccess = async (req, res, next) => {
  try {
    const admin = await Admin.findById(req.userId);
    if (admin) {
      req.role = "Admin";
      next();
    } else {
      return res.status(403).json({
        message: "Access denied. You don't have permission for this action.",
      });
    }
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
