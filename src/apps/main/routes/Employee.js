const express = require("express");
const router = express.Router();
const {
  createEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
  getEmployeeAgenda,
} = require("../controllers/EmployeeController");

// Create a new employee
router.post("/", createEmployee);

// Get all employees
router.get("/", getAllEmployees);

// Get a specific employee by ID
router.get("/:id", getEmployeeById);

// Update an employee by ID
router.put("/:id", updateEmployee);

// Delete an employee by ID
router.delete("/:id", deleteEmployee);

router.get("/agenda/:id", getEmployeeAgenda)

module.exports = router;
