const mongoose = require("mongoose");
const { Schema } = mongoose;

// Define Blog Schema
const BlogSchema = new Schema({
  writer: { type: String, required: false, default: "Anonymous" },
  date: { type: Date, default: Date.now }, // Default to current date if not provided
  category: {
    type: String,
    // enum: [
    //   "Adventure",
    //   "Beach",
    //   "Culture",
    //   "Historical",
    //   "Nature",
    //   "Wildlife",
    //   "Uncategorized",
    // ],
    default: "Uncategorized",
  },
  title: {
    type: String,
    required: [false, "Title is required"],
    minlength: [5, "Title must be at least 5 characters long"],
  },
  descriptions: { type: String, required: false },
  imagePath: { type: String },
  tags: {
    type: [String],
    required: [false, "Tags are required"],
  },
  comments: [
    {
      email: String,
      cmntText: String,
    },
  ],
  ratings: [
    {
      email: String,
      rate: Number,
    },
  ],
});

const BlogModel = mongoose.model("Blog", BlogSchema);

module.exports = BlogModel;
