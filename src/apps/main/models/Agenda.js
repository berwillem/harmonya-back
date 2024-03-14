const mongoose = require("mongoose");

const agendaSchema = new mongoose.Schema({
  agenda:  [],
  unit: {
    type:Number,
    default:60,
  },
  startDate: {
    type:Date,
    default: new Date(new Date().setHours(0, 0, 0, 0)),
  }
});

const Agenda = mongoose.model("Agenda", agendaSchema);

module.exports = Agenda;
