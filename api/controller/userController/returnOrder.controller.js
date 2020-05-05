const ReturnOrder = require('../../../model/returnOrder.model');
const NewOrder = require('../../../model/orders.model');
exports.returnRequest = async (req, res) => {

    try {

        const orderId = req.body.orderId;
        const subOrderId = req.body.subOrderId;
        const isRequestAlreadyRegistered = await NewOrder.aggregate([
            { $match: { $and: [{ '_id': mongoose.Types.ObjectId(orderId) }, { 'orderItems._id': mongoose.Types.ObjectId(subOrderId) }, { 'orderItems.isRefundRequested': true }] } },
            { $unwind: '$orderItems' },
            { $match: { 'orderItems._id': mongoose.Types.ObjectId(subOrderId) } }
        ])
        // const returnOrderData = await ReturnOrder.findOne({ orderId, subOrderId })
        if (!(isRequestAlreadyRegistered.length > 0)) {

            let dataOrderUpdate = await NewOrder.update({
                '$and':
                    [{ '_id': orderId }, { 'orderItems._id': subOrderId }]
            },
                {
                    '$set': {
                        'orderItems.$.requestComment' : req.body.requestComment,
                        'orderItems.$.isRefundRequested': true,
                        'orderItems.$.refundRequest.refundRequest': new Date(),
                        'orderItems.$.refundRequest.refundStatus': 'requested'
                    }
                });

            if (!dataOrderUpdate) {
                res.send({
                    message: "Unable save data",
                    success: false
                })
            }
            res.send({
                message: "Data saved successfully",
                success: true,
                data
            })
        } else {
            res.send({
                message: "Request already registered",
                success: false
            })
        }
    } catch (error) {
        res.status(500).send({
            message: "Internal Server Error",
            success: false
        })
    }
}

exports.getReturnOrderRequest = (req, res) => {
    const orderId = req.body.orderId;
    const subOrderId = req.body.subOrderId;

    NewOrder.findOne({ '$and': [{ '_id': orderId }, { 'orderItems._id': subOrderId }] })
        .then(data => {
            if (!data) {
                res.send({
                    message: "No data available",
                    success: false
                })
            }
            res.send({
                message: "Data fetched successfully",
                success: true,
                data
            })
        })
        .catch(error => {
            res.status(500).send({
                message: "Internal Server Error",
                success: false
            })
        })

}