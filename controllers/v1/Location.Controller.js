const path = require("path");
const fs = require("fs");
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
    console.error("Error getting locations:", error);
    res.status(500).json({
      success: false,
      message: "Error getting locations",
    });
  }
});

exports.postLocation = catchAsyncErrorsMiddleware(async (req, res) => {
  // upload-middlware ensures saving of file in "./uploads/" folder
  try {
    const imagePathUrl = req.file.path; // getting the file from client
    const locationData = { ...req.body, image: imagePathUrl };

    const newLocation = await LocationModel.create(locationData);
    res.status(200).json({
      success: true,
      location: newLocation,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "file upload failed",
    });
  }
});

const deletFileFromUploadsFolder = (fullPath) => {
  // Check if the file exists
  if (fs.existsSync(fullPath)) {
    console.log("Image file found, deleting...");
    fs.unlinkSync(fullPath);
    console.log("Image file deleted");
    return { status: 200 };
  } else {
    console.log("Image file not found.");
    return { status: 404 };
  }
};

exports.deleteLocation = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate inputs
    if (!id) {
      return res.status(400).send("Location ID is required.");
    }

    // Find the location by ID
    const location = await LocationModel.findById(id);
    if (!location) {
      return res.status(404).send("Location not found.");
    }

    // Delete the location from the database
    await LocationModel.findByIdAndDelete(id);

    //  steps to delete img from "/uploads" folder
    // Construct the full path of the image file
    const imagePath = location.image;
    if (!imagePath) {
      return res.status(400).send("Image path is not available.");
    }

    // const uploadsDir = path.resolve('tours-express-backend', 'uploads');
    const fullPath = path.resolve(imagePath);

    const { status } = deletFileFromUploadsFolder(fullPath);

    if (status == 200) {
      console.log(status)
      res.status(200).send("Image file not found. But location deleted");
    } else if (status == 404) {
      res.status(404).send("Image file not found. But location deleted");
    }
  } catch (error) {
    console.error("Error deleting location:", error);
    res.status(500).send("Internal server error.");
  }
};
