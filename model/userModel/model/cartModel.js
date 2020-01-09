var mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;


var CartSchema = new mongoose.Schema({
    price:{
        type: String,
        trim: true,
    },
    discount:{
        type: Number,
        default : 0
    },
    discountValue:{
        type: Number,
        default : 0
    },
    amount:{
        type: String,
        trim: true,
    },
    quantity:{
        type: String,
        trim: true,
    },
    total:{
        type: String,
        trim: true,
    },
    createdAt: {
        type: String,
        default: new Date()
    },
    status:{
        type: String,
        enum: ['Cart','Wishlist']
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    userId: {type: ObjectId, ref: 'user', default: null},
    productId : {type : ObjectId, ref : 'products',default: null},
    vendorId : {type: ObjectId, ref: 'user', default: null},
    
},{timestamps: true});

var Cart = mongoose.model('cart', CartSchema);

module.exports = Cart;