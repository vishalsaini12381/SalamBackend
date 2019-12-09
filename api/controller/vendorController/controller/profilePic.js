var user = require('../../../../model/vendorModel/model/vendorSchema');

var profilePic =(req,res,next)=>{
    console.log("found ",req.body);
    console.log('filename',req.file);

  user.findOne({email:req.body.email}).then((foundUser)=>{
      if(foundUser){
          console.log("------------------ ",foundUser);
          foundUser.image = 'uploads/'+req.file.filename;
          foundUser.save((err,saved)=>{
              console.log('WWWWWWWWWWWW',saved);
            if(err){
               return res.json({status:false, message: "Profile pic not uploaded"});
            }else{
               return res.json({status:true, message: "Profile pic uploaded.",});
            }
         });
      }
  })
}

module.exports=profilePic;