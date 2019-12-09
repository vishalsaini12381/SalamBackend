var category = require('../../../../model/adminModel/categoryModel');
var business = require('../../../../model/adminModel/businessCategoryModel');
var mongoose = require('mongoose');


var CategoryMethod = ((req,res)=>{
    // console.log('ZZZZZZZZZZZZZZZ',req.body);
    try{
        var Category = new category({
            businessId : req.body.businesscategoryId,
            category : req.body.category
        });
        Category.save((error,saved)=>{
            // console.log('saved',saved);
            if(error){
                return res.json({status: false, message: 'Category Not Added'});
            }else {
                return res.json({status: true, message: 'Category Added',saved});
            }
        })
    // })

    }catch(error){
            console.log('error',error);
        return res.json({status: false, message: 'Something Went Wrong'});
    }
})

var fetchCategoryPage = ((req,res)=>{
    // console.log('businesscategoryId',req.body.businesscategory);
    try{
        category.find({})
        .populate('businessId','businesscategory')
        .then((category)=>{
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

var fetchCategory = ((req,res)=>{
    // console.log('businesscategoryId',req.body.businesscategory);
    try{
        category.find({businessId :  mongoose.Types.ObjectId(req.body.businesscategory)})
        .populate('businessId','businesscategory')
        .then((category)=>{
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

var deleteCategory = ((req,res)=>{
    try{
        var id = req.body.businessId
        category.findByIdAndRemove(id).then((doc)=>{
            // console.log('DOOOOOOOOOOOOOOOOO',doc);
            return res.json({status: false, message: 'Poof! Your imaginary file has been deleted!' })
        })
    }catch(error){
        // console.log('ERROR',error);
        return res.json({status: false, message: "Something Went Wrong"});
    }
})


var editCategory = ((req,res)=>{
    try{
        let id = req.params.id;
        console.log('<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<',req.params.id);
        category.findById(id, function(err,category){
            res.json(category);
            console.log('category',category);
        })
    }catch(error){
        return res.json({status : false, message: 'Something Went Wrong'})
    }
})

var updateCategory = ((req,res)=>{
    try{
        // console.log('SSSSSSSSSSSSS',req.params.id);
        // var detail = {
        //     category : req.body.category
        // }

        let id = req.params.id;

        category.findByIdAndUpdate(id,{$set : {category : req.body.category}})
        .then((user)=>{
            // console.log('userserserses,',user);
            if(user){
                return res.json({status : true, message: 'Category Updated', user});
            }else{
                return res.json({status: false , message : 'Category Not found', })
            }
        },(e)=>{
            return res.json({status: false, message: 'Category NoT Updated'});
        })

    }catch(error){
        return res.json({status: false , message:'Something Went Wrong'})
    }
})

module.exports = {CategoryMethod,fetchCategory, fetchCategoryPage,deleteCategory,editCategory,updateCategory};