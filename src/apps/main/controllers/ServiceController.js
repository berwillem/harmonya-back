const Service = require("../models/Service");
const Magasin = require("../models/Magasin");
const { arrayify } = require("../../../helpers/utilities");

// Create a new service
exports.createService = async (req, res) => {
  try {
    const { Name, prix, time, details, category, cible, souscategory, color } =
      req.body;
    const { magasinId } = req.params;
    const images = [...arrayify(req.body.images), ...arrayify(req.images)];
    const newService = new Service({
      Name,
      prix,
      time,
      details,
      cible,
      magasin: magasinId,
      category,
      souscategory,
      images: images,
      color, // Add the color field
    });

    const savedService = await newService.save();

    await Magasin.findByIdAndUpdate(magasinId, {
      $push: { services: savedService._id },
    });

    res.status(201).json(savedService);
  } catch (error) {
    console.error("Error creating service:", error);
    res
      .status(500)
      .json({ error: "An error occurred while creating the service." });
  }
};

// Get all services
exports.getAllServices = async (req, res) => {
  try {
    const {
      page = 1,
      pageSize = 12,
      wilaya,
      gender,
      search,
      minPrice,
      maxPrice,
    } = req.query;

    const matchStage = {};

    if (search) {
      matchStage.Name = { $regex: search, $options: "i" };
    }

    if (wilaya) {
      matchStage["magasinDetails.wilaya"] = { $in: [wilaya] };
    }
    if (gender) {
      matchStage.cible = gender;
    }

    if (minPrice) {
      matchStage.prix = {};
      matchStage.prix.$gte = parseInt(minPrice);
    }

    if (maxPrice) {
      matchStage.prix = {};
      matchStage.prix.$lte = parseInt(maxPrice);
    }

    const aggregationPipeline = [
      {
        $lookup: {
          from: "magasins",
          localField: "magasin",
          foreignField: "_id",
          as: "magasinDetails",
        },
      },

      {
        $match: matchStage,
      },

      {
        $sort: { score: -1 }, // Adjust this sort if needed
      },
      {
        $skip: (page - 1) * pageSize,
      },
      {
        $limit: pageSize,
      },
      {
        $project: { magasinDetails: 0 },
      },
    ];

    const totalCountPipeline = [
      ...aggregationPipeline.slice(0, -2),
      { $count: "totalCount" },
    ];

    const [services, totalCountResult] = await Promise.all([
      Service.aggregate(aggregationPipeline),
      Service.aggregate(totalCountPipeline),
    ]);

    const totalCount =
      totalCountResult.length > 0 ? totalCountResult[0].totalCount : 0;
    const totalPages = Math.ceil(totalCount / pageSize);

    // const pageSize = req.query.pageSize || 12;
    // const totalCount = await Service.countDocuments();
    // const totalPages = Math.ceil(totalCount / pageSize);
    // const services = await Service.find({})
    // .skip((page - 1) * pageSize)
    // .limit(pageSize)
    // .sort({ score: -1 });
    res.status(200).json({ services, totalPages });
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while fetching services." });
  }
};

// Get a single service by ID
exports.getServiceById = async (req, res) => {
  const { id } = req.params;
  try {
    const service = await Service.findById(id);
    if (!service) {
      return res.status(404).json({ error: "Service not found." });
    }
    res.status(200).json(service);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while fetching the service." });
  }
};

exports.updateServiceById = async (req, res) => {
  const { serviceId } = req.params;
  const { Name, prix, time, details, category, cible, souscategory, color } =
    req.body; // Include color
  const images = [...arrayify(req.body.images), ...arrayify(req.images)];

  try {
    const updatedService = await Service.findByIdAndUpdate(
      serviceId,
      {
        Name,
        prix,
        time,
        details,
        category,
        cible,
        souscategory,
        images,
        color,
      }, // Include color
      { new: true }
    );
    if (!updatedService) {
      return res.status(404).json({ error: "Service not found." });
    }
    res.status(200).json(updatedService);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while updating the service." });
  }
};

// Delete a service by ID
exports.deleteServiceById = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedService = await Service.findByIdAndRemove(id);
    if (!deletedService) {
      return res.status(404).json({ error: "Service not found." });
    }
    res.status(204).end();
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while deleting the service." });
  }
};

exports.getServicesByCategory = async (req, res) => {
  const { id } = req.params;
  try {
    const services = await Service.find({ category: id });
    return res.status(200).json({ services });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "An error occurred while retrieving services" });
  }
};

// Get services by subcategory ID
exports.getServicesBySubCategory = async (req, res) => {
  const { souscategoryId } = req.params;
  try {
    const services = await Service.find({ souscategory: souscategoryId })
      .populate("souscategory")
      .populate("magasin");

    if (!services || services.length === 0) {
      return res
        .status(404)
        .json({ error: "No services found for this subcategory." });
    }

    res.status(200).json({ services });
  } catch (error) {
    console.error("Error retrieving services by subcategory:", error);
    res
      .status(500)
      .json({ error: "An error occurred while retrieving services." });
  }
};
