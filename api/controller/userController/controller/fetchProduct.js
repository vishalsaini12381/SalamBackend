var product = require('../../../../model/vendorModel/model/productSchema');
var product2 = require('../../../../model/vendorModel/model/productSchema');
var cart = require('../../../../model/userModel/model/cartModel');
var wishlist = require('../../../../model/userModel/model/wishlistModel');

var fetchHomeProduct = (async(req,res)=>{
    var businessData=[];
    var productData=[];
    try{
        productData = await product.find().limit(10).sort( { createdAt: -1 } )
        .populate('businesscategoryId')
        // .then(async(product)=>{
        //     businessData=product;
            // if(product){
            //     return res.json({status: true, message: '', product});
            // }else{
            //     return res.json({status: false, message: "Not Found"})
            // }
        // })
        // businessData.forEach(async element => {
        //     if(element.businesscategoryId.status==1){
        //         productData.push(element);
        //         await waitFor(60);
        //     }
        // });
        //await waitFor(500);
        if(productData){
            return res.json({status: true, message: '', productData});
        }else{
            return res.json({status: false, message: "Not Found"})
        }
    }catch(error){
        return res.json({status: false, message: "Something Went Wrong"});
    }
})

var fetchProduct = ((req,res)=>{
    try{
        product.find({subCategoryId:req.body.subcategoryid})
        .populate('businesscategoryId','businesscategory')
        .then((product)=>{

            if(product){
                return res.json({status: true, message: '', product});
            }else{
                return res.json({status: false, message: "Not Found"})
            }
        })
    }catch(error){
        return res.json({status: false, message: "Something Went Wrong"});
    }
})


var productDetail = (async(req,res)=>{
    var productData=[];
    try{
        const waitFor = (ms) => new Promise(r => setTimeout(r, ms));
        product.findOne({_id:req.body.productId})
        .populate('businesscategoryId','businesscategory')
        .populate('categoryId','category')
        .populate('subCategoryId','subcategory')
        .then(async(product)=>{
            var obj={}
            var isCart="0"
            
            await waitFor(50);
            cart.findOne({productId:product._id,userId:req.body.userId}).
            then(async(cartData)=>{
                if(cartData){
                    isCart=cartData.quantity
                }else{
                    isCart=0
                }
            
            })
            wishlist.findOne({productId:product._id,userId:req.body.userId}).
            then(async(wishlistData)=>{
                if(wishlistData){
                    isWishlist=1
                }else{
                    isWishlist=0
                }
            
            })
            await waitFor(50);
            obj={
                "product":product,
                "isCart":isCart,
                "isWishlist":isWishlist
            }
            productData.push(obj);
            //product['gffgfggf']="sddsdsdsds";
            
           // await waitFor(100);
            var similarProduct=[];
            if(productData){
                product2.find({subCategoryId:productData[0].product.subCategoryId}).
                    then(async(similarProductData)=>{
                        if(similarProductData){
                            similarProduct=similarProductData
                        }
            })
            await waitFor(50);

                return res.json({status: true, message: '', productData,similarProduct});
            }else{
                return res.json({status: false, message: "Not Found",similarProduct})
            }
        })
    }catch(error){
        return res.json({status: false, message: "Something Went Wrong"});
    }
})


var searchBox = ((req,res)=>{
    try{
        let query;
                query = {productName : { $regex : req.body.search, $options:'i' }}
                product.find(query).then((product)=>{
            res.status(200).send({product});
        },(e)=>{
            res.status(404).send(e);
        })
    } catch(e){
            return false;
    }
});

var fetchProductSpecification = (req,res)=>{
    try{
        let query ;
        let specification = req.body.specification;
        let status = 'false' ;
        if(status === 'false' ){
            query = {status : 'false'}
        }
        else if (status === 'false' && specification !== '') {
            query = {specification : req.body.specification} ;
        }

        product.find(query).then((doc)=>{
            if(doc){
                return res.json({status : true , message : '', doc});
            }else{
                return res.json({status : false , message : 'Not Found' });
            }
        })
    }catch(error){
        return res.json({status : false , message : 'Something Went Wrong'});
    }
}


var filterData2 = (async(req,res)=>{
    var businessData=[];
    var productData=[];
    try{
        const waitFor = (ms) => new Promise(r => setTimeout(r, ms));
        let query ;
        let specification = req.body.specification;
        let subCategoryId = req.body.subCategoryId;
        
        // let status = 'false' ;
        // if(status === 'false' ){
        //     query = {status : 'false'}
        // }
        // else if (status === 'false' && specification !== '') {
        //     query = {specification : req.body.specification} ;
        // }

        product.find({subCategoryId:subCategoryId}).then(async(doc)=>{
            if(doc){
                businessData=doc;
            }
        })
        await waitFor(50);
        businessData.forEach(async element => {
            //element.specification;
            element.specification.forEach(async elmData=>{
                specification.forEach(async reqData=>{
                    if(reqData==elmData.value){
                        if(element._id in productData){

                        }else{
                            productData.push(element);
                        }
                        // productData.forEach(async (proDta)=>{
                        //     if(element._id==proDta._id){

                        //     }
                        // })
                        
                    }
                })
            })
            //n=element.specification[2]
            //return res.json({status : true , message : '',ss: element.specification[2]});
        })
        await waitFor(500);
        if(productData){
            return res.json({status: true, message: '', productData});
        }else{
            return res.json({status: false, message: "Not Found"})
        }

        //return res.json({status : true , message : '',ss: n.value});
            // if(doc){
            //     return res.json({status : true , message : '', doc});
            // }else{
            //     return res.json({status : false , message : 'Not Found' });
            // }
    
    }catch(error){
        return res.json({status : false , message : 'Something Went Wrong'});
    }
})

var filterData = (async(req,res)=>{
    var businessData=[];
    var productData=[];
    try{
        const waitFor = (ms) => new Promise(r => setTimeout(r, ms));
        let query ;
        let specification = req.body.specification;
        let subCategoryId = req.body.subCategoryId;
        
        product.find({subCategoryId:subCategoryId}).then(async(doc)=>{
            if(doc){
                businessData=doc;
                return res.json({status: true, message: '', businessData});
           }
            else{
                return res.json({status: false, message: "Not Found"}) 
            }
        })
       
    }catch(error){
        return res.json({status : false , message : 'Something Went Wrong'});
    }
})

module.exports = {fetchHomeProduct,fetchProduct,productDetail,searchBox,fetchProductSpecification,filterData};