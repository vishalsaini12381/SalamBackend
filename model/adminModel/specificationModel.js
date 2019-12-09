var mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

var specificationSchema = new mongoose.Schema({
    subCategoryId : {type : ObjectId , ref: 'subCategory', default : null},

    fieldType : {
        type : String , 
        trim : true,
    },
    fieldName : {  
        type : String , 
        trim : true,
    },
    fieldValue : {
        type: Object, 
        trim : true
    }

}, {usePushEach : true});

var specification = mongoose.model('specification', specificationSchema);

module.exports = specification;
