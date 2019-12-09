var user = require('../../../../model/vendorModel/model/vendorSchema');

var clientProfile = ((req,res)=>{
    // console.log('rea.body',req.body.latLng.lng);
    try{
        user.findOne({email: req.body.email}).then((User)=>{
            // console.log('8888888888888888',User.lng);
            if(User){
                User.image        = req.body.file;
                User.name         = req.body.name;
                User.mobile       = req.body.mobile;
                User.storeName    = req.body.storeName;
                User.storeEmail   = req.body.storeEmail;
                User.storeMobile  = req.body.storeMobile;
                User.streetName   = req.body.streetName;
                User.address      = req.body.address;
                User.lat          = req.body.latLng.lat;
                User.lng          = req.body.latLng.lng;
                User.zipCode      = req.body.zipCode;
                User.city         = req.body.city;

                User.save(function(err,resp){
                    // console.log('response',resp);
                    if(err){
                    // console.log('response',err);
                        return res.json({status: false, message: "Some Error With Query"})
                    }else{
                        return res.json({
                            status       : true,
                            message      : "Profile Updated SuccessFully",
                            image        : resp.image,
                            name         : resp.name,
                            mobile       : resp.mobile,
                            storeEmail   : resp.storeEmail,
                            storeMobile  : resp.storeMobile,
                            storeName    : resp.storeName,
                            streetName   : resp.streetName,
                            address      : resp.address,
                            lat          : resp.lat,
                            lng          : resp.lng,
                            zipCode      : resp.zipCode,
                            city         : resp.city
                        })
                    }
                })
            }
        })
    }catch(error){
        console.log('error',error);
        return res.json({status: false, message: "SomeThing Went Wrong"})
    }
});

var imgProfile = ((req,res)=>{
    console.log('rea.body',req.body);
    try{
        user.findOne({email: req.body.email}).then((User)=>{
            console.log('8888888888888888',User);
            if(User){
                User.image        = req.body.file;
                User.save(function(err,resp){
                    console.log('response',resp);
                    if(err){
                    console.log('response',err);
                        return res.json({status: false, message: "Some Error With Query"})
                    }else{
                        return res.json({
                            status       : true,
                            message      : "Profile Photo Updated SuccessFully",
                            image        : resp.image,
                        })
                    }
                })
            }
        })
    }catch(error){
        console.log('error',error);
        return res.json({status: false, message: "SomeThing Went Wrong"})
    }
});




module.exports = {clientProfile,imgProfile};