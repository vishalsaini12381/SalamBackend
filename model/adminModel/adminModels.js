var mongoose = require('mongoose');

var adminSchema = new mongoose.Schema({
    email:{
        type: String,
        trim: true,
    },
    password:{
        type: String,
        trim: true,
    },
})

var admin = mongoose.model('admin', adminSchema);

module.exports = admin;