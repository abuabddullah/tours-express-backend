const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/.+\@.+\..+/, 'Please fill a valid email address']
  },
  password: {
    type: String,
    required: true,
  },
  bookingsByUser: [{
    type: Schema.Types.ObjectId,
    ref: 'Booking'
  }],
  toursByUser: [{
    type: Schema.Types.ObjectId,
    ref: 'Tour'
  }],
  blogsByUser: [{
    type: Schema.Types.ObjectId,
    ref: 'Blog'
  }],
  photo: {
    type: String, // URL to the photo stored in Firebase Storage
  },
  phone: {
    type: String,
    match: [/^\d{10}$/, 'Please fill a valid phone number'],
  }
}, { timestamps: true });

const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;
