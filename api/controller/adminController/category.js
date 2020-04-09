var category = require('../../../model/adminModel/categoryModel');
var business = require('../../../model/adminModel/businessCategoryModel');
var mongoose = require('mongoose');


var CategoryMethod = async (req, res) => {
    try {
        const isCategoryAvailable = await category.findOne({ category: req.body.category });

        if (isCategoryAvailable) {
            return res.json({ status: false, message: 'Category Already Available' })
        }
        const Category = new category({
            businessId: req.body.businesscategoryId,
            category: req.body.category
        });

        Category.save((error, saved) => {
            if (error) {
                return res.json({ status: false, message: 'Category Not Added' });
            } else {
                return res.json({ status: true, message: 'Category Added', saved });
            }
        })
        // })

    } catch (error) {
        return res.json({ status: false, message: 'Something Went Wrong' });
    }
}

var fetchCategoryPage = ((req, res) => {
    try {
        category.find({})
            .populate('businessId', 'businesscategory')
            .then((category) => {
                if (category) {
                    return res.json({ status: true, message: '', category })
                } else {
                    return res.json({ status: false, message: 'Category Not Found' });
                }
            })
    } catch (error) {
        return res.json({ status: false, message: 'SomeThing Went Wrong' })
    }
})

var fetchCategory = ((req, res) => {
    try {
        category.find({ businessId: mongoose.Types.ObjectId(req.body.businesscategory) })
            .populate('businessId', 'businesscategory')
            .then((category) => {
                if (category) {
                    return res.json({ status: true, message: '', category })
                } else {
                    return res.json({ status: false, message: 'Category Not Found' });
                }
            })

    } catch (error) {
        return res.json({ status: false, message: 'SomeThing Went Wrong' })
    }
})

var deleteCategory = ((req, res) => {
    try {
        var id = req.body.businessId
        category.findByIdAndRemove(id).then((doc) => {
            return res.json({ status: false, message: 'Poof! Your imaginary file has been deleted!' })
        })
    } catch (error) {
        return res.json({ status: false, message: "Something Went Wrong" });
    }
})


var editCategory = ((req, res) => {
    try {
        let id = req.params.id;
        category.findById(id, function (err, category) {
            res.json(category);
        })
    } catch (error) {
        return res.json({ status: false, message: 'Something Went Wrong' })
    }
})

var updateCategory = ((req, res) => {
    try {
        // var detail = {
        //     category : req.body.category
        // }

        let id = req.params.id;

        category.findByIdAndUpdate(id, { $set: { category: req.body.category } })
            .then((user) => {
                if (user) {
                    return res.json({ status: true, message: 'Category Updated', user });
                } else {
                    return res.json({ status: false, message: 'Category Not found', })
                }
            }, (e) => {
                return res.json({ status: false, message: 'Category NoT Updated' });
            })

    } catch (error) {
        return res.json({ status: false, message: 'Something Went Wrong' })
    }
})

module.exports = { CategoryMethod, fetchCategory, fetchCategoryPage, deleteCategory, editCategory, updateCategory };