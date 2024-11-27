const express = require("express");
const router = express.Router();
const {
  createEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
  getEmployeeAgenda,
  getEmployeeByStore,
} = require("../controllers/EmployeeController");


// Create a new employee
router.post("/", createEmployee);

// Get all employees
router.get("/", getAllEmployees);
// Get store employees
router.get("/store/:idStore", getEmployeeByStore);


// Get a specific employee by ID
router.get("/:id", getEmployeeById);

// Get a specific employee's agenda by ID
router.get("/agenda/:id", getEmployeeAgenda)

// Update an employee by ID
router.put("/:id", updateEmployee);

// Delete an employee by ID
router.delete("/:id", deleteEmployee);


module.exports = router;
