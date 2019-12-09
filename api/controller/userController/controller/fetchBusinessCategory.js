var businesss = require('../../../../model/adminModel/businessCategoryModel');
var category = require('../../../../model/adminModel/categoryModel');
var subcategory = require('../../../../model/adminModel/subCategoryModel');

var fetchBusinesscategory = (async (req,res)=>{
    var businessData=[];
    var categoryData=[];
    var subCategoryData=[];
    try{
        const waitFor = (ms) => new Promise(r => setTimeout(r, ms));
        businesss.find({status:1}).
        then(async(business)=>{
            if(business){
                businessData=business;
            }
        })

        await waitFor(50);
        //console.log('businessData',businessData);
        businessData.forEach(async element => {
            category.find({businessId:element._id}).
                then(async(categoryres)=>{
                    if(categoryres){
                        // categoryres['name22']=element.businesscategory;
                        var obj={
                            "business_id":element._id,
                            "business_name":element.businesscategory,
                            "categories":categoryres
                        }
                        // await waitFor(10);
                        categoryData.push(obj);
                        await waitFor(60);
                    }
                })
        })
        await waitFor(500);
        //return res.json({code:100,status: true, message: 'Staff List',data : categoryData});


        categoryData.forEach(async element => {
            var globalCat=[]
            //console.log('element._id',element._id)
            element.categories.forEach(async catelement => {
                subcategory.find({categoryId:catelement._id}).
                    then(async(subcategoryres)=>{
                        if(subcategoryres){
                            console.log('subcategoryressubcategoryres',catelement);
                            // categoryres['name22']=element.businesscategory;
                            var catObj={
                                'categories_id':catelement._id,
                                'categories':catelement.category,
                                'subcategorie':subcategoryres
                            }
                            // await waitFor(40);
                            globalCat.push(catObj);
                            await waitFor(40);
                            
                        }
                    })
            })
            var obj={
                "business_id":element.business_id,
                "business_name":element.business_name,
                "categories":globalCat
            }
            // await waitFor(50);
            subCategoryData.push(obj);
            await waitFor(60);

        })
        await waitFor(500);
        return res.json({code:100,status: true, message: 'Staff List',data : subCategoryData});

        }catch(error){
        return res.json({status: false , message :'SomeThing Went Wrong'});
    }
})


async function getAllData(data){
    let globalVar=[];
    await category.find({businessId:data}).then((categoryData)=>{
            
            globalVar.push(categoryData);
        })
     return await globalVar;
}

var fetchBusinesscategoryHeader = ((req,res)=>{
    try{
        businesss.find({}).then((business)=>{
            newArray=[]
            // newArray.push(1);
            if(business){
                business.forEach(async function(index,fun) {
                    globalVar=[];
                    var businessArr={
                        "_id":index._id,
                        "businesscategory":index.businesscategory,
                         "category":[],
                    }
                    
                    var data=  getAllData(index._id);
                    console.log("dat -----------------",await data) 
                    businessArr.category.push( await data);         
                    
                    console.log('categoryData',businessArr)
                    //newArray = businessArr
                    newArray.push(businessArr);
                    
                })
                // newArray.push(3);
                return res.json({status: true , message: '', newArray})
            }else{
                return  res.json({status: false , message:'Business Category Not Found'});
            }
        })
    }catch(error){
        return res.json({status: false , message :'SomeThing Went Wrong'});
    }
})

module.exports = {fetchBusinesscategory,fetchBusinesscategoryHeader};

