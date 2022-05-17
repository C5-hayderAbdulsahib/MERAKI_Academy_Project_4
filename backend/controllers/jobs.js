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

    //getting the params from the endpoint
    const categoryId = req.params.id;

    //and then we will check if the wanted object exist
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

    //then save the new Object to the database
    await newJobPost.save();

    res.status(201).json({
      success: true,
      message: "Job Post Created",
      job: newJobPost,
    });
  } catch (err) {
    //if the user enter a wrong id format then execute the if part
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
    const allJobs = await jobsModel.find({}).populate("category_id"); //when using populate first we need to specify the column or the property that we want to change the id and populate the data for, and the second parameter is for the columns or properties that we want to only show if we put the firstName alone then the firstName and id will also appear and if we want to remove the _id then we put (-) before it if we put (-) before any column it will make an exclude for it and if we put -_id alone then it will bring all the properties except the -_id property

    //other way to use populate
    // .populate({ path: "author", select: "firstName -_id" });

    //we add this condition to see if there was any created objects or the Schema is empty
    if (allJobs.length === 0) {
      return res
        .status(200)
        .json({ success: false, message: "No Jobs Have Been Created Yet" });
    }

    res.status(200).json({
      success: true,
      message: "All The Jobs",
      jobs: allJobs,
    });
  } catch (err) {
    //only if there is a server error then execute the catch statement
    res
      .status(500)
      .json({ success: false, message: "Server Error", err: err.message });
  }
};

