var mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;


var orderSchema = new mongoose.Schema({
    price:{
        type: String,
        trim: true,
    },
    shippingCharges:{
        type: String,
        trim: true,
    },
    amount:{
        type: String,
        trim: true,
    },
    product:{
        type: Array,
        trim: true,
    },
    orderType:{         //1=cod,2=online
        type: String,    
        trim: true,
    },
    status:{         //1=success,2=fail,3=cancel
        type: String,    
        trim: true,
    },
    createdAt: {
        type: String,
        default: new Date()
    },
    
    userId: {type: ObjectId, ref: 'user', default: null},
    addressId: {type: ObjectId, ref: 'shippingAddress', default: null},
    vendorId : {type: Array, ref: 'user', default: null},
    
},{usePushEach: true});

var order = mongoose.model('order', orderSchema);

module.exports = order;