var business = require('../../../../../model/adminModel/businessCategoryModel');
var mongoose = require('mongoose');



var fetchBusinessCategory = ((req,res)=>{
    try{
        business.find({status:1}).then((doc)=>{
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

module.exports = {fetchBusinessCategory};