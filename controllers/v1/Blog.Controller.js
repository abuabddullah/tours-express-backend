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
    const newBlog = await BlogModel.create({
      writer,
      date: new Date(),
      category,
      title: title,
      descriptions: content,
      tags: JSON.parse(tags),
      imagePath: req.file ? req.file.path : null,
    });
    console.log(newBlog);
    res.status(201).json({
      success: true,
      blog: newBlog,
    });
  } catch (error) {
    res.status(500).json({ error: "Error creating blog" });
  }
});

exports.deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("delete blog by id", id);

    // Validate inputs
    if (!id) {
      return res.status(400).send("Blog ID is required.");
    }

    // Find the Blog by ID
    const blog = await BlogModel.findById(id);
    if (!blog) {
      return res.status(404).send("Blog not found.");
    }

    // Delete the Blog from the database
    await BlogModel.findByIdAndDelete(id);

    res.status(200).send("Blog deleted");
  } catch (error) {
    console.error("Error deleting Blog:", error);
    res.status(500).send("Internal server error.");
  }
};

// need to create controller for getBlogDetailsById
// Function to get blog details by ID
exports.getBlogDetailsById = async (req, res) => {
  try {
    const blogId = req.params.id;

    // Validate the ID (basic validation, consider using a library like express-validator for more robust validation)
    // if (!blogId.match(/^[0-9a-fA-F]{24}$/)) {
    //   return res.status(400).json({ message: 'Invalid blog ID' });
    // }

    // Find the blog by ID
    const blog = await BlogModel.findById(blogId);

    // Check if the blog exists
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    // Return the blog details
    res.status(200).json(blog);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
