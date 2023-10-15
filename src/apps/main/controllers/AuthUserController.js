const User = require("../models/User");
const bcrypte = require("bcryptjs");
const jwt = require("jsonwebtoken");

// signup user :

exports.signup = async (req, res) => {
  const { userName, email, password } = req.body;
  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    console.log(err);
  }
  if (existingUser) {
    return res
      .status(400)
      .json({ message: "User already exists! Login instead." });
  }
  const hashedPassword = bcrypte.hashSync(password);
  const user = new User({
    userName,
    email,
    password: hashedPassword,
  });

  try {
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "3h",
    });
    res.cookie(String(user._id), token, {
      path: "/",
      expires: new Date(Date.now() + 10800000),
      httpOnly: true,
      sameSite: "lax",
    });

    return res
      .status(201)
      .json({ message: "Successfully Signed Up and Logged In", user });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Error during signup" });
  }
};
// login user:
exports.login = async (req, res) => {
  const { email, password } = req.body;
  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    console.log(err);
    return new Error(err);
  }
  if (!existingUser) {
    return res.status(400).json({ message: "User not found. Signup Please" });
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
  res.cookie("jwtoken", token, {
    path: "/",
    expires: new Date(Date.now() + 10800000),
    httpOnly: true,
    sameSite: "lax",
  });

  return res
    .status(200)
    .json({ message: "Successfully Logged In", user: existingUser });
};

// logout :

exports.logout = async (req, res) => {
  const cookies = req.cookies;
  const token = cookies.jwtoken;
  if (!token) {
    return res.status(404).json({ message: "token not found" });
  }
  jwt.verify(String(token), process.env.JWT_SECRET_KEY, (err, user) => {
    if (err) {
      console.log(err);
      return res.status(401).json({ message: "Invalide token" });
    }
    res.clearCookie(`jwtoken`);
    req.cookies["jwtoken"] = "";
    return res.status(200).json({ message: "logged out" });
  });
};
