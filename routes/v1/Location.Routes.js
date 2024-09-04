const express = require("express");
const {
  getLocations,
  postLocation,
  deleteLocation,
  getLocationById,
  updateLocation,
} = require("../../controllers/v1/Location.Controller");
const upload = require("../../middleware/multer.middleware");

const router = express.Router();

router
  .route("/locations")
  .get(getLocations)
  .post(upload.single("file"), postLocation);
router
  .route("/locations/:id")
  .delete(deleteLocation)
  .get(getLocationById)
  .patch(upload.single("file"), updateLocation); // Add PATCH route;

module.exports = router;







// const express = require("express");
// const {
//   getLocations,
//   postLocation,
//   deleteLocation,
//   getLocationById,
//   updateLocation,
// } = require("../../controllers/v1/Location.Controller");
// const upload = require("../../middleware/multer.middleware");
// const {
//   verifyToken,
//   verifyUserRole,
// } = require("../../middleware/jwt.middleware");

// const router = express.Router();

// router
//   .route("/locations")
//   .get(getLocations)
//   .post(upload.single("file"), postLocation);
// router.route("/locations/:id").get(getLocationById);
// router
//   .route("/locations/:id")
//   .delete(verifyToken, verifyUserRole("admin"), deleteLocation)
//   .patch(upload.single("file"), updateLocation); // Add PATCH route;

// module.exports = router;








// Protecting an admin route
// app.get('/admin', verifyToken, verifyUserRole('admin'), (req, res) => {
//   res.send('This is the admin area.');
// });

// // Protecting a general user route
// app.get('/user/profile', verifyToken, (req, res) => {
//   res.send('This is the user profile area.');
// });

