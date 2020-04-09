var specification = require('../../../model/adminModel/specificationModel');

var addSpecification = (req,res)=>{
    try{
        var log = new specification({
            'subCategoryId' : req.body.subCategory,
            'fieldType'     : req.body.fieldType,
            'fieldName'     : req.body.fieldName,
            'fieldValue'    : req.body.fieldValue
        });
        log.save(function(err,save){
            if(err){
                return res.json({status : false , message : 'SomeThing Went Wrong'});
            }else{
                return res.json({status : true , message : 'Added SuccessFully'});
            }
        })
    }catch(error){
        return res.json({status : false , message : 'Some Error Occured'});
    }
}

module.exports = {addSpecification};