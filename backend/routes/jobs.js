const express = require("express");

//require controllers function from the controller folder
const {
  getAllJobs,
  getJobById,
  getAllJobsForCompany,
  getJobsByCountry,
  updateJobById,
  deleteJobById,
  addJobPostToFavorites,
} = require("../controllers/jobs");

//require other controllers function from the other controllers folders
const {
  sendNewJobApplicationForm,
  getAllJobApplicationsForms,
  deleteJobApplicationFormById,
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

//we have to put it above the route /:id or express will run that controller before this one
jobsRouter.get(
  "/creator",
  authentication, //we have to be very careful with the orders of the middleware or things will go wrong (the authentication have to be before the authorization)
  authorization("POST_JOBS"), //if we want we can also add extra permissions as much as we want
  authorization("DELETE_JOB_POST"), //if we want we can also add extra permissions as much as we want

  getAllJobsForCompany
);

jobsRouter.get("/:id", authentication, getJobById);

jobsRouter.put(
  "/:id",
  authentication, //we have to be very careful with the orders of the middleware or things will go wrong (the authentication have to be before the authorization)
  authorization("POST_JOBS"), //if we want we can also add extra permissions as much as we want
  authorization("DELETE_JOB_POST"), //if we want we can also add extra permissions as much as we want
  updateJobById
);

jobsRouter.delete(
  "/:id",
  authentication, //we have to be very careful with the orders of the middleware or things will go wrong (the authentication have to be before the authorization)
  authorization("POST_JOBS"), //if we want we can also add extra permissions as much as we want
  authorization("DELETE_JOB_POST"), //if we want we can also add extra permissions as much as we want
  deleteJobById
);

jobsRouter.put("/:id/add_to_favorites", authentication, addJobPostToFavorites);

// all endpoints from other controller than the controller of this Schema
jobsRouter.post("/:id/candidates", authentication, sendNewJobApplicationForm);

jobsRouter.get(
  "/:id/candidates",
  authentication,
  authorization("POST_JOBS"),
  getAllJobApplicationsForms
);

jobsRouter.delete(
  "/:jobId/candidates/:id",
  authentication, //we have to be very careful with the orders of the middleware or things will go wrong (the authentication have to be before the authorization)
  authorization("POST_JOBS"), //if we want we can also add extra permissions as much as we want
  authorization("DELETE_JOB_POST"), //if we want we can also add extra permissions as much as we want
  deleteJobApplicationFormById
);

module.exports = jobsRouter;
