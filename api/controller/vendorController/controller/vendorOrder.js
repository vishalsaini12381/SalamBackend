// var order = require('../../../../model/userModel/model/orderModel');
const NewOrder = require('../../../../model/orders.model');
const Transaction = require('../../../../model/transaction.model')
const User = require('../../../../model/vendorModel/model/vendorSchema')
var product = require('../../../../model/vendorModel/model/productSchema');
var address = require('../../../../model/userModel/model/shippingAddressModel');
var mongoose = require('mongoose');

var getAllOrder = ((req, res) => {
    try {
        NewOrder.find({ vendorId: { $elemMatch: { $eq: mongoose.Types.ObjectId(req.body.vendorId) } } })
            .populate('userId')
            .then((user) => {

                if (user) {
                    return res.json({ status: true, message: '', user })
                } else {
                    return res.json({ status: false, message: 'Product Not Found' });
                }
            })
    } catch (error) {
        return res.json({ status: false, message: 'Some Error' });
    }
});

var getOrderDetail = (async (req, res) => {
    var productData = [];
    var resultData = [];
    var orderProductData = [];
    var addressData = [];
    try {
        const waitFor = (ms) => new Promise(r => setTimeout(r, ms));
        NewOrder.findOne({ _id: req.body.orderId })
            .populate('userId')
            .then(async (user) => {
                if (user) {
                    productData = user;
                }
            })
        await waitFor(100);
        productData.product.forEach(async element => {

            product.findOne({ _id: element.productId })
                .then(async (getProductData) => {
                    if (getProductData) {
                        var obj = {
                            "orderProductData": element,
                            "vendorId": getProductData.userId,
                            "businesscategoryId": getProductData.businesscategoryId,
                            "categoryId": getProductData.categoryId,
                            "subCategoryId": getProductData.subCategoryId,
                            "file1": getProductData.file1,
                            "productName": getProductData.productName,
                        }
                        orderProductData.push(obj);
                        await waitFor(60);
                    }
                })
        })
        await waitFor(100);

        address.findOne({ _id: productData.addressId })
            .then(async (getAddress) => {
                if (getAddress) {
                    addressData.push(getAddress);
                    await waitFor(60);
                }
            })
        await waitFor(100);
        var resObj = {
            "orderDetail": productData,
            "productDetail": orderProductData,
            "addressData": addressData
        }
        resultData.push(resObj);
        // await waitFor(200);
        return res.json({ status: false, message: 'Some Error', resultData });
    } catch (error) {
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
    // var productData = [];
    // var resultData = [];
    // var orderProductData = [];
    // var addressData = [];
    try {
        const orderData = await NewOrder.findOne({ _id: req.body.orderId })
            .populate('customerId')
            .populate('addressId')
            .populate('orderItems.productId')
            .populate('orderItems.vendorId')
        // .populate('orderItems.productId.categoryId');
        if (!orderData) {
            res.send({
                success: false,
                message: 'Order not found',
                data: []
            })
        }

        // await waitFor(100);
        // productData.product.forEach(async element => {

        //     product.findOne({ _id: element.productId })
        //         .then(async (getProductData) => {
        //             if (getProductData) {
        //                 var obj = {
        //                     "orderProductData": element,
        //                     "vendorId": getProductData.userId,
        //                     "businesscategoryId": getProductData.businesscategoryId,
        //                     "categoryId": getProductData.categoryId,
        //                     "subCategoryId": getProductData.subCategoryId,
        //                     "file1": getProductData.file1,
        //                     "productName": getProductData.productName,
        //                 }
        //                 orderProductData.push(obj);
        //                 await waitFor(60);
        //             }
        //         })
        // })
        // await waitFor(100);

        // address.findOne({ _id: productData.addressId })
        //     .then(async (getAddress) => {
        //         if (getAddress) {
        //             addressData.push(getAddress);
        //             await waitFor(60);
        //         }
        //     })
        // await waitFor(100);
        // var resObj = {
        //     "orderDetail": productData,
        //     "productDetail": orderProductData,
        //     "addressData": addressData
        // }
        // resultData.push(resObj);
        // await waitFor(200);
        return res.json({ success: true, message: 'Data fetched successfully', data: orderData });
    } catch (error) {
        return res.json({ status: false, message: 'Some Error' });
    }
};

module.exports = { getAllOrder, getOrderDetail, getAllOrderAdmin, getOrderDetailAdmin, getAllAdminReturnRequest, refundProcessing };