const jwt = require("jsonwebtoken");
// Generate JWT
const generateToken = (user) => {
  console.log("6.  geneating token for post user req");
  return jwt.sign(
    {
      id: user?._id || "",
      email: user?.email,
      username: user?.username,
      role: user?.role || "user",
      phone: user?.phone,
      image: user?.image,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
};

module.exports = { generateToken };
