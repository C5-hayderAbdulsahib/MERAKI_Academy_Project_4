const express = require("express");

//require controllers function from the controller folder
const { createNewCategory } = require("../controllers/categories");

//requiring authentication middlewares
const { authentication } = require("../middleware/authentication"); //we required the authentication custom function middleware in order to check the token if it exists or if it is valid
const { authorization } = require("../middleware/authorization"); //we required the authorization custom function middleware in order to check the if the user have the permissions to do certain things

// create router, insatiate router object
const jobsRouter = express.Router();

// all endpoints for this router that came from the controller
jobsRouter.post(
  "/",
  authentication, //we have to be very careful with the orders of the middleware or things will go wrong (the authentication have to be before the authorization)
  authorization("UPDATE_COMMENTS"), //if we want we can also add extra permissions as much as we want
  authorization("CREAT_COMMENTS"), //if we want we can also add extra permissions as much as we want
  createNewCategory
);

module.exports = jobsRouter;
