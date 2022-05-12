//require the wanted model from the models folder
const jobsModel = require("../models/jobs");

// this function will create a new job post
const createNewJobPost = async (req, res) => {
  try {
    const { title, description, company_name, type, country } = req.body;

    const newJobPost = new jobsModel({
      title, //this is the same as title: title
      description,
      company_name,
      type,
      country,
    });

    await newJobPost.save();

    res.status(201).json({
      success: true,
      message: "Job Post Created",
      job: newJobPost,
    });
  } catch (err) {
    //we can reach this error for example if we put an id that does not exist in the user model
    res
      .status(500)
      .json({ success: false, message: "Server Error", err: err.message });
  }
};

module.exports = { createNewJobPost };
