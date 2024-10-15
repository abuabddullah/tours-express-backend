const express = require("express");
const {
  getLocations,
  postLocation,
  deleteLocation,
  getLocationById,
  updateLocation,
  getAllUniqueNames,
} = require("../../controllers/v1/Location.Controller");
const upload = require("../../middleware/multer.middleware");

const router = express.Router();

router
  .route("/locations")
  .get(getLocations)
  .post(upload.single("file"), postLocation);

router.route("/locations/unique").get(getAllUniqueNames);
router
  .route("/locations/:id")
  .delete(deleteLocation)
  .get(getLocationById)
  .patch(upload.single("file"), updateLocation); // Add PATCH route;

module.exports = router;
