const User = require("../models/User");
const Store = require("../models/Store");
const Service = require("../models/Service");
const BookingRequest = require("../models/BookingRequest");
const Employee = require("../models/Employee");
const {
  agendaTimeAvailable,
  dateToAgenda,
  agendaToggle,
  refreshAgenda,
} = require("./AgendaController");

exports.CreateBookingRequest = async (req, res) => {
  const { employee, date, client, store, service } = req.body;
  try {
    const user = await User.findById(client);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const storeObject = await Store.findById(store);
    if (!storeObject) {
      return res.status(404).json({ message: "Store not found" });
    }
    const serviceObject = await Service.findById(service);
    if (!serviceObject) {
      return res.status(404).json({ message: "Service not found" });
    }

    let employeeObj = await Employee.findById(employee);

    if (
      !(await agendaTimeAvailable(
        employeeObj.agenda,
        await dateToAgenda(employeeObj.agenda, new Date(date))
      ))
    ) {
      return res.status(400).json({ message: "Employee unavailable" });
    }

    await agendaToggle(
      employeeObj.agenda,
      await dateToAgenda(employeeObj.agenda, new Date(date))
    );
    
    await refreshAgenda(store);
    
    const newRequest = new BookingRequest(req.body);
    const savedRequest = await newRequest.save();
    return res.status(201).json(savedRequest);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error." });
  }
};

exports.getBookingRequestsByStore = async (req, res) => {
  const { storeId } = req.params;
  try {
    const bookingRequests = await BookingRequest.find({
      store: storeId,
    }).populate("client store service");
    res.json(bookingRequests);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch booking requests" });
  }
};

exports.updateBookingRequest = async (req, res) => {
  try {
    const bookingRequest = await BookingRequest.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!bookingRequest) {
      return res.status(404).json({ error: "Booking request not found" });
    }
    res.json(bookingRequest);
  } catch (error) {
    res.status(500).json({ error: "Failed to update booking request" });
  }
};

exports.deleteBookingRequest = async (req, res) => {
  try {
    const bookingRequest = await BookingRequest.findByIdAndDelete(
      req.params.id
    );
    if (!bookingRequest) {
      return res.status(404).json({ error: "Booking request not found" });
    }
    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ error: "Failed to delete booking request" });
  }
};

exports.acceptBookingRequest = async (req, res) => {
  try {
    const { bookingId } = req.body;
    const bookingRequest = await BookingRequest.findByIdAndUpdate(bookingId, {
      $set: {
        confirmed: true,
      },
    });
    return res.status(200).json({ message: "Booking Request accepted" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server error" });
  }
};

exports.declineBookingRequest = async (req, res) => {
  try {
    const { bookingId } = req.body;
    const bookingRequest = await BookingRequest.findById(bookingId);
    const employee = await Employee.findById(bookingRequest.employee);
    await agendaToggle(
      employee,
      dateToAgenda(employee.agenda, bookingRequest.date)
    );
    await bookingRequest.deleteOne();
    return res
      .status(200)
      .json({ message: "Booking request declined successfully." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
