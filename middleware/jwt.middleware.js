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
    { expiresIn: process.env.JWT_EXPIRY }
  );
};

// Middleware to verify JWT
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];

  if (!token) return res.status(403).send({ message: "No token provided." });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err)
      return res.status(500).send({ message: "Failed to authenticate token." });

    req.user = decoded;
    next();
  });
};

// Middleware to check user role

const verifyUserRole = (role) => {
  return function (req, res, next) {
    if (req.user.role !== role) {
      return res
        .status(403)
        .send({ message: "Forbidden: Insufficient permissions." });
    }
    next();
  };
};

module.exports = { generateToken, verifyUserRole, verifyToken };
