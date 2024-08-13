const Employee = require("../models/Employee");
const { createAgenda } = require("./AgendaController");
const Store = require("../models/Store")

// Create a new employee
exports.createEmployee = async (req, res) => {
  try {
    const { nom, prenom, fonction, store } = req.body;
    const storeObj = await Store.findById(store).populate("baseAgenda")
    const agendaObject = storeObj.baseAgenda
    const agenda = await createAgenda(agendaObject)
    const employee = new Employee({ nom, prenom, fonction, store, agenda });
    await employee.save();
    return res.status(201).json(employee);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// Get all employees
exports.getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.find();
    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createEmployeeLocal = async ({ nom, prenom, fonction, store }) => {
  try {
    const storeObj = await Store.findById(store).populate({
      path:"baseAgenda",
      select:"-_id"
    })
    const agendaObject = storeObj.baseAgenda
    const agenda = await createAgenda(agendaObject)
    const employee = new Employee({ nom, prenom, fonction, store, agenda });
    await employee.save();
    return employee
  } catch (error) {
    console.error(error)
    return false
  }
};


// Get a specific employee by ID
exports.getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (employee) {
      res.json(employee);
    } else {
      res.status(404).json({ message: "Employee not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update an employee by ID
exports.updateEmployee = async (req, res) => {
  try {
    const { nom, prenom, fonction } = req.body;
    const employee = await Employee.findByIdAndUpdate(
      req.params.id,
      { nom, prenom, fonction },
      { new: true }
    );
    if (employee) {
      res.json(employee);
    } else {
      res.status(404).json({ message: "Employee not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete an employee by ID
exports.deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id);
    if (employee) {
      res.json({ message: "Employee deleted" });
    } else {
      res.status(404).json({ message: "Employee not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getEmployeeAgenda = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id).populate('agenda')
    // console.log(employee)
    return res.status(200).json(employee.agenda)

  }catch(error){
    console.error(error)
    return res.status(500).json({message:"Internal Server error"})
  }
}