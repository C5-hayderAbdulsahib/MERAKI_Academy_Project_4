//require the wanted model from the models folder
const jobCandidatesModel = require("../models/jobCandidates");
const jobsModel = require("../models/jobs");

//this is a function to create or send a job application form
const sendNewJobApplicationForm = async (req, res) => {
  try {
    //the variable names has to be the same as the names in postman or the destructuring will not work
    const { preferred_email, subject, body_description, name } = req.body;

    //getting the params from the endpoint
    const jobId = req.params.id;

    const wantedJob = await jobsModel.findById(jobId); //the reason that we made the finding is to see if there is a job in the database and if there is not then stop the execution of the code and do not create a new job application

    //we add this condition to see if there is a job with the specified id and if there is not then stop the execution of the function
    if (!wantedJob) {
      return res
        .status(404)
        .json({ success: false, message: "The Job Is Not Found" });
    }

    //creating the new Job Application object
    //the key names inside the object model has to be the same names of the Fields in the DB or an error will occur
    const newJobApplicationForm = new jobCandidatesModel({
      preferred_email, //this is the same as preferred_email: preferred_email
      name,
      subject,
      body_description,
      country: req.token.country, //we will take it from the token object that we add it to the req inside the authentication middleware
      job_id: jobId, //we take the category id from the params
    });

    //then save the new Object to the database
    const newJobApplicationObj = await newJobApplicationForm.save();

    //after that use updateOne to bring the wanted job then update the job_candidate_ids field for it
    await wantedJob.updateOne(
      { $push: { job_candidate_ids: newJobApplicationObj._id } } //we use $push to push an element to the array
    );

    res.status(201).json({
      success: true,
      message: "Job Application Form Has Been Sent",
      jobApplication: newJobApplicationForm,
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

// this function return all job candidates forms that the users applicants have send
const getAllJobApplicationsForms = async (req, res) => {
  try {
    //getting the job by using the params from the endpoint
    const jobId = req.params.id;

    const allJobApplicationsForms = await jobsModel
      .findById(jobId)
      .populate("job_candidate_ids"); //when using populate first we need to specify the column or the property that we want to change the id and populate the data for, and the second parameter is for the columns or properties that we want to only show if we put the firstName alone then the firstName and id will also appear and if we want to remove the _id then we put (-) before it if we put (-) before any column it will make an exclude for it and if we put -_id alone then it will bring all the properties except the -_id property

    //we add this condition in the case of some one try to get the data for a deleted job
    if (!allJobApplicationsForms) {
      return res //we have to use return to stop the execution of the function
        .status(404)
        .json({ success: false, message: "The Job Is Not Found" });
    }

    //this condition will check if the wanted job has no job applicants
    if (allJobApplicationsForms.job_candidate_ids.length === 0) {
      //we add the return to stop the execution of the function
      return res.status(200).json({
        success: false,
        message: "No One Have Send a Job Application Yet",
      });
    }

    res.status(200).json({
      success: true,
      message: "All The Job Applications Forms For Required Job",
      jobApplications: allJobApplicationsForms.job_candidate_ids,
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

// this function will delete a specific job application form
const deleteJobApplicationFormById = async (req, res) => {
  try {
    //getting the params from the endpoint
    const jobApplicationFormId = req.params.id;
    const jobId = req.params.jobId;

    //we used the findByIdAndDelete because this way we only need only one helper mongoose function instead of having two one to check if the object exist and another to delete it
    const foundJobApplicationForm = await jobCandidatesModel.findByIdAndDelete({
      _id: jobApplicationFormId,
    });
    // console.log(foundJobApplicationForm);

    //if we want to check the if statement then we view an object using its id then we delete that object then we come by and search using that id of the deleted object
    if (!foundJobApplicationForm) {
      return res.status(404).json({
        success: false,
        message: "The Job Application Form Is Not Found",
      });
    }

    //then we will bring the job that this for was belonging to then we will get the job application form id from the params nd then we will remove that id from the jobs array that hold the candidates array
    await jobsModel.findByIdAndUpdate(
      jobId,
      { $pull: { job_candidate_ids: jobApplicationFormId } } //we use $pull to remove an element from the array,
    );

    res.status(200).json({
      success: true,
      message: "Job Application Form deleted",
    });
  } catch (err) {
    //if the user enter a wrong id format then execute the if part
    //we actually don't need this part because in a real application the user will not enter an id it will be handled by the frontend developer and he will get the id from the backed so there is no way to enter a wrong id but i added this part to problem i might face in the future
    if (err.message.includes("Cast to ObjectId failed for value")) {
      //this condition if the id format for the job model was wrong
      if (err.message.includes('at path "_id" for model "Job"')) {
        res.status(404).json({
          success: false,
          message: "The Job Is Not Found",
        });
      }

      //this condition if the id format for the JobCandidate (job application form) model was wrong
      if (err.message.includes('at path "_id" for model "JobCandidate"')) {
        res.status(404).json({
          success: false,
          message: "The Job Application Form Is Not Found",
        });
      }
    } else {
      //this part will only be executed if there is a server error
      res
        .status(500)
        .json({ success: false, message: "Server Error", err: err.message });
    }
  }
};

module.exports = {
  getAllJobApplicationsForms,
  sendNewJobApplicationForm,
  deleteJobApplicationFormById,
};
