const express = require("express");
const {
  getTours,
  deleteTour,
  getTourById,
  postTour,
} = require("../../controllers/v1/Tour.Controller");
const upload = require("../../middleware/multer.middleware");

const router = express.Router();

router.route("/tours").get(getTours).post(upload.single("file"), postTour);
router.route("/tours/:id").delete(deleteTour).get(getTourById);

module.exports = router;
