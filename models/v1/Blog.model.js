// // models/Blog.js
// const mongoose = require("mongoose");
// const { Schema } = mongoose;

// // Define the Comment schema
// const CommentSchema = new Schema({
//   email: { type: String, required: true },
//   cmntText: { type: String, required: true },
// });

// // Define the Blog schema
// const BlogSchema = new Schema({
//   writer: { type: String, required: true },
//   date: { type: Date, required: true, default: Date.now },
//   category: {
//     type: String,
//     enum: [
//       "Adventure",
//       "Beach",
//       "Culture",
//       "Historical",
//       "Nature",
//       "Wildlife",
//       "Uncategorized",
//     ], // Enum values
//     default: "Uncategorized", // Default value
//   },
//   title: { type: String, required: false },
//   descriptions: { type: String, required: false },
//   image: { type: String, required: false },
//   tags: { type: [String], required: true },
//   comments: { type: [CommentSchema], default: [] },
// });

// // Create and export the Blog model
// const BlogModel = mongoose.model("Blog", BlogSchema);
// module.exports = BlogModel;









const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define Comment Schema
const CommentSchema = new Schema({
  email: { type: String, required: true },
  cmntText: { type: String, required: true },
});

// Define Blog Schema
const BlogSchema = new Schema({
  writer: { type: String, required: true },
  date: { type: Date, default: Date.now }, // Default to current date if not provided
  category: { 
    type: String, 
    enum: [
      "Adventure",
      "Beach",
      "Culture",
      "Historical",
      "Nature",
      "Wildlife",
      "Uncategorized"
    ], 
    default: "Uncategorized"
  },
  title: { 
    type: String, 
    required: [true, 'Title is required'],
    minlength: [5, 'Title must be at least 5 characters long']
  },
  descriptions: { 
    type: String, 
    required: [true, 'Description is required'],
    minlength: [30, 'Description must be at least 30 characters long']
  },
  image: { type: String }, // Not required
  tags: { 
    type: [String], 
    required: [true, 'Tags are required'] 
  },
  comments: [CommentSchema] // Optional
});

const BlogModel = mongoose.model('Blog', BlogSchema);

module.exports = BlogModel;
