const Service = require("../models/Service");

// Create a new service
exports.createService = async (req, res) => {
  try {
    const { Name, prix, details } = req.body;
    const newService = new Service({ Name, prix, details });
    const savedService = await newService.save();
    res.status(201).json(savedService);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while creating the service." });
  }
};

// Get all services
exports.getAllServices = async (req, res) => {
  try {
    const services = await Service.find();
    res.status(200).json(services);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while fetching services." });
  }
};

// Get a single service by ID
exports.getServiceById = async (req, res) => {
  const { id } = req.params;
  try {
    const service = await Service.findById(id);
    if (!service) {
      return res.status(404).json({ error: "Service not found." });
    }
    res.status(200).json(service);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while fetching the service." });
  }
};

// Update a service by ID
exports.updateServiceById = async (req, res) => {
  const { id } = req.params;
  const { Name, prix, details } = req.body;
  try {
    const updatedService = await Service.findByIdAndUpdate(
      id,
      { Name, prix, details },
      { new: true }
    );
    if (!updatedService) {
      return res.status(404).json({ error: "Service not found." });
    }
    res.status(200).json(updatedService);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while updating the service." });
  }
};

// Delete a service by ID
exports.deleteServiceById = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedService = await Service.findByIdAndRemove(id);
    if (!deletedService) {
      return res.status(404).json({ error: "Service not found." });
    }
    res.status(204).end();
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while deleting the service." });
  }
};
