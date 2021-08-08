const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const itemSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    default: "Indonesia",
  },
  isPopular: {
    type: Boolean,
    default: false,
  },
  unit: {
    type: String,
    default: 'night',
  },
  sumBooking: {
    type: Number,
    default: 0,
  },
  description: {
    type: String,
    required: true,
  },
  categoryId: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
  },
  imageId: [{
    type: Schema.Types.ObjectId,
    ref: 'Image',
  }],
  featureId: [{
    type: Schema.Types.ObjectId,
    ref: 'Feature',
  }],
  activityId: [{
    type: Schema.Types.ObjectId,
    ref: 'Activity',
  }],
});

module.exports = mongoose.model("Item", itemSchema);
