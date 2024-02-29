const Store = require("../models/Store");
const Magasin = require("../models/Magasin");
const Employee = require("../models/Employee");
const { createEmployee } = require("./employeeController");

// CREATE - Create a new store
exports.createStore = async (req, res) => {
  try {
    const ownerId = req.body.owner;

    if (!ownerId) {
      return res.status(400).json({ error: "Owner ID is required" });
    }

    // Create an array to hold employee ObjectIds
    const employeeIds = [];

    // Create employees or retrieve existing ones
    if (req.body.employees && req.body.employees.length > 0) {
      for (const employeeData of req.body.employees) {
        let employeeId;
        // Check if employee already exists
        const existingEmployee = await Employee.findOne({
          nom: employeeData.nom,
          prenom: employeeData.prenom,
          fonction: employeeData.fonction,
        });
        if (existingEmployee) {
          employeeId = existingEmployee._id;
        } else {
          // Create a new employee
          const newEmployee = new Employee(employeeData);
          const savedEmployee = await newEmployee.save();
          employeeId = savedEmployee._id;
        }
        // Add employee ObjectId to array
        employeeIds.push(employeeId);
      }
    }

    // Create a new store with employee references
    const newStoreData = { ...req.body, employees: employeeIds };
    const newStore = new Store(newStoreData);
    const savedStore = await newStore.save();

    // Add the store ID to the owner's stores array
    const magasin = await Magasin.findById(ownerId);
    if (magasin) {
      magasin.stores.push(savedStore._id);
      await magasin.save();
    } else {
      return res.status(404).json({ error: "Magasin not found" });
    }

    res.status(201).json(savedStore);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// READ - Get all stores
exports.getAllStores = async (req, res) => {
  try {
    const stores = await Store.find().populate("owner");
    res.status(200).json(stores);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// READ - Get a specific store by ID
exports.getStoreById = async (req, res) => {
  try {
    const store = await Store.findById(req.params.id).populate("owner");
    if (!store) {
      return res.status(404).json({ error: "Store not found" });
    }
    res.status(200).json(store);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// UPDATE - Update a specific store by ID
exports.updateStoreById = async (req, res) => {
  try {
    const updatedStore = await Store.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate("owner");
    if (!updatedStore) {
      return res.status(404).json({ error: "Store not found" });
    }

    // Update employees if provided
    if (req.body.employees && req.body.employees.length > 0) {
      for (const employeeData of req.body.employees) {
        await createEmployee({ body: employeeData }); // Assuming createEmployee accepts req
      }
    }

    res.status(200).json(updatedStore);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE - Delete a specific store by ID
exports.deleteStoreById = async (req, res) => {
  try {
    const deletedStore = await Store.findByIdAndDelete(req.params.id).populate(
      "owner"
    );
    if (!deletedStore) {
      return res.status(404).json({ error: "Store not found" });
    }

    if (deletedStore.employees && deletedStore.employees.length > 0) {
      for (const employeeId of deletedStore.employees) {
        await Employee.findByIdAndDelete(employeeId);
      }
    }

    res.status(200).json({ message: "Store deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
