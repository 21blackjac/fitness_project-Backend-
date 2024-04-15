const express = require("express");
const router = express.Router();
const Admin = require("../Models/Admin");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const JWT_SECRET = process.env.JWT_SECRET;

router.get("/test", (req, res) => {
  res.send("Admin Works!");
});

router.get("/adminList", async (req, res) => {
  try {
    const admins = await Admin.find();
    return res.status(200).json(admins);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send("Server error");
  }
});

router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const existingAdmin = await Admin.findOne({ email });

    if (existingAdmin) {
      return res.status(409).send({ message: "Account already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const newAdmin = new Admin({
      username,
      email,
      password: hashedPassword,
    });

    await newAdmin.save();

    const token = jwt.sign({ _id: newAdmin._id }, JWT_SECRET, {
      expiresIn: "1h",
    });
    res
      .cookie("jwt", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 3600000,
      })
      .status(201)
      .json({ token, userId: newAdmin._id });
  } catch (err) {
    console.error("Error:", err);
    return res.status(500).send("Internal server error");
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(401).send("Invalid Email or Password");
    }

    const isPasswordMatch = await bcrypt.compare(password, admin.password);

    if (!isPasswordMatch) {
      return res.status(401).send("Invalid Email or Password");
    }

    const token = jwt.sign({ _id: admin._id }, JWT_SECRET, { expiresIn: "1h" });
    res
      .cookie("jwt", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 3600000,
      })
      .json({ token, userId: admin._id });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).send("Server Error");
  }
});

module.exports = router;
