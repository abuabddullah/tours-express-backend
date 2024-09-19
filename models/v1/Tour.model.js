const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const tourSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: [true, "Image is required"],
    default: "https://i.ibb.co/jvBVcJh/tour-9.jpg",
  },
  location: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: [true, "Category is required"],
    enum: ["adventure", "honeymoon", "international", "popular"],
    default: "Adventure",
  },
  tourCount: {
    type: Number,
    required: true,
    default: 0,
  },
  ratings: {
    type: Number,
    min: 0,
    max: 5,
    default: 0,
  },
  cost: {
    type: Number,
    required: true,
    default: 0,
  },
  reviews: [],
});

const TourModel = mongoose.model("Tour", tourSchema);

module.exports = TourModel;
