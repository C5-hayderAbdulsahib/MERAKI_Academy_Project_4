//import styling
import "./App.css";

//importing packages
import { Routes, Route } from "react-router-dom";

//importing components
import Navbar from "./components/Navbar"; //since the file inside the folder component has the name of index.js then there is no need to specify it in the import path like this "./components/Register/index" because if you specify a folder then it look inside it files and if it saw a file with the name index then it will import that one, but if we want to import a file with another name then we need so specify it in the import path or it will not be imported

import { LoginPage } from "./components/LoginPage"; //since we used export directly then we have to use the {} when importing

import SignupPage from "./components/SignupPage"; //since the file inside the folder component has the name of index.js then there is no need to specify it in the import path like this "./components/Register/index" because if you specify a folder then it look inside it files and if it saw a file with the name index then it will import that one, but if we want to import a file with another name then we need so specify it in the import path or it will not be imported

import HomePage from "./components/HomePage"; //since the file inside the folder component has the name of index.js then there is no need to specify it in the import path like this "./components/Register/index" because if you specify a folder then it look inside it files and if it saw a file with the name index then it will import that one, but if we want to import a file with another name then we need so specify it in the import path or it will not be imported

import React, { useContext } from "react";

// import the context which we created in the authContext.js using the Context hook
import { AuthContext } from "./contexts/authContext";

import { useNavigate } from "react-router-dom";

function App() {
  const navigate = useNavigate();

  const { token, decodeToken, logout, setToken, test } =
    useContext(AuthContext);

  const logoutApp = () => {
    // setToken("");
    // setIsLoggedIn(false);
    // localStorage.removeItem("token");
    navigate("/login"); //we add this part if the logout was a button so when the user click on the it he will be redirect to the login page but if in the navbar it was a link then there is no need for this part because all what we need to do is giving it the path to the login page
  };

  if (test) {
    // decodeToken(token);
    console.log("hello");
    // navigate("/login");
  }
  // console.log(token);

  return (
    <div className="App">
      {/* since the Navbar component is outside the Routes tag then it will be executed whatever the path was   */}
      <Navbar />

      {/* Routes are used to wrap the Route components, it is not possible to define a Route without it being wrapped by Routes */}
      <Routes>
        {/* Route: will render whatever JSX in the element prop if the path matches.
          path: is used to define the path that will be used to render the element, if the path is `/` then it should render `Home` when the path matches.
          Having the path set to `/` means that it is the root path, in other words it means that there is no path provided. */}

        <Route path="/" element={<HomePage />} />

        <Route path="/signup" element={<SignupPage />} />

        <Route path="/login" element={<LoginPage />} />

        {/* this is the not found page component in case the user entered a path that is not defined in the routes above it will send him to this route, and that's why we put the "*" so we tell the code that if the entered path is nothing like the above path's then it means that it is something else and "*" means anything so it will choose this route and render the not found component */}
        <Route path="*" element={<h1>Not Found Page</h1>} />
      </Routes>
    </div>
  );
}

export default App;
