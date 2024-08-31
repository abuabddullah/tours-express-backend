const catchAsyncErrorsMiddleware = require("../../middleware/catchAsyncErrorsMiddleware");
const BlogModel = require("../../models/v1/Blog.model");

// test Route are ok to work or not
exports.getBlogs = catchAsyncErrorsMiddleware(async (req, res, next) => {
  try {
    const blogs = await BlogModel.find();
    res.status(200).json({
      success: true,
      blogs,
    });
  } catch (error) {
    console.error("Error checking Blogs:", error);
    res.status(500).json({
      success: false,
      message: "Error getting Blogs",
    });
  }
});

// test Route are ok to work or not
exports.postBlog = catchAsyncErrorsMiddleware(async (req, res, next) => {
  const { blog } = req.body;
  const newBlog = await BlogModel.create({
    blog,
  });

  res.status(201).json({
    success: true,
    blog: newBlog,
  });
});
