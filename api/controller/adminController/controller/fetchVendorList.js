var vendor = require('../../../../model/vendorModel/model/vendorSchema');
var mongoose  = require('mongoose');

var vendorList = ((req,res)=>{
    console.log('OOOOOOOOOOO',req.body.type);

    try{
        vendor.find({accountType : req.body.type}).then((doc)=>{
            console.log('MMMMMMMMMMMMMM',doc[0].name);
            if(doc){
                return res.json({status: true, message: '', data:doc,});
            }else{
                return res.json({status: false, message: 'Vendors Not Found'});
            }
        })
    }
    catch(error){
        return res.json({status: false, message: 'Something Went Wrong'});
    }
});

var fetchVendorList = ((req,res)=>{
    try{
        vendor.findById({_id: mongoose.Types.ObjectId(req.body.vendorId)}).then((user)=>{
            if(user){
                console.log('+++++++++++++++++++++++++',user.featured);
                return res.json({
                    status : true, 
                    message : '',
                    image : user.image,
                    name :  user.name,
                    email : user.email,
                    mobile : user.mobile,
                    adminStatus : user.adminStatus,
                    vendorId : user._id,
                    address : user.address,
                    accountType : user.accountType,
                    city : user.city,
                    streetName : user.streetName,
                    storeEmail : user.storeEmail,
                    storeName  : user.storeName,
                    featured   : user.featured,

                })
            }else{
                return res.json({status: false , message : 'Vendor Not Found'});
            }
        })
    }catch(error){
        return res.json({status: false, message: 'SomeThing Went Wrong'})
    }
})

var editVendorList = ((req,res)=>{
    try{
        console.log('CCCCCCCCCCCCCCCCC',req.body.featured);
        vendor.findOne({_id : mongoose.Types.ObjectId(req.body.vendorId)}).then((vendor)=>{
            console.log('AdminStatus',vendor.featured);
            if(vendor){
                vendor.adminStatus = req.body.status;
                vendor.featured    = req.body.featured;
                vendor.save((err,resp)=>{
                    console.log('response',resp.featured);
                    if(err){
                        return res.json({status: false , message : 'Some Error With Query'});
                    }else{
                        return res.json({
                            status : true , 
                            message : 'Vendor Status Updated',
                            adminStatus :  resp.adminStatus,
                            featured    :  resp.featured,
                        })
                    }
                })
            }
        })
    }catch(error){
        return res.json({status : false , message : 'SomeThing Went Wrong'});
    }
})

var deleteVendor = ((req,res)=>{
    try{
        var id = req.body.businessId
        vendor.findByIdAndRemove(id).then((doc)=>{
            console.log('DOOOOOOOOOOOOOOOOO',doc);
            return res.json({status: false, message: 'Poof! Your imaginary file has been deleted!' })
        })
    }catch(error){
        console.log('ERROR',error);
        return res.json({status: false, message: "Something Went Wrong"});
    }
})



module.exports = {vendorList,fetchVendorList,editVendorList,deleteVendor};