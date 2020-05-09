const stripe = require("stripe")('sk_test_MvJ9Wc8zcwXWz5gRZWzHrepc00eXKS8HNb');
var cart = require('../../../../model/userModel/model/cartModel');
const NewOrder = require('../../../../model/orders.model');
const user = require('../../../../model/vendorModel/model/vendorSchema');
const TransctionSchema = require('../../../../model/transaction.model');
const { sendMail } = require('../../../sendMail')


const confirmCashOrder = async (req, res) => {
    try {
        //get list of product in cart
        let { orderItemsArray, totalOrderCost, cartIdArray } = await getCartDetails(req.body.userId);

        const newOrder = new NewOrder({
            addressId: req.body.addressId,
            customerId: req.body.userId,
            orderStatus: 'Order Placed',
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


        const cartUpdated = await cart.update(
            { _id: { $in: cartIdArray } },
            { $set: { isDeleted: true } },
            { multi: true });

        sendOrderConfirmationMail({
            userId: req.body.userId,
            orderId: addedOrder._id,
            orderItems: orderItemsArray,
            totalOrderCost,
            shippingCharges: parseFloat(req.body.shippingCharges) || 0,
            paymentType: "cod"
        })

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

const getCartDetails = async (userId) => {

    const cartArray = await cart.find({ userId: userId, isDeleted: false }).populate('productId', "id productName")
    return new Promise((resolve, reject) => {
        let orderItemsArray = [];
        let totalOrderCost = 0;
        let cartIdArray = [];
        if (cartArray.length > 0) {
            cartArray.forEach(item => {
                orderItemsArray.push({
                    productId: item.productId.id,
                    productName: item.productId.productName,
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
            amount: Math.round(req.body.amount * 100),
            currency: "usd",
            customer: stripeCustomerData.id,
            description: req.body.description
        })
        if (chargeData.id !== undefined) {
            //create order
            let { orderItemsArray, totalOrderCost, cartIdArray } = await getCartDetails(req.body.senderId);

            const newOrder = new NewOrder({
                customerId: req.body.senderId,
                orderItems: orderItemsArray,
                shippingCharges: parseFloat(req.body.shippingCharges) || 0,
                totalOrderCost: totalOrderCost,
                paymentType: "cod",
                orderStatus: 'Order Placed',
                paymentType: "online",
                paymentStatus: "success",
                addressId: req.body.addressId
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
            const transActionData = await transaction.save();

            if (!transActionData) {
                throw "Unable to complete order"
            }

            const sendData = {
                paymentId: transActionData._id,
                transactionId: transActionData.transactionId,
                url: transActionData.url,
                transactionStatus: transActionData.transactionStatus,
                amount: transActionData.amount
            }

            sendOrderConfirmationMail({
                userId: userData.id,
                orderId: addedOrder._id,
                orderItems: orderItemsArray,
                totalOrderCost,
                shippingCharges: parseFloat(req.body.shippingCharges) || 0,
                paymentType: `Online (Stripe) - txn id : ${transActionData.transactionId}`
            });

            res.send({
                success: true,
                message: "Payment successfull",
                data: sendData
            })

        } else {
            throw "Unable to process payment"
        }


    } catch (error) {
        console.log("Error in payment", error)
        res.status(500).send({
            success: false,
            message: error.message,
        })
    }
};


const sendOrderConfirmationMail = async ({ userId, orderId, orderItems, totalOrderCost, shippingCharges, paymentType = "cod" }) => {
    const userData = await user.findById(userId);

    let orderTable = "";

    if (Array.isArray(orderItems)) {
        orderItems.map((item, index) => {
            orderTable +=
                `<tr>
                    <td style="border: 1px solid black;">${index + 1}</td>
                    <td style="border: 1px solid black;">${item.productName}</td>
                    <td style="border: 1px solid black;">${item.totalUnits}</td>
                    <td style="border: 1px solid black;">${item.totalOrderItemAmount}</td>
                </tr>`
        })
    }

    const mailOptions = {
        from: process.env.SYSTEM_MAIL,
        to: userData.email,
        subject: 'Order Confirm | Salamtrade',
        html: `<body>
                <h3>Hello ${userData.firstName}</h1>
                <br/>
                <p> <span>Thank you for ordering from us.</span></p></br/>
                <p><span> Your order number : ${orderId} </span></p>
                <span>Order Detail</span>
                <table style="border-collapse: collapse; width: 100%;">
                    <tr>
                        <th style="border: 1px solid black; height: 50px;">Sr. No</th>
                        <th style="border: 1px solid black; height: 50px;">Order Name </th>
                        <th style="border: 1px solid black; height: 50px;">Quantity</th>
                        <th style="border: 1px solid black; height: 50px;">Amount</th>
                    </tr>
                    ${orderTable}
                </table>
                <br/>
                <br/>
                <p>
                    <span> Payment Type :  ${paymentType}</span> <br/>
                    <span> Shipping Charges :  ${shippingCharges}</span> <br/>
                    <span> Total Order cost :  ${totalOrderCost}</span>
                <p>
                </body>`
    };

    const sendMailInfo = await sendMail(mailOptions);

}


module.exports = { confirmCashOrder, myOrders, payment, getOrderDetails };