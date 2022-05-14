const express = require("express");

//require controllers function from the controller folder
const {
  getAllJobs,
  getJobById,
  getJobsByCountry,
  getJobsByCategory,
  updateJobById,
} = require("../controllers/jobs");

//require other controllers function from the other controllers folders
const {
  sendNewJobApplicationForm,
  getAllJobApplicationsForms,
} = require("../controllers/jobCandidates");

//requiring authentication middlewares
const { authentication } = require("../middleware/authentication"); //we required the authentication custom function middleware in order to check the token if it exists or if it is valid
const { authorization } = require("../middleware/authorization"); //we required the authorization custom function middleware in order to check the if the user have the permissions to do certain things

// create router, insatiate router object
const jobsRouter = express.Router();

// all endpoints for this router that came from the controller
jobsRouter.get("/", authentication, getAllJobs);

//we have to put it above the route /:id or express will run that controller before this one
jobsRouter.get("/search_country", authentication, getJobsByCountry);
jobsRouter.get("/search_category", authentication, getJobsByCategory);

jobsRouter.get("/:id", authentication, getJobById);
jobsRouter.put(
  "/:id",
  authentication,
  authorization("POST_JOBS"),
  updateJobById
);

// all endpoints from other controller than the controller of this Schema
jobsRouter.post("/:id/candidates", authentication, sendNewJobApplicationForm);

jobsRouter.get(
  "/:id/candidates",
  authentication,
  authorization("POST_JOBS"),
  getAllJobApplicationsForms
);

module.exports = jobsRouter;
