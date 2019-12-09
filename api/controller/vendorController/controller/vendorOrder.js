var order = require('../../../../model/userModel/model/orderModel');
var product = require('../../../../model/vendorModel/model/productSchema');
var address = require('../../../../model/userModel/model/shippingAddressModel');
var mongoose = require('mongoose');

var getAllOrder = ((req,res)=>{
    // console.log('lllllllllllllllll',req.body);
    try{
        order.find({vendorId:{$elemMatch:{$eq:mongoose.Types.ObjectId(req.body.vendorId)}}})
        .populate('userId')
        .then((user)=>{
            
            if(user){
                return res.json({status: true, message: '', user})
            }else{
                return res.json({status: false, message: 'Product Not Found'});
            }
        })
    }catch(error){
        console.log('^^^^^^^^^^^^^^^^^',error);
        return res.json({status: false, message: 'Some Error'});
    }
});

var getOrderDetail = (async(req,res)=>{
    // console.log('lllllllllllllllll',req.body);
    var productData=[];
    var resultData=[];
    var orderProductData=[];
    var addressData=[];
    try{
        const waitFor = (ms) => new Promise(r => setTimeout(r, ms));
        order.findOne({_id:req.body.orderId})
        .populate('userId')
        .then(async(user)=>{
            if(user){
                productData=user;
            }
        })
            await waitFor(100);
           console.log('user',productData)
            productData.product.forEach(async element=>{
               
                product.findOne({_id:element.productId})
                .then(async(getProductData)=>{
                    if(getProductData){
                        var obj={
                            "orderProductData":element,
                            "vendorId":getProductData.userId,
                            "businesscategoryId":getProductData.businesscategoryId,
                            "categoryId":getProductData.categoryId,
                            "subCategoryId":getProductData.subCategoryId,
                            "file1":getProductData.file1,
                            "productName":getProductData.productName,
                        }
                        orderProductData.push(obj);
                        await waitFor(60);
                    }
                })
            })
            await waitFor(100);

            address.findOne({_id:productData.addressId})
                .then(async(getAddress)=>{
                    if(getAddress){
                        addressData.push(getAddress);
                        await waitFor(60);
                    }
                })
                await waitFor(100);
        var resObj={
            "orderDetail":productData,
            "productDetail":orderProductData,
            "addressData":addressData
        }
        resultData.push(resObj);
        // await waitFor(200);
        return res.json({status: false, message: 'Some Error',resultData});
    }catch(error){
        console.log('^^^^^^^^^^^^^^^^^',error);
        return res.json({status: false, message: 'Some Error'});
    }
});



var getAllOrderAdmin = ((req,res)=>{
    // console.log('lllllllllllllllll',req.body);
    try{
        order.find({})
        .populate('userId')
        .then((user)=>{
            console.log('lllllllllllllllll',user);
            if(user){
                return res.json({status: true, message: '', user})
            }else{
                return res.json({status: false, message: 'Product Not Found'});
            }
        })
    }catch(error){
        console.log('^^^^^^^^^^^^^^^^^',error);
        return res.json({status: false, message: 'Some Error'});
    }
});


var getOrderDetailAdmin = (async(req,res)=>{
    // console.log('lllllllllllllllll',req.body);
    var productData=[];
    var resultData=[];
    var orderProductData=[];
    var addressData=[];
    try{
        const waitFor = (ms) => new Promise(r => setTimeout(r, ms));
        order.findOne({_id:req.body.orderId})
        .populate('userId')
        .then(async(user)=>{
            if(user){
                productData=user;
            }
        })
            await waitFor(100);
           console.log('user',productData)
            productData.product.forEach(async element=>{
               
                product.findOne({_id:element.productId})
                .then(async(getProductData)=>{
                    if(getProductData){
                        var obj={
                            "orderProductData":element,
                            "vendorId":getProductData.userId,
                            "businesscategoryId":getProductData.businesscategoryId,
                            "categoryId":getProductData.categoryId,
                            "subCategoryId":getProductData.subCategoryId,
                            "file1":getProductData.file1,
                            "productName":getProductData.productName,
                        }
                        orderProductData.push(obj);
                        await waitFor(60);
                    }
                })
            })
            await waitFor(100);

            address.findOne({_id:productData.addressId})
                .then(async(getAddress)=>{
                    if(getAddress){
                        addressData.push(getAddress);
                        await waitFor(60);
                    }
                })
                await waitFor(100);
        var resObj={
            "orderDetail":productData,
            "productDetail":orderProductData,
            "addressData":addressData
        }
        resultData.push(resObj);
        // await waitFor(200);
        return res.json({status: false, message: 'Some Error',resultData});
    }catch(error){
        console.log('^^^^^^^^^^^^^^^^^',error);
        return res.json({status: false, message: 'Some Error'});
    }
});

module.exports = {getAllOrder,getOrderDetail,getAllOrderAdmin,getOrderDetailAdmin};