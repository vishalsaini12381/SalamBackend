var cart = require('../../../../model/userModel/model/cartModel');
var wishlist = require('../../../../model/userModel/model/wishlistModel');
var address = require('../../../../model/userModel/model/shippingAddressModel');
var product = require('../../../../model/vendorModel/model/productSchema');
var mongoose = require('mongoose');

var addToCart = ((req,res)=>{
    try{
        cart.findOne({userId: req.body.userId,productId:req.body.productId}).then((data)=>{
            product.findOne({_id: req.body.productId}).then((proData)=>{
                if(data){
                    console.log('exist',data);
                    var amount      = data.amount;
                    var quantity    = data.quantity;
                    if(req.body.action==3){
                        var id = data._id
                        cart.findByIdAndRemove(id).then((doc)=>{
                            var updatedQuantity    = parseInt(proData.quantity)+parseInt(data.quantity);
                            var detail      = {
                                quantity    : updatedQuantity
                            }
                            product.findOneAndUpdate({_id: req.body.productId},detail).then((response)=>{})

                            // console.log('DOOOOOOOOOOOOOOOOO',doc);
                            return res.json({
                                status: true, 
                                message: 'Item removed from cart.',
                                code : 100,
                                data: [] });
                        })
                    }else{
                        if(req.body.action==1){
                            if(proData.quantity>=1){
                                var totalQuantity= parseInt(quantity)+parseInt(req.body.quantity);
                                var updatedQuantity    = parseInt(proData.quantity)-parseInt(req.body.quantity);
                                var detail      = {
                                    quantity    : updatedQuantity
                                }
                                product.findOneAndUpdate({_id: req.body.productId},detail).then((response)=>{})
                            }else{
                                return res.json({
                                    status: true, 
                                    message: 'Out of stock.',
                                    code : 103,
                                    data: [] 
                                });
                            }
                        }else{
                            var updatedQuantity    = parseInt(proData.quantity)+parseInt(req.body.quantity);
                            var detail      = {
                                quantity    : updatedQuantity
                            }
                            product.findOneAndUpdate({_id: req.body.productId},detail).then((response)=>{})
                            var totalQuantity= parseInt(quantity)-parseInt(req.body.quantity);
                        }
                        
                        var total       = totalQuantity*amount;
                        var detail      = {
                            quantity    : totalQuantity,
                            total       : total
                        }
                        cart.findOneAndUpdate({_id: data._id},detail).then((response)=>{
                            console.log('88888888888888',response);
                            if(response){
                                return res.json({
                                    status: true, 
                                    message: 'cart updated successfully.',
                                    code : 100,
                                    data: [] });
                            }else{
                                return res.json({code:101,status: false, message: 'Some error found',data : []});
                            }
                        },(e)=>{
                            console.log('eeeeeeeeeeeeee',e);
                            return res.json({code:102,status: false, message: 'Some error found',data : []});
                        })
                    }
                    
                }else{
                    product.findOne({_id: req.body.productId}).then((proData)=>{
                        console.log('proDataproDataproDataproData',proData)
                        if(proData.quantity>=1){
                            var price       = req.body.price;
                            var discount    = (price*req.body.discount)/100;
                            var amount      = price-discount;
                            var quantity    = req.body.quantity;
                            var userCart    = new cart({
                                    userId          : req.body.userId,
                                    productId       : req.body.productId,
                                    vendorId        : proData['userId'],
                                    price           : price,
                                    discount        : discount,
                                    amount          : amount,
                                    quantity        : quantity,
                                    total           : quantity*amount,
                                    createdAt       : new Date(),
                            });
                            
                            userCart.save((error,saved)=>{
                                console.log('saved',userCart);
                                if(error){
                                    return res.json({status: false, message: 'Some error found.',code : 101});
                                }else {
                                    var updatedQuantity    = proData.quantity-quantity;
                                    var detail      = {
                                        quantity    : updatedQuantity
                                    }
                                    product.findOneAndUpdate({_id: req.body.productId},detail).then((response)=>{})
                                    return res.json({
                                        status: true, 
                                        message: 'Item successfully added in cart.',
                                        code : 100,
                                        data: proData
                                    });
                                }
                            })
                        }else{
                            return res.json({
                                status: true, 
                                message: 'Out of stock.',
                                code : 103,
                                data: [] 
                            });
                        }
                            
                    })
                }
            })
        })
    }catch(error){
        console.log(error);
        return res.json({status: false, message: 'Something Went Wrong',error:error});
    }
})

