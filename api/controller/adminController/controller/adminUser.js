var vendor = require('../../../../model/vendorModel/model/vendorSchema');
var mongoose  = require('mongoose');

var userList = ((req,res)=>{
    try{
        vendor.find({accountType : "User"}).then((doc)=>{
            if(doc){
                return res.json({status: true, message: '', data:doc,});
            }else{
                return res.json({status: false, message: 'User Not Found'});
            }
        })
    }
    catch(error){
        return res.json({status: false, message: 'Something Went Wrong'});
    }
});

module.exports = {userList};