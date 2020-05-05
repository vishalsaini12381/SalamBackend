const TransctionSchema = require('../../../model/transaction.model');
const UserSchema = require('../../../model/vendorModel/model/vendorSchema')

exports.getTransaction = async (req, res) => {
    const userId = req.body.userId;

    try {
        const userData = await UserSchema.findById(userId);

        const transactions = await TransctionSchema.find({ $or: [{ senderId: userId }, { receiverId: userId }] })
        if (transactions) {
            res.send({
                message: "Data fetched successfully",
                data: transactions,
                wallet : userData.wallet,
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