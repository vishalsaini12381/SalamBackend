var cart = require('../../../../model/userModel/model/cartModel');
var wishlist = require('../../../../model/userModel/model/wishlistModel');
var address = require('../../../../model/userModel/model/shippingAddressModel');
var products = require('../../../../model/products.model');
var mongoose = require('mongoose');
var addToCart = async (req, res) => {
    try {
        const productInCart = await cart.findOne({ userId: req.body.userId, isDeleted: false, productId: req.body.productId });

        let totalUnit = 0;
        let message = '';
        let success = true;

        const productDetails = await products.findOne({ _id: req.body.productId });
        let updatedQuantity = 0;


        if (productInCart != undefined && Object.keys(productInCart).length > 0) {

            if (req.body.action === 1) {
                totalUnit = parseInt(productInCart.quantity) + parseInt(req.body.quantity);
                if (parseInt(productDetails.quantity) >= req.body.quantity) {

                    updatedQuantity = parseInt(productDetails.quantity) - parseInt(req.body.quantity);
                    const cartDiscount = (parseFloat(productDetails.discount) * parseFloat(productDetails.productPrice)) / 100
                    const cartAmount = parseFloat(productDetails.productPrice) - cartDiscount;
                    const cartTotal = totalUnit * cartAmount;

                    await cart.findOneAndUpdate({ _id: productInCart._id },
                        {
                            quantity: totalUnit,
                            price: productDetails.productPrice,
                            discount: parseFloat(productDetails.discount),
                            discountValue: cartDiscount,
                            amount: cartAmount,
                            total: cartTotal
                        });
                    message = 'cart updated successfully.'
                } else {
                    message = 'Out of stock.';
                    success = false;
                }
            } else if (req.body.action === 2) {
                updatedQuantity = parseInt(productDetails.quantity) + parseInt(req.body.quantity);
                totalUnit = parseInt(productInCart.quantity) - parseInt(req.body.quantity);
                const cartDiscount = (parseFloat(productDetails.discount) * parseFloat(productDetails.productPrice)) / 100
                const cartAmount = parseFloat(productDetails.productPrice) - cartDiscount;
                const cartTotal = totalUnit * cartAmount;

                await cart.findOneAndUpdate({ _id: productInCart._id },
                    {
                        quantity: totalUnit,
                        price: productDetails.productPrice,
                        discount: parseFloat(productDetails.discount),
                        discountValue: cartDiscount,
                        amount: cartAmount,
                        total: cartTotal
                    });
                message = 'cart updated successfully.'
            } else {
                await cart.findByIdAndRemove(productInCart._id);

                updatedQuantity = parseInt(productDetails.quantity) + parseInt(productInCart.quantity);
                message = 'Item removed from cart.'
            }

        } else if (productDetails.quantity >= 1) {
            let price = productDetails.productPrice;
            let cartDiscount = (parseFloat(productDetails.discount) * price) / 100;
            let amount = price - cartDiscount;
            let quantity = 1;

            let userCart = new cart({
                userId: req.body.userId,
                productId: req.body.productId,
                vendorId: productDetails['userId'],
                price: price,
                discount: parseFloat(productDetails.discount),
                discountValue: cartDiscount,
                amount: amount,
                quantity: quantity,
                total: quantity * amount,
                createdAt: new Date(),
            });

            const cartData = await userCart.save()
            updatedQuantity = productDetails.quantity - quantity;
            message = 'Item successfully added in cart.'
        } else {
            message = 'Out of stock.'
            success = false;
        }
        await products.findOneAndUpdate({ _id: req.body.productId }, { quantity: updatedQuantity });
        let cartTotal = await getCartItemsCount(req.body.userId);
        
        if(Array.isArray(cartTotal))
            cartTotal = cartTotal.length;
        else
            cartTotal = 0;

        res.json({
            success,
            status: true,
            message,
            cartTotal,
            code: 200,
            data: []
        });

    } catch (error) {
        return res.json({ status: false, message: 'Something Went Wrong', error: error });
    }
}

