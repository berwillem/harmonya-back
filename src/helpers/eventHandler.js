const {BoostEventListeners} = require("../apps/main/controllers/BoostController");
const {BoostRequestEventListeners} = require("../apps/main/controllers/BoostRequestController");

const functionList = [BoostEventListeners, BoostRequestEventListeners];

exports.handleEventListeners = () => {
  for (const func of functionList) {
    func();
  }
};
