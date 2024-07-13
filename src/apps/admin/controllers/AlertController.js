const Alert = require("../models/Alert");

exports.addAlert = async (req, res) => {
  const timestamp = new Date();
  const { Name, UserType, Message } = req.body;

  // Validation simple des données reçues
  if (!Name || !UserType || !Message) {
    return res.status(400).json({ error: "Tous les champs (Name, UserType, message) sont requis." });
  }

  try {
    const newAlert = new Alert({
      Name,
      UserType,
      Message,
      timestamp,
    });

    const savedAlert = await newAlert.save();
    res.status(201).json(savedAlert);
  } catch (error) {
    console.error("Erreur lors de la création de l'alerte:", error);  // Affiche l'erreur dans la console
    res.status(500).json({ error: "Une erreur est survenue lors de la création de l'alerte.", details: error.message });
  }
};
