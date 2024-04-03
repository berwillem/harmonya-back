const Agenda = require("../models/Agenda");
const Store = require("../models/Store");

exports.createAgendaAPI = async (req, res) => {
  try {
    // console.log(req.body.agenda);
    const newagenda = new Agenda(req.body);
    const savedAgenda = await newagenda.save();
    return res.status(201).json(savedAgenda);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.createAgenda = async ({agenda, unit, startDate}) => {
  try {
    console.log("create agenda parameter:",{agenda, unit, startDate})
    const agendaObj = new Agenda({agenda, unit, startDate});
    const savedAgenda = await agendaObj.save();
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

exports.updateAgendaAPI = async (req, res) => {
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

exports.updateAgenda = async (id, agenda) => {
  try {
    const updatedAgenda = await Agenda.findByIdAndUpdate(
      id,
      { agenda },
      { new: true }
    );
    if (!updatedAgenda) {
      return false;
    }
    return updatedAgenda;
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

  return result;
};

exports.refreshAgenda = async (storeId) => {
  try {
    const store = await Store.findById(storeId).populate({
      path: "employees",
      select: "agenda",
      populate: {
        path: "agenda",
        select: "agenda -_id",
      },
    });

    const empAgendas = store.employees.map(
      (employee) => employee.agenda.agenda
    );

    const updatedAgenda = await exports.updateAgenda(
      store.displayAgenda,
      exports.combineAgenda(empAgendas)
    );

    return updatedAgenda;
  } catch (error) {
    console.error(error);
  }
};

exports.AgendaToDate = async (agendaId, agendaTime) => {
  try {
    const agenda = await Agenda.findById(agendaId);
    const result = new Date(agenda.startDate);
    result.setDate(result.getDate() + agendaTime.day);
    const agendaDay = agenda.agenda[agendaTime.day];
    result.setHours(
      agendaDay[0] + Math.floor(agendaTime.index * (agenda.unit / 60)),
      (agendaTime.index * agenda.unit) % 60,
      0,
      0
    );
    return result;
  } catch (error) {
    console.error(error);
  }
};

exports.dateToAgenda = async (agendaId, date) => {
  try {
    // console.log(date.getHours())
    // console.log("date.getMinutes(): ", date.getMinutes())
    const agenda = await Agenda.findById(agendaId);
    const result = {
      day: 0,
      index: 0,
    };

    result.day = Math.floor(
      (date.getTime() - agenda.startDate.getTime()) / (1000 * 3600 * 24)
    );
    if (result.day < 0 || result.day > 30) {
      console.error("Date outside agenda");
      return false;
    }
    let day = agenda.agenda[result.day];
    // console.log("day[0]: ", day[0])
    let minutes = (date.getHours() - day[0]) * 60 + date.getMinutes();
    // console.log("minutes: ", minutes)
    if (minutes < 0) {
      console.error("Date before starting hours");
      return false;
    }
    result.index = Math.floor(minutes / agenda.unit);
    return result;
  } catch (error) {
    // console.log(date.getTime());
    console.error(error);
  }
};

exports.agendaTimeAvailable = async (agendaId, agendaTime) => {
  try {
    const agenda = await Agenda.findById(agendaId);
    const { day, index } = agendaTime;

    if (agenda.agenda[day][1][index]) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error(error);
  }
};

exports.agendaToggle = async (agendaId, agendaTime) => {
  // console.log("toggle function triggered");
  try {
    const agenda = await Agenda.findById(agendaId);
    const { day, index } = agendaTime;
    // console.log("agendaTime:", agendaTime);
    // console.log("agenda:", agenda.agenda[day]);
    agenda.agenda[day][1][index] = agenda.agenda[day][1][index] == 1 ? 0 : 1;
    agenda.markModified("agenda");
    // console.log("agenda:", agenda.agenda[day]);
    await agenda.save();
    return true;
  } catch (error) {
    console.error(error);
  }
};

exports.testFeature = async (req, res) => {
  try {
    const agendas = await Agenda.find({}).select("agenda startDate")
    let i = 0
    const bulkOps = agendas.map(agenda => ({
      updateOne: {
        filter: { _id: agenda._id },
        update: {
          $set: {
            startDate: new Date(agenda.startDate.setHours(24, 0, 0, 0)),
            agenda: agenda.agenda.slice(1)
          }
        }
      }
    }));
    await Agenda.bulkWrite(bulkOps);
    return res.status(200).json({message:"success"})
  } catch(error) {
    console.error("Error updating agendas")
    return res.status(500).json({message:"failed"})
  }

};
