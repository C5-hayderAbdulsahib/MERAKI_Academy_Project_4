const express = require("express");

//require controllers function from the controller folder
const { createNewJobPost } = require("../controllers/jobs");

// create router, insatiate router object
const jobsRouter = express.Router();

// endpoints for this router came from the controller
jobsRouter.post("/", createNewJobPost);

module.exports = jobsRouter;
