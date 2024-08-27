const Magasin = require("../models/Magasin");
const Service = require("../models/Service");
const { filterObject, arrayify } = require("../../../helpers/utilities");

exports.getAllMagasins = async (req, res) => {
  try {
    const { page = 1, pageSize = 12, wilaya, search } = req.query;

    const matchStage = {};
    if (wilaya) {
      // matchStage["stores.wilaya"] = wilaya;
      matchStage["wilaya"] = { $in: [wilaya] };
    }

    if (search) {
      matchStage.magasinName = { $regex: search, $options: "i" };
    }

    const aggregationPipeline = [
      { $match: matchStage },
      { $sort: { score: -1 } },
      { $skip: (page - 1) * pageSize },
      { $limit: parseInt(pageSize) },
      {
        $project: {
          name: "$magasinName",
          images: { $ifNull: ["$infos.images", null] },
          id: "$_id",
        },
      },
    ];

    const totalCountPipeline = [
      { $match: matchStage },
      { $count: "totalCount" },
    ];

    const [magasins, totalCountResult] = await Promise.all([
      Magasin.aggregate(aggregationPipeline).exec(),
      Magasin.aggregate(totalCountPipeline).exec(),
    ]);

    const totalCount =
      totalCountResult.length > 0 ? totalCountResult[0].totalCount : 0;
    const totalPages = Math.ceil(totalCount / pageSize);

    res.status(200).json({ magasins, totalPages });
  } catch (error) {
    console.error("Error fetching magasins:", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

exports.getMagasinById = async (req, res) => {
  try {
    const magasin = await Magasin.findById(req.params.id).select(
      "-password -tour -completedAuth"
    ).populate("subscriptions");
    return res.status(200).json(magasin);
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

exports.setMagasinInfo = async (req, res) => {
  const { adresse, name, desc, numero } = req.body;
  const pdp = req.body.pdp ? req.body.pdp : req.pdp[0];
  const images = [...arrayify(req.body.images), ...arrayify(req.images)];

  // const {pdp, images} = req;

  const { magasinId } = req.params;
  try {
    const infos = {
      Adresse: adresse,
      Desc: desc,
      numero,
      pdp: pdp || null,
      images: images,
    };

    await Magasin.findByIdAndUpdate(
      magasinId,
      { infos, magasinName: name, completedauth: true },
      { new: true, runValidators: true }
    );
    return res.status(201).json({ message: "Update Successful" });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ error: "An error occurred while updating the information." });
  }
};

exports.getMagasinServices = async (req, res) => {
  const { magasinId } = req.query;

  try {
    const { services } = await Magasin.findOne({ _id: magasinId });
    return res.status(201).json(await Service.find({ _id: { $in: services } }));
  } catch (error) {
    return res.status(400).json({ message: "mouchkil" });
  }
};

exports.getMagasinInfos = async (req, res) => {
  const { magasinId, userId } = req.query;
  try {
    const magasin = await Magasin.findOne({ _id: magasinId });
    if (userId === magasinId) {
      return res
        .status(201)
        .json({ ...magasin.infos, magasinName: magasin.magasinName,email: magasin.email });
    }
    if (magasin) {
      const today = new Date();
      const dayOfYear =
        (Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()) -
          Date.UTC(today.getFullYear(), 0, 0)) /
        24 /
        60 /
        60 /
        1000;
      const todayYear = today.getFullYear();
      if (userId) {
        if (!magasin.data.visits.userList.find((user) => user.user == userId)) {
          magasin.data.visits.userList.push({
            user: userId,
            lastVisit: today,
            visits: 2,
          });
        } else {
          let user = magasin.data.visits.userList.find(
            (user) => user.user == userId
          );
          if (user.visits !== 0) {
            user.visits = user.visits - 1;
          } else {
            if (today - user.lastVisit > 8 * 60 * 60 * 1000) {
              user.visits = 2;
              user.lastVisit = today;
            }
            await magasin.save();
            return res
              .status(201)
              .json({ ...magasin.infos, magasinName: magasin.magasinName });
          }
        }
        const foundYear = magasin.data.visits.auth.find(
          (item) => item.year === todayYear
        );
        foundYear.days[dayOfYear] += 1;
        // magasin.data.visits.auth++;
        console.log(magasin.data.visits);

        magasin.markModified("data.visits");
      }
      const foundYear = magasin.data.visits.noAuth.find(
        (item) => item.year === todayYear
      );
      foundYear.days[dayOfYear] += 1;
      await magasin.save();
    } else {
      return res.status(404).json({ message: "Magasin Not Found" });
    }
    return res
      .status(201)
      .json({ ...magasin.infos, magasinName: magasin.magasinName,email: magasin.email  });
  } catch (error) {
    // console.log(error)
    return res.status(400).json({ message: "mouchkil" });
  }
};

exports.getMagasinsByCategory = async (req, res) => {
  const { id } = req.params;

  try {
    const magasins = await Magasin.find({ category: id });
    return res
      .status(201)
      .json(
        magasins.map((magasin) =>
          filterObject(magasin, ["magasinName", "services", "stores"])
        )
      );
  } catch (error) {
    return res.status(400).json({ message: "mouchkil" });
  }
};

exports.getMagasinStores = async (req, res) => {
  const { id } = req.params;

  try {
    const magasin = await Magasin.findById(id)
      .select("stores")
      .populate("stores");
    if (!magasin) {
      return res.status(400).json({ message: "Magasin not found." });
    }
    return res.status(200).json(magasin.stores);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Interal Server Error" });
  }
};
exports.deleteMagasin = async (req, res) => {
  const { magasinid } = req.params;

  try {
    const magasin = await Magasin.findById(magasinid);
    if (!magasin) {
      return res.status(404).json({ message: "Magasin not found." });
    }
    await Magasin.findByIdAndDelete(magasinid);
    return res.status(200).json({ message: "Magasin deleted successfully." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
exports.updateMagasinTour = async (req, res) => {
  const { magasinid } = req.params;
  try {
    const magasin = await Magasin.findById(magasinid);
    if (!magasin) {
      return res.status(404).json({ message: "Magasin not found." });
    }
    magasin.tour = true;
    await magasin.save();
    return res
      .status(200)
      .json({ message: "Magasin tour updated successfully." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.updateMagasinInfos = async (req, res) => {
  const { magasinid } = req.params;
  const { adresse, name, desc, numero } = req.body;
  const { pdp, images } = req;

  try {
    const magasin = await Magasin.findByIdUpdate(
      magasinid,
      {
        "infos.Adresse": adresse,
        "infos.Desc": desc,
        "infos.numero": numero,
        "infos.pdp": pdp,
        "infos.images": images,
        magasinName: name,
      },
      {
        new: true,
      }
    );
    return res.status(200).json({ magasin });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
exports.countMagasins = async (req, res) => {
  try {
    const magasinCount = await Magasin.countDocuments();
    res.json({ count: magasinCount });
  } catch (err) {
    console.error("Error counting magasins:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
