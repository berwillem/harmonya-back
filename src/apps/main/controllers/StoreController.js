const Store = require("../models/Store");
const Magasin = require("../models/Magasin");
const Employee = require("../models/Employee");
const Agenda = require("../models/Agenda");
const { createEmployee, createEmployeeLocal } = require("./EmployeeController");
const {
  combineAgenda,
  createAgenda,
  updateAgenda,
  agendaSet,
  dateToAgenda,
  refreshAgenda,
} = require("./AgendaController");

// CREATE - Create a new store
// CREATE - Create a new store
exports.createStore = async (req, res) => {
  try {
    const ownerId = req.body.owner;
    const { agenda, wilaya, location, storeName, owner, phone, email } =
      req.body;

    // Make sure phone and email are provided
    if (!phone || !email) {
      return res.status(400).json({ error: "Phone and email are required" });
    }

    const extended = {
      unit: agenda.unit,
      agenda: [
        ...agenda.agenda,
        ...agenda.agenda,
        ...agenda.agenda,
        ...agenda.agenda,
        ...agenda.agenda,
        ...agenda.agenda,
        ...agenda.agenda,
        ...agenda.agenda,
      ],
    };
    const baseAgenda = await createAgenda(extended);
    const displayAgenda = await createAgenda(extended);

    if (!ownerId) {
      return res.status(400).json({ error: "Owner ID is required" });
    }

    // Create a new store with phone and email
    const newStoreData = {
      wilaya,
      storeName,
      location,
      owner,
      employees: [],
      baseAgenda: baseAgenda._id,
      displayAgenda: displayAgenda._id,
      phone, // Add phone to the store data
      email, // Add email to the store data
    };

    const newStore = new Store(newStoreData);
    const savedStore = await newStore.save();

    if (req.body.employees && req.body.employees.length > 0) {
      for (const employeeData of req.body.employees) {
        let employeeId;

        // Create a new employee
        await createEmployeeLocal({ ...employeeData, store: savedStore._id });
      }
    }

    // Add the store ID to the owner's stores array
    const magasin = await Magasin.findById(ownerId);
    if (magasin) {
      magasin.stores.push(savedStore._id);
      await magasin.save();
    } else {
      return res.status(404).json({ error: "Magasin not found" });
    }

    // Ensure wilaya is updated
    const wilayaExists = magasin.wilaya.includes(savedStore.wilaya);
    if (!wilayaExists) {
      magasin.wilaya.push(savedStore.wilaya);
      await magasin.save();
    } else {
      return res
        .status(200)
        .json({ message: "Wilaya already exists in magasin" });
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
    const { phone, email, employees } = req.body;

    // Validate phone and email (if they are provided)
    if (phone) {
      const phoneRegex = /^[0-9\-+()]*$/; // You can modify the regex based on your phone number format
      if (!phoneRegex.test(phone)) {
        return res.status(400).json({ error: "Invalid phone number format" });
      }
    }

    if (email) {
      const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ error: "Invalid email format" });
      }
    }

    // Find the store by ID and update the fields
    const updatedStore = await Store.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate("owner");

    if (!updatedStore) {
      return res.status(404).json({ error: "Store not found" });
    }

    // Update employees if provided
    if (employees && employees.length > 0) {
      for (const employeeData of employees) {
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

exports.getStoreAgenda = async (req, res) => {
  try {
    const { id } = req.params;
    const storeObj = await Store.findById(id).populate("displayAgenda");
    if (!storeObj) {
      return res.status(400).json({ messaage: "Store Not Found" });
    }
    return res.status(200).json({ agenda: storeObj.displayAgenda });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.closeHour = async (req, res) => {
  const { employee, date, store } = req.body;

  try {
    if (employee === "employee") {
      const storeObj = await Store.findById(store).populate("employees");
      storeObj.employees.map(async (emp, index) => {
        const employeeAgenda = (await Employee.findById(emp).select("agenda"))
          .agenda;
        await agendaSet(
          employeeAgenda,
          await dateToAgenda(employeeAgenda, new Date(date)),
          0
        );
        // console.log(emp._id)
      });
      await agendaSet(
        storeObj.displayAgenda,
        await dateToAgenda(storeObj.displayAgenda, new Date(date)),
        0
      );
      return res.status(200).json({ messaage: "machya" });
    } else {
      const employeeAgenda = (
        await Employee.findById(employee).select("agenda")
      ).agenda;
      await agendaSet(
        employeeAgenda,
        await dateToAgenda(employeeAgenda, new Date(date)),
        0
      );
      await refreshAgenda(store);
      // console.log(employeeAgenda);
      return res.status(200).json(employeeAgenda);
    }
  } catch (err) {
    console.error(err);
    return res.status(500);
  }
};

exports.getStoreEmployees = async (req, res) => {
  try {
    const { id } = req.params;
    const storeObj = await Store.findById(id).populate({
      path: "employees",
      select: "-__v",
      populate: {
        path: "agenda",
      },
    });
    if (!storeObj) {
      return res.status(400).json({ message: "Store Not Found" });
    }
    return res.status(200).json(storeObj.employees);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
