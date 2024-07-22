const Receip = require("../models/Receipt");




// Add a new Receip
exports.addReceip = async (req, res) => {
  const { services,custom} = req.body;
  const {IdMagasain}=req.params;

  try {
    const newReceip = new Receip({
        Date:  new Date(Date.now()),
        magasin: IdMagasain,
        services: services,
        custom: custom,
    });

    await newReceip.save();
    return res.status(201).json({ message: "Receip created successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to create Receip" });
  }
};




exports.getReceipsByMagasain = async (req, res) => {
    const { IdMagasain } = req.params;
    const { date, time } = req.query;

    try {

        let filter = { magasin: IdMagasain };

        if (date) {
            const startDateTime = new Date(date);
            const endDateTime = new Date(startDateTime);

            if (time) {
                const [hours, minutes] = time.split(':');
                startDateTime.setHours(hours, minutes, 0, 0);
                endDateTime.setHours(hours, minutes, 59, 999);
            } else {
                endDateTime.setDate(endDateTime.getDate() + 1);
            }

            filter.Date = {
                $gte: startDateTime,
                $lt: endDateTime
            };
        } else if (time) {
            const today = new Date();
            const startDateTime = new Date(today.setHours(time.split(':')[0], time.split(':')[1], 0, 0));
            const endDateTime = new Date(today.setHours(time.split(':')[0], time.split(':')[1], 59, 999));

            filter.Date = {
                $gte: startDateTime,
                $lt: endDateTime
            };
        }

        const Receips = await Receip.find(filter);
        return res.status(200).json(Receips);
    } catch (error) {
        console.error(error);
        return res.status(400).json({ error: error.message });
    }
};
