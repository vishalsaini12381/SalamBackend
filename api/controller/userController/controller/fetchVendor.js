var user = require('../../../../model/vendorModel/model/vendorSchema');

var fetchVendorList = ((req,res)=>{
    user.find({featured : true}).then((vendor)=>{
        if(vendor){
            return res.json({status : true ,message : '',vendor});
        }else{
            return res.json({status: false , message: 'Vendor Not Found'})
        }
    })
})

module.exports = {fetchVendorList};