const multer = require('multer');

//mime types lists
const MIME_TYPES = {
    "image/jpg": "jpg",
    "image/jpeg": "jpg",
    "image/gif": "gif",
    "image/png": "png"
};

//file destination (repository) and generate unique file name
const storage = multer.diskStorage({

    //file destinantion
    destination: (req, file, callback) => {
        callback(null, "public/profilePicture")
    },
    filename: (req, file, callback) => {
        //delete spaces in filename
        const name = file.originalename.split(" ").join("_");
        const extension = MIME_TYPES[file.mimetype];

        callback(null, name + "_" + Date.now() + extension);
    }
})

module.exports = multer({ storage }).single("image");