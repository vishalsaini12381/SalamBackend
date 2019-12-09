var mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

var brandSchema = new mongoose.Schema({
    brandName : {
        type: String,
        trim: true,
    },
   
    file: {
        type: String,
        default: null
    },
   
    createdAt: {
        type: String,
        default: new Date()
    },
    updatedAt: {
        type : String,
        default : new Date()
    },
    // userId: {type: ObjectId, ref: 'user', default: null},
},{usePushEach: true});


var brand = mongoose.model('brand', brandSchema);

module.exports = brand;