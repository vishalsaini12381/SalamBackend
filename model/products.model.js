var mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

var productsSchema = new mongoose.Schema({
    productName: {
        type: String,
        trim: true,
    },
    productPrice: {
        type: String,
        trim: true,
    },
    discount: {
        type: String,
        trim: true,
    },
    businesscategoryId: {
        type: ObjectId,
        ref: 'businesss'
    },
    categoryId: {
        type: ObjectId,
        ref: 'category'
    },
    subCategoryId: {
        type: ObjectId,
        ref: 'subCategory'
    },
    brandName: {
        type: String,
        trim: true,
    },
    file: {
        type: String,
        default: null
    },
    file1: {
        type: String,
        default: null
    },
    file2: {
        type: String,
        default: null
    },
    file3: {
        type: String,
        default: null
    },
    file4: {
        type: String,
        default: null
    },
    quantity: {
        type: String,
        trim: true,
    },
    status: {
        type: String,
        trim: true,
        default: false,
    },
    aboutProduct: {
        type: String,
        trim: true,
    },
    isRefundable: { type: Boolean, default: false },
    returnPolicy: {
        daysToReturn: { type: Number, default: 0 },
        conditions: { type: String }
    },
    createdAt: {
        type: String,
        default: new Date()
    },
    updatedAt: {
        type: String,
        default: new Date()
    },
    userId: { type: ObjectId, ref: 'user', default: null },
}, { usePushEach: true });


var products = mongoose.model('products', productsSchema);

module.exports = products;