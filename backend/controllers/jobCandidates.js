//require the wanted model from the models folder
const jobCandidatesModel = require("../models/jobCandidates");
const jobsModel = require("../models/jobs");

//this is a function to create or send a job application form
const sendNewJobApplicationForm = async (req, res) => {
  try {
    //creating the job application form object
    const { preferred_email, subject, body_description, name } = req.body;

    //getting the job by using the params from the endpoint
    const jobId = req.params.id;

    //creating the new Job Application object
    const newJobApplicationForm = new jobCandidatesModel({
      preferred_email, //this is the same as preferred_email: preferred_email
      name,
      subject,
      body_description,
    });

    //then save the new Job Application to the database
    const newJobApplication = await newJobApplicationForm.save();

    //after that use updateOne to bring the wanted job then update the job_candidate_ids field for it
    await jobsModel.updateOne(
      { _id: jobId },
      { $push: { job_candidate_ids: newJobApplication._id } } //we use $push to push an element to the array
    );

    res.status(201).json({
      success: true,
      message: "Job Application Form Created",
      jobApplication: newJobApplicationForm,
    });
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

// this function return all job candidates forms that the users applicants have send
const getAllJobApplicationsForms = async (req, res) => {
  try {
    //getting the job by using the params from the endpoint
    const jobId = req.params.id;

    const allJobApplicationsForms = await jobCandidatesModel.find({});

    res.status(200).json({
      success: true,
      message: "All The Job Applications Forms",
      //   userId: req.token.userId, //we add the user id for the user who is trying to get the articles
      jobs: allJobApplicationsForms,
    });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Server Error", err: err.message });
  }
};

module.exports = { getAllJobApplicationsForms, sendNewJobApplicationForm };
