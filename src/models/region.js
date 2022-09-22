const mongoose = require('mongoose');

const regionSchema = new mongoose.Schema({
    regionname: {
        type: String,
        required: true,
        unique: true
    },
    capital: {
        type: String,
        required: true,
        unique: true
    },
    population: {
        type: Number,
        required: true
    }
});

const districtSchema = new mongoose.Schema({
    district_name:{
                type:String,
                required:true,
                unique:true
            },
            district_capital:{
                type:String,
                required:true,
                unique:true
            },
            district_location:{
                type:String,
                required:true
            },
            district_population:{
                type:Number,
                required:true
            },
            dce_name:{
                type:String,
                required:true,
                unique:true
            },
            region_id:{
                type:String,
                required: true
            }
});

const District = mongoose.model('District', districtSchema);

const Region = mongoose.model('Region', regionSchema);

module.exports = { Region, District };