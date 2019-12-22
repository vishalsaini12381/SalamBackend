const ReturnOrder = require('../../../model/returnOrder.model');

exports.returnRequest = async (req, res) => {

    try {

        const orderId = req.body.orderId;
        const subOrderId = req.body.subOrderId;

        const returnOrderData = await ReturnOrder.findOne({ orderId, subOrderId })
        if (returnOrderData) {
            const returnOrder = new ReturnOrder({
                orderId,
                subOrderId,
                customerComment: req.body.customerComment
            })

            const data = await returnOrder.save()
            if (!data) {
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

    ReturnOrder.findOne({ orderId, subOrderId })
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