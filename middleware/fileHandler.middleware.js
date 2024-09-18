const fs = require("fs");

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

module.exports = deletFileFromUploadsFolder;
