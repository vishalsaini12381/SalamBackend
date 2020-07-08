var product = require('../../../../model/products.model');
var mongoose = require('mongoose');

var fetchProduct = ((req, res) => {
    try {
        product.find({ userId: mongoose.Types.ObjectId(req.body.userId) })
            .populate('businesscategoryId', 'businesscategory')
            .populate('categoryId', 'category')
            .populate('userId', 'name')
            .then((user) => {
                if (user) {
                    return res.json({ status: true, message: '', user })
                } else {
                    return res.json({ status: false, message: 'Product Not Found' });
                }
            })
    } catch (error) {
        return res.json({ status: false, message: 'Some Error' });
    }
});

var fetchProductList = ((req, res) => {
    try {
        product.findById({ _id: mongoose.Types.ObjectId(req.body.productId) })
            .populate('businesscategoryId', '_id businesscategory')
            .populate('categoryId', 'category')
            .populate('subCategoryId', 'subcategory')
            .populate('userId', 'name storeName')
            .then((user) => {
                if (user) {
                    console.log("object", user.subCategoryId)
                    return res.json({
                        status: true,
                        message: '',
                        //  name :  
                        productId: user._id,
                        name: user.userId.name,
                        storeName: user.userId.storeName,
                        productName: user.productName,
                        file1: user.file1,
                        file2: user.file2,
                        file3: user.file3,
                        file4: user.file4,
                        productPrice: user.productPrice,
                        discount: user.discount,
                        businesscategoryId: user.businesscategoryId._id,
                        businesscategory: user.businesscategoryId.businesscategory,
                        category: user.categoryId.category,
                        subCategoryId: user.subCategoryId._id,
                        subCategory: user.subCategoryId.subcategory,
                        brandName: user.brandName,
                        quantity: user.quantity,
                        aboutProduct: user.aboutProduct,
                        specification: user.specification
                        //  storeName : user.storeName,
                    })
                } else {
                    return res.json({ status: false, message: 'Product Not Found' });
                }
            })
    } catch (error) {
        return res.json({ status: false, message: 'Some Error' });
    }
});


var deleteProduct = ((req, res) => {
    try {
        var id = (req.body.productId)
        product.findByIdAndRemove(id).then((doc) => {
            return res.send({ status: true, message: 'Poof! Your imaginary file has been deleted!' })
        })
    } catch (error) {
        return res.json({ status: false, menubar: "Some Error occured" })
    }
})

var editProduct = ((req, res) => {
    try {
        product.findById({ _id: mongoose.Types.ObjectId(req.body.productId) })
            .then((user) => {
                if (user) {
                    user.file1 = req.body.file1;
                    user.file2 = req.body.file2;
                    user.file3 = req.body.file3;
                    user.file4 = req.body.file4;
                    user.productName = req.body.productName;
                    user.productPrice = req.body.productPrice;
                    user.discount = req.body.discount;
                    user.businesscategory = req.body.businesscategory;
                    user.category = req.body.category;
                    user.subCategory = req.body.subCategory;
                    user.brandName = req.body.brandName;
                    user.quantity = req.body.quantity;
                    user.aboutProduct = req.body.aboutProduct;
                    user.specification = req.body.specification;

                    user.save(function (err, resp) {
                        if (err) {
                            return res.json({ status: false, message: 'Some Error With Query' })
                        } else {
                            return res.json({
                                status: true,
                                message: 'Product Successfully Updated',
                                file1: resp.file1,
                                file2: resp.file2,
                                file3: resp.file3,
                                file4: resp.file4,
                                productName: resp.productName,
                                productPrice: resp.productPrice,
                                discount: resp.discount,
                                businesscategory: resp.businesscategory,
                                category: resp.category,
                                subCategory: resp.subCategory,
                                brandName: resp.brandName,
                                quantity: resp.quantity,
                                aboutProduct: resp.aboutProduct,
                                specification : resp.specification
                            })
                        }
                    })
                } else {
                }
            })
    } catch (error) {
        return res.json({ status: false, menubar: 'Something Went wrong' });
    }
})



module.exports = { fetchProduct, fetchProductList, deleteProduct, editProduct };