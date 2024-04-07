const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const Users = require("./Routes/usersRoute");
const Categories = require("./Routes/categoriesRoute");

const app = express();
const port = 5000;
const uri = "mongodb://0.0.0.0/Gym_Project";

app.use(express.json());
app.use(bodyParser.json());
app.use("/Users", Users);
app.use("/Categorie", Categories);

//Connection
async function connection() {
  try {
    await mongoose.connect(`${uri}`);
    console.log("Connected to MongoDB!");
  } catch (error) {
    console.log("Error, not connected to MongoDB");
  }
}
connection();

app.listen(port, () => {
  console.log(`The serveur is connected to the port: ${port}`);
});
