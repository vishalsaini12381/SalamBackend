var mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;


var addresSchema = new mongoose.Schema({
    fullName:{
        type: String,
        trim: true,
    },
    mobile:{
        type: String,
        trim: true,
    },
    pincode:{
        type: String,
        trim: true,
    },
    address:{
        type: String,
        trim: true,
    },
    city:{
        type: String,
        trim: true,
    },
    state:{
        type: String,
        trim: true,
    },
    landmark:{
        type: String,
        trim: true,
    },
    alterateNumber:{
        type: String,
        trim: true,
    },
    createdAt: {
        type: String,
        default: new Date()
    },
    
    userId: {type: ObjectId, ref: 'user', default: null},
    
},{usePushEach: true});

var shippingAddress = mongoose.model('shippingAddress', addresSchema);

module.exports = shippingAddress;