var mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;


var CategorySchema = new mongoose.Schema({
    category:{
        type: String,
        trim: true,
    },
    businessId : [{type : ObjectId, ref : 'businesss',default: null}],
    // subCategoryId : [{type : ObjectId, ref : 'subCategory',default: null}],
},{usePushEach: true});

var category = mongoose.model('category', CategorySchema);

module.exports = category;