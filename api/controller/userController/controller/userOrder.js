const stripe = require("stripe")('sk_test_MvJ9Wc8zcwXWz5gRZWzHrepc00eXKS8HNb');
var order = require('../../../../model/userModel/model/orderModel');
var cart = require('../../../../model/userModel/model/cartModel');
var mongoose = require('mongoose');
const NewOrder = require('../../../../model/orders.model')

const confirmCashOrder = async (req, res) => {
    try {
        //get list of product in cart
        const cartArray = await cart.find({ userId: req.body.userId, isDeleted: false });
        let orderItemsArray = [];
        let totalOrderCost = 0;
        let cartIdArray = [];
        if (cartArray.length > 0) {
            cartArray.forEach(item => {
                orderItemsArray.push({
                    productId: item.productId,
                    OrderItemStatus: 'Ordered',
                    totalUnits: parseFloat(item.quantity) || 0,
                    discount: parseFloat(item.discount) || 0,
                    pricePerUnit: parseFloat(item.price) || 0,
                    amountAfterDiscount: parseFloat(item.amount) || 0,
                    totalOrderItemAmount: parseFloat(item.total) || 0,
                    vendorId: item.vendorId
                });

                cartIdArray.push(item._id);

                if (!isNaN(parseFloat(item.total))) {
                    totalOrderCost += parseFloat(item.total);
                }

            })
        } else {
            throw 'Cart is empty'
        }

        const newOrder = new NewOrder({
            customerId: req.body.userId,
            orderStatus: 'Completed',
            orderItems: orderItemsArray,
            shippingCharges: parseFloat(req.body.shippingCharges) || 0,
            totalOrderCost: totalOrderCost
        })

        const addedOrder = await newOrder.save();
        if (!addedOrder) {
            //Update cart model
            throw 'Unable to process your request'
        }
        console.log('Response Create order', addedOrder, cartIdArray)

        const cartUpdated = await cart.update(
            { _id: { $in: cartIdArray } },
            { $set: { isDeleted: true } },
            { multi: true })

        res.json({
            status: true,
            success: true,
            message: 'Order placed successfully.',
            code: 200
        });

    } catch (error) {
        console.log("Error", error)
        res.json({
            status: false,
            success: false,
            message: error.message,
            code: 500
        });
    }

}

var myOrders = (async (req, res) => {
    NewOrder.find({ customerId: req.body.userId })
        .populate('addressId')
        .populate('customerId')
        .then(async (product) => {
            if (product.length > 0) {
                return res.json({ status: true, code: 200, message: '', product });
            } else {
                return res.json({ status: false, code: 101, message: "Not Found" })
            }
        })
})

const getOrderDetails = async (req, res) => {
    try {
        NewOrder.find({ _id: req.params.id })
        .populate('customerId')
        .populate('orderItems.productId')
        .populate('orderItems.vendorId')
        .then(async (product) => {
            if (product.length > 0) {
                return res.json({ status: true, code: 100, message: '', product: product[0] });
            } else {
                return res.json({ status: false, code: 101, message: "Not Found" })
            }
        })
    } catch (error) {
        return res.json({ status: false, code: 102, message: "Something Went Wrong" });
    }
}

var payment = (async (req, res) => {
    // app.get("/", (req, res) => {
    //   res.send({
    //     message: "Hello Stripe checkout server!",
    //     timestamp: new Date().toISOString()
    //   });
    // });
    // app.post("/payment", (req, res) => {
    const waitFor = (ms) => new Promise(r => setTimeout(r, ms));
    const body = {
        source: req.body.token.id,
        amount: req.body.amount,
        currency: "usd"
    };
    await waitFor(100);
    var resultData = stripe.charges.create(body, stripeChargeCallback(res));
    await waitFor(500);
    //   }); 
    return app;
});

const stripeChargeCallback = res => (stripeErr, stripeRes) => {
    if (stripeErr) {
        //   res.status(500).send({ error: stripeErr });
        return res.json({ status: false, code: 101, message: "Some error found" })
    } else {
        //   res.status(200).send({ success: stripeRes });
        return res.json({ status: false, code: 100, message: "Payment Success" })
    }
};

module.exports = { confirmCashOrder, myOrders, payment,getOrderDetails };