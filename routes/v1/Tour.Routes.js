const express = require("express");
const { getTours } = require("../../controllers/v1/Tour.Controller");


const router = express.Router();

router.route("/tours").get(getTours);


module.exports = router;