const express = require("express");
const router = express.Router({ mergeParams: true });
const StoreController = require("../controllers/StoreController"); // Replace with the correct path to your controller file

// Store routes:

// CREATE - Create a new store
router.post("/", StoreController.createStore);

router.post("/closehour", StoreController.closeHour)
// READ - Get all stores
router.get("/", StoreController.getAllStores);

// READ - Get a specific store by ID
router.get("/:id", StoreController.getStoreById);

// UPDATE - Update a specific store by ID
router.put("/:id", StoreController.updateStoreById);

// DELETE - Delete a specific store by ID
router.delete("/:id", StoreController.deleteStoreById);

router.get("/agenda/:id", StoreController.getStoreAgenda)

router.get("/employees/:id", StoreController.getStoreEmployees)

module.exports = router;
