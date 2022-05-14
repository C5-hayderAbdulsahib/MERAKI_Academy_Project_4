//require the wanted model from the models folder
const jobsModel = require("../models/jobs");
const categoriesModel = require("../models/categories");

// this function will create a new job post
const createNewJobPost = async (req, res) => {
  try {
    //the variable names has to be the same as the names in postman or the destructuring will not work
    const {
      title,
      description,
      company_name,
      type,
      salary_min,
      salary_max,
      currency,
    } = req.body;

    //getting the query parameter from the endpoint
    const categoryId = req.params.id;

    //and then we will check if the category exist
    await categoriesModel.findById(categoryId);

    //creating the new Job Post object
    //the key names inside the object model has to be the same names of the Fields in the DB or an error will occur
    const newJobPost = new jobsModel({
      title, //this is the same as title: title
      description,
      company_name,
      type,
      country: req.token.country,
      salary_min, //this is the same as salary_min: salary_min
      salary_max,
      currency,
      user_id: req.token.userId,
      category_id: categoryId, //we take the category id from the params
    });

    await newJobPost.save();

    res.status(201).json({
      success: true,
      message: "Job Post Created",
      job: newJobPost,
    });
  } catch (err) {
    //if the user enter a wrong category id then execute the if part
    //we actually don't need this part because in a real application the user will not enter an id it will be handled by the frontend developer and he will get the id from the backed so there is no way to enter a wrong id but i added this part to problem i might face in the future
    if (err.message.includes("Cast to ObjectId failed for value")) {
      res
        .status(404)
        .json({ success: false, message: "The Category Is Not Found" });

      //only if there is a server error then execute this part
    } else {
      res.status(500).json({
        success: false,
        message: "Server Error",
        err: err.message,
      });
    }
  }
};

// this function return all jobs
const getAllJobs = async (req, res) => {
  try {
    const allJobs = await jobsModel.find({});

    //we add this condition to see if there was any created jobs or not
    if (allJobs.length === 0) {
      return res.status(200).json({ success: false, message: "No Jobs Yet" });
    }

    res.status(200).json({
      success: true,
      message: "All The Jobs",
      jobs: allJobs,
    });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Server Error", err: err.message });
  }
};

// this function return job with the same id
const getJobById = async (req, res) => {
  try {
    //getting the id from the parameter
    const id = req.params.id;

    const jobById = await jobsModel.findById(id); //if we want to find something from the model using id we should use findById

    res.status(200).json({
      success: true,
      message: "The Job For The Specified Id",
      job: jobById,
    });

    //if we want to check the error part then change the id of the query to something notfound in the article model
  } catch (err) {
    //if the user enter a wrong job id then execute the if part
    //we actually don't need this part because in a real application the user will not enter an id it will be handled by the frontend developer and he will get the id from the backed so there is no way to enter a wrong id but i added this part to problem i might face in the future
    if (err.message.includes("Cast to ObjectId failed for value")) {
      res.status(404).json({ success: false, message: "The Job Is Not Found" });

      //only if there is a server error then execute this part
    } else {
      res.status(500).json({
        success: false,
        message: "Server Error",
        err: err.message,
      });
    }
  }
};

module.exports = { createNewJobPost, getAllJobs, getJobById };
