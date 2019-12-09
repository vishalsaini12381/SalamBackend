var mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;


var subCategorySchema = new mongoose.Schema({
    Subcategory:{
        type: String,
        trim: true,
    },
    businessId : {type : ObjectId, ref : 'businesss',default: null},
    categoryId : {type: ObjectId, ref : 'category', default: null},
},{usePushEach: true});

var subCategory = mongoose.model('subCategory', subCategorySchema);

module.exports = subCategory;