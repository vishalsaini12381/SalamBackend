var user = require('../../../../model/vendorModel/model/vendorSchema');
var bcrypt = require('bcryptjs');
const { sendMail } = require('../../../sendMail');

const registerUser = ((req, res) => {
    try {
        user.findOne({ email: req.body.email }).then((response) => {
            if (response) {
                return res.json({ status: false, message: 'The E-mail You Entered is Alredy Registered Plz Try Different' })
            }

            const otp = Math.floor(1000 + Math.random() * 9000);
            const pass = bcrypt.hashSync(req.body.password);
            const type = req.body.type;
            var User = new user({
                accountType: type,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                mobile: req.body.mobile,
                password: pass,
                'status.activeEmailToken': otp,
            });
            User.save((err, user) => {
                if (err) {
                    return res.json({ status: false, message: 'Error registering the user details' });
                } else {
                    return res.json({ status: true, message: 'User successfully sign up' })
                }
            })
        })
    } catch (error) {
        return res.json({ status: false, message: 'SomeThing Went Wrong' });
    }
})

var verifyEmail = ((req, res) => {
    const Token = req.params.token;
    var Account = req.params.type;
    try {
        if (Account === 'User') {
            if (!Token) {
                return res.json({ status: false, message: "There is something wrong with the verification.Please retry." })
            }
            user.findOne({ $and: [{ 'status.activeEmailToken': Token }, { accountType: Account }] }, function (err, User) {
                if (err) {
                    return res.json({ status: false, message: "Error. Please Try again" })
                }
                if (!User) {
                    return res.json({ status: false, message: "Error! Account already activated/Please Register again" });
                } else {
                    User.status.activeEmail = true;
                    User.status.activeEmailToken = null;

                    User.save(function (err, saved) {
                        if (err) {
                            return res.json({ status: false, message: "Something went wrong" });
                        }
                        if (!saved) {
                            return res.json({ status: false, message: "Please try again" });
                        }
                        return res.redirect('http://localhost:3000');

                    })
                }
            })
        }
    }
    catch (error) {
        return res.json({ status: false, message: "Error. SomeThing Went Wrong" });
    }
})


var login = ((req, res) => {
    var log = {
        email: req.body.email,
        password: req.body.password,
        accountType: req.body.type
    }
    try {
        // if(req.body.type === 'User'){
        user.findOne({ $and: [{ email: log.email }, { accountType: log.accountType }] }).then(async (doc) => {
            if (!doc) {
                return res.json({ status: false, message: 'User Does Not Exist' });
            }
            if (doc) {
                if (doc.status.activeEmail == true) {
                    if (await bcrypt.compare(req.body.password, doc.password)) {

                        return res.json({
                            status: true,
                            message: 'Login SuccessFully',
                            userId: doc._id,
                            firstName: doc.firstName,
                            lastName: doc.lastName,
                            email: doc.email,
                            mobile: doc.mobile,
                            gender: doc.gender,
                            dob: doc.dob,
                            accountType: doc.accountType,
                            streetAddress: doc.streetAddress,
                            zipcode: doc.zipcode,
                            city: doc.city,
                            state: doc.state,
                            country: doc.country,
                            // cartTotal
                        })
                    } else {
                        return res.json({ status: false, message: 'Incorrect Password' });
                    }
                } else {
                    return res.json({ status: false, message: 'Please Activate your account First' });
                }
            } else {
                return res.json({ status: false, message: 'Email Or Password Incorrect' });
            }
        })
        // }
    } catch (error) {
        return res.json({ status: false, message: "SomeThing Went Wrong" });
    }
})

