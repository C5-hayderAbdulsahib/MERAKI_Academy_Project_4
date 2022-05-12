const express = require("express");

//require controllers function from the controller folder
const { createNewJobPost } = require("../controllers/jobs");

const {
  sendNewJobApplicationForm,
  getAllJobApplicationsForms,
} = require("../controllers/jobCandidates");

// create router, insatiate router object
const jobsRouter = express.Router();

// all endpoints for this router that came from the controller
jobsRouter.post("/", createNewJobPost);

// all endpoints from other controller than the controller of this Schema
jobsRouter.post("/:id/candidates", sendNewJobApplicationForm);

jobsRouter.get("/:id/candidates", getAllJobApplicationsForms);

module.exports = jobsRouter;
