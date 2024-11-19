const {
  agendaTimeAvailable,
  agendaTimeAvailableLocal,
  filterAgenda,
} = require("./apps/main/controllers/AgendaController");

const agenda = {
  _id: {
    $oid: "66c34aaa89796027d0b7fdbb",
  },
  agenda: [
    [8, [1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]],
    [8, [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]],
    [8, [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]],
    [8, [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]],
    [8, [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]],
    [8, [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]],
    [8, [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]],
  ],
  unit: 30,
  startDate: {
    $date: "2024-09-07T23:00:00.000Z",
  },
  __v: 0,
};

const filtered = filterAgenda(agenda, 60);
// console.log(agendaTimeAvailableLocal(agenda, { day: 0, index: 4 }, 90));
console.log(filtered.agenda[0]);
console.log(agenda.agenda[0]);
