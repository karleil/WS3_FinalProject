const multer = require("multer");// we import multer to handle file uploads
const path = require("path");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null,'public/images'); //we store files in the public/images folder
    },
    filename:(req, file, cb) => { //we define the filename conventions
        cb(null, Date.now() + path.extname(file.originalname)) //we use the current time of when the file was uploaded + original file name to ensure theres no duplicates even if the image is the same.
    }
});
const upload = multer({ storage });

module.exports = upload; //we export the file to be used in other parts of the app.