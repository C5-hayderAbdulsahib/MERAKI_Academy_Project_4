const jwt = require("jsonwebtoken");
const jwtDecode = require("jwt-decode");

const authentication = (req, res, next) => {
  //this condition will work only if we didn't put a token in the header
  if (!req.headers.authorization) {
    return res.status(403).json({
      success: false,
      message: "Forbidden because the token does not exist",
    }); //we add return in order to stop the execution of the function and without it the response will be send but it will still read the rest of the code and since there is no token an error will occur because if we tried to execute a method on an undefined value then an error will appear, and thats the different between res and return while res stop the execution of the req and send a response, but it does not stop the execution of the function and it will execute anything under it, while return stop the execution of the function and anything under it will not be executed
  }

  const token = req.headers.authorization.split(" ").pop(); //we will bring the token from the request header, but when we get is it will contain the word Bearer before the toke so we used split to remove this extra word and only having the token

  // verifying the token by using the secret key
  const parsedToken = jwt.verify(token, process.env.SECRET, (err, result) => {
    //in order to get the secret key from the .env file we write process.env.NAME_OF_THE_VARIABLE
    //the method verify is a built-in method from jwt and its job is to verify the token and check if it is exist or if it has the write format so if anyone tried to mess with the token and make changes to it then the verify method will notice these changes and will send a warning, the verify method takes two main parameter which are the token and the second is the secret key but we add an extra parameter which is the callback function to do certain things

    //in order to test the error we have to make sure that remove parts from either the header or signature part of the token so that an error message appear but if we tried to remove from the payload part of the token then an error message will not appear and an empty object will be send as a response
    if (err) {
      return res //we add return in order to stop the execution of the function and without it the response will be send but it will still read the rest of the code and since there is no token an error will occur because if we tried to execute a method on an undefined value then an error will appear, and thats the different between res and return while res stop the execution of the req and send a response, but it does not stop the execution of the function and it will execute anything under it, while return stop the execution of the function and anything under it will not be executed
        .status(403)
        .json({ success: false, message: "The token is invalid or expired" });
    }
    // console.log(result); //the result is the token after it gets decoded (so it will bring the content of the token and not the hashed token)

    //we actually can just send the result to the request (because the result will hold the decoded token with the actual data) instead of using jwt-decode package but i only did this to understand how the package works
    const tokenDecoded = jwtDecode(token); //jwtDecode is a packaged that help us to get the data(payload) from the token and decode it back from a series of character to an object of data

    req.token = tokenDecoded; //we add the token data(payload) to the request so that we can get this data from the token when receiving the request and not by the database

    // by invoking the next we will exit the function and go to the next one, and if we did not use the next then the request will continue and it will not stop
    next();
  });
};

module.exports = {
  authentication,
};
