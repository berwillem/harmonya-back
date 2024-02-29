const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: true,
  },
  prenom: {
    type: String,
    required: true,
  },
  fonction: {
    type: String,
    required: true,
  },
});

const Employee = mongoose.model("Employee", employeeSchema);

module.exports = Employee;
