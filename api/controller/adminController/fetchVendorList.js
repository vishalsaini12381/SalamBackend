var vendor = require('../../../model/vendorModel/model/vendorSchema');
var mongoose = require('mongoose');

var vendorList = ((req, res) => {

    try {
        vendor.find({ accountType: req.body.type }).then((doc) => {
            if (doc) {
                return res.json({ status: true, message: '', data: doc, });
            } else {
                return res.json({ status: false, message: 'Vendors Not Found' });
            }
        })
    }
    catch (error) {
        return res.json({ status: false, message: 'Something Went Wrong' });
    }
});

var fetchVendorList = ((req, res) => {
    try {
        vendor.findById({ _id: mongoose.Types.ObjectId(req.body.vendorId) }).then((user) => {
            if (user) {
                return res.json({
                    status: true,
                    message: '',
                    image: user.image,
                    name: user.name,
                    email: user.email,
                    mobile: user.mobile,
                    adminStatus: user.adminStatus,
                    vendorId: user._id,
                    address: user.address,
                    accountType: user.accountType,
                    city: user.city,
                    streetName: user.streetName,
                    storeEmail: user.storeEmail,
                    storeName: user.storeName,
                    featured: user.featured,

                })
            } else {
                return res.json({ status: false, message: 'Vendor Not Found' });
            }
        })
    } catch (error) {
        return res.json({ status: false, message: 'SomeThing Went Wrong' })
    }
})

var editVendorList = ((req, res) => {
    try {
        vendor.findOne({ _id: mongoose.Types.ObjectId(req.body.vendorId) }).then((vendor) => {
            if (vendor) {
                if (req.body.status !== undefined)
                    vendor.adminStatus = req.body.status;

                if (req.body.featured !== undefined)
                    vendor.featured = req.body.featured;
                vendor.save((err, resp) => {
                    if (err) {
                        return res.json({ status: false, message: 'Some Error With Query' });
                    } else {
                        return res.json({
                            status: true,
                            message: 'Vendor Status Updated',
                            adminStatus: resp.adminStatus,
                            featured: resp.featured,
                        })
                    }
                })
            }
        })
    } catch (error) {
        return res.json({ status: false, message: 'SomeThing Went Wrong' });
    }
})

var deleteVendor = ((req, res) => {
    try {
        var id = req.body.businessId
        vendor.findByIdAndRemove(id).then((doc) => {
            return res.json({ status: false, message: 'Poof! Your imaginary file has been deleted!' })
        })
    } catch (error) {
        return res.json({ status: false, message: "Something Went Wrong" });
    }
})

const getRecentCustomer = async (req, res) => {
    try {
        const customerList = await vendor.find({ accountType: 'User' })
            .sort({ _id: -1 })
            .limit(10);

        const totalCustomer = await vendor.find({ accountType: 'User' });

        res.json({
            status: false,
            message: 'Successfully fetched the data',
            customerList,
            totalCustomer: totalCustomer.length
        })
    } catch (error) {
        return res.json({ status: false, message: "Something Went Wrong" });
    }
}




module.exports = { getRecentCustomer, vendorList, fetchVendorList, editVendorList, deleteVendor };