const forgetPasswprd = async (req, res) => {
    const otp = Math.floor(1000 + Math.random() * 9000);
    const email = req.body.email;
    const resetPassToken = otp;
    try {

        if (!email || email == null || email == '') {
            return res.json({ status: false, message: 'Please Enter The Valid E-mail Address' });
        }

        const userInfo = await user.findOne({ email });

        if (!userInfo || userInfo == null || userInfo == '') {
            return res.json({ status: false, message: '"User does not exist"' })
        }

        if (userInfo.status.activeEmail == false) {
            return res.json({
                status: false,
                message: "Please activate first, using the link sent to your email address"
            })
        }

        const mailOptions = {
            from: `basilravi@gmail.com`,
            to: email,
            subject: 'Forget PassWord | Salamtrade',
            html: `<body>
                    <h1>Hello ${userInfo.firstName}</h1>
                    <h2>This is your OTP to reset password: ${otp}.  <a title = "Reset" href = "http://localhost:3100/api/verifyPasswordLink/${resetPassToken}/">Click here to Reset Password </a> </h2>
                    </body>`
        };

        const sendMailInfo = await sendMail(mailOptions);

        if (!sendMailInfo) {
            return res.json({ status: false, message: "Error sending activation link" });
        }

        userInfo.status.resetPassToken = resetPassToken;

        const updatedUserInfo = await userInfo.save();

        if (!updatedUserInfo) {
            return res.json({ status: false, message: "Error. Please try again" });
        }

        return res.json({
            status: true,
            email,
            resetPassToken: resetPassToken,
            message: "Otp sent to your email address To reset your Password"
        });

    } catch (error) {
        return res.json({ status: false, message: '"Oops There is an Error' });
    }
}

var verifyPasswordLink = ((req, res) => {
    var Token = req.params.token;

    try {
        if (!Token || Token == null || Token == undefined) {
            return res.json({ status: false, message: "Something Went Wrong Please Please retry sending the reset link." });
        }

        user.findOne({ 'status.resetPassToken': Token }, function (err, User) {
            if (err) {
                return res.json({ status: false, message: "Error. Please Try again" })
            }
            if (!User) {
                return res.json({ status: false, message: "Error. Try resetting again and then find the email for activation" })
            } else {
                User.save(function (err, saved) {
                    if (err) {
                        return res.json({ status: false, message: "Something went wrong" });
                    }
                    if (!saved) {
                        return res.json({ status: false, message: "Please try again" });
                    }
                    return res.redirect("http://localhost:3000/Forgotpassword");
                })
            }
        })
    } catch (error) {
        return res.json({ status: false, message: "SomeThing Went Wrong" });
    }
})

var saveNewPassword = ((req, res) => {
    var password = req.body.password;
    var resetPassToken = req.body.otp;
    try {
        if (!password || password === null || password === "") return res.json({ status: false, message: "Enter Password" })
        user.findOne({ 'status.resetPassToken': resetPassToken }, async (err, User) => {
            if (err) {
                return res.json({ status: false, message: "Error Occured" });
            }
            if (User) {
                req.body.password = bcrypt.hashSync(req.body.password, 10);
                if (await bcrypt.compare(req.body.password, User.password)) {
                    return res.json({ status: false, message: "Can Not Set The OldPassword" });
                } else {
                    User.password = req.body.password;
                    User.status.resetPassToken = null;
                    User.save(function (err, saved) {
                        if (err) {
                            return res.json({ status: false, message: "Error While Saving New Password.Please Try Again" });
                        } else {
                            return res.json({ status: true, message: "SuccessFully! Password Changed" });
                        }
                    })
                }
            } else {
                return res.json({ status: false, message: "Error, Correct Otp" });
            }
        })
    } catch (error) {
        return res.json({ status: false, message: "SomeThing Went Wrong" });
    }
})

var fetchUser = ((req, res) => {
    try {
        user.findOne({ email: req.body.email }).then((doc) => {
            if (doc) {
                if (doc.status.activeEmail == true) {
                    return res.json({
                        status: true,
                        message: '',
                        firstName: doc.firstName,
                        lastName: doc.lastName,
                        email: doc.email,
                        mobile: doc.mobile,
                        gender: doc.gender,
                        dob: doc.dob
                    })
                }
            }
        })
    } catch (error) {
        return res.json({ status: false, message: 'Something Went Wrong' });
    }
})

var logOut = ((req, res) => {
    try {
        res.clearCookie('jwtToken');
        return res.json({
            status: true,
            message: "Logout SuccessFully"
        })
    } catch (error) {
        return res.json({ status: false, message: "Something Went Wrong" });
    }
})

module.exports = { registerUser, verifyEmail, login, forgetPasswprd, verifyPasswordLink, saveNewPassword, fetchUser, logOut };

