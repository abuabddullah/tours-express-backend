const express = require("express");
const router = express.Router();

const {
  getMetaTags,
  getMetaTagsByPath,
  postMetaTag,
} = require("../../controllers/v1/MetaTag.Controller");

router.route("/metadata").get(getMetaTags).post(postMetaTag);
router.route("/metadataPath").get(getMetaTagsByPath);

// router.route("/metadata/:path").get(getMetaTagsById);

module.exports = router;
