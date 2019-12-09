var mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

var productSchema = new mongoose.Schema({
    productName : {
        type: String,
        trim: true,
    },
    productPrice: {
        type : String,
        trim: true,
    },
    discount: {
        type :String,
        trim: true,
    },
    businesscategoryId : {
        type : ObjectId,
        ref : 'businesss',
        default: null
    },
    categoryId : {
        type : ObjectId,
        ref : 'category',
        default: null
    },
    subCategoryId : {
        type : ObjectId,
        ref : 'subCategory',
        default: null
    },
    brandName : {
        type : String,
        trim: true,
    },
    file: {
        type: String,
        default: null
    },
    quantity : {
        type : String,
        trim: true,
    },
    status : {
        type: String,
        trim: true,
        default : false,
    },
    aboutProduct : {
        type: String,
        trim: true,
    },
    createdAt: {
        type: String,
        default: new Date()
    },
    updatedAt: {
        type : String,
        default : new Date()
    },
    userId: {type: ObjectId, ref: 'user', default: null},
},{usePushEach: true});


var product = mongoose.model('product', productSchema);

module.exports = product;