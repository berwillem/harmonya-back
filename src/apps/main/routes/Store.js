const express = require("express");
const router = express.Router({ mergeParams: true });
const StoreController = require("../controllers/StoreController"); // Replace with the correct path to your controller file

// Store routes:

// CREATE - Create a new store
router.post("/", StoreController.createStore);
router.post("/closehour", StoreController.closeHour)

router.get("/", StoreController.getAllStores);
router.get("/:id", StoreController.getStoreById);
router.get("/agenda/:id", StoreController.getStoreAgenda)
router.get("/employees/:id", StoreController.getStoreEmployees)

router.put("/:id", StoreController.updateStoreById);

router.delete("/:id", StoreController.deleteStoreById);

module.exports = router;
