const TransctionSchema = require('../../../model/transaction.model')

exports.getTransaction = async (req, res) => {
    const userId = req.body.userId;

    try {
        const transactions = await TransctionSchema.find({ senderId: userId })
        if (transactions) {
            res.send({
                message: "Data fetched successfully",
                data: transactions,
                success: true
            })
        }

        res.send({
            message: "Data not available",
            data: [],
            success: false
        })

    } catch (error) {
        res.send({
            message: "Internal Server Error",
            success: false
        })
    }
}