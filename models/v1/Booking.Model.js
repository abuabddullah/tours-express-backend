const mongoose = require('mongoose');

const BookingSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    contactNumber: {
        type: String,
        required: true,
    },
    nationality: {
        type: String,
        required: true,
    },
    passportNumber: {
        type: String,
        required: false,
    },
    travelDetails: {
        tourPackageName: {
            type: String,
            required: false,
        },
        departureDate: {
            type: Date,
            required: true,
        },
        returnDate: {
            type: Date,
            required: true,
        },
        numberOfAdults: {
            type: Number,
            required: true,
        },
        numberOfChildren: {
            type: Number,
            required: false, // Optional field
        },
    },
    accommodationPreferences: {
        hotelType: {
            type: String,
            required: false,
        },
        roomConfiguration: {
            type: String,
            required: false,
        },
        specialRequests: {
            type: String,
            required: false,
        },
    },
    transportationPreferences: {
        flightPreference: {
            type: String,
            required: false,
        },
        airportTransfers: {
            type: Boolean,
            default: false,
        },
        specialTransportationRequests: {
            type: String,
            required: false,
        },
    },
    emergencyContactInformation: {
        name: {
            type: String,
            required: true,
        },
        relationship: {
            type: String,
            required: true,
        },
        contactNumber: {
            type: String,
            required: true,
        },
    },
    paymentInformation: {
        paymentMethod: {
            type: String,
            required: true,
        },
        creditCardDetails: {
            type: String,
            required: false,
        },
        billingAddress: {
            type: String,
            required: false,
        },
    },
    additionalComments: {
        specificDietary: {
            type: String,
            required: false,
        },
        specialRequests: {
            type: String,
            required: false,
        },
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
});

module.exports = mongoose.model('Booking', BookingSchema);
