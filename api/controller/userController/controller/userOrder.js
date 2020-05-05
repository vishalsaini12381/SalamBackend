const stripe = require("stripe")('sk_test_MvJ9Wc8zcwXWz5gRZWzHrepc00eXKS8HNb');
var cart = require('../../../../model/userModel/model/cartModel');
const NewOrder = require('../../../../model/orders.model');
const user = require('../../../../model/vendorModel/model/vendorSchema');
const TransctionSchema = require('../../../../model/transaction.model');


const confirmCashOrder = async (req, res) => {
    try {
        //get list of product in cart
        let { orderItemsArray, totalOrderCost, cartIdArray } = await getCartDetails(req.body.userId);

        const newOrder = new NewOrder({
            addressId : req.body.addressId,
            customerId: req.body.userId,
            orderStatus: 'Completed',
            orderItems: orderItemsArray,
            shippingCharges: parseFloat(req.body.shippingCharges) || 0,
            totalOrderCost: totalOrderCost,
            paymentType: "cod"
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

//update the products
const updateTheProductQuantities = (orderItemsArray) =>{

    orderItemsArray.forEach(item =>{

    })

}
const getCartDetails = async (userId) => {

    const cartArray = await cart.find({ userId: userId, isDeleted: false });
    return new Promise((resolve, reject) => {
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
            resolve({ orderItemsArray, totalOrderCost, cartIdArray })
        } else {
            reject('Cart is empty')
        }
    })
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
            .populate('addressId')
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

var payment = async (req, res) => {
    try {
        const stripeToken = req.body.token.id
        if (stripeToken === undefined) {
            throw "Stripe token not available"
        }
        const userData = await user.findById(req.body.senderId);

        const stripeCustomerData = await stripe.customers.create({
            email: userData.email,
            source: stripeToken
        })

        const chargeData = await stripe.charges.create({
            amount: Math.round(req.body.amount*100),
            currency: "usd",
            customer: stripeCustomerData.id,
            description: req.body.description
        })
        if (chargeData.id !== undefined) {
            //create order
            let { orderItemsArray, totalOrderCost, cartIdArray } = await getCartDetails(req.body.senderId);

            const newOrder = new NewOrder({
                customerId: req.body.senderId,
                orderStatus: 'Completed',
                orderItems: orderItemsArray,
                shippingCharges: parseFloat(req.body.shippingCharges) || 0,
                totalOrderCost: totalOrderCost,
                paymentType: "cod",
                orderStatus: 'Completed',
                paymentType: "online",
                paymentStatus: "success"
            })

            const addedOrder = await newOrder.save();
            if (!addedOrder) {
                //Update cart model
                throw 'Unable to process your request'
            } else {
                const cartUpdated = await cart.update(
                    { _id: { $in: cartIdArray } },
                    { $set: { isDeleted: true } },
                    { multi: true })
            }

            //insert new transation
            const transaction = new TransctionSchema({
                transactionId: chargeData.balance_transaction,
                chargeId: chargeData.id,
                customerId: chargeData.customer,
                url: chargeData.receipt_url,
                paymentType: "creditCard",
                senderId: req.body.senderId,
                orderId: addedOrder._id,
                amount: chargeData.amount,
                amountRefunded: chargeData.amount_refunded,
                email: chargeData.email,
                transactionStatus: "completed"
            })
            const transActionData = await transaction.save()
            if (transActionData) {
                const data = {
                    paymentId: transActionData._id,
                    transactionId: transActionData.transactionId,
                    url: transActionData.url,
                    transactionStatus: transActionData.transactionStatus,
                    amount: transActionData.amount
                }
                res.send({
                    message: "Payment successfull",
                    data
                })

            } else {
                throw "Unable to complete order"
            }
        } else {
            throw "Unable to process payment"
        }


    } catch (error) {
        console.log("Error in payment", error)
        res.status(500).send({
            message: error.message,
        })
    }
    // const waitFor = (ms) => new Promise(r => setTimeout(r, ms));
    // const body = {
    //     source: req.body.token.id,
    //     amount: req.body.amount,
    //     currency: "usd"
    // };
    // await waitFor(100);
    // var resultData = stripe.charges.create(body, stripeChargeCallback(res));
    // await waitFor(500);
    //   }); 
    // return app;
};

const stripeChargeCallback = res => (stripeErr, stripeRes) => {
    if (stripeErr) {
        //   res.status(500).send({ error: stripeErr });
        return res.json({ status: false, code: 101, message: "Some error found" })
    } else {
        //   res.status(200).send({ success: stripeRes });
        return res.json({ status: false, code: 100, message: "Payment Success" })
    }
};

module.exports = { confirmCashOrder, myOrders, payment, getOrderDetails };