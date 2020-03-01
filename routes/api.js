var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var JWTSECRET = 'shivendra123'
// Admin
var adminSign = require('../api/controller/adminController/controller/adminLogin');
var adminVendor = require('../api/controller/adminController/controller/fetchVendorList');
var adminUser = require('../api/controller/adminController/controller/adminUser');
var adminProduct = require('../api/controller/adminController/controller/fetchProductList');
var adminBusiness = require('../api/controller/adminController/controller/businessCategory');
var adminCategory = require('../api/controller/adminController/controller/category');
var adminSubCategory = require('../api/controller/adminController/controller/subCategory');
var user = require('../model/adminModel/adminModels');
var adminBrand = require('../api/controller/adminController/controller/addBrand');
var Specification = require('../api/controller/adminController/controller/specification');
var adminOrder = require('../api/controller/vendorController/controller/vendorOrder');

//Vendor

var Vendor = require('../api/controller/vendorController/controller/commonVendor');
var Product = require('../api/controller/vendorController/controller/addProduct');
var ClientProfile = require('../api/controller/vendorController/controller/clientProfile');
// var uploadPic = require('../api/controller/vendorController/controller/profilePic');
var FetchProduct = require('../api/controller/vendorController/controller/fetchProduct')
var User = require('../model/vendorModel/model/vendorSchema');
var Brand = require('../api/controller/vendorController/controller/admin/fetchBrand');
var Business = require('../api/controller/vendorController/controller/admin/fetchBusinessCategory');
var Category = require('../api/controller/vendorController/controller/admin/fetchCagtegory');
var SubCategory = require('../api/controller/vendorController/controller/admin/fetchSubCategory');
var VendorSpecification = require('../api/controller/vendorController/controller/admin/fetchSpecification');
var vendorOrder = require('../api/controller/vendorController/controller/vendorOrder');

//User

var Sign = require('../api/controller/userController/controller/sign');
var userFetchProduct = require('../api/controller/userController/controller/fetchProduct');
var Profile = require('../api/controller/userController/controller/clientProfile');
var userBusiness = require('../api/controller/userController/controller/fetchBusinessCategory');
var userCategory = require('../api/controller/userController/controller/fetchcategory');
var userSubCategory = require('../api/controller/userController/controller/fetchSubCategory');
var userVendor = require('../api/controller/userController/controller/fetchVendor');
var UserSpecification = require('../api/controller/userController/controller/fetchSpecification');
var userCart = require('../api/controller/userController/controller/userCart');
var userOrder = require('../api/controller/userController/controller/userOrder');
const { returnRequest, getReturnOrderRequest } = require('../api/controller/userController/returnOrder.controller')
// Admin Api Token

var verifyTokenApi = function (req, res, next) {
  if (req.cookies.jwtToken) {
    token = req.cookies.jwtToken[0];
    jwt.verify(token, JWTSECRET, function (err, decoded) {
      if (err) return res.redirect('/');
      user.findOne({ _id: decoded.id }).then(function (res) {
        if (res == null || res == '') return res.redirect('/');
        if (res) {
          req.currentUser = res;
          return next();
        }
      }).catch(function (err) {
        return res.redirect('/');
      });
    });
  } else {
    return res.redirect('/');
  }
}

// Vendor Api Token

var verifyTokenAPII = function (req, res, next) {
  if (req.cookies.jwtToken) {
    token = req.cookies.jwtToken[0];
    // tokenStatus	=req.cookies.jwtToken[1];
    jwt.verify(token, JWTSECRET, function (err, decoded) {
      if (err) return res.redirect('/');
      User.findOne({ _id: decoded.id }).then(function (res) {
        if (res == null || res == '') return res.redirect('/');
        if (res) {
          req.currentUser = res;
          return next();
        }
      }).catch(function (err) {
        return res.redirect('/');
      });
    });

  } else {
    return res.redirect('/');
  }
};

router.get('/', (req, res) => res.send("Welcome to Salam Trade"));

