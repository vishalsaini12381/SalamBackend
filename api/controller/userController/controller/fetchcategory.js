var category = require('../../../../model/adminModel/categoryModel');

var fetchcategory = ((req, res) => {
    try {
        category
            .aggregate([
                {
                    $lookup: {
                        from: 'products',
                        localField: '_id',
                        foreignField: 'categoryId',
                        as: 'productList'
                    }
                },
                { $match: { "productList": { $gt: { $size: 1 } } } }
            ])
            .then((category) => {
                if (category) {
                    return res.json({ status: true, message: '', category })
                } else {
                    return res.json({ status: false, message: "Category Not Found" })
                }
            })
    } catch (error) {
        return res.json({ status: false, message: 'SomeThing Went Wrong' })
    }
})

module.exports = { fetchcategory };