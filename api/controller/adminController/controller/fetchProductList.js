var product = require('../../../../model/vendorModel/model/productSchema');
var mongoose = require('mongoose');

var productList = ((req,res)=>{
    try{
        product.find({})
        .populate('businesscategoryId','businesscategory')
        .populate('categoryId','category')
        .populate('userId','name storeName')
        .then((product)=>{
            console.log('product',product);
         if(product){
             return res.json({status : true , message : '' , product})
         }else{
             return res.json({status : false , message : 'Product Not found'});
         }
        })
    }catch(erro){
        return res.json({status : false , message : 'Something Went Wrong'})
    }
})

var fetchProductList = ((req,res)=>{
    try{
        product.findById({_id : mongoose.Types.ObjectId(req.body.productId)})
        .populate('categoryId','category').
        populate('subCategoryId','Subcategory')
        .populate('userId','name storeName')
        .then((resp)=>{
            console.log('?????????????????????/',resp.subCategoryId);
            if(resp){
                return res.json({
                    status: true ,
                    message : '',
                    productId : resp._id,
                    name : resp.userId.name,
                    storeName : resp.userId.storeName,
                    productName :  resp.productName,
                    productPrice :  resp.productPrice,
                    discount : resp.discount,
                    category : resp.categoryId.category,
                    subCategory : resp.subCategoryId.Subcategory,
                    brandName : resp.brandName,
                    quantity : resp.quantity,
                    aboutProduct : resp.aboutProduct,
                    file : resp.file,
                })
            }
        })
    }catch(error){
        return res.json({status : false , message : 'Something Went Werong'});
    }
})

module.exports = {productList,fetchProductList};