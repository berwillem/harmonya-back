const User = require("../models/User");
const Store = require("../models/Store");
const Service = require("../models/Service");
const BookingRequest = require("../models/BookingRequest")

exports.CreateBookingRequest = async (req, res) => {
  const {employee, date, client, store, service} = req.body;
  //TODO: Change date implementation once agenda is properly implemented
  try {
    const user = await User.findById(client);
    if(!user){
      return res.status(404).json({message: "User not found"});
    }
    const storeObject = await Store.findById(store);
    if(!storeObject){
      return res.status(404).json({message: "Store not found"});
    }
    const serviceObject = await Service.findById(service);
    if(!serviceObject){
      return res.status(404).json({message: "Service not found"});
    }

    //TODO: add employee check once employee is implemented properly

    const newRequest = new BookingRequest(req.body)
    const savedRequest = newRequest.save()
    return res.status(201).json(savedRequest)
    

  }catch(err){
    console.error(err)
    return res.status(500).json({message: "Internal server error."})
  }
}