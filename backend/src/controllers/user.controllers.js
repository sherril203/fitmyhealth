const { UserModel } = require("../models/user.model");
const bcrypt = require("bcrypt");
const tokengenerator = require("../middleware/Auth");

const UserRegister = async (req, res) => {
  try {
    const userdata = req.body;
    const existuser = await UserModel.findOne({
      email: userdata.email,
    });
    if (existuser) {
      return res.status(400).json({
        message: "User already registered",
      });
    }
    const hashedpassword = await bcrypt.hash(userdata.password,10);
    const newUser = new UserModel({
      ...userdata,
      password: hashedpassword,
    });
    await newUser.save();
    return res.status(201).json({
      message: "User registered successfully",
    });
  } catch (err) {

    return res.status(500).json({
      message: "Register failed",
      error: err.message,
    });
  }
};

const UserLogin = async (req, res) => {

  try {

    const { email, password } = req.body;

    const existuser = await UserModel.findOne({ email });

    if (!existuser) {
      return res.status(400).json({
        message: "User not registered",
      });
    }

    const matchedpassword = await bcrypt.compare(
      password,
      existuser.password
    );

    if (!matchedpassword) {
      return res.status(400).json({
        message: "Invalid password",
      });
    }

    const token = tokengenerator(existuser._id);
    return res.status(200).json({
      message: "User login successfully",
      data: {
        token,
        user: {
          id: existuser._id,
          username: existuser.username,
          email: existuser.email,
           role: existuser.role
        },
      },
    });

  } catch (err) {
    return res.status(500).json({
      message: "Login failed",
      error: err.message,
    });
  }
};

const getProfile = async (req, res) => {
  try {

    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token found",
      });
    }

    const jwt = require("jsonwebtoken");

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await UserModel.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
module.exports = { UserRegister, UserLogin,getProfile};