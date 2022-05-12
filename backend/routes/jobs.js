const express = require("express");

//require controllers function from the controller folder
const { createNewJobPost } = require("../controllers/jobs");

const { sendNewJobApplicationForm } = require("../controllers/jobCandidates");

// create router, insatiate router object
const jobsRouter = express.Router();

// all endpoints for this router that came from the controller
jobsRouter.post("/", createNewJobPost);

jobsRouter.post("/:id/candidates", sendNewJobApplicationForm);

module.exports = jobsRouter;
