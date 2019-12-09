var mongoose = require('mongoose');

var businessCategory = new mongoose.Schema({
    businesscategory:{
        type: String,
        trim: true,
    },
})

var businesss = mongoose.model('businesss', businessCategory);

module.exports = businesss;