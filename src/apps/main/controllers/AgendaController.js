const Agenda = require("../models/Agenda");

exports.createAgendaAPI = async (req, res) => {
  try {
    console.log(req.body.agenda)
    const newagenda = new Agenda(req.body);
    const savedAgenda = await newagenda.save();
    return res.status(201).json(savedAgenda)
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.createAgenda = async (agendaMatrix) => {
  try {
    const agenda = new Agenda({ agenda: agendaMatrix });
    savedAgenda = await agenda.save();
    return savedAgenda;
  } catch (err) {
    console.error(err);
    return false;
  }
};

exports.deleteAgenda = async (req, res) => {
  try {
    const deletedAgenda = await Agenda.findByIdAndDelete(req.params.id);
    if (!deletedAgenda) {
      return res.status(404).json({ message: "Agenda not found" });
    }
    return res.status(200).json({ message: "Agenda deleted successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.updateAgenda = async (req, res) => {
  try {
    const updatedAgenda = await Agenda.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedAgenda) {
      return res.status(404).json({ message: "Agenda not found" });
    }
    return res.status(200).json(updatedAgenda);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.getAllAgendas = async (req, res) => {
  try {
    const agendas = await Agenda.find();
    return res.status(200).json(agendas);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.getAgendaById = async (req, res) => {
  try {
    const agenda = await Agenda.findById(req.params.id);
    if (!agenda) {
      return res.status(404).json({ message: "Agenda not found" });
    }
    return res.status(200).json(agenda);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.combineAgenda = (agendas) => {
  const combineDay = (day1, day2) => {
    if (day1 === undefined) {
      return day2;
    }
    if (day2 === undefined) {
      return day1;
    }
    let result = [0, []];

    const diffstart = day1[0] - day2[0];
    if (diffstart > 0) {
      day1[1] = [...Array(diffstart).fill(0), ...day1[1]];
    } else if (diffstart < 0) {
      day2[1] = [...Array(-diffstart).fill(0), ...day2[1]];
    }

    result[0] = Math.min(day1[0], day2[0]);
    result[1] = Array(Math.max(day1[1].length, day2[1].length)).fill(0);
    result[1] = result[1].map((elem, index) =>
      day1[1][index] || day2[1][index] ? 1 : 0
    );
    return result;
  };

  let result = Array(Math.max(...agendas.map((agenda) => agenda.length))).fill(
    undefined
  );
  result = agendas.reduce((accumulator, nextagenda) => {
    return accumulator.map((elem, index) => {
      return combineDay(accumulator[index], nextagenda[index]);
    });
  }, result);
  // result = result.map((elem, index)=>{
  //   return combineDay(agenda1[index],agenda2[index])

  // })

  return result;
};


