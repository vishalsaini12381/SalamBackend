// var order = require('../../../../model/userModel/model/orderModel');
const NewOrder = require('../../../../model/orders.model');
const Transaction = require('../../../../model/transaction.model')
const User = require('../../../../model/vendorModel/model/vendorSchema')
const ProductModel = require('../../../../model/products.model');
const address = require('../../../../model/userModel/model/shippingAddressModel');
var mongoose = require('mongoose');

var getAllOrder = ((req, res) => {
    try {
        NewOrder
            // .find({ vendorId: { $elemMatch: { $eq: mongoose.Types.ObjectId(req.body.vendorId) } } })
            .aggregate([
                { $match: { "isDeleted": false } },
                {
                    $lookup:
                    {
                        from: 'users',
                        localField: 'customerId',
                        foreignField: '_id',
                        as: "customer"
                    }
                },
                { $unwind: "$orderItems" },
                { $match: { "orderItems.vendorId": mongoose.Types.ObjectId(req.body.vendorId) } }
            ])
            .then((myOrders) => {
                return res.json({ status: true, message: '', myOrders })
            })
    } catch (error) {
        return res.json({ status: false, message: 'Some Error' });
    }
});

var getOrderDetail = (async (req, res) => {
    try {
        let resultData = await NewOrder.aggregate([
            { $match: { "isDeleted": false } },
            { $unwind: "$orderItems" },
            { $match: { "orderItems._id": mongoose.Types.ObjectId(req.body.orderId) } },
            {
                $lookup:
                {
                    from: 'users',
                    localField: 'customerId',
                    foreignField: '_id',
                    as: "customer"
                }
            },
            {
                $lookup:
                {
                    from: 'products',
                    localField: 'orderItems.productId',
                    foreignField: '_id',
                    as: "product"
                }
            },
            {
                $lookup:
                {
                    from: 'shippingaddresses',
                    localField: 'addressId',
                    foreignField: '_id',
                    as: "address"
                }
            }]);
        if (Array.isArray(resultData) && resultData.length > 0) {
            res.json({ status: false, message: 'Successfully data fetched', order: resultData[0] });
        }

        res.json({ status: false, message: 'Successfully data fetched', order: {} });
    } catch (error) {
        console.log("object", error)
        return res.json({ status: false, message: 'Some Error' });
    }
});



var getAllOrderAdmin = ((req, res) => {
    try {
        NewOrder.find({})
            .populate('customerId')
            .then((order) => {
                if (order) {
                    return res.json({ status: true, message: '', order })
                } else {
                    return res.json({ status: false, message: 'Product Not Found' });
                }
            })
    } catch (error) {
        return res.json({ status: false, message: 'Some Error' });
    }
});


const getAllAdminReturnRequest = (req, res) => {
    try {
        NewOrder.aggregate([
            { $match: { $and: [{ 'orderItems.isRefundRequested': true }] } },
            { $unwind: '$orderItems' },
            { $match: { 'orderItems.refundRequest.refundStatus': 'requested' } },
            {
                $lookup: {
                    "from": "users",
                    "localField": "customerId",
                    "foreignField": "_id",
                    "as": "customerId"
                }
            },
            {
                $lookup: {
                    "from": "products",
                    "localField": "orderItems.productId",
                    "foreignField": "_id",
                    "as": "productDetail"
                }
            },
            {
                $lookup: {
                    "from": "users",
                    "localField": "orderItems.vendorId",
                    "foreignField": "_id",
                    "as": "vendorDetail"
                }
            }
        ])
            .then(order => {
                if (order) {
                    res.json({ status: true, message: '', order })
                } else {
                    res.json({ status: false, message: 'Product Not Found' });
                }
            })
            .catch(error => {
                console.log(error)
                return res.json({ status: false, message: 'Some Error', error });
            })
    } catch (error) {
        res.json({ success: false, message: 'Some Error' });
    }
}

const refundProcessing = async (req, res) => {
    try {
        const { orderId, subOrderId } = req.body;
        const dataOrderUpdate = await NewOrder.update(
            {
                '$and':
                    [{ '_id': orderId }, { 'orderItems._id': subOrderId }]
            },
            {
                '$set': {
                    'orderItems.$.refundRequest.refundStatus': 'processed',
                    'orderItems.$.refundRequest.refundProcessedDate': new Date()
                }
            }, { new: true });

        if (!dataOrderUpdate) {
            throw "Unable to update order"
        }
        const getOrderData = await NewOrder.aggregate([
            { $match: { $and: [{ '_id': mongoose.Types.ObjectId(orderId) }, { 'orderItems._id': mongoose.Types.ObjectId(subOrderId) }, { 'orderItems.isRefundRequested': true }] } },
            { $unwind: '$orderItems' },
            { $match: { 'orderItems._id': mongoose.Types.ObjectId(subOrderId) } }
        ])

        if (!getOrderData[0]) {
            throw "No data available"
        }
        if (getOrderData[0].orderItems !== undefined) {
            //save new transaction
            const transaction = new Transaction({
                amountRefunded: getOrderData[0].orderItems.totalOrderItemAmount,
                orderId: getOrderData[0]._id,
                amount: getOrderData[0].orderItems.totalOrderItemAmount,
                receiverId: getOrderData[0].customerId
            })
            const transData = await transaction.save();

            if (getOrderData[0].customerId) {
                await User.findOneAndUpdate({
                    _id: getOrderData[0].customerId,
                }, {
                    $inc: { wallet: getOrderData[0].orderItems.totalOrderItemAmount }
                }, {
                    upsert: true
                })
            }

            res.json({ success: true, message: 'Refund initiated sucessfully', data: transData });
        } else {
            res.json({ success: true, message: 'Refund initiated sucessfully', data: transData });
        }
    } catch (error) {
        console.log("object", error)
        res.status(500).json({ success: false, message: 'Some Error' });
    }
}

