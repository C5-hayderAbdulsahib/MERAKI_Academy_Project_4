//importing packages
import React, { useState, useEffect } from "react";
import jwt_decode from "jwt-decode";

//creating a new context using createContext hook
export const AuthContext = React.createContext();

// =================================================================

const AuthProvider = (props) => {
  /* note: regarding this file is the same as the app.js in term of execution so each time the global state is changed or the user click on the navbar link this file will get executed because we import this file and use it inside the index.js file so it will be executed each time a change happens in the website, so we have to be careful and we must put our code inside of useEffect in order to make the code executed depending on the dependency array (or even run one time) */

  const [token, setToken] = useState("there is no token");
  const [tokenDecoded, setTokenDecoded] = useState("");

  // =================================================================

  const logout = () => {
    setToken("");
    localStorage.removeItem("token");
  };

  // =================================================================

  const decodeTokenFun = (token) => {
    const tokenDecoded = jwt_decode(token);
    return tokenDecoded;
  };

  //the reason that we put it inside useEffect is for the code to be executed only once when the user enter the website for the first time or if he refresh the page, and if i did not add the useEffect then each time a user make an event such as entering data in an input or clicking a button then the condition will be read but it will not enter it unless he refresh the page, but even still this is wasting performance and to end this problem we added the useEffect so the condition code will only execute once until the user refresh the page

  useEffect(() => {
    //we add this condition because when we refresh the browser all the States will return to their default value thats why we add this condition so we give them the right data depending if there is a token saved in the localStorage or not
    const savedTokenInLocalStorage = localStorage.getItem("token");
    // decodeToken(savedTokenInLocalStorage);

    if (savedTokenInLocalStorage) {
      setToken(savedTokenInLocalStorage);
      const tokenDecoded = jwt_decode(savedTokenInLocalStorage);

      // const tt = decodeToken(savedTokenInLocalStorage);
      // console.log("the decode token it", tt);

      setTokenDecoded(tokenDecoded);
      // console.log("the stored token", savedTokenInLocalStorage);
    } else {
      setToken("");
    }
  }, [token]);

  // =================================================================

  // console.log(token);
  if (token && token !== "there is no token") {
    // console.log(new Date().getTime());
    console.log("the token", token);
    console.log("the hashed token is", tokenDecoded.expireAt);

    if (tokenDecoded.expireAt < new Date().getTime()) {
      console.log("it is bigger");
      logout();
    }
  }

  // =================================================================

  const state = {
    token,
    setToken,
    logout,
    decodeTokenFun,
    tokenDecoded,
    setTokenDecoded,
  };
  // =================================================================

  return (
    <AuthContext.Provider value={state}>{props.children}</AuthContext.Provider>
  );
};

export default AuthProvider;
