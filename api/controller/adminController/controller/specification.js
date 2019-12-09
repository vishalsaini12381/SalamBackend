var specification = require('../../../../model/adminModel/specificationModel');

var addSpecification = (req,res)=>{
    // console.log('33333333',req.body.fieldValue[0]);
    try{
        var log = new specification({
            'subCategoryId' : req.body.subCategory,
            'fieldType'     : req.body.fieldType,
            'fieldName'     : req.body.fieldName,
            'fieldValue'    : req.body.fieldValue
        });
        console.log('444444444444444444',log);
        log.save(function(err,save){
            if(err){
                console.log('11111111111',err);
                return res.json({status : false , message : 'SomeThing Went Wrong'});
            }else{
                // console.log('22222222222',save)
                return res.json({status : true , message : 'Added SuccessFully'});
            }
        })
    }catch(error){
        console.log('error',error);
        return res.json({status : false , message : 'Some Error Occured'});
    }
}

module.exports = {addSpecification};