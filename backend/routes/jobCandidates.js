const express = require("express");

//require controllers function from the controller folder
const { getAllJobApplicationsForms } = require("../controllers/jobCandidates");

// create router, insatiate router object
const jobCandidatesRouter = express.Router();

// all endpoints for this router that came from the controller
jobCandidatesRouter.get("/", getAllJobApplicationsForms);

module.exports = jobCandidatesRouter;
