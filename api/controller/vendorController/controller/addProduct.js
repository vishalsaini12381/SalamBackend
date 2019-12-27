var Product = require('../../../../model/products.model');
var User = require('../../../../model/vendorModel/model/vendorSchema');

var addProduct = ((req, res) => {

    const errors = req.validationErrors();
    if (errors) {
        var errorMessage = [];
        errors.forEach((err) => {
            errorMessage.push(err.msg);
        });
        return res.json({ status: false, message: errorMessage[0], });
    } else {
        try {
            const product = new Product({
                userId: req.body.userId,
                file1: req.body.file1,
                file2: req.body.file2,
                file3: req.body.file3,
                file4: req.body.file4,
                productId: Date.now(),
                productName: req.body.productName,
                productPrice: req.body.productPrice,
                discount: req.body.discount,
                businesscategoryId: req.body.businesscategory,
                categoryId: req.body.category,
                subCategoryId: req.body.subCategory,
                brandName: req.body.brandName,
                quantity: req.body.quantity,
                aboutProduct: req.body.aboutProduct,
                specification: req.body.specification,
                createdAt: new Date(),
                updateAt: new Date().getTime(),
                isRefundable: req.body.isRefundable || false,
                returnPolicy: req.body.returnPolicy
            })
            User.findById({ _id: req.body.userId }).then((user) => {
                if (!user) {
                    return res.json({ status: false, message: "User not Exist" })
                }
                if (user) {
                    if (user.adminStatus === 'Verify') {
                        // user.productId.push(product)
                        // user.save();
                        // if(arr.includes(p[1])){
                            // console.log("-----------",product)
                        product.save(function (err, save) {
                            console.log("----------",err)
                            if (err) {
                                return res.json({ status: false, message: "Error Occured" });
                            }
                            return res.json({
                                status: true,
                                message: 'Product Added SuccessFully',
                                _id: save._id,
                                file1: save.file1,
                                file2: save.file2,
                                file3: save.file3,
                                file4: save.file4,
                                productName: save.productName,
                                productPrice: save.productPrice,
                                discount: save.discount,
                                businesscategory: save.businesscategoryId,
                                category: save.categoryId,
                                subCategory: save.subCategoryId,
                                brandName: save.brandName,
                                quantity: save.quantity,
                                aboutProduct: save.aboutProduct,
                            });
                        })
                        // }else{
                        //     return res.json({status: false, message: 'File Type Not Match'})
                        // }
                    } else {
                        return res.json({ status: false, message: "Not Verified By Admin" })
                    }
                }
            })
        } catch (error) {
            return res.json({ status: false, message: "Something Went Wrong" })
        }
    }
});

var userStatus = ((req, res) => {

    //    var userId = req.body.userId;
    User.findById({ _id: req.body.userId }).then((user) => {
        if (user) {
            if (user.adminStatus === 'Verify') {
                return res.json({
                    status: true,
                    message: 'Verify',
                    status: user.adminStatus
                })
            } else if (user.adminStatus === 'Block') {
                return res.json({ status: false, message: 'You are blocked by admin' })
            } else {
                return res.json({ status: false, message: 'Your profile is not verified by admin' })
            }
        }
    })
})

module.exports = { addProduct, userStatus };