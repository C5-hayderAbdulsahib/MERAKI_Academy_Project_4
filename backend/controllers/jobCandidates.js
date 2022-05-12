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

    console.log(jobId);

    const allJobApplicationsForms = await jobsModel
      .findById(jobId)
      .populate("job_candidate_ids"); //when using populate first we need to specify the column or the property that we want to change the id and populate the data for, and the second parameter is for the columns or properties that we want to only show if we put the firstName alone then the firstName and id will also appear and if we want to remove the _id then we put (-) before it if we put (-) before any column it will make an exclude for it and if we put -_id alone then it will bring all the properties except the -_id property

    res.status(200).json({
      success: true,
      message: `All The Job Applications Forms For Job With Id ⇾ ${jobId}`,
      jobApplications: allJobApplicationsForms.job_candidate_ids,
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

module.exports = { getAllJobApplicationsForms, sendNewJobApplicationForm };
