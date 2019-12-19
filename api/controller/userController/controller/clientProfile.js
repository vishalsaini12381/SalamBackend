var user = require('../../../../model/vendorModel/model/vendorSchema');

var userProfile = ((req,res)=>{
    try {
        user.findOne({email: req.body.email}).then((data)=>{ 
            if(data){
                data.firstName = req.body.firstName;
                data.lastName  = req.body.lastName;
                data.mobile    = req.body.mobile;
                data.gender    = req.body.gender;
                data.dob       = req.body.dob;
                data.streetAddress = req.body.streetAddress;
                data.city = req.body.city;
                data.state = req.body.state;
                data.zipcode = req.body.zipcode;
                data.country = req.body.country;

                data.save((err,resp)=>{
                    if(err){
                        return res.json({status: false, message: 'Profile Not Updated Some Error'});
                    }else{
                        return res.json({
                            status: true,
                             message   : 'Profile  Updated SuccessFully',
                             firstName : resp.firstName,
                             email     : resp.email,
                             lastName  : resp.lastName,
                             mobile    :  resp.mobile,
                             gender    : resp.gender,
                             dob       : resp.dob,
                             accountType : resp.accountType,
                             streetAddress : resp.streetAddress,
                             zipcode  : resp.zipcode,
                             city : resp.city,
                             state : resp.state,
                             country : resp.country,
                            });
                    }
                })
            }
        })
    }catch(error){
        return res.json({status: false, message: 'Something Went Wrong'});
    }
});
module.exports = {userProfile};