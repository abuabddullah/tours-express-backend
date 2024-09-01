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

exports.deleteLocation = async (req, res) => {
  try {
    const { id } = req.params;
    const { imgUrlPath } = req.body;

    // Validate inputs
    if (!id || !imgUrlPath) {
      return res.status(400).send('Location ID and image URL path are required.');
    }

    // Find the location by ID
    const location = await Location.findById(id);
    if (!location) {
      return res.status(404).send('Location not found.');
    }

    // Delete the location from the database
    await Location.findByIdAndDelete(id);

    // Remove the image file from the uploads directory
    if (imgUrlPath.startsWith('image:uploads/')) {
      const filePath = imgUrlPath.replace('image:', '');
      const fullPath = path.resolve(filePath);

      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
      } else {
        return res.status(404).send('Image file not found.');
      }
    } else {
      return res.status(400).send('Invalid image URL path.');
    }

    res.send('Location and image deleted successfully.');
  } catch (error) {
    console.error('Error deleting location:', error);
    res.status(500).send('Internal server error.');
  }
};
