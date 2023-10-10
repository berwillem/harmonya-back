const jwt = require("jsonwebtoken");

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
exports.checkUserRole = (requiredRole) => {
  return (req, res, next) => {
    const userRole = req.userRole;

    if (userRole === requiredRole || userRole === "admin") {
      next();
    } else {
      return res.status(403).json({
        message: "Access denied. You don't have permission for this action.",
      });
    }
  };
};
