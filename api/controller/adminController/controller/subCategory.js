var subCategory = require('../../../../model/adminModel/subCategoryModel');
var business = require('../../../../model/adminModel/businessCategoryModel');
var mongoose = require('mongoose');


var subCategoryMethod = ((req,res)=>{
    // console.log('ZZZZZZZZZZZZZZZ',req.body);
    try{
        // business.findById({_id: req.body.businesscategoryId}).then((user)=>{
        var log = new subCategory({
            businessId : req.body.businesscategory,
            categoryId : req.body.categoryId,
            subcategoryId : Date.now(),
            subcategory : req.body.subcategory,
        });
        // user.categoryId.subCategoryId.push(log);
        // user.save();
        log.save((error,saved)=>{
            // console.log('saved',saved);
            if(error){
                return res.json({status: false, message: 'SubCategory Not Added'});
            }else {
                return res.json({status: true, message: 'SubCategory Added',saved});
            }
        })
    // })
    }catch(error){
        return res.json({status: false, message: 'Something Went Wrong'});
    }
})

var fetchsubCategory = ((req,res)=>{
    try{
        subCategory.find({})
        .populate('businessId','businesscategory')
        .populate('categoryId','category')
        .then((subcategory)=>{
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

var deleteSubCategory = ((req,res)=>{
    try{
        var id = req.body.businessId
        subCategory.findByIdAndRemove(id).then((doc)=>{
            // console.log('DOOOOOOOOOOOOOOOOO',doc);
            return res.json({status: false, message: 'Poof! Your imaginary file has been deleted!' })
        })
    }catch(error){
        console.log('ERROR',error);
        return res.json({status: false, message: "Something Went Wrong"});
    }
})

var editSubCategory = ((req,res)=>{
    try{
    let id = req.params.id;
    // console.log('///////////////////////',id);
    subCategory.findById(id, function(err,subCategory){
        res.json(subCategory);
        console.log('subCategory',subCategory);
    })
}catch(error){
    return res.json({status: false, message: 'SomeThing Went Wrong'});
}
})

var updateSubCategory = ((req,res)=>{
    try{
        // console.log('SSSSSSSSSSSSS',req.params.id);

        let id = req.params.id;

        subCategory.findByIdAndUpdate(id , {$set:{subcategory : req.body.Subcategory}})
        .then((user)=>{
            // console.log('userserserses,',user);
            if(user){
                return res.json({status: true , message: 'SubCategory Updated' , user})
            }else{
                return res.json({status: false , message: 'SubCategory Not Found'});
            }
        },(e)=>{
            // console.log('eeeeeeeeeeeeeeeeeee',e);
            return res.json({status: false, message: 'Subcategory Not Updated' });
        })
    }catch(error){
        // console.log('error',error);
        return res.json({status: false ,message: 'SomeThing Went Wrong'});
    }
})

var fetchsubCategoryId = ((req,res)=>{
    console.log('req.body.subcategory',req.body.category);
    try{
        subCategory.find({categoryId :  mongoose.Types.ObjectId(req.body.category)})
        // .populate('categoryId','category')
        .then((subcategory)=>{
            console.log('DDDDDDDDDDDDDDDD',subcategory);
            if(subcategory){
                return res.json({status : true, message: '' , subcategory})
            }else{
                return res.json({status: false , message: 'Category Not Found'});
            }
        })
        
    }catch(error){
        console.log('error',error);
        return res.json({status: false, message: 'SomeThing Went Wrong'})
    }
})

module.exports = {subCategoryMethod,fetchsubCategory,deleteSubCategory,editSubCategory,updateSubCategory,fetchsubCategoryId};