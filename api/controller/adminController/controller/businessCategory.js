var business = require('../../../../model/adminModel/businessCategoryModel');
var category = require('../../../../model/adminModel/categoryModel');
var subCategory = require('../../../../model/adminModel/subCategoryModel');

var mongoose = require('mongoose');

var businessCategory = ( async (req, res) => {
    try {
        var Business = new business({
            business_id: 'B-' + Date.now(),
            businesscategory: req.body.businesscategory,
            status: 1
        });

        const businessData = await business.findOne({ businesscategory: req.body.businesscategory });
        if (businessData) {
            return res.json({
                status: false,
                message: 'Business Category Already Present',
            });
        } else {
            Business.save((error, saved) => {
                if (error) {
                    return res.json({ status: false, message: 'Business Category Not Added', });
                } else {
                    return res.json({
                        status: true,
                        message: 'Business Category Added',
                        id: saved._id,
                        businesscategory: saved.businesscategory
                    });
                }
            })
        }
    } catch (error) {
        return res.json({ status: false, message: 'Something Went Wrong' });
    }
})

var fetchBusinessCategory = ((req, res) => {
    try {
        business.find({ status: { $ne: 5 } }).then((doc) => {
            if (doc) {
                return res.json({ status: true, message: '', doc });
            } else {
                return res.json({ status: false, message: 'Business Category Not Found' });
            }
        })
    } catch (error) {
        return res.json({ status: false, message: 'SomeThing Went Wrong' });
    }
})

// var deleteBusinessCategory = ((req,res)=>{
//     try{
//         var id = req.body.businessId
//         business.findByIdAndRemove(id).then((doc)=>{
//             return res.json({status: false, message: 'Deleted SuccessFully' })
//         })
//     }catch(error){
//         return res.json({status: false, message: "Something Went Wrong"});
//     }
// })

var deleteBusinessCategory = ((req, res) => {
    try {
        var id = req.body.businessId
        business.findByIdAndUpdate(id, { $set: { status: 5 } })
            .then((user) => {
                if (user) {
                    return res.json({ status: true, message: 'Business Category Deleted', user });
                } else {
                    return res.json({ status: false, message: 'Business Category Not Found' });
                }
            }, (e) => {
                return res.json({ status: false, message: 'Business Category Not Deleted' });
            })
    } catch (error) {
        return res.json({ status: false, message: "Something Went Wrong" });
    }
})

var editBusinessCategory = ((req, res) => {
    try {
        let id = req.params.id;
        business.findById(id, function (err, businessCategory) {
            res.json(businessCategory);
        });
    } catch (error) {
        return res.json({ status: false, message: 'Something Went Wrong' });
    }
})

var updateBusinessCategory = ((req, res) => {
    try {
        var detail = {
            businesscategory: req.body.businesscategory,
        };
        let id = req.params.id;

        business.findByIdAndUpdate(id, { $set: { businesscategory: req.body.businesscategory, status: req.body.status } })
            .then((user) => {
                if (user) {
                    return res.json({ status: true, message: 'Business Category Updated', user });
                } else {
                    return res.json({ status: false, message: 'Business Category Not Found' });
                }
            }, (e) => {
                return res.json({ status: false, message: 'Business Category Not Updated' });
            })
    } catch (error) {
        return res.json({ status: false, message: 'SomeThing Went Wrong' });
    }
})


var fetchStatus = (req, res) => {
    try {
        business.findById({ _id: mongoose.Types.ObjectId(req.body.businesscategoryId) }).then((doc) => {
            if (doc) {
                return res.json({
                    status: true,
                    message: '',
                    status: doc.status
                })
            } else {
                return res.json({ status: false, message: 'Business Category Not Found' });
            }
        })
    } catch (error) {
        return res.json({ status: false, message: 'SomeThing Went Wrong' });
    }
}

editStatus = ((req, res) => {
    try {
        business.findById({ _id: mongoose.Types.ObjectId(req.body.businesscategoryId) }).then((user) => {
            if (user) {
                user.status = req.body.status;
                user.save(function (err, resp) {
                    if (err) {
                        return res.json({ status: false, message: 'Some Error' });
                    } else {
                        return res.json({
                            status: true,
                            message: 'Status Updated',
                            status: resp.status,
                        })
                    }
                })
            }
        })
    } catch (error) {
        return res.json({ status: false, message: 'SomeThing Went Wrong' });
    }
})


module.exports = {
    businessCategory, fetchBusinessCategory, deleteBusinessCategory,
    editBusinessCategory,
    editStatus,
    fetchStatus,
    updateBusinessCategory
};