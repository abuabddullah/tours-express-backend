const path = require("path");
const catchAsyncErrorsMiddleware = require("../../middleware/catchAsyncErrorsMiddleware");
const LocationModel = require("../../models/v1/Location.Model");
const deletFileFromUploadsFolder = require("../../middleware/fileHandler.middleware");

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
    console.log("imagePath", imagePath);
    if (!imagePath) {
      return res.status(400).send("Image path is not available.");
    }

    const fullPath = path.resolve(imagePath);
    console.log("fullPath", fullPath);

    const { status } = deletFileFromUploadsFolder(fullPath);

    if (status == 200) {
      console.log(status);
      res.status(200).send("Image file not found. But location deleted");
    } else if (status == 404) {
      res.status(404).send("Image file not found. But location deleted");
    }
  } catch (error) {
    console.error("Error deleting location:", error);
    res.status(500).send("Internal server error.");
  }
};

exports.getLocationById = async (req, res) => {
  const { id } = req.params;
  // Validate inputs
  if (!id) {
    return res.status(400).send("Location ID is required.");
  }

  // Find the location by ID
  const location = await LocationModel.findById(id);
  console.log("getLocationById", id);
  console.log("location", location);
  if (!location) {
    return res.status(404).send("Location not found.");
  }

  res.status(200).json({
    success: true,
    location,
  });
};

exports.updateLocation = catchAsyncErrorsMiddleware(async (req, res) => {
  try {
    const { id } = req.params;
    const location = await LocationModel.findById(id);
    console.log(location);
    if (!location) {
      return res
        .status(404)
        .json({ success: false, message: "Location not found" });
    }

    const updatedData = {
      name: req.body.name || location.name,
      description: req.body.description || location.description,
      category: req.body.category || location.category,
      tourCount: req.body.tourCount || location.tourCount,
    };

    if (req.file) {
      // Delete old image if it exists
      const oldImagePath = path.resolve(location.image);
      const { status } = deletFileFromUploadsFolder(oldImagePath);
      if (status === 200) {
        console.log("Old image deleted");
      }

      // Update with new image
      updatedData.image = req.file.path;
    } else {
      // Keep old image if no new file is uploaded
      updatedData.image = location.image;
    }

    const updatedLocation = await LocationModel.findByIdAndUpdate(
      id,
      updatedData,
      { new: true }
    );
    res.status(200).json({ success: true, location: updatedLocation });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error updating location" });
  }
});
