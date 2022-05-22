//importing packages
import { Link, NavLink } from "react-router-dom";
import React, { useContext, useState } from "react";
import { FaBars } from "react-icons/fa";

// import the context which we created in the authContext.js using the Context hook
import { AuthContext } from "../../contexts/authContext";

//import the image in the component to use it
import profileImage from "../../assest/profile image.png";
import logo from "../../assest/logo.png";

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

  const [toggle, setToggle] = useState(true);

  const hideToggle = toggle ? "hide" : "";

  return (
    <div className="nav">
      <nav className="navbar">
        {token && token !== "there is no token" ? (
          <>
            <div>
              <Link to="/" className="logo">
                <img src={logo} alt="profile image" />
              </Link>
            </div>

            {/* ////////////////////////////////////////////////////////////////////////////////// */}
            {/* this is the left side of the navbar */}
            <div className="left-content">
              <div>
                <Link to="/user/account" className="link-img-profile">
                  {userAccountData.image_profile ? (
                    <img
                      src={userAccountData.image_profile}
                      alt="profile image"
                      className="img-profile"
                    />
                  ) : (
                    <img
                      src={profileImage}
                      alt="profile image"
                      className="img-profile"
                    />
                  )}
                </Link>
              </div>

              {/* we added NavLink because it will automatically add an active attributes to the link if it matches its path  */}
              <div>
                <NavLink to="/user/account">
                  {userAccountData.first_name ? userAccountData.first_name : ""}
                </NavLink>
              </div>

              {/* <!-- we created this link to make show near the logo but after reaching the decided width it will be disappeared and thats the way to make it work in responsive mode --> */}
              <div>
                <NavLink to="/" className="home-link-left">
                  Home
                </NavLink>
              </div>
            </div>

            {/* ////////////////////////////////////////////////////////////////////////// */}
            {/* this is the toggle button and in order for it to work i need to keep it alone like this not inside the right content div nor the left */}
            <div className="bars-icon">
              <FaBars onClick={() => setToggle(!toggle)} />
            </div>

            {/* ////////////////////////////////////////////////////////////////////////////////// */}
            {/* this is the right side of the navbar */}
            {/* <!-- we add a condition to this home link to make it disappear while in the desktop mode and to make it appear while on the mobile mode --> */}
            <div className={`right-content ${hideToggle}`}>
              <NavLink to="/" className="home-link-right">
                Home
              </NavLink>

              <NavLink to="job/saved_jobs">Saved Job Posts</NavLink>

              <NavLink to="job/search">Search</NavLink>

              {tokenDecoded.role === "COMPANY" && (
                <>
                  <NavLink to="/job/new_job_post">Create New Job Post</NavLink>

                  <NavLink to="job/company_jobs">Your Job Posts</NavLink>
                </>
              )}

              <Link to="/login" className="link-logout-btn" onClick={logout}>
                <button className="logout-btn">Logout</button>
              </Link>
            </div>
          </>
        ) : (
          <>
            {/* ////////////////////////////////////////////////////////////////////////////////// */}
            {/* this part is when the user is logged out */}
            <div className="login-signup">
              <div>
                <Link to="/" className="logo">
                  <img
                    src={logo}
                    alt="profile image"
                    style={{
                      width: "95px",
                      height: "30px",
                    }}
                  />
                </Link>
              </div>

              <div>
                <NavLink to="/signup">Signup</NavLink>
              </div>
              <div>
                <NavLink to="/login">Login</NavLink>
              </div>
            </div>
          </>
        )}
      </nav>

      <div className="push-down"></div>
    </div>
  );
};

export default Navbar; //if we use export default then when we import we dont use {} or an error will appear
