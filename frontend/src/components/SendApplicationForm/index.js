//import packages
import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

// import the context which we created in the authContext.js using the useContext hook
import { AuthContext } from "../../contexts/authContext";

//import styling
import "./style.css";

const SendApplicationForm = () => {
  //   we can use the states that are send using the useContext by either calling it property from the object or by using destructuring
  //   const setIsLoggedIn = useContext(TokenContext).setIsLoggedIn;
  //   const setToken = useContext(TokenContext).setToken;

  //or we can use destructuring to get the state from the context hook
  // assign the context value to a variable so it can be used (we get this context value from the useContext hook)
  const { token, logout, tokenDecoded } = useContext(AuthContext);

  const [preferredEmail, setPreferredEmail] = useState("");
  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");
  const [bodyDescription, setBodyDescription] = useState("");

  const [successMessage, setSuccessMessage] = useState("");

  const [errMessage, setErrMessage] = useState("");

  const [hide, setHide] = useState(false); //we add this state to either hide the form or show it depending on the case

  const [requiredMessage, setRequiredMessage] = useState("");

  // use the `useNavigate` hook in the component to gain access to the instance that is used to navigate
  const navigate = useNavigate();

  // `useParams` returns an object that contains the URL parameters
  const { id } = useParams();
  console.log("the id from the params is", id);
  console.log(tokenDecoded.userId);

  const sendFormApplication = async () => {
    try {
      if (!(preferredEmail && name && subject && bodyDescription)) {
        setRequiredMessage("you have to fill all the input field");
        return;
      }

      setRequiredMessage(""); //the reason for adding this line is that if the user does not have a validation error he might get a server error form the backend so and the problem is the both messages will appear at the same time and that is very confusion

      const response = await axios.post(
        `http://localhost:5000/jobs/${id}/candidates`,
        {
          // the data that is entered in the object that is sent using axios must have the same key name as the name in postman(the same field name in the DB) or an error will occur

          preferred_email: preferredEmail, //the key has to be the same key in the backend
          name,
          subject, //this is the same as subject: subject
          body_description: bodyDescription,
        },

        //this is how to send a token using axios
        {
          headers: {
            Authorization: `Bearer ${token}`, //if we write Authorization or authorization(with small a) both will work fine
          },
        }
      );

      console.log(response);

      if (response.data.success) {
        setSuccessMessage(response.data.message);
      }
    } catch (err) {
      console.log(err);

      setHide(true);

      //we add this condition to check if the user login or not
      if (err.response.data.message === "The token is invalid or expired") {
        return logout(); //i dont need to use navigate since i already did in the useEffect under and this function will change the value of the state so it will make the useEffect run again and it will see the condition so it will apply the navigate
      }

      //we add this condition in the case something went wrong and we were unable to get the error message from the backed then there will be a default error message to view it to the user
      if (err.response.data) {
        return setErrMessage(err.response.data.message);
      }

      setErrMessage("Error happened while Get Data, please try again");
    }
  };

  return (
    <>
      {!hide && (
        <div>
          <h3>Job Application Form:</h3>
          <br />

          <input
            type={"email"}
            placeholder="Email"
            onChange={(e) => setPreferredEmail(e.target.value)}
          />
          <br />

          <input
            type={"text"}
            placeholder="Name"
            onChange={(e) => setName(e.target.value)}
          />
          <br />

          <input
            type={"text"}
            placeholder="Subject"
            onChange={(e) => setSubject(e.target.value)}
          />
          <br />

          <input
            type={"text"}
            placeholder="Description"
            onChange={(e) => setBodyDescription(e.target.value)}
          />
          <br />

          <button onClick={sendFormApplication}>Send Form</button>

          {/* this part is for showing showing the user a success message for the user from the backend if his form was sent successfully */}
          {successMessage ? <p className="login-err">{successMessage}</p> : ""}

          {/* this part is for showing an error message for the validation */}
          {requiredMessage && <p>{requiredMessage}</p>}
        </div>
      )}

      {/* this part is for showing an error message from the backend */}
      {errMessage && <p>{errMessage}</p>}
    </>
  );
};

export default SendApplicationForm; //if we use export default then when we import we dont use {} or an error will appear
