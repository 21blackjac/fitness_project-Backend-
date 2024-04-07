const express = require("express");
const router = express.Router();
const user = require("../Models/Users");

//Affichier tout les utilisateurs
router.get("/users", async (req, res) => {
  try {
    const showUsers = await user.find({});
    if (showUsers.length === 0) {
      res.status(404).send("No users found!");
    } else {
      res.status(200).json(showUsers);
    }
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Error fetching users" });
  }
});

//Affichier l'utilisateur par id
router.get("/user/:id", async (req, res) => {
  try {
    const userId = +req.params.id;
    const showUser = await user.findOne({ id: userId });
    if (!showUser) {
      res.status(404).send("User not found!");
    } else {
      res.json(showUser);
    }
  } catch (err) {
    console.log("Something is wrong!!! ", err);
  }
});

//Ajouter les utilisateurs
router.post("/addUser", async (req, res) => {
  try {
    console.log("Request Body : ", req.body);
    const newUser = new user(req.body);
    await newUser.save();
    res.json({
      message: "User Added successfully!",
      id: newUser.id,
    });
  } catch (err) {
    console.log("Message erreur: ", err.message);
    // console.log('User Not Added: ', err);
  }
});

//Modifier l'utilisateur
router.put("/updateUser/:id", async (req, res) => {
  try {
    const userId = +req.params.id;
    const updateUser = await user.updateOne({ id: userId }, { $set: req.body });
    if (updateUser.modifiedCount === 0) {
      res.status(404).send("No user updated");
    } else {
      res.json({
        message: "User updated successfully!",
        id: updateUser.upsertedId,
      });
    }
  } catch (err) {
    console.log("Something is wrong!!!", err);
  }
});

//Suprimer l'utilisateur
router.delete("/deleteUser/:id", async (req, res) => {
  try {
    const userId = +req.params.id;
    const deleteUser = await user.deleteOne({ id: userId });

    if (deleteUser.deletedCount === 0) {
      res.status(404).send("No user deleted");
    } else {
      res.status(200).send("User deleted successfully!");
    }
  } catch (err) {
    console.log("Something is wrong!!! ", err);
  }
});

module.exports = router;
