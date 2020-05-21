var vendor = require('../../../model/vendorModel/model/vendorSchema');
var mongoose = require('mongoose');
const NewOrder = require('../../../model/orders.model');

var userList = ((req, res) => {
    try {
        vendor.find({ accountType: "User" }).then((doc) => {
            if (doc) {
                return res.json({ status: true, message: '', data: doc, });
            } else {
                return res.json({ status: false, message: 'User Not Found' });
            }
        })
    }
    catch (error) {
        return res.json({ status: false, message: 'Something Went Wrong' });
    }
});

const userDetail = async (req, res) => {
    try {

        let id = req.params.id;
        const userDetail = await vendor.findById(id);

        const orders = await NewOrder.aggregate([
            { '$match': { customerId: mongoose.Types.ObjectId(id) } },
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
            {
                $lookup:
                {
                    from: 'users',
                    localField: 'orderItems.vendorId',
                    foreignField: '_id',
                    as: "vendor"
                }
            },
            { $sort: { updatedAt: -1 } }
        ])
        if (!userDetail) {
            return res.json({ status: false, message: 'User Not Found' });
        }

        return res.json({ status: true, message: '', userDetail: userDetail || {}, orders: orders || [] });

    }
    catch (error) {
        return res.json({ status: false, message: 'Something Went Wrong' });
    }
};

module.exports = { userList, userDetail };