var mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

var NewOrdersSchema = new mongoose.Schema({
    customerId: { type: ObjectId, ref: 'user', default: null },
    orderDate: { type: String, default: new Date() },
    orderItems: [{
        productId: { type: ObjectId, ref: 'product', trim: true },
        OrderItemStatus: { type: String, enum: ['Ordered', 'Delivered', 'ReturnRefund', 'ReturnExchange', 'Out of Stock'] },
        totalUnits: { type: Number, default: 0 },
        discount: { type: Number, default: 0 },
        pricePerUnit: { type: Number, default: 0 },
        amountAfterDiscount: { type: Number, default: 0 },
        totalOrderItemAmount: { type: Number, default: 0 },
        vendorId: { type: ObjectId, ref: 'user' }
    }],
    shippingCharges: { type: Number, default: 0 },
    totalOrderCost: { type: Number, default: 0 },
    orderStatus: { type: String, enum: ['Cancelled', 'Completed'] },
    paymentType: { type: String, enum: ["cod", "pod", "online", "wallet"] },
    paymentStatus : { type : String, enum : ["success","failed"] },
    isDeleted: {
        type: Boolean,
        default: false
    },
    addressId: { type: ObjectId, ref: 'shippingAddress', default: null },
    transactionId : { type: ObjectId, ref: 'transaction', default: null }
}, { usePushEach: true });

var NewOrder = mongoose.model('new_order', NewOrdersSchema);

module.exports = NewOrder;