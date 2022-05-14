const express = require("express");

//require controllers function from the controller folder
const {
  signup,
  login,
  getUserInfo,
  updateUserInfo,
} = require("../controllers/users");

//requiring authentication middlewares
const { authentication } = require("../middleware/authentication"); //we required the authentication custom function middleware in order to check the token if it exists or if it is valid

// create router, insatiate router object
const usersRouter = express.Router();

// all endpoints for this router that came from the controller
usersRouter.post("/signup", signup);
usersRouter.post("/login", login);

usersRouter.get("/", authentication, getUserInfo);
usersRouter.put("/", authentication, updateUserInfo);

module.exports = usersRouter;