var addToWishlist = ((req,res)=>{
    try{
        wishlist.findOne({userId: req.body.userId,productId:req.body.productId}).then((data)=>{
            if(data){
                var id = data._id
                wishlist.findByIdAndRemove(id).then((doc)=>{
                    // console.log('DOOOOOOOOOOOOOOOOO',doc);
                    return res.json({
                        status: true, 
                        message: 'Item removed from wishlist.',
                        code : 100,
                        data: [] });
                })
            }else{
                
                var userCart    = new wishlist({
                        userId          : req.body.userId,
                        productId       : req.body.productId,
                        createdAt       : new Date(),
                });
                
                userCart.save((error,saved)=>{
                    console.log('saved',userCart);
                    if(error){
                        return res.json({status: false, message: 'Some error found.',code : 101});
                    }else {
                        return res.json({
                            status: true, 
                            message: 'Item successfully added in wishlist.',
                            code : 100,
                            data: [] 
                        });
                    }
                })
            }
        })
    }catch(error){
        console.log(error);
        return res.json({status: false, message: 'Something Went Wrong',error:error});
    }
})

var myCart = (async(req,res)=>{
    var productData=[];
    try{
        const waitFor = (ms) => new Promise(r => setTimeout(r, ms));
        cart.find({userId:req.body.userId})
        .populate('productId')
        .then(async(product)=>{
           if(product.length > 0){
                return res.json({status: true,code:100, message: '', product});
            }else{
                return res.json({status: false,code:101, message: "Not Found"})
            }
        })
    }catch(error){
        // console.log('QQQQQQQQQQ',error);
        return res.json({status: false,code:102, message: "Something Went Wrong"});
    }
})

var myWishlist = (async(req,res)=>{
    var productData=[];
    try{
        const waitFor = (ms) => new Promise(r => setTimeout(r, ms));
        wishlist.find({userId:req.body.userId})
        .populate('productId')
        .then(async(product)=>{
           if(product.length > 0){
                return res.json({status: true,code:100, message: '', product});
            }else{
                return res.json({status: false,code:101, message: "Not Found"})
            }
        })
    }catch(error){
        // console.log('QQQQQQQQQQ',error);
        return res.json({status: false,code:102, message: "Something Went Wrong"});
    }
})

var getAddress = (async(req,res)=>{
    try{
        address.find({userId:req.body.userId})
        .then((getAddress)=>{
           if(getAddress){
                return res.json({code:100,status: true, message: '', getAddress});
            }else{
                return res.json({code:101,status: false, message: "Not Found"})
            }
        })
    }catch(error){
        // console.log('QQQQQQQQQQ',error);
        return res.json({status: false, message: "Something Went Wrong"});
    }
})

var getSingleAddress = (async(req,res)=>{
    try{

       
        if (mongoose.Types.ObjectId.isValid(req.body.addressId)){
            
        }else{
            return res.json({
                status   : true,
                code     : 101,
                message  : 'Incorrect addressId.',
                data     : {}
            })
        }
        
        address.findOne({_id:req.body.addressId})
        .then((getAddress)=>{
           if(getAddress){
                return res.json({code:100,status: true, message: '', getAddress});
            }else{
                return res.json({code:101,status: false, message: "Not Found"})
            }
        })
    }catch(error){
        // console.log('QQQQQQQQQQ',error);
        return res.json({status: false, message: "Something Went Wrong"});
    }
})


var addAddress = (async(req,res)=>{
    var userAddress    = new address({
            userId          : req.body.userId,
            fullName        : req.body.fullName,
            mobile          : req.body.mobile,
            pincode         : req.body.pincode,
            address         : req.body.address,
            city            : req.body.city,
            state           : req.body.state,
            landmark        : req.body.landmark,
            alterateNumber  : req.body.alterateNumber,
            createdAt       : new Date(),
    });
    
    userAddress.save((error,saved)=>{
        console.log('saved',userAddress);
        if(error){
            return res.json({status: false, message: 'Some error found.',code : 101});
        }else {
            return res.json({
                status: true, 
                message: 'Address saved successfully..',
                code : 100,
                data: [] 
            });
        }
    })
})

var deleteAddress = (async(req,res)=>{
    var id = req.body.addressId
    address.findByIdAndRemove(id).then((doc)=>{
        return res.json({
            status: true, 
            message: 'Address removed.',
            code : 100,
            data: [] });
    })
})


module.exports = {addToCart,addToWishlist,myCart,myWishlist,getAddress,addAddress,deleteAddress,getSingleAddress};