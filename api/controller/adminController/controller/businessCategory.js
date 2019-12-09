var business = require('../../../../model/adminModel/businessCategoryModel');
var category = require('../../../../model/adminModel/categoryModel');
var subCategory = require('../../../../model/adminModel/subCategoryModel');

var mongoose = require('mongoose');

var businessCategory = ((req,res)=>{
    // console.log('ZZZZZZZZZZZZZZZ',req.body);
    try{
        var Business = new business({
            business_id      : 'B-'+Date.now(),
            businesscategory : req.body.businesscategory,
            status           : 1
        });
        
        Business.save((error,saved)=>{
            console.log('saved',Business);
            if(error){
                return res.json({status: false, message: 'Business Category Not Added',});
            }else {
                return res.json({
                    status: true, 
                    message: 'Business Category Added',
                    id : saved._id,
                    businesscategory: saved.businesscategory });
            }
        })
    }catch(error){
        return res.json({status: false, message: 'Something Went Wrong'});
    }
})

var fetchBusinessCategory = ((req,res)=>{
    try{
        business.find({status:{ $ne: 5 }}).then((doc)=>{
            if(doc) {
                return res.json ({status : true , message : '' , doc});
            }else {
                return res.json({status : false , message : 'Business Category Not Found'});
            }
        })
    }catch(error){
        return res.json({status : false , message : 'SomeThing Went Wrong'});
    }
})

// var deleteBusinessCategory = ((req,res)=>{
//     try{
//         var id = req.body.businessId
//         business.findByIdAndRemove(id).then((doc)=>{
//             // console.log('DOOOOOOOOOOOOOOOOO',doc);
//             return res.json({status: false, message: 'Deleted SuccessFully' })
//         })
//     }catch(error){
//         console.log('ERROR',error);
//         return res.json({status: false, message: "Something Went Wrong"});
//     }
// })

var deleteBusinessCategory = ((req,res)=>{
    try{
        var id = req.body.businessId
        business.findByIdAndUpdate(id,{$set : { status: 5}})
        .then((user)=>{
            // console.log('333333333333333333333',user);
            if(user){
                return res.json({status : true , message : 'Business Category Deleted' , user});
            }else{
                return res.json({status : false , message : 'Business Category Not Found'});
            }
        },(e)=>{
            // console.log('555555555555555555555',e);
            return res.json({status : false , message: 'Business Category Not Deleted'});
        })
    }catch(error){
        console.log('ERROR',error);
        return res.json({status: false, message: "Something Went Wrong"});
    }
})

var editBusinessCategory = ((req,res)=>{
    try{
        let id = req.params.id;
    // console.log('<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<',req.params.id);
    business.findById(id, function (err, businessCategory){
        // console.log('UUUUUUUUUUUUUUUUUUU',err);
    res.json(businessCategory);
    console.log('----------------------',businessCategory);

    }); 
    }catch(error){
        // console.log('error',error);
        return res.json({status: false, message: 'Something Went Wrong'});
    }
})

var updateBusinessCategory = ((req,res)=>{
    try{
        // console.log('SSSSSSSSSSSs',req.params.id);
        var detail = {
            businesscategory : req.body.businesscategory,
        };
        // console.log('2222222222222222',detail);
        let id = req.params.id;     

        // console.log('jjjjjjj', id);
        business.findByIdAndUpdate(id,{$set : {businesscategory : req.body.businesscategory, status: req.body.status}})
        .then((user)=>{
            // console.log('333333333333333333333',user);
            if(user){
                return res.json({status : true , message : 'Business Category Updated' , user});
            }else{
                return res.json({status : false , message : 'Business Category Not Found'});
            }
        },(e)=>{
            // console.log('555555555555555555555',e);
            return res.json({status : false , message: 'Business Category Not Updated'});
        })
    }catch(error){
        console.log('4444444444444444',error);
        return res.json({status: false, message: 'SomeThing Went Wrong'});
    }
})


var fetchStatus = (req,res)=>{
    try{
        business.findById({_id : mongoose.Types.ObjectId(req.body.businesscategoryId)}).then((doc)=>{
            if(doc){
                // console.log('doc',doc.status);
                return res.json({
                    status: true, 
                    message : '',
                    status : doc.status
                })
            }else{
                return res.json({status: false , message: 'Business Category Not Found'});
            }
        })
    }catch(error){
        return res.json({status: false ,message : 'SomeThing Went Wrong'});
    }
}

editStatus = ((req,res)=>{
    try{
        // console.log('req.body',req.body.businesscategoryId);
        business.findById({_id : mongoose.Types.ObjectId(req.body.businesscategoryId)}).then((user)=>{
            // console.log('editUser',user);
            if(user){
                user.status = req.body.status;
                user.save(function(err,resp){
                    // console.log('EditStatusError',err);
                    // console.log('EditStatusResPonse',resp.status);
                    if(err){
                        return res.json({status: false , message : 'Some Error'});
                    }else{
                        return res.json({
                            status: true,
                            message : 'Status Updated',
                            status : resp.status,
                        })
                    }
                })
            }
        })
    }catch(error){
        return res.json({status: false , message: 'SomeThing Went Wrong'});
    }
})


module.exports = {businessCategory,fetchBusinessCategory,deleteBusinessCategory,
                  editBusinessCategory,
                  editStatus,
                  fetchStatus,
                  updateBusinessCategory
                };