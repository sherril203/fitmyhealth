const { adminModel } = require("../models/admin.model");
const bcrypt = require("bcrypt");
const tokengenerator = require("../middleware/Auth");

const AdminRegister = async (req, res) => {
  try {

    const admindata = req.body;
    const existadmin = await adminModel.findOne({
      email: admindata.email,
    });

    if (existadmin) {
      return res.status(400).json({
        message: "admin already registered",
      });
    }

    const hashedpassword = await bcrypt.hash(
      admindata.password,
      10
    );

    const newadmin = new adminModel({
      ...admindata,
      password: hashedpassword,
    });

    await newadmin.save();

    return res.status(201).json({
      message: "admin registered successfully",
    });

  } catch (err) {



    return res.status(500).json({
      message: "Register failed",
      error: err.message,
    });
  }
};

const AdminLogin = async (req, res) => {

  try {

    const { email, password } = req.body;

    const existadmin = await adminModel.findOne({ email });

    if (!existadmin) {
      return res.status(400).json({
        message: "admin not registered",
      });
    }

    const matchedpassword = await bcrypt.compare(
      password,
      existadmin.password
    );

    if (!matchedpassword) {
      return res.status(400).json({
        message: "Invalid password",
      });
    }

    const token = tokengenerator(existadmin._id);

    return res.status(200).json({
      message: "admin login successfully",
      data: {
        token,
        admin: {
          id: existadmin._id,
          adminname: existadmin.adminname,
          email: existadmin.email,
          role: existadmin.role
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

const getAdminProfile = async (req, res) => {
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

    const user = await adminModel.findById(decoded.id).select("-password");

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

module.exports = { AdminRegister, AdminLogin ,getAdminProfile};