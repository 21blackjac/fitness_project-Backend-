const express = require("express");
const router = express.Router();
const admin = require("../Models/Admin");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

router.post("/Sign-up", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const findAdmin = admin.findOne({ email: email });

    if (findAdmin) {
      return res.status(409).send({ message: "Account already exist" });
    } else {
      const hashedPassword = bcrypt(password, 12);
      const newAdmin = new admin({
        username: username,
        email: email,
        password: hashedPassword,
      });

      await newAdmin.save();
      const token = jwt.sign({ _id: newAdmin._id });
      res
        .status(201)
        .header({ Authorization: `Bearer ${token}` })
        .send({ token: token, userId: newAdmin._id });
      //res.header('auth-token', token).send(token);
      res.cookie("jwt", token, { httpOnly: true }).send(token);
    }
  } catch (err) {
    console.log("Error:", err);
    return res.status(500).send("Internal server error");
  }
});

router.post("Login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const findAdmin = admin.findOne({ email: email });
    const comparePassword = await bcrypt.compare(password, findAdmin.password);

    if (!findAdmin || !comparePassword) {
      res.status(401).send("Invalid Email or Password");
    } else {
      const token = jwt.sign({ _id: findAdmin._id });
      res.cookie("jwt", token, { httpOnly: true }).send(token);
    }
  } catch (error) {
    console.log("Error:", error);
    res.status(500).send("Server Error");
  }
});