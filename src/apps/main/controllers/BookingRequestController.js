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
  agendaTimeAvailableLocal,
  dateToAgendaLocal,
} = require("./AgendaController");
const Magasin = require("../models/Magasin");

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
    let employeeObj;
    if (employee === "employee") {
      const employees = await Employee.find({ store }).populate("agenda");
      for (emp of employees) {
        if (
          agendaTimeAvailableLocal(
            emp.agenda,
            dateToAgendaLocal(emp.agenda, new Date(date))
          )
        ) {
          employeeObj = emp;
          req.body.employee = emp._id;
          console.log("employeeObj: ", employeeObj);
          break;
        }
      }
    } else {
      console.log("called");
      employeeObj = await Employee.findById(employee).populate("agenda");
      if (!employeeObj) {
        return res.status(404).json({ message: "Employee not found" });
      }
    }

    if (
      !agendaTimeAvailableLocal(
        employeeObj.agenda,
        dateToAgendaLocal(employeeObj.agenda, new Date(date))
      )
    ) {
      return res.status(400).json({ message: "Employee unavailable" });
    }

    await agendaToggle(
      employeeObj.agenda._id,
      dateToAgendaLocal(employeeObj.agenda, new Date(date))
    );

    await refreshAgenda(store);

    const newRequest = new BookingRequest(req.body);
    const savedRequest = await newRequest.save();
    return res.status(201).json(savedRequest);
  } catch (err) {
    // console.error(err);
    return res.status(500).json({ message: "Internal server error." });
  }
};

exports.getBookingRequestsByStore = async (req, res) => {
  const { storeId } = req.params;
  try {
    const bookingRequests = await BookingRequest.find({
      store: storeId,
    }).populate("client employee store service");
    res.json(bookingRequests);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch booking requests" });
  }
};
exports.getBookingRequestsByUser = async (req, res) => {
  const { userId } = req.params;
  try {
    const bookingRequests = await BookingRequest.find({
      client: userId,
    }).populate("client store service employee");
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
    const storeObj = await Store.findById(bookingRequest.store).select("owner");
    await Magasin.findByIdAndUpdate(storeObj.owner, {
      $inc: { "data.bookings": 1 },
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
