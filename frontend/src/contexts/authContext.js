//importing packages
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import jwt_decode from "jwt-decode";

//creating a new context using createContext hook
export const AuthContext = React.createContext();

// =================================================================

const AuthProvider = (props) => {
  /* note: regarding this file is the same as the app.js in term of execution so each time the global state is changed or the user click on the navbar link this file will get executed because we import this file and use it inside the index.js file so it will be executed each time a change happens in the website, so we have to be careful and we must put our code inside of useEffect in order to make the code executed depending on the dependency array (or even run one time) */

  const navigate = useNavigate();

  //i can make my app authentication work without the need for isLoggedIn state using only the token state to make the condition but it write in order to understand how to send multiple props using context hook

  const [token, setToken] = useState("");
  const [tokenDecoded, setTokenDecoded] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [test, setTest] = useState(false);

  // =================================================================

  const logout = () => {
    setToken("");
    setIsLoggedIn(false);
    localStorage.removeItem("token");
    // navigate("/login"); //we add this part if the logout was a button so when the user click on the it he will be redirect to the login page but if in the navbar it was a link then there is no need for this part because all what we need to do is giving it the path to the login page
  };

  // =================================================================

  const decodeToken = (token) => {
    const tokenDecoded = jwt_decode(token);
    return tokenDecoded;
  };

  const testFun = (token) => {
    // const tokenDecoded = jwt_decode(token);
    return token;
  };

  //the reason that we put it inside useEffect is for the code to be executed only once when the user enter the website for the first time or if he refresh the page, and if i did not add the useEffect then each time a user make an event such as entering data in an input or clicking a button then the condition will be read but it will not enter it unless he refresh the page, but even still this is wasting performance and to end this problem we added the useEffect so the condition code will only execute once until the user refresh the page

  useEffect(() => {
    //we add this condition because when we refresh the browser all the States will return to their default value thats why we add this condition so we give them the right data depending if there is a token saved in the localStorage or not
    const savedTokenInLocalStorage = localStorage.getItem("token");
    // decodeToken(savedTokenInLocalStorage);

    if (!token && savedTokenInLocalStorage) {
      setToken(savedTokenInLocalStorage);
      const tokenDecoded = jwt_decode(savedTokenInLocalStorage);

      // const tt = decodeToken(savedTokenInLocalStorage);
      // console.log("the decode token it", tt);

      setTokenDecoded(tokenDecoded);
      setIsLoggedIn(true);
      // console.log("the stored token", savedTokenInLocalStorage);
    }

    //we can add this condition in order if the user is not login redirect him to the home page but it is better to handle it inside each main component
    // if (!isLoggedIn) {
    //   navigate("/login");
    // }
  }, [token]);

  // =================================================================

  // console.log(token);
  if (token) {
    // console.log(new Date().getTime());
    console.log("the token", token.expireAt);

    if (token.expireAt < new Date().getTime()) {
      console.log("it is bigger");
      logout();
      // setTest(true);
      // navigate("/login");
    }
  }

  // =================================================================

  const state = {
    token,
    isLoggedIn,
    setIsLoggedIn,
    setToken,
    logout,
    decodeToken,
    testFun,
    test,
  };
  // =================================================================

  return (
    <AuthContext.Provider value={state}>{props.children}</AuthContext.Provider>
  );
};

export default AuthProvider;
