var mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;


var ReturnOrderSchema = new mongoose.Schema({
    orderId: { type: ObjectId, ref: 'orders', default: null },
    subOrderId : { type: ObjectId },
    returnReasonId:{
        type: String,
        trim: true
    },
    customerComment:{
        type: String,
        trim : true
    },
    returnComment: {
        type: String,
        trim: true,
    },
    createdAt: {
        type: String,
        default: new Date()
    },
}, { usePushEach: true });

var ReturnOrder = mongoose.model('returnOrder', ReturnOrderSchema);

module.exports = ReturnOrder;