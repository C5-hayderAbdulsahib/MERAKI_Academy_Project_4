//requiring packages
const express = require("express");

//dotenv and this has to be the second line after requiring express because in the third line we will require the db from the model and we have put the mongoLink inside the .env and if we tried to use the process.env before requiring the .env package an error will appear so it has to be after the requiring of the express
require("dotenv").config(); //we require the dotenv in the index.js because we want to make it available for the all application folder

//this is to bring the database and if i did not write this line the mongo server will not run on my device even so even if i did not use the variable i still have to require the db from the model server
require("./models/db"); //or we can write like this-->  const db = require("./models/db");

// instantiate express
const app = express();
const PORT = process.env.PORT; //in order to get any variable from the .env file we write process.env.NAME_OF_THE_VARIABLE

// Import Routers
const usersRouter = require("./routes/users");
const jobsRouter = require("./routes/jobs");
const categoriesRouter = require("./routes/categories");

// express.json() is a built-in middleware that parses incoming requests with JSON payloads (it turn the request to json so we can be able to use it and we use it if we want to get data from the body of postman)
app.use(express.json());
// app.use(cors()); //we created an application-level middleware and invoke it the cors function, and the reason for that if we want these api that we created to be used by the frontend code then we have to give it the cors permissions

// Routes Middleware
app.use("/users", usersRouter);
app.use("/jobs", jobsRouter);
app.use("/categories", categoriesRouter);

//////////////////////////////////////////////////////////////////////////////////
// Handles any other endpoints [unassigned - endpoints]

// this is an Error-handling middleware and it has to be at the bottom of the page before the app.listen
//it job is to print an error if the user enter a wrong endpoint(url)

// the reason that this code work is because it is at the end of the file so first it will go and check the routes above and if it found a matching route then it will go inside it and if there is a response then it will stop the execution of the file and it will never reach this middleware,
//but if it did not found any matching routes then it will reach this middleware and execute it

app.use("*", (req, res, next) => {
  //it is true that we don't need to specify an (endpoint or next parameter) in this task, but it is better to give it an endpoint and if it is going to affect all the routes then we give it "*" as an endpoint, so that why each middleware should have an endpoint and the next parameter so that it does not get confused with a request handling function(or a controller) because there is no request handling function(or a controller) that have an endpoint of "*"

  const error = new Error("NO content at this path");
  error.status = 404;
  res.status(404).json({
    error: {
      message: error.message,
      status: error.status,
    },
  });
});

// run the server locally on the desired PORT.
app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
