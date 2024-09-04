// authController.js

const jwt = require("jsonwebtoken");
const UserModel = require("../../models/v1/User.model");
const { generateToken } = require("../../middleware/jwt.middleware");

// Login or Register user
exports.authUser = async (req, res) => {
  console.log("3. post user request come to backend");
  const { email, firebaseUID, username, phone, image } = req.body;

  try {
    let user = await UserModel.findOne({ email });

    if (!user) {
      console.log("4. its a post user request for new user");
      // Register new user
      user = await UserModel.create({
        email,
        username,
        phone,
        image,
        firebaseUID, // Store Firebase UID for reference
      });
      console.log("5.  new user created");
    }

    // Generate JWT token
    const token = generateToken(user);

    console.log("7.  new user created with token");
    res.json({
      token,
      user,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
