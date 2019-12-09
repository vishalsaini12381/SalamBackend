var specification = require('../../../../../model/adminModel/specificationModel');
var mongoose = require('mongoose');

var fetchSpecification = (req,res)=>{
    console.log('subcategory',req.body.subCategoryId);
    try{
    specification.find({subCategoryId : mongoose.Types.ObjectId(req.body.subCategoryId)}).then((doc)=>{
    // console.log('document',doc.fieldValue);
        if(doc){
            // doc.fieldValue.map((e)=>{
            //     console .log('eeeeeeeeeeeeeeeeeeee',e.fieldValue);
            //     return e;
            // })
            return res.json({status : true , message : '',  doc})
        }else{
            return res.json({status  : false , message : 'Not Found'})
        }
    })
}catch (error){
    return res.json({status : false , message : 'SomeThing Went Wrong'});
}
}

module.exports = {fetchSpecification};