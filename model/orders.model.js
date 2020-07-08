var mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

var NewOrdersSchema = new mongoose.Schema({
    customerId: { type: ObjectId, ref: 'user', default: null },
    orderDate: { type: String, default: new Date() },
    orderItems: [{
        productId: { type: ObjectId, ref: 'products', trim: true },
        orderStatus: { type: String, enum: ['Order Placed', 'Order Accepted', 'Dispatched', 'Delivered', 'Canceled', 'Out of Stock'] },
        cancelItem: { type: Boolean, default: false },
        totalUnits: { type: Number, default: 0 },
        discount: { type: Number, default: 0 },
        pricePerUnit: { type: Number, default: 0 },
        amountAfterDiscount: { type: Number, default: 0 },
        totalOrderItemAmount: { type: Number, default: 0 },
        vendorId: { type: ObjectId, ref: 'user' },
        isRefundRequested: { type: Boolean, default: false },
        refundRequest: {
            requestComment: { type: String },
            refundId: { type: ObjectId, ref: "returnOrder" },
            refundRequestDate: { type: Date },
            refundProcessedDate: { type: Date },
            refundStatus: { type: String, enum: ['requested', 'initiated', 'processed'] }
        },
        isReturnRequested: { type: Boolean, default: false },
        returnRequest: {
            returnId: { type: ObjectId, ref: "returnOrder" },
            returnStatus: { type: String, enum: ['requested', 'initiated', 'Completed'] }
        },
    }],
    shippingCharges: { type: Number, default: 0 },
    totalOrderCost: { type: Number, default: 0 },
    paymentType: { type: String, enum: ["cod", "pod", "online", "wallet"] },
    paymentStatus: { type: String, enum: ["success", "failed"] },
    isDeleted: {
        type: Boolean,
        default: false
    },
    addressId: { type: ObjectId, ref: 'shippingAddress', default: null },
    transactionId: { type: ObjectId, ref: 'transaction', default: null },
}, { timestamps: true });

var NewOrder = mongoose.model('new_order', NewOrdersSchema);

module.exports = NewOrder;