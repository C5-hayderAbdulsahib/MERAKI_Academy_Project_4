const express = require("express");

//require controllers function from the controller folder
const { signup } = require("../controllers/users");

// create router, insatiate router object
const usersRouter = express.Router();

// all endpoints for this router that came from the controller
usersRouter.post("/signup", signup);

module.exports = usersRouter;
