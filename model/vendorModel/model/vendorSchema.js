var mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

var userSchema = new mongoose.Schema({
    accountType: {
        type: String,
        trim: true,
    },

    firstName : {
        type: String, 
        trim: true,
    },
    lastName  : {
        type : String, 
        trim : true,
    },

    name :{
        type : String,
        trim: true,
    },
    email :{
        type : String,
        trim: true,
    },
    password : {
        type : String, 
        trim : true
    },
    mobile:{
        type: String,
        trim:true
    },
    gender :  {
        type: String, 
        trim : true
    },
    streetAddress : {
        type: String,
        trim : true,
    },
    dob :{
        type: String,
        trim: true
    },
    storeName:{
        type: String,
        trim: true
    },
    storeEmail:{
        type: String,
        trim: true
    },
    storeMobile:{
        type: String,
        trim: true
    },
    image:{
        type: String,
        default: null
    },
    streetName:{
        type: String, 
        trim: true
    },
    address: {
        type: String,
        trim: true
    },
     lat: {
        type : Number,
        trim : true
      },
       lng : {
           type: Number , 
           trim : true
        },
       
        zipcode :{
            type: String,
            trim : true,
        },
    zipCode:{
        type: String,
        trim: true
    },
    state :{
        type: String,
        trim : true,
    },
    country :{
        type: String,
        trim : true,
    },
    city:{
        type: String, 
        trim: true
    },
    createdAt : {
        type: String,
        default: new Date()
    },

    featured : {type: Boolean, default: false},
    
    adminStatus : {type : String, default : 'Unverify'},

    status : {
        activeEmailToken : {type : Number},
        activeEmail : {type:Boolean, default: true},
        resetPassToken : {type: Number, default: null},
    },
    productId : [{type: ObjectId, ref: 'product',default: null}],

},{usePushEach: true})

var user = mongoose.model('user', userSchema);

module.exports = user;