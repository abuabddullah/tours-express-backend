const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/.+\@.+\..+/, "Please fill a valid email address"],
    },
    uid: {
      type: String,
      required: false,
    },
    phone: {
      type: String,
      match: [/^\d{10}$/, "Please fill a valid phone number"],
    },
    image: {
      type: String, // URL to the photo stored in Firebase Storage
    },
    password: {
      type: String,
      required: false,
    },
    bookingsByUser: [
      {
        type: Schema.Types.ObjectId,
        ref: "Booking",
      },
    ],
    toursByUser: [
      {
        type: Schema.Types.ObjectId,
        ref: "Tour",
      },
    ],
    blogsByUser: [
      {
        type: Schema.Types.ObjectId,
        ref: "Blog",
      },
    ],
    role: {
      type: String,
      required: [true, "role is required"],
      enum: ["user", "admin"],
      default: "user",
    },
  },
  { timestamps: true }
);

const UserModel = mongoose.model("User", userSchema);

module.exports = UserModel;
