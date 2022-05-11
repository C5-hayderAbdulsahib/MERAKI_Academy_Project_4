const express = require("express");

//require controllers function from the controller folder
const { createNewRole } = require("../controllers/roles");

// create router, insatiate router object
const rolesRouter = express.Router();

// endpoints for this router came from the controller
rolesRouter.post("/", createNewRole);

module.exports = rolesRouter;
