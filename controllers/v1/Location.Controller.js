const catchAsyncErrorsMiddleware = require("../../middleware/catchAsyncErrorsMiddleware");
const LocationModel = require("../../models/v1/Location.Model");

// test Route are ok to work or not
exports.getLocations = catchAsyncErrorsMiddleware(async (req, res, next) => {
  try {
    const locations = await LocationModel.find();
    res.status(200).json({
      success: true,
      locations,
    });
  } catch (error) {
    console.error("Error checking locations:", error);
    res.status(500).json({
      success: false,
      message: "Error getting locations",
    });
  }
});
