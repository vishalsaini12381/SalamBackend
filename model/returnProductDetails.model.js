var mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;


var ReturnOrderSchema = new mongoose.Schema({
    order_id: { type: ObjectId, ref: 'orders', default: null },
    return_reason_id:{
        type: String,
        trim: true
    },
    customer_comment:{
        type: String,
        trim : true
    },
    return_comment: {
        type: String,
        trim: true,
    },
    createdAt: {
        type: String,
        default: new Date()
    },
}, { usePushEach: true });

var returnOrder = mongoose.model('returnOrder', ReturnOrderSchema);

module.exports = returnOrder;