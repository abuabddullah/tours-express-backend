// authController.js

const jwt = require("jsonwebtoken");
const UserModel = require("../../models/v1/User.model");

// Generate JWT
const generateToken = (user) => {
    console.log("6.  geneating token for post user req")
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      username: user.username,
      role: user.role,
      phone: user.phone,
      image: user.image,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
};

// Login or Register user
exports.authUser = async (req, res) => {
    console.log("3. post user request come to backend")
  const { email, uid, username, phone, image } = req.body;

  try {
    let user = await UserModel.findOne({ email });

    if (!user) {
        console.log("4. its a post user request for new user")
      // Register new user
      user = await UserModel.create({
        email,
        username,
        phone,
        image,
        firebaseUID: uid, // Store Firebase UID for reference
      });
      console.log("5.  new user created")
    }

    // Generate JWT token
    const token = generateToken(user);

    console.log("7.  new user created with token")
    res.json({
      token,
      //   user: {
      //     email: user.email,
      //     username: user.username,
      //     role: user.role,
      //     phone: user.phone,
      //     image: user.image,
      //   },
      user,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
