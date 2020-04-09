var Brand = require('../../../model/adminModel/brandModel');

var addBrand = ((req, res) => {
    try {

        // var a = req.body.file;
        // var m = a.indexOf('data:')
        // var n = a.indexOf(';');
        // var o = a.slice(m,n);
        // var p = o.split('/')
        // var arr = (["jpeg","jpg","png"]);


        const brand = new Brand({
            file: req.body.file,
            brandName: req.body.brand,
            createdAt: new Date(),
            updateAt: new Date().getTime()
        })
        // if(arr.includes(p[1])){
        brand.save(function (err, save) {
            if (err) {
                return res.json({ status: false, message: "Error Occured" });
            }
            return res.json({
                status: true,
                message: 'Brand is SuccessFully Added',
                file: save.file,
                brandName: save.brandName,
            });
        })
        // }else{
        //     return res.json({status: false, message: 'File Type Not Match'})
        // }

    } catch (error) {
        return res.json({ status: false, message: "Something Went Wrong" })
    }
});


var fetchBrands = ((req, res) => {
    try {
        Brand.find({}, {}, { sort: { 'created_at': -1 } }).then((doc) => {
            if (doc) {
                return res.json({ status: true, message: '', doc });
            } else {
                return res.json({ status: false, message: 'Brands Not Found' });
            }
        })
    } catch (error) {
        return res.json({ status: false, message: 'SomeThing Went Wrong' });
    }
})

var editBrands = ((req, res) => {
    try {
        let id = req.params.id;
        Brand.findById(id, function (err, brands) {
            res.json(brands);

        });
    } catch (error) {
        return res.json({ status: false, message: 'Something Went Wrong' });
    }
})

var updateBrands = ((req, res) => {
    try {
        var detail = {
            brandName: req.body.brandName,
            file: req.body.file,
        };
        let id = req.params.id;

        Brand.findByIdAndUpdate(id, { $set: { brandName: req.body.brandName, file: req.body.file, status: true } })
            .then((user) => {
                if (user) {
                    return res.json({ status: true, message: 'Brand Updated', user });
                } else {
                    return res.json({ status: false, message: 'Brand Not Found' });
                }
            }, (e) => {
                return res.json({ status: false, message: 'Brand Not Updated' });
            })
    } catch (error) {
        return res.json({ status: false, message: 'SomeThing Went Wrong' });
    }
})

var deleteBrand = ((req, res) => {
    try {
        var id = req.body.brandId
        Brand.findByIdAndRemove(id).then((doc) => {
            return res.json({ status: false, message: 'Poof! Your imaginary data has been deleted!' })
        })
    } catch (error) {
        return res.json({ status: false, message: "Something Went Wrong" });
    }
})

module.exports = { addBrand, fetchBrands, editBrands, updateBrands, deleteBrand };