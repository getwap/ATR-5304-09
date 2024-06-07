/* --------- Local database connection ---------- */
const mongoose = require("mongoose");
require("dotenv").config({ path: "./config.env" });
const DB_URL = process.env.DATABASE_LOCAL_URL;
// const MongoDb = mongoose
//   .connect(DB, {
//     useNewUrlParser: true,
//   })
//   .then((con) => console.log("Local database connected."));

const MongoDb = async () => {
  try {
    const con = await mongoose.connect(DB_URL);
    console.log("mongodb connected successfuly");
  } catch (err) {
    console.log(err);
  }
};

/* --------- end of Local database connection ---------- */

/* --------- Live cloud database connection ---------- */

// const teamDB = mongoose.createConnection(process.env.Team_DATABASE);
// teamDB.on("connected", () => {
//   console.log("Team > Live cloud database connected.");
// });

// teamDB.model("User", require("./models/UserModel"));

module.exports = MongoDb;
