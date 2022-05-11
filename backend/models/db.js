// DB connection goes here

const mongoose = require("mongoose");

// connecting to mongodb
//we get the database url of mongoose from the variable environment because this is a very sensitive data and it should not be available in the code
mongoose.connect(process.env.DATABASE_URI).then(
  () => {
    console.log("the mongo server is running");
  },
  (err) => {
    console.log(err);
  }
);
