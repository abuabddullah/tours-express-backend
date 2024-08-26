const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const locationSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: [true, "Location image Avatar is required"],
    default: "https://i.ibb.co/jvBVcJh/tour-9.jpg",
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: [true, "Category is required"],
    enum: ["Wildlife", "Adventure"],
    default: "Adventure",
  },
  tourCount: {
    type: Number,
    required: true,
    default: 0,
  },
});

const LocationModel = mongoose.model("Location", locationSchema);

module.exports = LocationModel;
