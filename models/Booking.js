const mongoose = require("mongoose");
const Bank = require("./Bank");
const Item = require("./Item");
const Member = require("./Member");
const Schema = mongoose.Schema;

const bookingSchema = new Schema({
  bookingStartDate: {
    type: Date,
    required: true,
  },
  bookingEndDate: {
    type: Date,
    required: true,
  },
  invoice: {
    type: String,
    required: true,
  },
  itemId: {
    _id: {
      type: Schema.Types.ObjectId,
      ref: Item,
    },
    title: { type: String, required: true },
    price: { type: Number, required: true },
    duration: { type: Number, required: true },
  },
  total: { type: Number, required: true },
  memberId: {
    type: Schema.Types.ObjectId,
    ref: Member,
  },
  bankId: {
    type: Schema.Types.ObjectId,
    ref: Bank,
  },
  payments: {
    proofPayment: {
      type: String,
      required: true,
    },
    bankFrom: {
      type: String,
      required: true,
    },
    accountHolder: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
  },
});

module.exports = mongoose.model("Booking", bookingSchema);
