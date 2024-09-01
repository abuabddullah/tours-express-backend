const express = require("express");
const {
  getLocations,
  postLocation,
  deleteLocation,
} = require("../../controllers/v1/Location.Controller");
const upload = require("../../middleware/multer.middleware");

const router = express.Router();

router
  .route("/locations")
  .get(getLocations)
  .post(upload.single("file"), postLocation);
router.route("/locations/:id").delete(deleteLocation);

module.exports = router;
