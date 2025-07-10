const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null,'uploads/')
    },
    filename: function(req, file,cb) {
        const ext = path.extname(file.originalname);
        const uniqueName = `${Date.now()} -${Math.round(Math.random() * 1e9)}${ext}`;
        cb(null, uniqueName)
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024},
    fileFilter(req, file, cb){
        const allowed = ['image/png', 'image/jpeg', 'image/jpg'];
        if(!allowed.includes(file.mimetype)){
            return cb(new Error('omly images file allowed'));
        }
        cb(null, true);
    }
});

module.exports = upload;