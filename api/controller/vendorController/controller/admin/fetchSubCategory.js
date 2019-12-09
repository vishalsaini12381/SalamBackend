var subCategory = require('../../../../../model/adminModel/subCategoryModel');
var mongoose = require('mongoose');

var fetchsubCategory = ((req,res)=>{
    try{
        subCategory.find({categoryId : mongoose.Types.ObjectId(req.body.category) }).then((subcategory)=>{
            // console.log('DDDDDDDDDDDDDDDD',subcategory);
            if(subcategory){
                return res.json({status : true, message: '' , subcategory})
            }else{
                return res.json({status: false , message: 'Category Not Found'});
            }
        })
    }catch(error){
        return res.json({status: false, message: 'SomeThing Went Wrong'})
    }
})

module.exports = {fetchsubCategory};