var mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;


var wishlistSchema = new mongoose.Schema({
    createdAt: {
        type: String,
        default: new Date()
    },
    userId: {type: ObjectId, ref: 'user', default: null},
    productId : {type : ObjectId, ref : 'product',default: null},
    
},{usePushEach: true});

var wishlist = mongoose.model('wishlist', wishlistSchema);

module.exports = wishlist;