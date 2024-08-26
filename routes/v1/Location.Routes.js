const express = require("express");
const { getLocations } = require("../../controllers/v1/Location.Controller");

const router = express.Router();

router.route("/locations").get(getLocations);


module.exports = router;