const express = require("express");
const { getBlogs, postBlog } = require("../../controllers/v1/Blog.Controller");

const router = express.Router();

router.route("/blogs").get(getBlogs).post(postBlog);

module.exports = router;
