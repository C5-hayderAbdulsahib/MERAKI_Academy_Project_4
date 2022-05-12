//require the wanted model from the models folder
const jobsModel = require("../models/jobs");

// this function will create a new job post
const createNewJobPost = async (req, res) => {
  try {
    const { title, description, type, salary_min, salary_max, currency } =
      req.body;

    console.log(req.token.userId);
    const newJobPost = new jobsModel({
      title, //this is the same as title: title
      description,
      company_name: req.token.company_name, //we will take it from the token object that we add it to the req inside the authentication middleware
      type,
      country: req.token.country,
      salary_min, //this is the same as salary_min: salary_min
      salary_max,
      currency,
      user_id: req.token.userId,
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
