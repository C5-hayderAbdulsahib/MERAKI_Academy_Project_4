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

    if (user !== null) {
      //we add this condition to see if the role_id was deleted and only for that but if we signing up we forget the role field or we enter a wrong role id formate then this condition will not help us
      if (user.role_id === null) {
        return res.status(404).json({
          //the reason that i add the return in order to stop the execution of the code
          success: false,
          message: "Role Is Not Found",
        });
      }

      //the first argument refer to the entered password while the second refer to the hashedPassword in the database
      bcrypt.compare(req.body.password, user.password, (err, result) => {
        // result will be a boolean depending on whether the hashedPassword is made using the password provided
        if (result) {
          //this is to invoke the generateToken function to create a token after the user is verified
          const token = generateToken({
            userId: user._id,
            role: user.role_id.role,
            country: user.country,
            name: user.first_name + " " + user.last_name,
            companyName: user.company_name,
            permissions: user.role_id.permissions,
          });

          res.status(200).json({
            success: true,
            message: "Valid login Credentials",
            token: token,
          });
        } else {
          //to test this part change the password in the postman body to something that does not match the real password that is saved in the database
          res.status(403).json({
            success: false,
            message: "Invalid login Credentials",
          });
        }
      });
    } else {
      //the else part will be executed if the entered email does not exist in the database
      res
        .status(404)
        .json({ success: false, message: "Invalid login Credentials" });
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
  const { userId, role, country, name, companyName, permissions } =
    objectTokenData;
  const payload = {
    userId, //this is the same as userId: userId
    role,
    country,
    companyName, //this is the same as company_name: company_name
    name,
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
      user: {
        first_name: userById.first_name,
        last_name: userById.last_name,
        company_name: userById.company_name,
        country: userById.country,
        phone_number: userById.phone_number,
      },
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

// this function will update a specific user account
const updateUserInfo = async (req, res) => {
  try {
    //getting the user id from the token
    const userId = req.token.userId;

    //since we are only want to update a single object then we use findByIdAndUpdate or we can also use updateOne, findOneAndUpdate but if we used update then it is still going to work fine

    //findByIdAndUpdate or findOneAndUpdate are special because they update the wanted data and also return the wanted data, unlike update or updateOne were they don't return the wanted data but they return a status of the updated
    //we used the findByIdAndUpdate because this way we only need only one helper mongoose function instead of having two one to check if the object exist and another to update it
    const updatedUser = await usersModel.findByIdAndUpdate(
      userId,
      {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        company_name: req.body.company_name,
        country: req.body.country,
        phone_number: req.body.phone_number,
      },
      { new: true } //the reason that we are using this is because without it, it will return the object before updating it and that is not what we want
    );

    res.status(201).json({
      success: true,
      message: "Account updated",
      user: {
        first_name: updatedUser.first_name,
        last_name: updatedUser.last_name,
        company_name: updatedUser.company_name,
        country: updatedUser.country,
        phone_number: updatedUser.phone_number,
      },
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

// this function will update a specific user account
const changePassword = async (req, res) => {
  try {
    //getting the user id from the token
    const userId = req.token.userId;

    const wantedUser = await usersModel.findById(userId); //if we want to find something from the model using id we should use findById

    //the variable names has to be the same as the names in postman or the destructuring will not work
    let { password, new_password, confirm_password } = req.body; //we used let instead of const because we need to resign the value of password

    //the first argument refer to the entered password while the second refer to the hashedPassword in the database
    bcrypt.compare(password, wantedUser.password, async (err, result) => {
      // result will be a boolean depending on whether the hashedPassword is made using the password provided
      if (result) {
        if (password === new_password) {
          return res.status(400).json({
            success: false,
            message:
              "Your New Password Must Not Be the Same As Your Old Password",
          });
        }

        if (new_password !== confirm_password) {
          return res.status(400).json({
            success: false,
            message: "The New Password Does Not Match Confirm Password",
          });
        }

        //we have to save the salt in the .env file because if it was found it would make the process of reversing the hash easier
        //the hash from the bcrypt package is a built-in method needs time to execute so it is an async function and in order to make it work we need to use async await or promises (then,catch)
        password = await bcrypt.hash(new_password, +process.env.SALT); //the .env will return the salt as a string and that is wrong because the salt parameter must be an number so thats why we added (+)

        await wantedUser.updateOne({ password: password });

        res.status(201).json({
          success: true,
          message: "Password Changed",
        });
      } else {
        //to test this part change the password in the postman body to something that does not match the real password that is saved in the database
        res.status(403).json({
          success: false,
          message: "The Old Password You Have Entered Is Incorrect",
        });
      }
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

module.exports = { signup, login, getUserInfo, updateUserInfo, changePassword };
