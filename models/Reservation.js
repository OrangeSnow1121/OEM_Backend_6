
const mongoose = require("mongoose");

const reservationSchema = new mongoose.Schema({
  site: String,
  date: String,
  timeSlot: String,
  note: String,
  username: String
});

module.exports = mongoose.model("Reservation", reservationSchema);
