var subcategory = require('../../../../model/adminModel/subCategoryModel');
var category = require('../../../../model/adminModel/categoryModel');
var businesscategory = require('../../../../model/adminModel/businessCategoryModel');
var fetchsubcategory = ((req, res) => {
    try {
        subcategory.aggregate(
            [
                {
                    "$lookup": {
                        "from": "businessses",
                        "localField": "businessId",
                        "foreignField": "_id",
                        "from": "categories",
                        "localField": "categoryId",
                        "foreignField": "_id",
                        "as": "monster",
                    }
                },
                { "$unwind": "$monster" },
                {
                    "$project": {
                        "businesscategory": "$monster.businesscategory",
                        "category": "$monster.category",
                        "businessId": 1,
                        "categoryId": 1,
                        "Subcategory": 1,
                    }
                },
                {
                    "$group": {
                        "_id": "$categoryId",
                        "_id": "$businessId",
                        "businesscategory": { "$addToSet": "$businesscategory" },
                        "category": { "$addToSet": "$category" }, "Subcategory": { "$addToSet": "$Subcategory" }
                    }
                },
                // {
                //     $group: {
                //       _id: "$categoryId",
                //        category: "$monster.category" 
                //     }
                // },

                // More stages
            ],
            function (err, results) {

                subcategory.findOne({})
                    .populate('categoryId', 'category')
                    // .populate('businessId','businesscategory')
                    .then((subcategory) => {
                        if (subcategory) {
                            return res.json({ status: true, message: '=', results })
                        } else {
                            return res.json({ status: false, message: 'Sub Category Not Found' })
                        }
                    })
            }
        )
    } catch (error) {
        return res.json({ status: false, message: 'SomeThing Went Wrong' });
    }
})







var fetchcategoryData = ((req, res) => {
    try {
        businesscategory.aggregate([
            {
                $lookup:
                {
                    from: 'categories',
                    localField: 'businessId',
                    foreignField: '_id',
                    as: 'orderdetails'
                }
            }
        ]).toArray(function (err, res) {
            if (err) throw err;
        });
    } catch (err) {
        return res.json({ status: false, message: 'SomeThing Went Wrong' });
    }
})


















// var fetchcategoryData = ((req,res)=>{
//     array1 = [];
//     try {
//         category.find({businessId : req.body.businessId})
//         // .populate('categoryId','category')
//         // .populate('businessId','businesscategory')
//         .then((category)=>{
//             // categoryArry = [];
//             if(category){
//                 category.forEach(function(item){
//                     // arr =[];
//                     // item.subcategoryArry =arry;
//                     // categoryArry.push(item);
//                     array3=[];

//                     subcategory.find({categoryId : item._id}).then((subcategory)=>{
//                         // categoryArry._id.push(subcategory);
//                         obj1 = {"category123":[]},
//                         subcategory.forEach(function(item1){
//                             obj1.category123.push(item1);
//                         })
//                         var z = Object.assign( {}, obj1, item );

//                     })

//                 })
//                 return res.json({status : true, message : '',category})
//             }else{
//                 return res.json({status : false ,message : 'Sub Category Not Found'})
//             }
//         })
//     } catch (error) {
//         return res.json({status : false ,message : 'SomeThing Went Wrong'});
//     }
// })

module.exports = { fetchsubcategory, fetchcategoryData };