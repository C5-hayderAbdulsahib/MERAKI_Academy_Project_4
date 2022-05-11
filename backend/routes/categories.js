const express = require("express");

//require controllers function from the controller folder
const { createNewCategory } = require("../controllers/categories");

// create router, insatiate router object
const jobsRouter = express.Router();

// endpoints for this router came from the controller
jobsRouter.post("/", createNewCategory);

module.exports = jobsRouter;
