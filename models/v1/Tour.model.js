// const mongoose = require("mongoose");

// const Schema = mongoose.Schema;

// const tourSchema = new Schema({
//   title: {
//     type: String,
//     required: true,
//   },
//   image: {
//     type: String,
//     required: [true, "Image is required"],
//     default: "https://i.ibb.co/jvBVcJh/tour-9.jpg",
//   },
//   location: {
//     type: String,
//     required: true,
//   },
//   country: {
//     type: String,
//     required: true,
//   },
//   category: {
//     type: String,
//     required: [true, "Category is required"],
//     enum: ["adventure", "honeymoon", "international", "popular"],
//     default: "Adventure",
//   },
//   tourCount: {
//     type: Number,
//     required: true,
//     default: 0,
//   },
//   ratings: {
//     type: Number,
//     min: 0,
//     max: 5,
//     default: 0,
//   },
//   cost: {
//     type: Number,
//     required: true,
//     default: 0,
//   },
//   reviews: [],
// });

// const TourModel = mongoose.model("Tour", tourSchema);

// module.exports = TourModel;

/* *********************** */
/* v-2 */

const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const tourSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    default: null,
  },
  location: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  cheapPriceFrom: {
    type: Number,
    default: 0,
  },
  durationDays: {
    type: Number,
    default: 0,
  },
  tourType: {
    type: String,
    enum: ["air", "bus", "train"],
    default: "air",
  },
  overview: {
    type: String,
    required: true,
  },
  ratings: {
    type: Number,
    min: 0,
    max: 5,
    default: 0,
  },
  cost: {
    type: Number,
    required: true,
    default: 0,
  },
  category: {
    type: String,
    required: true,
  },
  tourCount: {
    type: Number,
    required: true,
    default: 0,
  },
  features: {
    pickNdrop: {
      type: Boolean,
      default: false,
    },
    mealPerDay: {
      type: Number,
      default: 0,
    },
    cruiseDinner: {
      type: Boolean,
      default: false,
    },
    musicEvent: {
      type: Boolean,
      default: false,
    },
    visitPlacesCountInTheCity: {
      type: Number,
      default: 0,
    },
    visitPlacesCountInTheCityWithGroup: {
      type: Boolean,
      default: false,
    },
    additionalServices: {
      type: Boolean,
      default: false,
    },
    insurance: {
      type: Boolean,
      default: false,
    },
    foodNDrink: {
      type: Boolean,
      default: false,
    },
    freeTicket: {
      type: Boolean,
      default: false,
    },
  },
  tourPlan: {
    day1: {
      type: String,
      default: "",
    },
    day2: {
      type: String,
      default: "",
    },
    day3: {
      type: String,
      default: "",
    },
    day4: {
      type: String,
      default: "",
    },
    day5: {
      type: String,
      default: "",
    },
  },
  seo: {
    keywords: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      default: "",
    },
  },
  maxGuest: {
    type: Number,
    default: 0,
  },
  minAge: {
    type: Number,
    default: 0,
  },
  reviews: [],
});

const TourModel = mongoose.model("Tour", tourSchema);

module.exports = TourModel;
