//import packages
import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// import the context which we created in the authContext.js using the useContext hook
import { AuthContext } from "../../contexts/authContext";

//import styling
import "./style.css";

//since we used export directly then when we import we have to add the {} or an error will occur
export const LoginPage = () => {
  //   we can use the states that are send using the useContext by either calling it property from the object or by using destructuring
  //   const setIsLoggedIn = useContext(TokenContext).setIsLoggedIn;
  //   const setToken = useContext(TokenContext).setToken;

  //or we can use destructuring to get the state from the context hook
  // assign the context value to a variable so it can be used (we get this context value from the useContext hook)
  const { setToken, setTokenDecoded, decodeTokenFun } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");

  // use the `useNavigate` hook in the component to gain access to the instance that is used to navigate
  const navigate = useNavigate();

  const loginFun = () => {
    axios
      .post("http://localhost:5000/users/login", {
        // the data that is entered in the object that is sent using axios must have the same key name as the name in postman(the same field name in the DB) or an error will occur

        email, //this is the same as email: email
        password, //the key has to be the same key in the backend
      })
      .then((result) => {
        console.log(result);

        localStorage.setItem("token", result.data.token); //we add the token to local storage so that even if the user refresh the page the token will not be lost

        const tokenDecoded = decodeTokenFun(result.data.token);
        console.log(tokenDecoded);

        setToken(result.data.token); //the reason that we changed the state of token because in our project we are depending on it to make an axios request and to make the condition if the user is logged in or not
        setTokenDecoded(tokenDecoded); //we change the state of the token because i need to decode it and get the data that is stored inside its payload

        navigate("/"); //we used the navigate in order to change the path to /dashboard automatically without the user need to enter it in the browser url field
      })
      .catch((err) => {
        console.log(err);

        //we add this condition in the case something went wrong and we were unable to get the error message from the backed then there will be a default error message to view it to the user
        if (err.response.data) {
          console.log(err);
          return setMessage(err.response.data.message);
        }

        setMessage("Error happened while Get Data, please try again");
      });
  };

  return (
    <div className="login">
      <h3>Login Form:</h3>
      <br />

      <input
        type={"email"}
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type={"password"}
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={loginFun}>Log in</button>

      {message ? <p className="login-err">{message}</p> : ""}
    </div>
  );
};
