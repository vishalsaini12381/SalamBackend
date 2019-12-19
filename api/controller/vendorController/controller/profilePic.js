var user = require('../../../../model/vendorModel/model/vendorSchema');

var profilePic = (req, res, next) => {

   user.findOne({ email: req.body.email }).then((foundUser) => {
      if (foundUser) {
         foundUser.image = 'uploads/' + req.file.filename;
         foundUser.save((err, saved) => {
            if (err) {
               return res.json({ status: false, message: "Profile pic not uploaded" });
            } else {
               return res.json({ status: true, message: "Profile pic uploaded.", });
            }
         });
      }
   })
}

module.exports = profilePic;