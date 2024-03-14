const mongoose = require("mongoose");
const Store = require("./Store");
const { refreshAgenda } = require("../controllers/AgendaController");

const employeeSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: true,
  },
  prenom: {
    type: String,
    required: true,
  },
  fonction: {
    type: String,
    required: true,
  },
  store: {
    type:mongoose.Schema.Types.ObjectId,
    required:true,
  },
  agenda: {
    type:mongoose.Schema.Types.ObjectId,
    ref:"Agenda",
    required:true,
  }

});

employeeSchema.post('save', async (emp)=>{
  try{
    const store = await Store.findById(emp.store);
    store.employees.push(emp._id)
    await store.save()
    await refreshAgenda(emp.store)
  }catch(error){
    console.error(error)
  }
})

const Employee = mongoose.model("Employee", employeeSchema);

module.exports = Employee;
