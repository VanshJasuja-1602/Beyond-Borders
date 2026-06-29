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
  
  const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
  const mapToken = process.env.MAP_TOKEN;
  const geocodingClient = mapToken ? mbxGeocoding({ accessToken: mapToken }) : null;

  const updatedData = [];
  for (let obj of initData.data) {
    let coordinates = [0, 0];
    if (geocodingClient) {
      try {
        const response = await geocodingClient
          .forwardGeocode({
            query: `${obj.location}, ${obj.country}`,
            limit: 1,
          })
          .send();
        if (response.body.features && response.body.features.length > 0) {
          coordinates = response.body.features[0].geometry.coordinates;
        }
      } catch (err) {
        console.error(`Failed to geocode ${obj.location}:`, err.message);
      }
    }
    
    updatedData.push({
      ...obj,
      owner: "6990ff2617ee924793d6de3f",
      geometry: {
        type: "Point",
        coordinates
      }
    });
  }

  await Listing.insertMany(updatedData);
  console.log("data was initialized");
};

initDB();