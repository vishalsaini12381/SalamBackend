var category = require('../../../../../model/adminModel/categoryModel');
var mongoose = require('mongoose');


var fetchCategory = ((req,res)=>{
    console.log('businesscategoryId',req.body.businesscategory);
    try{
        category.find({businessId :  mongoose.Types.ObjectId(req.body.businesscategory)}).then((category)=>{
            // console.log('DDDDDDDDDDDDDDDD',category);
            if(category){
                return res.json({status : true, message: '' , category})
            }else{
                return res.json({status: false , message: 'Category Not Found'});
            }
        })
    }catch(error){
        return res.json({status: false, message: 'SomeThing Went Wrong'})
    }
})



module.exports = {fetchCategory};