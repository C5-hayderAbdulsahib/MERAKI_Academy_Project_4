import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

//creating a new context using createContext hook
export const AuthContext = React.createContext();

// =================================================================

const AuthProvider = (props) => {
  /* note: regarding this file is the same as the app.js in term of execution so each time the the state is changed or a useEffect is called this file will get executed because we import this file and use it inside the index.js file so it will be executed each time a change happens in the website, so have to be careful and we must put our code inside of useEffect in order to make the code executed depending on the dependency array */

  const navigate = useNavigate();

  //i can make my app authentication work without the need for isLoggedIn state using only the token state to make the condition but it write in order to understand how to send multiple props using context hook

  const [token, setToken] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // =================================================================

  //   const saveToken = (token) => {
  //     setToken(token);
  //     setIsLoggedIn(true);
  //   };

  // =================================================================

  const logout = () => {
    setToken("");
    setIsLoggedIn(false);
    localStorage.removeItem("token");
    navigate("/login");
  };

  // =================================================================

  //the reason that we put it inside useEffect is for the code to be executed only once when the user enter the website for the first time or if he refresh the page, and if i did not add the useEffect then each time a user make an event such as entering data in an input or clicking a button then the condition will be read but it will not enter it unless he refresh the page, but even still this is wasting performance and to end this problem we added the useEffect so the condition code will only execute once until the user refresh the page

  useEffect(() => {
    //we add this condition because when we refresh the browser all the States will return to their default value thats why we add this condition so we give them the right data depending if there is a token saved in the localStorage or not
    const savedToken = localStorage.getItem("token");
    // console.log(savedToken);
    if (!token && savedToken) {
      setToken(savedToken);
      setIsLoggedIn(true);
      console.log("the stored token", savedToken);
    }

    //we can add this condition in order if the user is not login redirect him to the home page
    // if (!isLoggedIn) {
    //   navigate("/login");
    // }
  }, [token]);

  // =================================================================

  const state = {
    token,
    isLoggedIn,
    setIsLoggedIn,
    setToken,
    logout,
    // saveToken,
    // logout,
  };
  // =================================================================

  return (
    <AuthContext.Provider value={state}>{props.children}</AuthContext.Provider>
  );
};

export default AuthProvider;
