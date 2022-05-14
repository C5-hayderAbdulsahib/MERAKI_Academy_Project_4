//require the wanted model from the models folder
const usersModel = require("../models/users");

//import the jwt package
const jwt = require("jsonwebtoken");

//we need too require the bcrypt in order to use it to hash our password
const bcrypt = require("bcrypt");

// this function will create a new user
const signup = async (req, res) => {
  try {
    //the variable names has to be the same as the names in postman or the destructuring will not work
    let {
      email,
      password,
      first_name,
      last_name,
      company_name,
      country,
      phone_number,
      role_id,
    } = req.body; //we used let instead of const because we need to resign the value of password

    emailExist = await usersModel.findOne({ email: email }); //and if it does not exist then it will go to the catch statement

    //we have to save the salt in the .env file because if it was found it would make the process of reversing the hash easier
    //the hash from the bcrypt package is a built-in method needs time to execute so it is an async function and in order to make it work we need to use async await or promises (then,catch)
    password = await bcrypt.hash(password, +process.env.SALT); //the .env will return the salt as a string and that is wrong because the salt parameter must be an number so thats why we added (+)

    //creating the new new user object
    //the key names inside the object model has to be the same names of the Fields in the DB or an error will occur
    const newUser = new usersModel({
      email,
      password, //we will be sending the new hashed password instead
      first_name,
      last_name,
      company_name, //this is the same as company_name: company_name
      country,
      phone_number,
      role_id,
    });

    //then save the new Object to the database
    await newUser.save();

    res.status(201).json({
      success: true,
      message: "Account Created Successfully",
      user: newUser,
    });
  } catch (err) {
    //the if statement will be executed if the entered email does not exist in the DB
    if (err.message.includes("E11000 duplicate key")) {
      return res //we used return to get out of the function and without it the code will read the response under and that will give us an error because there can't be two response under each other
        .status(409)
        .json({ success: false, message: "The email already exists" });
    }
    res
      .status(500)
      .json({ success: false, message: "Server Error", err: err.message });
  }
};

// this function to login to the account
const login = async (req, res) => {
  try {
    const user = await usersModel
      .findOne({ email: req.body.email })
      .populate("role_id"); //we are using populate by deciding the field that we want to show the data for, and we are doing this so we can send the role name and permission and put it inside the token

    //we add this condition to see if the role_id exists or it doesn't or it was deleted
    if (user.role === null) {
      return res.status(404).json({
        //the reason that i add the return in order to stop the execution of the code
        success: false,
        message: "Role Is Not Found",
      });
    }

    if (user !== null) {
      //the first argument refer to the entered password while the second refer to the hashedPassword in the database
      bcrypt.compare(req.body.password, user.password, (err, result) => {
        // result will be a boolean depending on whether the hashedPassword is made using the password provided
        if (result) {
          //this is to invoke the generateToken function to create a token after the user is verified
          const token = generateToken({
            userId: user._id,
            role: user.role_id.role,
            country: user.country,
            company_name: user.company_name,
            permissions: user.role_id.permissions,
          });

          res.status(200).json({
            success: true,
            message: "Valid login Credentials",
            token: token,
          });
        } else {
          //to test this part change the password in the postman body to something that does not match the real password
          res.status(403).json({
            success: false,
            message: "The password you’ve entered is incorrect",
          });
        }
      });
    } else {
      //the else part will be executed if the entered email does not exist in the database
      res
        .status(404)
        .json({ success: false, message: "The email doesn't exist" });
    }
  } catch (err) {
    //this part will only work if there is a server error
    res
      .status(500)
      .json({ success: false, message: "Server Error", err: err.message });
  }
};

// getting environment variables
const SECRET = process.env.SECRET;
const TOKEN_EXP_Time = process.env.TOKEN_EXP_Time;

// generating a new token
const generateToken = (objectTokenData) => {
  // the payload that will be sent to the client-side
  const { userId, role, country, company_name, permissions } = objectTokenData;
  const payload = {
    userId, //this is the same as userId: userId
    role,
    country,
    company_name, //this is the same as company_name: company_name
    permissions,
  };

  const options = {
    expiresIn: TOKEN_EXP_Time,
  };
  return jwt.sign(payload, SECRET, options); //sign is a built-in method from jwt which it's job is to create a token and it takes three parameter, this 1.first is payload which is the data that we want our token to contain, the 2.second is the secret key, and the 3.third is options which is the expire for the token, and something else the sign method add another data to the token payload which is the date when this token was created
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// this function will return the data of the specified user
const getUserInfo = async (req, res) => {
  try {
    //getting the user id from the token
    const userId = req.token.userId;

    const userById = await usersModel.findById(userId); //if we want to find something from the model using id we should use findById

    res.status(200).json({
      success: true,
      message: "The User Exists",
      user: userById,
    });
  } catch (err) {
    //only if there is a server error then execute this part

    res.status(500).json({
      success: false,
      message: "Server Error",
      err: err.message,
    });
  }
};

module.exports = { signup, login, getUserInfo };
