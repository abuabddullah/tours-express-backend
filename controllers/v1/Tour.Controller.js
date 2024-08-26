const catchAsyncErrorsMiddleware = require("../../middleware/catchAsyncErrorsMiddleware");
const TourModel = require("../../models/v1/Tour.model");

// test Route are ok to work or not
exports.getTours = catchAsyncErrorsMiddleware(async (req, res, next) => {
  try {
    const tours = await TourModel.find();
    res.status(200).json({
      success: true,
      tours,
    });
  } catch (error) {
    console.error("Error checking Tours:", error);
    res.status(500).json({
      success: false,
      message: "Error getting Tours",
    });
  }
});
