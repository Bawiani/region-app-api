const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const regionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  capital: {
    type: String,
    required: true,
    unique: true,
  },
  population: {
    type: Number,
    required: true,
  },
  districts: [
    {
      type: Schema.Types.ObjectId,
      ref: "District",
    },
  ],
});

const districtSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  capital: {
    type: String,
    required: true,
    unique: true,
  },
  location: {
    type: String,
    required: true,
  },
  population: {
    type: Number,
    required: true,
  },
  dce_name: {
    type: String,
    required: true,
    unique: true,
  },
  region_id: {
    type: Schema.Types.ObjectId,
    ref: "Region",
    required: true,
  },
});

// Clean up all districts associated with region
// after deleting a region
regionSchema.post("remove", function (next) {
  District.remove({ region_id: this._id }).exec();
  next();
});

districtSchema.post("save", async function (doc, next) {
  // Add district ID to region districts
  const region = await Region.findById(doc.region_id);
  region.districts.push(doc._id);
  await region.save();

  next();
});

const Region = mongoose.model("Region", regionSchema);
const District = mongoose.model("District", districtSchema);

module.exports = { Region, District };