// this function return job with the same id
const getJobById = async (req, res) => {
  try {
    //getting the params from the endpoint
    const id = req.params.id;

    const jobById = await jobsModel
      .findById(id) //if we want to find something from the model using id we should use findById

      .populate("category_id"); //when using populate first we need to specify the column or the property that we want to change the id and populate the data for, and the second parameter is for the columns or properties that we want to only show if we put the firstName alone then the firstName and id will also appear and if we want to remove the _id then we put (-) before it if we put (-) before any column it will make an exclude for it and if we put -_id alone then it will bring all the properties except the -_id property

    //other way to use populate
    // .populate({ path: "author", select: "firstName -_id" });

    //if we want to check the if statement then we view an object using its id then we delete that object then we come by and search using that id of the deleted object
    if (!jobById) {
      return res.status(404).json({
        success: false,
        message: "The Job Is Not Found",
      });
    }

    res.status(200).json({
      success: true,
      message: "The Job For The Specified Id",
      job: jobById,
    });
  } catch (err) {
    //if the user enter a wrong id format then execute the if part
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

// this function return all the jobs (that the user created) for the user with the company role
const getAllJobsForCompany = async (req, res) => {
  try {
    //getting the params from the endpoint
    const userId = req.token.userId;
    console.log(userId);

    const jobsByCreator = await jobsModel.find({ user_id: userId });

    //if the user company having
    if (!jobsByCreator) {
      return res.status(404).json({
        success: false,
        message: "You Need To Create a Job Post First",
      });
    }

    res.status(200).json({
      success: true,
      message: "All The Jobs For This Company",
      jobs: jobsByCreator,
    });
  } catch (err) {
    //only if there is a server error then execute this part
    res.status(500).json({
      success: false,
      message: "Server Error",
      err: err.message,
    });
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
  } catch (err) {
    //only if there is a server error then execute the catch statement
    res.status(500).json({
      success: false,
      message: "Server Error",
      err: err.message,
    });
  }
};

// this function will update a specific job
const updateJobById = async (req, res) => {
  try {
    //getting the params from the endpoint
    const jobId = req.params.id;

    //since we are only want to update a single object then we use findByIdAndUpdate or we can also use updateOne, findOneAndUpdate but if we used update then it is still going to work fine

    //findByIdAndUpdate or findOneAndUpdate are special because they update the wanted data and also return the wanted data, unlike update or updateOne were they don't return the wanted data but they return a status of the updated
    //we used the findByIdAndUpdate because this way we only need only one helper mongoose function instead of having two one to check if the object exist and another to update it
    const updatedJob = await jobsModel.findByIdAndUpdate(
      jobId,
      req.body,
      { new: true } //the reason that we are using this is because without it, it will return the object before updating it and that is not what we want
    );

    //if we want to check the if statement then we view an object using its id then we delete that object then we come by and search using that id of the deleted object
    if (!updatedJob) {
      res.status(404).json({ success: false, message: "The Job Is Not Found" });
    } else {
      res.status(201).json({
        success: true,
        message: "Job updated",
        job: updatedJob,
      });
    }
  } catch (err) {
    //if the user enter a wrong id format then execute the if part
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

// this function will delete a specific job depending on the id
const deleteJobById = async (req, res) => {
  try {
    //getting the params from the endpoint
    const jobId = req.params.id;

    //we used the findByIdAndDelete because this way we only need only one helper mongoose function instead of having two one to check if the object exist and another to delete it
    const foundJob = await jobsModel.findByIdAndDelete({ _id: jobId });

    //if we want to check the if statement then we view an object using its id then we delete that object then we come by and search using that id of the deleted object
    if (!foundJob) {
      res.status(404).json({
        success: false,
        message: "The Job Is Not Found",
      });
    } else {
      res.status(200).json({
        success: true,
        message: "Job deleted",
      });
    }
  } catch (err) {
    //if the user enter a wrong id format then execute the if part
    //we actually don't need this part because in a real application the user will not enter an id it will be handled by the frontend developer and he will get the id from the backed so there is no way to enter a wrong id but i added this part to problem i might face in the future
    if (err.message.includes("Cast to ObjectId failed for value")) {
      res.status(404).json({
        success: false,
        message: "The Job Is Not Found",
      });
    } else {
      //this part will only be executed if there is a server error
      res
        .status(500)
        .json({ success: false, message: "Server Error", err: err.message });
    }
  }
};

// this function will add the specified job post to the user Favorites
const addJobPostToFavorites = async (req, res) => {
  try {
    //getting the params from the endpoint
    const jobId = req.params.id;

    const userId = req.token.userId; //we will get the user id from the token

    //since we are only want to update a single object then we use findByIdAndUpdate or we can also use updateOne, findOneAndUpdate but if we used update then it is still going to work fine

    //findByIdAndUpdate or findOneAndUpdate are special because they update the wanted data and also return the wanted data, unlike update or updateOne were they don't return the wanted data but they return a status of the updated
    //we used the findByIdAndUpdate because this way we only need only one helper mongoose function instead of having two one to check if the object exist and another to update it
    const addToFavorites = await jobsModel
      .findByIdAndUpdate(
        jobId,
        { $push: { inFavorites: userId } }, //we use $push to push an element to the array
        { new: true } //the reason that we are using this is because without it, it will return the object before updating it and that is not what we want
      )
      .populate("category_id"); //when using populate first we need to specify the column or the property that we want to change the id and populate the data for, and the second parameter is for the columns or properties that we want to only show if we put the firstName alone then the firstName and id will also appear and if we want to remove the _id then we put (-) before it if we put (-) before any column it will make an exclude for it and if we put -_id alone then it will bring all the properties except the -_id property

    //if we want to check the if statement then we view an object using its id then we delete that object then we come by and search using that id of the deleted object
    if (!addToFavorites) {
      return res.status(404).json({
        success: false,
        message: "The Job Is Not Found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Job Was Added To Favorites",
      job: addToFavorites,
    });
  } catch (err) {
    //if the user enter a wrong id format then execute the if part
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

// this function will remove the specified job post from the user Favorites
const removeJobPostFromFavorites = async (req, res) => {
  try {
    //getting the params from the endpoint
    const jobId = req.params.id;

    const userId = req.token.userId; //we will get the user id from the token

    //since we are only want to update a single object then we use findByIdAndUpdate or we can also use updateOne, findOneAndUpdate but if we used update then it is still going to work fine

    //findByIdAndUpdate or findOneAndUpdate are special because they update the wanted data and also return the wanted data, unlike update or updateOne were they don't return the wanted data but they return a status of the updated
    //we used the findByIdAndUpdate because this way we only need only one helper mongoose function instead of having two one to check if the object exist and another to update it
    const jobAfterRemovingFavorites = await jobsModel
      .findByIdAndUpdate(
        jobId,
        { $pull: { inFavorites: userId } }, //we use $pull to remove an element from the array,
        { new: true } //the reason that we are using this is because without it, it will return the object before updating it and that is not what we want
      )
      .populate("category_id"); //when using populate first we need to specify the column or the property that we want to change the id and populate the data for, and the second parameter is for the columns or properties that we want to only show if we put the firstName alone then the firstName and id will also appear and if we want to remove the _id then we put (-) before it if we put (-) before any column it will make an exclude for it and if we put -_id alone then it will bring all the properties except the -_id property

    //if we want to check the if statement then we view an object using its id then we delete that object then we come by and search using that id of the deleted object
    if (!jobAfterRemovingFavorites) {
      return res.status(404).json({
        success: false,
        message: "The Job Is Not Found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Job Was Removed From Favorites",
      job: jobAfterRemovingFavorites,
    });
  } catch (err) {
    //if the user enter a wrong id format then execute the if part
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

// this function return all favorites jobs for the current user
const getFavoritesJobs = async (req, res) => {
  try {
    const userId = req.token.userId;

    const favoritesJob = [];

    const allJobs = await jobsModel.find({});

    //we add this condition to see if there was any created objects or the Schema is empty
    if (allJobs.length === 0) {
      return res.status(200).json({
        success: false,
        message: "No Jobs Posts Have Been Created Yet",
      });
    }

    allJobs.forEach((element) => {
      if (element.inFavorites.includes(userId)) {
        favoritesJob.push(element);
      }
    });

    if (favoritesJob.length === 0) {
      return res.status(200).json({
        success: true,
        message: "You Need To Save A Job First",
      });
    }

    res.status(200).json({
      success: true,
      message: "All The Favorite Jobs For This User",
      jobs: favoritesJob,
    });
  } catch (err) {
    //only if there is a server error then execute the catch statement
    res
      .status(500)
      .json({ success: false, message: "Server Error", err: err.message });
  }
};

module.exports = {
  createNewJobPost,
  getAllJobs,
  getJobById,
  getJobsByCountry,
  updateJobById,
  deleteJobById,
  getAllJobsForCompany,
  addJobPostToFavorites,
  removeJobPostFromFavorites,
  getFavoritesJobs,
};
