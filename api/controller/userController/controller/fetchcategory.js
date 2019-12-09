var category = require('../../../../model/adminModel/categoryModel');

var fetchcategory = ((req,res)=>{
    try {
        category.find({}).then((category)=>{
            if(category){
                return res.json({status: true ,message: '', category})
            }else{
                return res.json({status : false , message: "Category Not Found"})
            }
        })
    } catch (error) {
        return res.json({status: false ,message : 'SomeThing Went Wrong'})
    }
})

module.exports = {fetchcategory};