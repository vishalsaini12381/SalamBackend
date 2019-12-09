var mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

var businessCategory = new mongoose.Schema({
    business_id:{
        type: String,
        trim: true,
    },
    businesscategory:{
        type: String,
        trim: true,
    },
    status : {
        type : String, 
        default : 0,
    },
    // categoryId : [{type : ObjectId, ref : 'category',default: null}],
    // subCategoryId : [{type : ObjectId, ref : 'subCategory',default: null}],
    categoryId : [{type : ObjectId, ref : 'category',default: null}],

},{usePushEach: true})

var businesss = mongoose.model('businesss', businessCategory);

module.exports = businesss;




