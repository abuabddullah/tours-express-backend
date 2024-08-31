// models/Blog.js
const mongoose = require("mongoose");
const { Schema } = mongoose;

// Define the Comment schema
const CommentSchema = new Schema({
  email: { type: String, required: true },
  cmntText: { type: String, required: true },
});

// Define the Blog schema
const BlogSchema = new Schema({
  writer: { type: String, required: false },
  date: { type: Date, required: true, default: Date.now },
  category: {
    type: String,
    enum: [
      "Adventure",
      "Beach",
      "Culture",
      "Historical",
      "Nature",
      "Wildlife",
      "Uncategorized",
    ], // Enum values
    default: "Uncategorized", // Default value
  },
  title: { type: String, required: false },
  descriptions: { type: [String], required: true },
  image: { type: String, required: false },
  tags: { type: [String], required: true },
  comments: { type: [CommentSchema], default: [] },
});

// Create and export the Blog model
const BlogModel = mongoose.model("Blog", BlogSchema);
module.exports = BlogModel;
