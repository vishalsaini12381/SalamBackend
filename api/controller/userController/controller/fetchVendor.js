var user = require('../../../../model/vendorModel/model/vendorSchema');

var fetchVendorList = ((req,res)=>{
    console.log('2222222222222222',req.body)
    user.find({featured : true}).then((vendor)=>{
        console.log('##################',vendor);
        if(vendor){
            return res.json({status : true ,message : '',vendor});
        }else{
            return res.json({status: false , message: 'Vendor Not Found'})
        }
    })
})

module.exports = {fetchVendorList};