const express = require("express");
const slug = require("slug");
const { Region, District } = require("../models/region");

const router = new express();

// Add new region
router.post("/regions", async (req, res) => {
  const nameSlug = slug(req.body.name);
  const alreadyExist = await Region.findOne({ slug: nameSlug });
  if (alreadyExist)
    return res.status(400).send({ message: "Region already exist!" });

  const { name, capital, population } = req.body;
  const region = new Region({
    name,
    capital,
    population,
    slug: nameSlug,
  });

  try {
    await region.save();
    res.status(200).send({
      message: "Record saved successfully!",
      data: region,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

// Get all regions
router.get("/regions", async (req, res) => {
  try {
    const region = await Region.find().populate("districts");
    res.send(region);
  } catch (err) {
    res.status(404).send(err);
  }
});

// Get region by ID
router.get("/regions/:id", async (req, res) => {
  try {
    const region = await Region.findById(req.params.id);
    if (!region) {
      return res.status(404).send();
    }
    res.status(200).send(region);
  } catch (e) {
    res.status(500).send(e);
  }
});

// Update region
router.patch("/regions/:id", async (req, res) => {
  try {
    const region = await Region.findById(req.params.id);

    region.name = req.body.name;
    region.capital = req.body.capital;
    region.population = req.body.population;

    await region.save();
    res.status(200).send({
      message: "Record updated sucessfully!",
      data: region,
    });
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error!" });
  }
});

// Delete region
router.delete("/regions/:id", async (req, res) => {
  try {
    await District.deleteMany({ region_id: req.params.id });
    const region = await Region.findByIdAndDelete(req.params.id);
    if (!region) {
      return res.status(404).send();
    }
    await res.send(region);
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error!" });
  }
});

// Add new district
router.post("/regions/:id/districts", async (req, res) => {
  const nameSlug = slug(req.body.name);
  const region = await Region.findById(req.params.id);

  const districtExist = await District.findOne({
    slug: nameSlug,
  });

  if (districtExist)
    return res.status(400).send({ message: "District already exist!" });

  const { name, capital, location, population, dce_name } = req.body;
  const district = new District({
    name,
    capital,
    location,
    population,
    dce_name,
    region_id: req.params.id,
    slug: nameSlug,
  });
  try {
    district.save();

    res.status(200).send({
      message: "District saved successfully!",
      data: district,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

// Get all districts in a region
router.get("/regions/:id/districts", async (req, res) => {
  try {
    const district = await District.find({ region_id: req.params.id });
    if (!district) {
      return res.status(400).send();
    }

    res.status(200).send(district);
  } catch (err) {
    res.status(400).send();
  }
});

// Get district by id
router.get("/districts/:id", async (req, res) => {
  try {
    const district = await District.findById(req.params.id);
    if (!district) {
      return res.status(400).send();
    }
    res.status(200).send(district);
  } catch (err) {
    res.status(400).send();
  }
});

// Update district by id
router.patch("/districts/:id", async (req, res) => {
  try {
    const district = await District.findById(req.params.id);
    district.name = req.body.name;
    district.capital = req.body.capital;
    district.location = req.body.location;
    district.population = req.body.population;
    district.dce_name = req.body.dce_name;

    await district.save();
    res.status(200).send({
      message: "District updated successfully!",
      data: district,
    });
  } catch (err) {
    res.status(400).send();
  }
});

// Delete district
router.delete("/districts/:id", async (req, res) => {
  try {
    const district = await District.findByIdAndDelete(req.params.id);
    if (!district) {
      return res.status(404).send();
    }
    await res.send(district);
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error!" });
  }
});

module.exports = router;
