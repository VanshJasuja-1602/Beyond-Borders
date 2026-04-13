const path = require("path");
if (process.env.NODE_ENV != "production") {
  require('dotenv').config({ path: path.join(__dirname, "../.env") });
}
const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

const dbUrl=process.env.ATLASDB_URL;

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(dbUrl);
}

const initDB = async () => {
  await Listing.deleteMany({});
  initData.data = initData.data.map((obj) => ({
    ...obj,
    owner: "6990ff2617ee924793d6de3f",
    geometry: {
      type: "Point",
      coordinates: [0, 0] // Default coordinates
    }
  }));
  await Listing.insertMany(initData.data);
  console.log("data was initialized");
};

initDB();