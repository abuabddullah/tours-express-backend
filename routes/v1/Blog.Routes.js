const express = require("express");
const {
  getBlogs,
  postBlog,
  deleteBlog,
  getBlogDetailsById,
  updateBlog,
  getBlogsByCategory,
  getCategoryNames,
} = require("../../controllers/v1/Blog.Controller");
const upload = require("../../middleware/multer.middleware");
const {
  verifyToken,
  verifyUserRole,
} = require("../../middleware/jwt.middleware");

const router = express.Router();

router.route("/blogs").get(getBlogs);
router
  .route("/blogs")
  .post(
    verifyToken,
    verifyUserRole("blogger"),
    upload.single("image"),
    postBlog
  );
router
  .route("/blogs/:id")
  .delete(deleteBlog)
  .get(getBlogDetailsById)
  .put(upload.single("image"), updateBlog);

//getCategoryNames
router.route("/blogs/categories/unique").get(getCategoryNames);
// getBlogsByCategory route
router.route("/blogs/categories/:category").get(getBlogsByCategory);

module.exports = router;
