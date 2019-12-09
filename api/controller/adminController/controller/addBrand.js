var Brand = require('../../../../model/adminModel/brandModel');

var addBrand = ((req,res)=>{
    try{

        // var a = req.body.file;
        // var m = a.indexOf('data:')
        // var n = a.indexOf(';');
        // var o = a.slice(m,n);
        // var p = o.split('/')
        // var arr = (["jpeg","jpg","png"]);
        // console.log('\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\',m,n,o,p)


        const brand = new Brand({
            // file   : req.body.file,
            brandName: req.body.brand,
            createdAt: new Date(),
            updateAt: new Date().getTime()
        })
        // if(arr.includes(p[1])){
            brand.save(function(err,save){
                console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!',save);
               if(err){
               return res.json({status: false, message: "Error Occured"});
               }
               return res.json({
                status: true,
                message: 'Brand is SuccessFully Added',
                file   : save.file,
                brandName: save.brandName,
            });
           }) 
        // }else{
        //     return res.json({status: false, message: 'File Type Not Match'})
        // }
      
    }catch(error)
    {
        console.log('.................',error);
        return res.json({status: false, message: "Something Went Wrong"})
    }
});


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

var editBrands = ((req,res)=>{
    try{
        let id = req.params.id;
    console.log('<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<',req.params.id);
    Brand.findById(id, function (err, brands){
        // console.log('UUUUUUUUUUUUUUUUUUU',err);
    res.json(brands);
    console.log('----------------------',brands);

    }); 
    }catch(error){
        console.log('error',error);
        return res.json({status: false, message: 'Something Went Wrong'});
    }
})

var updateBrands = ((req,res)=>{
    try{
        console.log('SSSSSSSSSSSs',req.params.id);
        var detail = {
            brandName : req.body.brandName,
        };
        console.log('2222222222222222',detail);
        let id = req.params.id;     

        console.log('jjjjjjj', id);
        Brand.findByIdAndUpdate(id,{$set : {brandName : req.body.brandName, status: true}})
        .then((user)=>{
            console.log('333333333333333333333',user);
            if(user){
                return res.json({status : true , message : 'Brand Updated' , user});
            }else{
                return res.json({status : false , message : 'Brand Not Found'});
            }
        },(e)=>{
            console.log('555555555555555555555',e);
            return res.json({status : false , message: 'Brand Not Updated'});
        })
    }catch(error){
        console.log('4444444444444444',error);
        return res.json({status: false, message: 'SomeThing Went Wrong'});
    }
})

var deleteBrand = ((req,res)=>{
    try{
        var id = req.body.brandId
        Brand.findByIdAndRemove(id).then((doc)=>{
            console.log('DOOOOOOOOOOOOOOOOO',doc);
            return res.json({status: false, message: 'Poof! Your imaginary data has been deleted!' })
        })
    }catch(error){
        console.log('ERROR',error);
        return res.json({status: false, message: "Something Went Wrong"});
    }
})

module.exports = {addBrand,fetchBrands,editBrands,updateBrands,deleteBrand};