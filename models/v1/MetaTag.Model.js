// models/MetaTag.js
const mongoose = require("mongoose");

const metaTagSchema = new mongoose.Schema({
  path: { type: String, required: true, unique: true },
  title: { type: String },
  keywords: { type: String },
  description: { type: String },
  author: { type: String },
  content: { type: String },
});

const MetaTagModel = mongoose.model("MetaTag", metaTagSchema);

module.exports = MetaTagModel;
