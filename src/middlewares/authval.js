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
