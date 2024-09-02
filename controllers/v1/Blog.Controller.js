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
// exports.postBlog = catchAsyncErrorsMiddleware(async (req, res, next) => {
//   const blog = req.body;
//   console.log(blog);

//   // Create new blog entry
//   const newBlog = new BlogModel({
//     blog,
//   });

//   // Save to database
//   await newBlog.save();

//   res.status(201).json({
//     success: true,
//     blog: newBlog,
//   });
// });


exports.postBlog = catchAsyncErrorsMiddleware(async (req, res) => {
  try {
    // Destructure required fields from request body
    const { writer, category, title, descriptions, image, tags, comments } =
      req.body;

    // Validate required fields
    if (!writer || !title || !descriptions || !tags) {
      return res.status(400).json({
        success: false,
        message: "Writer, title, description, and tags are required fields.",
      });
    }

    // Create new blog entry
    const newBlog = new BlogModel({
      writer,
      category,
      title,
      descriptions,
      image,
      tags,
      comments: comments || [], // Default to empty array if not provided
    });

    // Save to database
    await newBlog.save();

    // Respond with success
    res.status(201).json({
      success: true,
      blog: newBlog,
    });
  } catch (error) {
    console.error("Error creating blog:", error);
    res.status(500).json({
      success: false,
      message: "Error creating blog",
    });
  }
});
