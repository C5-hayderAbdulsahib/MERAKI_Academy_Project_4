// this closure function middleware is used to check if the user have the right permission or not and if he don't have the right permissions then end the request and send him an error message

// and the reason that we put it in a closure function we want to send arguments to it, and you can't send arguments to a middleware that's wont work because a middleware can only take few know arguments (req,res,next) and you can't add extra to it, and the only way to pass an parameters to it is calling the middleware in a closure so you can pass the parameters to the main function and they will be accessible by the middleware
const authorization = (permission) => {
  return (req, res, next) => {
    const tokenPermissions = req.token.permissions; //first we will bring the the permissions for the user from his token, and we got the token in the request because of the authentication middleware

    //then we will check if he have the specified permission from his permissions array that we get from his token and if it matched any of his permission then continue the process and if not any of his permission matches the specified permission then he dont have access to this process so end the request and give him an error message
    if (tokenPermissions.includes(permission)) {
      // by invoking the next we will exit the function and go to the next one, and if we did not use the next then the request will continue and it will not stop
      next();
    } else {
      res.status(403).json({ success: false, massage: "Unauthorized" });
    }
  };
};

module.exports = {
  authorization,
};