/* GET Admin Api listing. */
router.post('/admin/adminSignup', adminSign.adminSignup);
router.post('/admin/adminLogin', adminSign.adminLogin);
router.get('/admin/adminLogout', adminSign.adminLogout);
router.post('/admin/fetchVendor', adminSign.fetchVendor);

//
router.post('/admin/vendorList', adminVendor.vendorList);
router.get('/admin/recent-customer',adminVendor.getRecentCustomer)
router.post('/admin/fetchVendorList', adminVendor.fetchVendorList);
router.post('/admin/editVendorList', adminVendor.editVendorList);
router.post('/admin/deleteVendor', adminVendor.deleteVendor);
router.post('/admin/userList', adminUser.userList);
router.post('/admin/productList', adminProduct.productList);
router.post('/admin/fetchProductList', adminProduct.fetchProductList);
router.post('/admin/businessCategory', adminBusiness.businessCategory);
router.post('/admin/fetchBusiness', adminBusiness.fetchBusinessCategory);
router.post('/admin/deleteBusinessCategory', adminBusiness.deleteBusinessCategory);
router.get('/admin/editBusinessCategory/:id', adminBusiness.editBusinessCategory);
router.post('/admin/updateBusinessCategory/:id', adminBusiness.updateBusinessCategory);
router.post('/admin/editStatus', adminBusiness.editStatus);
router.post('/admin/fetchStatus', adminBusiness.fetchStatus);

router.post('/admin/addSpecification', Specification.addSpecification);


//
router.post('/admin/Category', adminCategory.CategoryMethod);
router.get('/admin/editCategory/:id', adminCategory.editCategory);
router.post('/admin/updateCategory/:id', adminCategory.updateCategory);
router.post('/admin/fetchcategory', adminCategory.fetchCategory);
router.post('/admin/deleteCategory', adminCategory.deleteCategory);
router.post('/admin/fetchCategoryPage', adminCategory.fetchCategoryPage);
//
router.post('/admin/SubCategory', adminSubCategory.subCategoryMethod);
router.post('/admin/fetchSubCategory', adminSubCategory.fetchsubCategory);
router.post('/admin/deleteSubCategory', adminSubCategory.deleteSubCategory);
router.get('/admin/editSubcategory/:id', adminSubCategory.editSubCategory);
router.post('/admin/updateSubcategory/:id', adminSubCategory.updateSubCategory);
router.post('/admin/fetchsubCategoryId', adminSubCategory.fetchsubCategoryId);

router.post('/admin/addBrand', adminBrand.addBrand);
router.post('/admin/fetchBrands', adminBrand.fetchBrands);
router.get('/admin/editBrands/:id', adminBrand.editBrands);
router.post('/admin/updateBrands/:id', adminBrand.updateBrands);
router.post('/admin/deleteBrand', adminBrand.deleteBrand);

router.post('/admin/getAllOrderAdmin', adminOrder.getAllOrderAdmin);
router.post('/admin/getOrderDetailAdmin', adminOrder.getOrderDetailAdmin);
router.get('/admin/getAllAdminReturnRequest', adminOrder.getAllAdminReturnRequest);
router.post('/admin/initiate-refund-process', adminOrder.refundProcessing);


