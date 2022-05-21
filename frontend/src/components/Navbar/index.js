//importing packages
import { Link } from "react-router-dom";
import React, { useContext } from "react";

// import the context which we created in the authContext.js using the Context hook
import { AuthContext } from "../../contexts/authContext";

//import the image in the component to use it
import profileImage from "../../assest/profile image.png";

//import styling
import "./style.css";

const Navbar = () => {
  //   we can use the states that are send using the useContext by either calling it property from the object or by using destructuring
  //   const setIsLoggedIn = useContext(TokenContext).setIsLoggedIn;
  //   const setToken = useContext(TokenContext).setToken;

  //or we can use destructuring to get the state from the context hook
  // assign the context value to a variable so it can be used (we get this context value from the useContext hook)
  const { logout, token, tokenDecoded, userAccountData } =
    useContext(AuthContext);
  if (token) {
    console.log("the token is", token);
  }

  return (
    <div className="navbar">
      {token && token !== "there is no token" ? (
        <>
          <Link to="/">Home </Link>

          <Link to="/user/account">
            {userAccountData.first_name ? userAccountData.first_name : ""}
          </Link>

          <Link to="/user/account">
            {userAccountData.image_profile ? (
              <img
                src={userAccountData.image_profile}
                alt="profile image"
                style={{ width: "50px", height: "50px", borderRadius: "50%" }}
              />
            ) : (
              <img
                src={profileImage}
                alt="profile image"
                style={{ width: "50px", height: "50px", borderRadius: "50%" }}
              />
            )}
          </Link>

          <Link to="job/saved_jobs">Saved Job Posts</Link>

          <Link to="job/search">Search</Link>

          {tokenDecoded.role === "COMPANY" && (
            <>
              <Link to="/job/new_job_post">Create New Job Post</Link>

              <Link to="job/company_jobs">Your Job Posts</Link>
            </>
          )}

          <Link to="/login">
            <button onClick={logout}>Logout</button>
          </Link>
        </>
      ) : (
        <>
          <Link to="/signup">Signup</Link>
          <Link to="/login">Login</Link>
        </>
      )}
    </div>
  );
};

export default Navbar; //if we use export default then when we import we dont use {} or an error will appear
