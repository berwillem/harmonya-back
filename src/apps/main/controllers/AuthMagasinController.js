const Magasin = require("../models/Magasin");
const bcrypte = require("bcryptjs");
const jwt = require("jsonwebtoken");

// signup magasin :

exports.signup = async (req, res) => {
  const { magasinName, email, password } = req.body;
  let existingMagasin;
  try {
    existingMagasin = await Magasin.findOne({ email: email });
  } catch (err) {
    console.log(err);
  }
  if (existingMagasin) {
    return res
      .status(400)
      .json({ message: "Magasin already exists! Login instead." });
  }
  const hashedPassword = bcrypte.hashSync(password);
  const magasin = new Magasin({
    magasinName,
    email,
    password: hashedPassword,
  });

  try {
    await magasin.save();

    const existingMagasin = await Magasin.findOne({ email: email });
    if (!existingMagasin) {
      return res
        .status(400)
        .json({ message: "Magasin not found. Signup Please" });
    }
    const isPasswordCorrect = bcrypte.compareSync(
      password,
      existingMagasin.password
    );
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid Email / password" });
    }
    const token = jwt.sign(
      { id: existingMagasin._id },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "3h",
      }
    );
    res.cookie(String(existingMagasin._id), token, {
      path: "/",
      expires: new Date(Date.now() + 10800000),
      httpOnly: true,
      sameSite: "lax",
    });

    return res
      .status(201)
      .json({ message: "Successfully Signed Up and Logged In", magasin });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Error during signup" });
  }
};

// login magasin:
exports.login = async (req, res) => {
  const { email, password } = req.body;
  let existingUser;
  try {
    existingUser = await Magasin.findOne({ email: email });
  } catch (err) {
    console.log(err);
    return new Error(err);
  }
  if (!existingUser) {
    return res
      .status(400)
      .json({ message: "Magasin not found. Signup Please" });
  }
  const isPasswordCorrect = bcrypte.compareSync(
    password,
    existingUser.password
  );
  if (!isPasswordCorrect) {
    return res.status(400).json({ message: "invalid Email / password" });
  }
  const token = jwt.sign({ id: existingUser._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: "3h",
  });
  res.cookie(String(existingUser._id), token, {
    path: "/",
    expires: new Date(Date.now() + 10800000),
    httpOnly: true,
    sameSite: "lax",
  });

  return res
    .status(200)
    .json({ message: "Successfully Logged In", magasin: existingUser });
};

// logout :

exports.logout = async (req, res) => {
  const cookies = req.headers.cookie;
  const token = cookies.split("=")[1];
  if (!token) {
    return res.status(404).json({ message: "token not found" });
  }
  jwt.verify(String(token), process.env.JWT_SECRET_KEY, (err, magasin) => {
    if (err) {
      console.log(err);
      return res.status(401).json({ message: "Invalide token" });
    }
    res.clearCookie(`${magasin.id}`);
    req.cookies[`${magasin.id}`] = "";
    return res.status(200).json({ message: "loged out" });
  });
};
