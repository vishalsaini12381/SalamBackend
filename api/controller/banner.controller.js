const BannerModel = require('../../model/banner.model');
const multer = require('multer');

exports.create = (req, res) => {

  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public')
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname)
    }
  })

  const upload = multer({ storage: storage }).single('file');

  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(500).json(err)
    } else if (err) {
      return res.status(500).json(err)
    }

    const bannerModel = new BannerModel({
      imageName: req.file.filename,
      imageType: req.file.mimetype,
      imagePath: req.file.path
    });

    bannerModel.save()
      .then(data => {
        return res.status(200).send(data)
      })
      .catch(error => {
        return res.status(500).json(error)
      })

  })
}

exports.get = (req, res) => {

  BannerModel.find()
    .then(data => {
      return res.status(200).send(data);
    })
    .catch(error => {
      return res.status(500).json(error)
    })
}
