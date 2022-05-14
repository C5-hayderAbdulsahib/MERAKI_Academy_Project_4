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

// this function return job with the same country name
const getJobsByCountry = async (req, res) => {
  try {
    //getting the country name from the query
    const country = req.query.country;

    const jobByCountry = await jobsModel.find({ country: country }); //if we want to find something from the model using id we should use findById

    //we are going to make a condition to see if there is countries with the specified country, or if someone entered the wrong path
    if (jobByCountry.length === 0) {
      return res
        .status(200)
        .json({ success: false, message: "There Is No Jobs For This Country" });
    }

    res.status(200).json({
      success: true,
      message: "The Job For The Specified County",
      job: jobByCountry,
    });

    //if we want to check the error part then change the id of the query to something notfound in the article model
  } catch (err) {
    //since were are searching using the country name and not id there will be to error by the found what so ever
    res.status(500).json({
      success: false,
      message: "Server Error",
      err: err.message,
    });
  }
};

// this function return job with the same country name
const getJobsByCategory = async (req, res) => {
  try {
    //getting the country name from the query
    const category = req.query.category;

    const jobByCategory = await jobsModel.findOne({ category_id: category }); //if we want to find something from the model using id we should use findById

    //we are going to make a condition to see if there is countries with the specified country, or if someone entered the wrong path
    if (!jobByCategory) {
      return res.status(200).json({
        success: false,
        message: "There Is No Jobs For This Category",
      });
    }

    res.status(200).json({
      success: true,
      message: "The Job For The Specified Category",
      job: jobByCategory,
    });

    //if we want to check the error part then change the id of the query to something notfound in the article model
  } catch (err) {
    //if the user enter a wrong job id then execute the if part
    //we actually don't need this part because in a real application the user will not enter an id it will be handled by the frontend developer and he will get the id from the backed so there is no way to enter a wrong id but i added this part to problem i might face in the future
    if (err.message.includes("Cast to ObjectId failed for value")) {
      res.status(404).json({
        success: false,
        message: "The Category Is Not Found",
      });

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

// this function will update a specific job
const updateJobById = async (req, res) => {
  try {
    //getting the article by using the params from the endpoint
    const jobId = req.params.id;

    const jobById = await jobsModel.findById(jobId); //if we want to find something from the model using id we should use findById
    if (jobById) {
      //since we are only want to update a single article then we use findByIdAndUpdate or we can also use updateOne, findOneAndUpdate but if we used update then it is still going to work fine

      //findByIdAndUpdate or findOneAndUpdate are special because they update the wanted data and also return the wanted data, unlike update or updateOne were they don't return the wanted data but they return a status of the updated
      const updatedJob = await jobsModel.findByIdAndUpdate(
        jobId,
        req.body,
        { new: true } //the reason that we are using this is because without it, it will return the object before updating it and that is not what we want
      );

      res.status(201).json({
        success: true,
        message: "Job updated",
        job: updatedJob,
      });
      //if we want to check the else statement then we view an article using its id then we delete that article using the delete methods then we come by and search using the id of the deleted article
    } else {
      res.status(404).json({ success: false, message: "The Job Is Not Found" });
    }
  } catch (err) {
    //if the user enter a wrong job id then execute the if part
    //we actually don't need this part because in a real application the user will not enter an id it will be handled by the frontend developer and he will get the id from the backed so there is no way to enter a wrong id but i added this part to problem i might face in the future
    if (err.message.includes("Cast to ObjectId failed for value")) {
      res.status(404).json({
        success: false,
        message: "The Job Is Not Found",
      });

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

// this function will delete a specific article depending on the id
const deleteArticleById = async (req, res) => {
  try {
    //getting the article by using the params from the endpoint
    const articleId = req.params.id;

    const articleById = await articleModel.findById(articleId);

    //if there was an article with the same id then do the following
    if (articleById) {
      await articleById.deleteOne();

      //or we can solve it by another way
      // await articleModel.deleteOne({ _id: articleId });

      res.status(200).json({
        success: true,
        message: "Article deleted",
      });
    }

    //if there was no article with the same id then give a failed message
    else {
      res.status(404).json({
        success: false,
        message: `The article with id ⇾ ${articleId} is not found`,
      });
    }
  } catch (err) {
    //to test this part then change the id of the article to something that does not exist

    //we actually don't need this part because in a real application the user will not enter an id it will be handled by the frontend developer and he will get the id from the backed so there is no way to enter a wrong id but i added this part to problem i might face in the future
    if (err.message.includes("Cast to ObjectId failed for value")) {
      res.status(404).json(err.message); //or we can customize the error message
    } else {
      //this part will only be executed if there is a server error
      res
        .status(500)
        .json({ success: false, message: "Server Error", err: err.message });
    }
  }
};

module.exports = {
  createNewJobPost,
  getAllJobs,
  getJobById,
  getJobsByCountry,
  getJobsByCategory,
  updateJobById,
};
