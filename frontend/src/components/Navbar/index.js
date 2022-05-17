//importing packages
import { Link } from "react-router-dom";
import React, { useContext } from "react";

// import the context which we created in the authContext.js using the Context hook
import { AuthContext } from "../../contexts/authContext";

//import styling
import "./style.css";

const Navbar = () => {
  //   we can use the states that are send using the useContext by either calling it property from the object or by using destructuring
  //   const setIsLoggedIn = useContext(TokenContext).setIsLoggedIn;
  //   const setToken = useContext(TokenContext).setToken;

  //or we can use destructuring to get the state from the context hook
  // assign the context value to a variable so it can be used (we get this context value from the useContext hook)
  const { isLoggedIn, logout, token } = useContext(AuthContext);

  return (
    <div className="navbar">
      {token && token !== "there is no token" ? (
        <>
          <Link to="/">Home </Link>
          <Link to="/newArticle">New article</Link>
          {/* //we imported the logout function from the context hook in the authContext.js file */}
          <button onClick={logout}>Logout</button>
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
