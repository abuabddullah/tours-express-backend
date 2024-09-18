const catchAsyncErrorsMiddleware = require("../../middleware/catchAsyncErrorsMiddleware");
const deletFileFromUploadsFolder = require("../../middleware/fileHandler.middleware");
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

exports.postTour = catchAsyncErrorsMiddleware(async (req, res) => {
  try {
    const { body, file } = req;
    if (!file) {
      return res.status(400).json({
        success: false,
        message: "File is required.",
      });
    }

    const imagePathUrl = file.path; // getting the file from client
    console.log("imagePathUrl", imagePathUrl);

    const tourData = { ...body, image: imagePathUrl };
    console.log("tourData", tourData);

    const newTour = await TourModel.create(tourData);
    res.status(201).json({
      success: true,
      tour: newTour,
    });
  } catch (error) {
    console.error("Error creating tour:", error);
    res.status(500).json({
      success: false,
      message: "Error creating tour.",
    });
  }
});

// getTour by id
exports.getTourById = catchAsyncErrorsMiddleware(async (req, res, next) => {
  try {
    const { id } = req.params;
    const tour = await TourModel.findById(id);
    res.status(200).json({
      success: true,
      tour,
    });
  } catch (error) {
    console.error("Error checking tour:", error);
    res.status(500).json({
      success: false,
      message: "Error getting tour",
    });
  }
});

// deleteTour
exports.deleteTour = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("delete tour by id", id);
    // Validate inputs
    if (!id) {
      return res.status(400).send("Tour ID is required.");
    }

    // Find the Tour by ID
    const tour = await TourModel.findById(id);
    if (!tour) {
      return res.status(404).send("Tour not found.");
    }

    // Delete the Tour from the database
    const deletedTour = await TourModel.findByIdAndDelete(id);
    // res.status(200).json({
    //   success: true,
    //   deletedTour,
    // });

    // Delete the image from the uploads folder
    // Construct the full path of the image file
    const imagePath = tour.image;
    if (!imagePath) {
      return res.status(400).send("Image path is not available.");
    }
    const fullPath = path.resolve(imagePath);
    console.log(fullPath);

    const { status } = deletFileFromUploadsFolder(fullPath);

    console.log(status);
    if (status == 200) {
      res.status(200).json({
        success: true,
        tour: deletedTour,
      });
    } else {
      res.status(status).send("Image file not found. But tour deleted");
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting tour",
    });
  }
};
