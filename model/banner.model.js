const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

var bannerSchema = new mongoose.Schema({
  imageName: { type: String },
  imageType: { type: String },
  imagePath: { type: String },
  isDeleted: { type: Boolean, default: false },
}, { timestamps: true });

const BannerSchema = mongoose.model('banner', bannerSchema);

module.exports = BannerSchema;