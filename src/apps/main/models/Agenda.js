const mongoose = require("mongoose");

const agendaSchema = new mongoose.Schema({
  agenda:  []
  //   type: [[{type: Number, required: true }, [{ type: Number }]]],
  //   validate: [(val) => val.length <= 30, "{PATH} exceeds the limit of 10"],
  // },
});

const Agenda = mongoose.model("Agenda", agendaSchema);

module.exports = Agenda;
