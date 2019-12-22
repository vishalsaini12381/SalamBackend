var mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

var transactionSchema = new mongoose.Schema({
    transactionId: { type: String },
    chargeId: { type: String },
    customerId: { type: String },
    url: { type: String },
    refundId: { type: String },
    amountRefunded: { type: String },
    paymentType: { type: String, enum: ["debitCard", "creditCard"] },
    senderId: { type: ObjectId, ref: 'user' },
    receiverId: { type: ObjectId, ref: 'user' },
    orderId: { type: ObjectId, ref: 'new_order' },
    currency: { type: String, default: "usd" },
    amount: { type: String, default: '0' },
    email: { type: String },
    transactionStatus: { type: String }
}, { timestamps: true });

const TransctionSchema = mongoose.model('transaction', transactionSchema);

module.exports = TransctionSchema;