const mongoose = require('mongoose');

const citySchema = new mongoose.Schema({
    city: {
      type: String,
      trim: true,
      unique: true,
      default: ''
    },
    degree: {
      type: String,
      trim: true,
      default: ''
    },
    createdAt: {
      type: Date,
      default: Date.now()
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);


const City = mongoose.model('Weather', citySchema);

module.exports = City;
