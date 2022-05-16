// import React from "react";
import { Link } from "react-router-dom";
import React, { useContext } from "react";

// import the context which we created in the app.js using the Context hook
import { TokenContext } from "../../App";

//import styling
import "./style.css";

const Navbar = () => {
  // assign the context value to a variable so it can be used (we get this context value from the Context hook)
  // const isLoggedIn = useContext(TokenContext).isLoggedIn;

  // const setIsLoggedIn = useContext(TokenContext).setIsLoggedIn;

  // const setToken = useContext(TokenContext).setToken;

  // const logout = () => {
  //   localStorage.removeItem("token");
  //   setIsLoggedIn(false);
  //   setToken(null);
  // };

  return (
    <div className="navbar">
      {false ? (
        <>
          <Link to="/dashboard">Dashboard </Link>
          <Link to="/newArticle">New article</Link>
          {/* <Link to="/login" onClick={logout}>
            Logout
          </Link> */}
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
