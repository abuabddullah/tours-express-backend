const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    // cb(null, file.originalname);
    const timeStamp = Date.now();
    const filenme = `${timeStamp}-${file.originalname}`;
    cb(null, filenme);
  },
});

const upload = multer({
  storage,
}); // grabing any kind of file {maxcount:1}

module.exports = upload;
