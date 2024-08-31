const catchAsyncErrorsMiddleware = require("../../middleware/catchAsyncErrorsMiddleware");
const LocationModel = require("../../models/v1/Location.Model");

// test Route are ok to work or not
exports.getLocations = catchAsyncErrorsMiddleware(async (req, res, next) => {
  console.log("first");
  try {
    const locations = await LocationModel.find();
    res.status(200).json({
      success: true,
      locations,
    });
  } catch (error) {
    console.error("Error getting locations:", error);
    res.status(500).json({
      success: false,
      message: "Error getting locations",
    });
  }
});

exports.postLocation = catchAsyncErrorsMiddleware(async (req, res, next) => {
  const locationDetails = req.body;
  console.log(req);
  console.log("locationDetails", locationDetails);
  try {
    const newLocation = await LocationModel.create(locationDetails);
    res.status(200).json({
      success: true,
      locations: newLocation,
    });
  } catch (error) {
    console.error("Error creating locations:", error);
    res.status(500).json({
      success: false,
      message: "Error creating locations",
    });
  }
});