var getOrderDetailAdmin = async (req, res) => {

        try {
            let resultData = await NewOrder.aggregate([
                { $match: { "isDeleted": false } },
                { $unwind: "$orderItems" },
                { $match: { "orderItems._id": mongoose.Types.ObjectId(req.body.orderId) } },
                {
                    $lookup:
                    {
                        from: 'users',
                        localField: 'customerId',
                        foreignField: '_id',
                        as: "customer"
                    }
                },
                {
                    $lookup:
                    {
                        from: 'products',
                        localField: 'orderItems.productId',
                        foreignField: '_id',
                        as: "product"
                    }
                },
                {
                    $lookup:
                    {
                        from: 'shippingaddresses',
                        localField: 'addressId',
                        foreignField: '_id',
                        as: "address"
                    }
                }]);
            if (Array.isArray(resultData) && resultData.length > 0) {
                res.json({ status: false, message: 'Successfully data fetched', order: resultData[0] });
            }

            res.json({ status: false, message: 'Successfully data fetched', order: {} });
        } catch (error) {
            console.log("object", error)
            return res.json({ status: false, message: 'Some Error' });
        }
    }

// get dashboard
const getVendorDashboard = async (req, res) => {
    try {
        const vendorId = req.params.vendorId;

        const numberOfProduct = await ProductModel.find({ 'userId': vendorId });

        const totalOrders = await NewOrder.aggregate([
            { $unwind: "$orderItems" },
            {
                $match: {
                    "orderItems.vendorId": mongoose.Types.ObjectId(vendorId)
                }
            }
        ])

        const revenueObj = await NewOrder.aggregate([
            { $match: { "isDeleted": false } },
            { $unwind: "$orderItems" },
            { $match: { "orderItems.vendorId": mongoose.Types.ObjectId(vendorId), "orderItems.orderStatus": { $ne: "Canceled" } } },
            { $group: { _id: null, revenue: { $sum: "$orderItems.totalOrderItemAmount" }, } }
        ])
        res.json({
            success: true,
            message: 'Data fetched successfully',
            numberOfProduct: numberOfProduct.length,
            totalOrders: totalOrders.length,
            totalRevenue: revenueObj[0].revenue
        });

    } catch (error) {
        res.json({ status: false, message: 'Some Error' });
    }
}

const getRecentOrderList = async (req, res) => {
    const vendorId = req.params.vendorId;

    NewOrder
        .aggregate([
            { $match: { "isDeleted": false } },
            {
                $lookup:
                {
                    from: 'users',
                    localField: 'customerId',
                    foreignField: '_id',
                    as: "customer"
                }
            },
            {
                $lookup:
                {
                    from: 'shippingaddresses',
                    localField: 'addressId',
                    foreignField: '_id',
                    as: "address"
                }
            },
            { $unwind: "$orderItems" },
            { $match: { "orderItems.vendorId": mongoose.Types.ObjectId(vendorId) } },
            { $limit: 10 },
            { $sort: { updatedAt: -1 } }
        ])
        .then(data => {
            res.json({ status: true, message: 'Successfully fetched recent list', recentOrderList: data });
        })
        .catch(error => {
            res.json({ status: false, message: 'Some Error' });
        })
}

const changeOrderStatus = async (req, res) => {

    try {

        const { orderId, orderStatus } = req.body;

        const orderUpdate = await NewOrder.update({ "orderItems._id": mongoose.Types.ObjectId(orderId) },
            { $set: { "orderItems.$.orderStatus": orderStatus } }, { new: true });

        const isStatusUpdated = orderUpdate.ok === 1 && orderUpdate.nModified === 1;
        res.json({ status: true, message: 'Status updated successfully', isStatusUpdated });

    } catch (error) {
        console.log(';-------', error)
        res.json({ status: false, message: 'Some Error' });
    }

}


module.exports = { getAllOrder, changeOrderStatus, getRecentOrderList, getVendorDashboard, getOrderDetail, getAllOrderAdmin, getOrderDetailAdmin, getAllAdminReturnRequest, refundProcessing };