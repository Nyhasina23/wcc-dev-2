const express = require('express');
const router = express.Router();
const multer = require('multer')
const { userController } = require('../controllers/user.controller');
const DIR = './public/';
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, DIR);
    },
    filename: (req, file, cb) => {
        const fileName = Date.now().toString() + '.jpg';
        cb(null, fileName)
    }
});


var upload = multer({
    limits: { fieldSize: 25 * 1024 * 1024 },
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
        }
    }
});

router.post('/signup/',upload.array('images', Number.POSITIVE_INFINITY), userController.signup);
router.post('/signin/',upload.array('images', Number.POSITIVE_INFINITY), userController.signin);
router.use('/*', (req,res)=> res.status(404).send('This route does not exist'));



module.exports = router;