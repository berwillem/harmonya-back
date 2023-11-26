const trackMagasinVisit = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { ip, headers } = req;
    const uniqueVisitorId = `${ip}-${headers["user-agent"]}`;
    const magasin = await Magasin.findById(id).select("data");

    if (!magasin) {
      return res.status(404).json({ message: "Magasin not found" });
    }

    // Check if the user has already visited based on the unique identifier
    const hasVisited = magasin.data.visits.timestamps.some(
      (visit) => visit.visitorId === uniqueVisitorId
    );

    // If the user hasn't visited, update the timestamps array
    if (!hasVisited) {
      magasin.data.visits.timestamps.push({
        visitorId: uniqueVisitorId,
        timestamp: new Date(),
      });
      await magasin.save();
    }

    next();
  } catch (err) {
    console.error("Error in trackMagasinVisit middleware:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = trackMagasinVisit;
