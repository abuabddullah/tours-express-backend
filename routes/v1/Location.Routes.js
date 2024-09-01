const express = require("express");
const {
  getLocations,
  postLocation,
} = require("../../controllers/v1/Location.Controller");
const upload = require("../../middleware/multer.middleware");

const router = express.Router();

router
  .route("/locations")
  .get(getLocations)
  .post(upload.single("file"), postLocation);

module.exports = router;
