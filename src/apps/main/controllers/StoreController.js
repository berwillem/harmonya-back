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
  filterAgenda,
} = require("./AgendaController");
const {  arrayify } = require("../../../helpers/utilities");

// CREATE - Create a new store
// CREATE - Create a new store
exports.createStore = async (req, res) => {
  try {
   

    const {  wilaya, location, storeName, owner, phone, email } = req.body;
    const images = [...arrayify(req.body.images), ...arrayify(req.images)];

    // Validate required fields
    if (!phone || !email) {
      return res.status(400).json({ error: "Phone and email are required" });
    }

    if (!owner) {
      return res.status(400).json({ error: "Owner ID is required" });
    }

    let agenda = req.body.agenda;
    let employees = req.body.employees;
    employees = JSON.parse(employees);
    // Parse agenda if it's a string
    if (typeof agenda === "string") {
      try {
        agenda = JSON.parse(agenda);
      } catch (parseError) {
        return res.status(400).json({ error: "Invalid agenda format" });
      }
    }

    // Validate agenda structure
    if (!agenda || !agenda.unit || !Array.isArray(agenda.agenda)) {
      return res.status(400).json({ error: "Agenda must have a valid unit and agenda array" });
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

    // Prepare new store data
    const newStoreData = {
      wilaya,
      storeName,
      location,
      owner,
      employees: [],
      baseAgenda: baseAgenda._id,
      displayAgenda: displayAgenda._id,
      phone,
      email,
      images,
    };

    // Create and save the new store
    const newStore = new Store(newStoreData);
    const savedStore = await newStore.save();
console.log(employees , employees.length);

    // Add employees if provided
    if (employees && employees.length > 0) {
      for (const employeeData of employees) {
        console.log(employeeData);
        
        await createEmployeeLocal({ ...employeeData, store: savedStore._id });
      }
    }

    // Add the store to the owner's magasins and update wilaya
    const magasin = await Magasin.findById(owner);
    if (!magasin) {
      return res.status(404).json({ error: "Magasin not found" });
    }

    magasin.stores.push(savedStore._id);

    if (!magasin.wilaya.includes(savedStore.wilaya)) {
      magasin.wilaya.push(savedStore.wilaya);
    }

    await magasin.save();

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
    return res
      .status(200)
      .json({ agenda: filterAgenda(storeObj.displayAgenda) });
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