var addToWishlist = ((req, res) => {
    try {
        wishlist.findOne({ userId: req.body.userId, productId: req.body.productId }).then((data) => {
            if (data) {
                var id = data._id
                wishlist.findByIdAndRemove(id).then((doc) => {
                    return res.json({
                        status: true,
                        message: 'Item removed from wishlist.',
                        code: 100,
                        data: []
                    });
                })
            } else {
                var userCart = new wishlist({
                    userId: req.body.userId,
                    productId: req.body.productId,
                    createdAt: new Date(),
                });

                userCart.save((error, saved) => {
                    if (error) {
                        return res.json({ status: false, message: 'Some error found.', code: 101 });
                    } else {
                        return res.json({
                            status: true,
                            message: 'Item successfully added in wishlist.',
                            code: 100,
                            data: []
                        });
                    }
                })
            }
        })
    } catch (error) {
        return res.json({ status: false, message: 'Something Went Wrong', error: error });
    }
})

var myCart = (async (req, res) => {
    cart.find({ userId: mongoose.Types.ObjectId(req.body.userId), isDeleted: false })
        .populate('productId')
        .then(async (product) => {
            if (product.length > 0) {
                return res.json({ status: true, code: 100, message: '', product });
            } else {
                return res.json({ status: false, code: 101, message: "Not Found" })
            }
        })
        .catch(error => {
            return res.json({ status: false, code: 102, message: "Something Went Wrong" });
        })
})

const getCartItemsCount = (userId) => {
    return cart.find({ userId: mongoose.Types.ObjectId(userId), isDeleted: false });
}

var myWishlist = (async (req, res) => {
    var productData = [];
    try {
        const waitFor = (ms) => new Promise(r => setTimeout(r, ms));
        wishlist.find({ userId: req.body.userId })
            .populate('productId')
            .then(async (product) => {
                if (product.length > 0) {
                    return res.json({ status: true, code: 100, message: '', product });
                } else {
                    return res.json({ status: false, code: 101, message: "Not Found" })
                }
            })
    } catch (error) {
        return res.json({ status: false, code: 102, message: "Something Went Wrong" });
    }
})

var getAddress = (async (req, res) => {
    try {
        address.find({ userId: req.body.userId })
            .then((getAddress) => {
                if (getAddress) {
                    return res.json({ code: 100, status: true, message: '', getAddress });
                } else {
                    return res.json({ code: 101, status: false, message: "Not Found" })
                }
            })
    } catch (error) {
        return res.json({ status: false, message: "Something Went Wrong" });
    }
})

var getSingleAddress = (async (req, res) => {
    try {


        if (mongoose.Types.ObjectId.isValid(req.body.addressId)) {

        } else {
            return res.json({
                status: true,
                code: 101,
                message: 'Incorrect addressId.',
                data: {}
            })
        }

        address.findOne({ _id: req.body.addressId })
            .then((getAddress) => {
                if (getAddress) {
                    return res.json({ code: 100, status: true, message: '', getAddress });
                } else {
                    return res.json({ code: 101, status: false, message: "Not Found" })
                }
            })
    } catch (error) {
        return res.json({ status: false, message: "Something Went Wrong" });
    }
})


var addAddress = (async (req, res) => {
    var userAddress = new address({
        userId: req.body.userId,
        fullName: req.body.fullName,
        mobile: req.body.mobile,
        pincode: req.body.pincode,
        address: req.body.address,
        city: req.body.city,
        state: req.body.state,
        landmark: req.body.landmark,
        alterateNumber: req.body.alterateNumber,
        createdAt: new Date(),
    });

    userAddress.save((error, saved) => {
        if (error) {
            return res.json({ status: false, message: 'Some error found.', code: 101 });
        } else {
            return res.json({
                status: true,
                message: 'Address saved successfully..',
                code: 100,
                data: []
            });
        }
    })
})

var deleteAddress = (async (req, res) => {
    var id = req.body.addressId
    address.findByIdAndRemove(id).then((doc) => {
        return res.json({
            status: true,
            message: 'Address removed.',
            code: 100,
            data: []
        });
    })
})


module.exports = { addToCart, addToWishlist, myCart, getCartItemsCount, myWishlist, getAddress, addAddress, deleteAddress, getSingleAddress };