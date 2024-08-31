const express = require("express");
const { getLocations, postLocation } = require("../../controllers/v1/Location.Controller");

const router = express.Router();

router.route("/locations").get(getLocations).post(postLocation);


module.exports = router;