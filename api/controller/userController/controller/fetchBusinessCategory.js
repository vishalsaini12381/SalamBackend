var businesss = require('../../../../model/adminModel/businessCategoryModel');
var category = require('../../../../model/adminModel/categoryModel');
var subcategory = require('../../../../model/adminModel/subCategoryModel');

var fetchBusinesscategory = (async (req, res) => {
    try {
        const data = await businesss
            .aggregate([
                { $match: { "status": '1' } },
                {
                    $lookup: {
                        from: 'products',
                        localField: '_id',
                        foreignField: 'businesscategoryId',
                        as: 'productList'
                    }
                },
                { $match: { "productList": { $gt: { $size: 1 } } } },
                { $project: { "business_id": "$_id", "business_name": "$businesscategory" } },
                { $sort: { "business_id": 1 } },
                {
                    $lookup: {
                        from: 'categories',
                        let: { "bussinessId": "$_id" },
                        pipeline: [
                            { $match: { $expr: { $in: ["$$bussinessId", "$businessId"] } } },
                            {
                                $lookup: {
                                    from: 'products',
                                    localField: '_id',
                                    foreignField: 'categoryId',
                                    as: 'productList'
                                }
                            },
                            { $match: { "productList": { $gt: { $size: 1 } } } },
                            { $project: { "categories_id": '$_id', "categories": "$category" } },
                            { $sort: { "categories_id": -1 } },
                            {
                                $lookup: {
                                    from: 'subcategories',
                                    let: { 'categories_id': '$categories_id' },
                                    pipeline: [
                                        { $match: { $expr: { $eq: ['$$categories_id', '$categoryId'] } } },
                                        {
                                            $lookup: {
                                                from: 'products',
                                                localField: '_id',
                                                foreignField: 'subCategoryId',
                                                as: 'productList'
                                            }
                                        },
                                        { $match: { "productList": { $gt: { $size: 1 } } } },
                                        { $project: { 'businessId': 1, 'categoryId': 1, 'subcategory': 1, 'subcategoryId': '1' } },
                                        { $sort: { "businessId": -1 } },
                                    ],
                                    as: 'subcategorie'
                                }
                            },
                            { $match: { "subcategorie": { $gt: { $size: 1 } } } }
                        ],
                        as: 'categories'
                    }
                }
            ])
        return res.json({ code: 100, status: true, message: 'Staff List', data });

    } catch (error) {
        return res.json({ status: false, message: 'SomeThing Went Wrong' });
    }
})


async function getAllData(data) {
    let globalVar = [];
    await category.find({ businessId: data }).then((categoryData) => {

        globalVar.push(categoryData);
    })
    return await globalVar;
}

var fetchBusinesscategoryHeader = ((req, res) => {
    try {
        businesss.find({}).then((business) => {
            newArray = []
            // newArray.push(1);
            if (business) {
                business.forEach(async function (index, fun) {
                    globalVar = [];
                    var businessArr = {
                        "_id": index._id,
                        "businesscategory": index.businesscategory,
                        "category": [],
                    }

                    var data = getAllData(index._id);
                    businessArr.category.push(await data);
                    newArray.push(businessArr);

                })
                // newArray.push(3);
                return res.json({ status: true, message: '', newArray })
            } else {
                return res.json({ status: false, message: 'Business Category Not Found' });
            }
        })
    } catch (error) {
        return res.json({ status: false, message: 'SomeThing Went Wrong' });
    }
})

module.exports = { fetchBusinesscategory, fetchBusinesscategoryHeader };

// var fetchBusinesscategory = (async (req,res)=>{
//     var businessData=[];
//     var categoryData=[];
//     var subCategoryData=[];
//     try{
//         const waitFor = (ms) => new Promise(r => setTimeout(r, ms));

//         businesss
//         .aggregate([
//                 {$match : { "status" : '1' }},
//                 {
//                     $lookup: {
//                         from: 'products',
//                         localField: '_id',
//                         foreignField: 'businesscategoryId',
//                         as: 'productList'
//                     }
//                 },
//                 { $match: { "productList": { $gt: { $size: 1 } } } }
//             ])
//         .then(async(business)=>{
//             if(business){
//                 businessData=business;
//             }
//         })

//         await waitFor(50);
//         businessData.forEach(async element => {
//             category.find({businessId:element._id}).
//                 then(async(categoryres)=>{
//                     if(categoryres){
//                         // categoryres['name22']=element.businesscategory;
//                         var obj={
//                             "business_id":element._id,
//                             "business_name":element.businesscategory,
//                             "categories":categoryres
//                         }
//                         // await waitFor(10);
//                         categoryData.push(obj);
//                         await waitFor(60);
//                     }
//                 })
//         })
//         await waitFor(500);
//         //return res.json({code:100,status: true, message: 'Staff List',data : categoryData});


//         categoryData.forEach(async element => {
//             var globalCat=[]
//             element.categories.forEach(async catelement => {
//                 subcategory.find({categoryId:catelement._id}).
//                     then(async(subcategoryres)=>{
//                         if(subcategoryres){
//                             // categoryres['name22']=element.businesscategory;
//                             var catObj={
//                                 'categories_id':catelement._id,
//                                 'categories':catelement.category,
//                                 'subcategorie':subcategoryres
//                             }
//                             // await waitFor(40);
//                             globalCat.push(catObj);
//                             await waitFor(40);

//                         }
//                     })
//             })
//             var obj={
//                 "business_id":element.business_id,
//                 "business_name":element.business_name,
//                 "categories":globalCat
//             }
//             // await waitFor(50);
//             subCategoryData.push(obj);
//             await waitFor(60);

//         })
//         await waitFor(500);
//         return res.json({code:100,status: true, message: 'Staff List',data : subCategoryData});

//         }catch(error){
//         return res.json({status: false , message :'SomeThing Went Wrong'});
//     }
// })