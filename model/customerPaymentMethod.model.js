var mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

var PaymentMethods = new mongoose.Schema({
    customer_id: {
        type: ObjectId,
        ref: 'user'
    },
    payment_method_code: {
        type: String,
        trim: true
    },
    credit_card_number: {
        type: String,
        trim: true,
    },
    payment_method_details: {
        type: String,
        trim: true,
    },
    createdAt: {
        type: String,
        default: new Date()
    },
    updatedAt: {
        type: String,
        default: new Date()
    },
}, { usePushEach: true });

var paymentMethod = mongoose.model('payment_methods', PaymentMethods);

module.exports = paymentMethod;