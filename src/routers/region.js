const express = require('express');
const { Region, District } = require('../models/region');

const router = new express();

//Add new region
router.post('/region', async(req, res) => {

    const alreadyExist = await Region.findOne({ regionname: req.body.region });
    if (alreadyExist)
        return res.status(400).send({ message: "Region already exist!" });

    const region = await new Region({
        regionname: req.body.region,
        capital: req.body.capital,
        population: req.body.population
    });
    try {
        await region.save();
        res.status(200).send({
            message: "Record saved successfully!",
            data: region
        });
    } catch (err) {
        res.status(500).send({ message: "Internal Server Error" });
    }
});

// Get all region
router.get('/', async(req, res) => {
    try {
        const region = await Region.find();
        res.send(region);
    } catch (err) {
        res.status(404).send(err);
    }
});

//Get region by ID
router.get("/region/:id", async(req, res) => {

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

//Update region
router.patch('/region/:id', async(req, res) => {
    try {
        const region = await Region.findById(req.params.id);

        region.regionname = req.body.regionname;
        region.capital = req.body.capital;
        region.population = req.body.population;

        await region.save();
        res.status(200).send({
            message: "Record updated sucessfully!",
            data: region
        });
    } catch (error) {
        res.status(500).send({ message: "Internal Server Error!" });
    }
});

//Delete region
router.delete('/region/:id', async(req, res) => {
    try {
        await District.deleteMany({region_id:req.params.id});
        const region = await Region.findByIdAndDelete(req.params.id);
        if (!region) {
            return res.status(404).send();
        }
        await res.send(region);
    } catch (error) {
        res.status(500).send({ message: "Internal Server Error!" });
    }
});

//Add new district
router.post('/district/:id', async(req, res) => {
    const alreadyExist = await District.findOne({ district_name:req.body.district_name });
    if (alreadyExist)
        return res.status(400).send({ message: "District already exist!" });

    const district = new District({
        district_name:req.body.district_name,
        district_capital:req.body.district_capital,
        district_location:req.body.district_location,
        district_population:req.body.district_population,
        dce_name:req.body.dce_name,
        region_id:req.params.id
    });
    try {
         district.save();
         res.status(200).send({
            message:"Record saved successfully!",
            data: district
        });
    } catch (err) {
        res.status(500).send({message:"Internal Server Error"})
    }
});

//Get all districts
router.get('/district/:id', async(req, res) => {
    try {
        const district = await District.find({ region_id: req.params.id });
        if(!district){
            return res.status(400).send();
        }
            
        res.status(200).send(district);
    } catch (err) {
        res.status(400).send();
    }
});

//Get district by id
router.get('/district/district/:id', async(req, res) => {
    try {
        const district = await District.findById(req.params.id);
        if(!district){
            return res.status(400).send();
        }
        res.status(200).send(district);
    } catch (err) {
        res.status(400).send();
    }
});

//Update district by id
router.patch('/district/district/:id', async(req, res) => {
    try {
        const district = await District.findById(req.params.id);
        district.district_name = req.body.district_name;
        district.district_capital = req.body.district_capital;
        district.district_location = req.body.district_location;
        district.district_population = req.body.district_population;
        district.dce_name = req.body.dce_name;

        await district.save();
        res.status(200).send({
            message:"Record updated successfully!",
            data: district
        });
    } catch (err) {
        res.status(400).send();
    }
});

//Delete district
router.delete('/district/:id', async(req, res) => {
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