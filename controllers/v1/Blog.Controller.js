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

exports.postBlog = catchAsyncErrorsMiddleware(async (req, res) => {
  try {
    const { title, content, category, tags } = req.body;
    const writer = req.user.name || req.user.email;
    console.log({
      writer, // Replace this with actual user data
      date: new Date(),
      category,
      title: title,
      descriptions: content,
      tags: JSON.parse(tags),
      imagePath: req.file ? req.file.path : null,
    })
    const newBlog = new BlogModel({
      writer, // Replace this with actual user data
      date: new Date(),
      category,
      title: title,
      descriptions: content,
      tags: JSON.parse(tags),
      imagePath: req.file ? req.file.path : null,
    });
    await newBlog.save();
    res.status(201).json({
      success: true,
      blog: newBlog,
    });
  } catch (error) {
    res.status(500).json({ error: "Error creating blog" });
  }
});
