var specification = require('../../../../model/adminModel/specificationModel');
var mongoose = require('mongoose');

var fetchSpecification = (req,res)=>{
    try{
    specification.find({subCategoryId : mongoose.Types.ObjectId(req.body.subCategoryId)}).then((doc)=>{
        // console.log('DOCUMENT',doc);
        if(doc){
            return res.json({status :  true, message : '', doc})
        }else{
            return res.json({status : false , message : 'Not Found'});
        }
    })
}catch(error){
    return res.json({status : false , message : 'Something Went Wrong'});
}
}

module.exports = {fetchSpecification};