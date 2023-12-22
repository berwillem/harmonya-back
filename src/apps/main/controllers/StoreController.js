const Store = require("../models/Store");
const Magasin = require("../models/Magasin");

// CREATE - Create a new store
exports.createStore = async (req, res) => {
  try {
    const ownerId = req.body.owner;

    if (!ownerId) {
      return res.status(400).json({ error: "Owner ID is required" });
    }

    const newStore = new Store(req.body);
    const savedStore = await newStore.save();

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
    res.status(200).json({ message: "Store deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
