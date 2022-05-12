const express = require("express");

//require controllers function from the controller folder
const { createNewCategory } = require("../controllers/categories");

//requiring authentication middlewares
const { authentication } = require("../middleware/authentication"); //we required the authentication custom function middleware in order to check the token if it exists or if it is valid

// create router, insatiate router object
const jobsRouter = express.Router();

// all endpoints for this router that came from the controller
jobsRouter.post("/", authentication, createNewCategory);

module.exports = jobsRouter;