/* GET Vendor Api listing. */
router.post('/vendor/Signup', Vendor.registerVendor);
router.post('/vendor/getData', Vendor.getData);
router.post('/vendor/Login', Vendor.loginVendor);
router.get('/vendor/activate/:token/:type', Vendor.verifyEmail);
router.post('/vendor/resetPassword', Vendor.forgetPassword);
router.get('/vendor/verifyResetPassword/:token', Vendor.verifyResetPassword);
router.post('/vendor/SavePassword', Vendor.saveNewPassword);
router.post('/vendor/fetchUser', Vendor.fetchUser);
router.get('/vendor/logOut', Vendor.logOut);
router.post('/vendor/clientProfile', ClientProfile.clientProfile);
router.post('/vendor/imgProfile', ClientProfile.imgProfile);
// router.post('/profilePic',upload.single("myImage"),uploadPic);
router.post('/vendor/addProduct', Product.addProduct);
router.post('/vendor/userStatus', Product.userStatus)
router.post('/vendor/fetchProduct', FetchProduct.fetchProduct);
router.post('/vendor/fetchProductList', FetchProduct.fetchProductList);
router.post('/vendor/deleteProduct', FetchProduct.deleteProduct);
router.post('/vendor/editProduct', FetchProduct.editProduct);
router.post('/vendor/fetchBrand', Brand.fetchBrands);
router.post('/vendor/fetchBusiness', Business.fetchBusinessCategory);
router.post('/vendor/fetchCategory', Category.fetchCategory);
router.post('/vendor/fetchsubCategory', SubCategory.fetchsubCategory);
router.post('/vendor/fetchSpecification', VendorSpecification.fetchSpecification);
router.post('/vendor/getAllOrder', vendorOrder.getAllOrder);
router.post('/vendor/getOrderDetail', vendorOrder.getOrderDetail);
router.get('/vendor/dashboard/:vendorId', vendorOrder.getVendorDashboard)
router.get('/vendor/dashboard/recent-order/:vendorId', vendorOrder.getRecentOrderList)

/* GET Users Api listing. */
router.post('/user/Signup', Sign.registerUser);
router.get('/user/activate/:token/:type', Sign.verifyEmail);
router.post('/user/forgetPasswprd', Sign.forgetPasswprd);
router.get('/user/verifyPasswordLink/:token', Sign.verifyPasswordLink);
router.post('/user/resetPassword', Sign.saveNewPassword);
router.post('/user/Login', Sign.login);
router.get('/user/Logout', Sign.logOut);
//
router.post('/user/fetchUser', Sign.fetchUser);
router.post('/user/fetchProduct', userFetchProduct.fetchProduct);
router.post('/user/fetchHomeProduct', userFetchProduct.fetchHomeProduct);
router.post('/user/productDetail', userFetchProduct.productDetail);
router.post('/user/fetchProductSpecification', userFetchProduct.fetchProductSpecification);
//
router.post('/user/searchBox', userFetchProduct.searchBox);
router.post('/user/userProfile', Profile.userProfile);
router.post('/user/fetchBusinesscategory', userBusiness.fetchBusinesscategory);
router.post('/user/fetchBusinesscategoryHeader', userBusiness.fetchBusinesscategoryHeader);
router.post('/user/fetchcategory', userCategory.fetchcategory);

router.post('/user/fetchSubCategory', userSubCategory.fetchsubcategory);
router.post('/user/fetchcategoryData', userSubCategory.fetchcategoryData);
//
router.post('/user/fetchVendorList', userVendor.fetchVendorList);
router.post('/user/fetchSpecification', UserSpecification.fetchSpecification);

router.post('/user/addToCart', userCart.addToCart);
router.post('/user/removeProduct', userCart.removeProductFromCart);
router.post('/user/addToWishlist', userCart.addToWishlist);
router.post('/user/myCart', userCart.myCart);
router.post('/user/myWishlist', userCart.myWishlist);
router.post('/user/getAddress', userCart.getAddress);
router.post('/user/addAddress', userCart.addAddress);
router.post('/user/deleteAddress', userCart.deleteAddress);
router.post('/user/getSingleAddress', userCart.getSingleAddress);
router.post('/user/codOrder', userOrder.confirmCashOrder);

router.post('/user/myOrders', userOrder.myOrders);
router.get('/user/myOrders/:id', userOrder.getOrderDetails);

router.post('/user/payment', userOrder.payment);
router.post('/user/filterData', userFetchProduct.filterData);
router.post('/user/return-request', returnRequest);
router.post('/user/get-return-request', getReturnOrderRequest);

const { getTransaction } = require('../api/controller/userController/transaction.controller')

router.post('/user/transaction', getTransaction);
router.get('/user/brands', adminBrand.fetchBrands);

module.exports = router;
