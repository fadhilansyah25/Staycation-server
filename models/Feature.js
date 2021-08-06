const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const featureSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  itemId: {
    type: Schema.Types.ObjectId,
    ref: 'Item',
  }
});

module.exports = mongoose.model("Feature", featureSchema);
