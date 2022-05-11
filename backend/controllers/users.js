//require the wanted model from the models folder
const usersModel = require("../models/users");

// this function will create a new user
const signup = async (req, res) => {
  try {
    // const email = await userModel.findOne({ email: req.body.email });

    if (true) {
      //the variable names has to be the same as the names in postman or the destructuring will not work
      let { email, password, first_name, last_name, company_name, country } =
        req.body; //we used let instead of const because we need to resign the value of password

      //we have to save the salt in the .env file because if it was found it would make the process of reversing the hash easier
      //the hash from the bcrypt package is a built-in method needs time to execute so it is an async function and in order to make it work we need to use async await or promises (then,catch)
      //   password = await bcrypt.hash(password, +process.env.SALT); //the .env will return the salt as a string and that is wrong because the salt parameter must be an number so thats why we added (+)

      const newUser = new userModel({
        email,
        password, //we will be sending the new hashed password instead
        first_name,
        last_name,
        company_name,
        country,
      });

      await newUser.save();

      res.status(201).json({
        success: true,
        message: "Account Created Successfully",
        author: newUser,
      });
    } else {
      res
        .status(409)
        .json({ success: false, message: "The email already exists" });
    }
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Server Error", err: err.message });
  }
};

module.exports = { signup };
