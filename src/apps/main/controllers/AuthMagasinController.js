const Magasin = require("../models/Magasin");
const bcrypte = require("bcryptjs");
const jwt = require("jsonwebtoken");
const ResetToken = require("../models/resetPassword");
const { creatRandomBytes } = require("../../../helpers/RandomBytes");
const { ResetPassEmail } = require("../../../helpers/ResetEmailTemplate");
const SibApiV3Sdk = require("../../../config/sendiblue");
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
    res.cookie("jwtoken", token, {
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
     existingUser = await Magasin.findOne({ email: email }).populate({
      path: 'subscriptions',
      select: '_id type',
    });
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
  res.cookie("jwtoken", token, {
    path: "/",
    expires: new Date(Date.now() + 10800000),
    httpOnly: true,
    sameSite: "lax",
  });

  return res.status(200).json({
    message: "Successfully Logged In",
    magasin: existingUser,
  });
};

// logout :

exports.logout = async (req, res) => {
  const { cookies } = req;
  const token = cookies.jwtoken;

  if (!token) {
    return res.status(404).json({ message: "token not found" });
  }
  jwt.verify(String(token), process.env.JWT_SECRET_KEY, (err, magasin) => {
    if (err) {
      console.log(err);
      return res.status(401).json({ message: "Invalide token" });
    }
    res.clearCookie("jwtoken");
    req.cookies["jwtoken"] = "";
    return res.status(200).json({ message: "logged out" });
  });
};

// forgot password magasin :
exports.forgotPasswordMagasin = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    // Handle the case of missing email here if needed
    res
      .status(400)
      .json({ success: false, message: "Please provide a valid email!" });
    return;
  }

  const magasin = await Magasin.findOne({ email });
  if (!magasin) {
    // Handle the case of magasin not found here if needed
    res.status(404).json({ success: false, message: "magasin not found" });
    return;
  }

  const token = await ResetToken.findOne({ owner: magasin._id });
  if (token) {
    // Handle the case where a token already exists
    res.status(400).json({
      success: false,
      message: "Token already exists. Check your email.",
    });
    return;
  }

  const randomBytes = await creatRandomBytes();
  const resetToken = new ResetToken({ owner: magasin._id, token: randomBytes });
  await resetToken.save();

  const url = `http://localhost:5173/PassForgotMagasin?token=${randomBytes}&id=${user._id}`;

  new SibApiV3Sdk.TransactionalEmailsApi()
    .sendTransacEmail({
      sender: { email: "harmonyadz@gmail.com", name: "Harmonya" },
      subject: "passwordreset",
      htmlContent: ResetPassEmail(url),
      to: [
        {
          email: magasin.email,
        },
      ],
    })
    .then((data) => {
      console.log(data);
    })
    .catch((error) => {
      console.error(error);
    });

  res.json({
    success: true,
    message: "Password reset link is sent to your email.",
  });
};
// resetpassword magasin
exports.resetpassword = async (req, res) => {
  const { password } = req.body;
  const magasin = await Magasin.findById(req.magasin._id);
  if (!magasin) return sendError(res, "magasin not found");
  const isSame = await magasin.comparePassword(password);
  if (isSame) return sendError(res, "New password Must be different");
  if (password.trim().length < 8 || password.trim().length > 20)
    return sendError(res, "password must be 8 to 20 caracters");
  magasin.password = password.trim();
  await magasin.save();
  await ResetToken.findOneAndDelete({ owner: magasin._id });
  res.status(200).json({
    success: true,
    message: "Password updated",
  });
};
