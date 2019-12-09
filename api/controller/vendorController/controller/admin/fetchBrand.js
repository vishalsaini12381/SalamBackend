var Brand = require('../../../../../model/adminModel/brandModel');

var fetchBrands = ((req,res)=>{
    try{
        Brand.find({}).then((doc)=>{
            console.log('???????????????',doc);
            if(doc) {
                return res.json ({status : true , message : '' , doc});
            }else {
                return res.json({status : false , message : 'Brands Not Found'});
            }
        })
    }catch(error){
        return res.json({status : false , message : 'SomeThing Went Wrong'});
    }
})

module.exports = {fetchBrands};