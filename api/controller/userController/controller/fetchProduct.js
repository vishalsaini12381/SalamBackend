const product = require('../../../../model/products.model');
const cart = require('../../../../model/userModel/model/cartModel');
const wishlist = require('../../../../model/userModel/model/wishlistModel');

const fetchHomeProduct = (async (req, res) => {
    let productList = [];
    try {

        productList = await product.aggregate([
            {
                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            { '$unwind': '$user' },
            { '$match': { "user.adminStatus": { '$eq': 'Verify' } } },
            { '$sort': { 'createdAt': 1 } },
            { '$limit': 10 }]);


        if (productList) {
            return res.send({ status: true, message: '', productList });
        } else {
            return res.send({ status: false, message: "Not Found" })
        }
    } catch (error) {
        console.log("object", error)
        return res.json({ status: false, message: "Something Went Wrong" });
    }
})

const fetchProduct = ((req, res) => {
    try {
        product.find({ subCategoryId: req.body.subcategoryid })
            .populate('businesscategoryId', 'businesscategory')
            .then((product) => {

                if (product) {
                    return res.json({ status: true, message: '', product });
                } else {
                    return res.json({ status: false, message: "Not Found" })
                }
            })
    } catch (error) {
        return res.json({ status: false, message: "Something Went Wrong" });
    }
})


const productDetail = (async (req, res) => {
    try {
        let productData = await product.findOne({ _id: req.body.productId })
            .populate('businesscategoryId', 'businesscategory')
            .populate('categoryId', 'category')
            .populate('subCategoryId', 'subcategory')
            .populate('userId')

        let cartQuantity = "0"

        const cartData = await cart.findOne({
            productId: productData._id,
            userId: req.body.userId,
            isDeleted: false
        })
        if (cartData) {
            cartQuantity = parseInt(cartData.quantity)
        } else {
            cartQuantity = 0
        }

        const wishlistData = await wishlist.findOne({
            productId: productData._id,
            userId: req.body.userId
        })
        if (wishlistData) {
            isWishlist = 1
        } else {
            isWishlist = 0
        }


        let similarProduct = [];
        if (productData) {
            const similarProductData = await product.find({
                subCategoryId: productData.subCategoryId
            })

            if (similarProductData) {
                similarProduct = similarProductData
            }

            return res.json({ status: true, message: '', productData, similarProduct, cartQuantity, isWishlist });
        } else {
            return res.json({ status: false, message: "Not Found", similarProduct })
        }

    } catch (error) {
        console.log(error)
        return res.json({ status: false, message: "Something Went Wrong" });
    }
})


const searchBox = ((req, res) => {
    try {
        let query;
        query = { productName: { $regex: req.body.search, $options: 'i' } }
        product.find(query).then((product) => {
            res.status(200).send({ product });
        }, (e) => {
            res.status(404).send(e);
        })
    } catch (e) {
        return false;
    }
});

const fetchProductSpecification = (req, res) => {
    try {
        let query;
        let specification = req.body.specification;
        let status = 'false';
        if (status === 'false') {
            query = { status: 'false' }
        }
        else if (status === 'false' && specification !== '') {
            query = { specification: req.body.specification };
        }

        product.find(query).then((doc) => {
            if (doc) {
                return res.json({ status: true, message: '', doc });
            } else {
                return res.json({ status: false, message: 'Not Found' });
            }
        })
    } catch (error) {
        return res.json({ status: false, message: 'Something Went Wrong' });
    }
}


const filterData2 = (async (req, res) => {
    const businessData = [];
    const productData = [];
    try {
        const waitFor = (ms) => new Promise(r => setTimeout(r, ms));
        let query;
        let specification = req.body.specification;
        let subCategoryId = req.body.subCategoryId;

        // let status = 'false' ;
        // if(status === 'false' ){
        //     query = {status : 'false'}
        // }
        // else if (status === 'false' && specification !== '') {
        //     query = {specification : req.body.specification} ;
        // }

        product.find({ subCategoryId: subCategoryId }).then(async (doc) => {
            if (doc) {
                businessData = doc;
            }
        })
        await waitFor(50);
        businessData.forEach(async element => {
            //element.specification;
            element.specification.forEach(async elmData => {
                specification.forEach(async reqData => {
                    if (reqData == elmData.value) {
                        if (element._id in productData) {

                        } else {
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
        if (productData) {
            return res.json({ status: true, message: '', productData });
        } else {
            return res.json({ status: false, message: "Not Found" })
        }

        //return res.json({status : true , message : '',ss: n.value});
        // if(doc){
        //     return res.json({status : true , message : '', doc});
        // }else{
        //     return res.json({status : false , message : 'Not Found' });
        // }

    } catch (error) {
        return res.json({ status: false, message: 'Something Went Wrong' });
    }
})

const filterData = (async (req, res) => {
    const businessData = [];
    const productData = [];
    try {
        const waitFor = (ms) => new Promise(r => setTimeout(r, ms));
        let query;
        let specification = req.body.specification;
        let subCategoryId = req.body.subCategoryId;

        product.find({ subCategoryId: subCategoryId }).then(async (doc) => {
            if (doc) {
                businessData = doc;
                return res.json({ status: true, message: '', businessData });
            }
            else {
                return res.json({ status: false, message: "Not Found" })
            }
        })

    } catch (error) {
        return res.json({ status: false, message: 'Something Went Wrong' });
    }
})


module.exports = { fetchHomeProduct, fetchProduct, productDetail, searchBox, fetchProductSpecification, filterData };