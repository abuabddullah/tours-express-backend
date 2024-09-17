const catchAsyncErrorsMiddleware = require("../../middleware/catchAsyncErrorsMiddleware");
const MetaTagModel = require("../../models/v1/MetaTag.Model");

exports.getMetaTags = catchAsyncErrorsMiddleware(async (req, res, next) => {
  try {
    const metaTags = await MetaTagModel.find();
    res.json(metaTags);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

exports.getMetaTagsByPath = catchAsyncErrorsMiddleware(
  async (req, res, next) => {
    try {
      const { path } = req.query;
      const metaTag = await MetaTagModel.findOne({ path });
      if (!metaTag)
        return res.status(404).json({ message: "Meta tag not found" });
      res.json(metaTag);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

exports.postMetaTag = catchAsyncErrorsMiddleware(async (req, res, next) => {
  try {
    const { path, title, keywords, description, author, content } = req.body;
    const metaTag = await MetaTagModel.findOneAndUpdate(
      { path },
      { title, keywords, description, author, content },
      { upsert: true, new: true } // upsert: true will create a new document if one is not found
    );
    res.json(metaTag);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
