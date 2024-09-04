const express = require("express");
const { getBlogs, postBlog } = require("../../controllers/v1/Blog.Controller");
const upload = require("../../middleware/multer.middleware");
const { verifyToken } = require("../../middleware/jwt.middleware");

const router = express.Router();

router.route("/blogs").get(getBlogs)
router.route("/blogs").post(verifyToken,upload.single("image"),postBlog);

module.exports = router;
