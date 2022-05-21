//import packages
import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import FadeLoader from "react-spinners/FadeLoader";

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
  const { token, logout, userAccountData } = useContext(AuthContext);

  const [preferredEmail, setPreferredEmail] = useState("");
  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");
  const [bodyDescription, setBodyDescription] = useState("");

  //this state is for the cv
  const [cv, setCv] = useState("");
  const [cvUrl, setCvUrl] = useState("");

  const [successMessage, setSuccessMessage] = useState("");

  const [errMessage, setErrMessage] = useState("");

  const [hide, setHide] = useState(false); //we add this state to either hide the form or show it depending on the case

  const [requiredMessage, setRequiredMessage] = useState("");

  const [requiredCv, setRequiredCv] = useState("");

  const [savedCvChosen, setSavedCvChosen] = useState(false); //we add this state in order to hide  the upload new cv buttons if the user clicked on upload my saved cv for a better user experience

  // use the `useNavigate` hook in the component to gain access to the instance that is used to navigate
  const navigate = useNavigate();

  // `useParams` returns an object that contains the URL parameters
  const { id } = useParams();
  // console.log("the decoded token is", tokenDecoded.email);
  console.log("the cv of user is", userAccountData.user_cv);

  const sendFormApplication = async () => {
    try {
      setSuccessMessage("");

      if (
        !(
          preferredEmail &&
          name &&
          subject &&
          bodyDescription &&
          cv &&
          requiredCv
        )
      ) {
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
          candidate_cv: cvUrl,
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

  //this function is for uploading pdf on my account on cloudinary server
  const uploadCv = () => {
    const data = new FormData();
    data.append("file", cv);
    data.append("upload_preset", "merakie");
    data.append("cloud_name", "dkqqtkt3b");
    fetch("https://api.cloudinary.com/v1_1/dkqqtkt3b/image/upload", {
      method: "post",
      body: data,
    })
      .then((resp) => resp.json())
      .then((data) => {
        setCvUrl(data.url);
        console.log("the data url for the cv", data.url);
        setRequiredCv("has been uploaded");
        setSuccessMessage("");
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }

    //the reason that we add this condition is because when the page is refreshed it will take sometime in order to take the token from the context hook and until then it will take the default value first then it will take the token value so thats why we first add the condition and make sure that the token exist
    if (token && token !== "there is no token") {
      setPreferredEmail(userAccountData.email);
      setName(userAccountData.first_name + " " + userAccountData.last_name);
    }
  }, [token, userAccountData.email]); //the reason that we put the token state inside the array dependency because in the beginning the value of the token state will be the default value and then it will change to the token value that why we add it in the dependency array so when it get change and take the decoded from of the token, then it make the real request

  return (
    <>
      {!hide ? (
        <div>
          <h3>Job Application Form:</h3>
          <br />

          <input
            type={"email"}
            placeholder="Email"
            value={preferredEmail || ""} //the reason that we add this condition is because without it an error will appear saying that you can not change a controlled input to be uncontrolled
            onChange={(e) => setPreferredEmail(e.target.value)}
          />
          <br />

          <input
            type={"text"}
            placeholder="Name"
            value={name || ""} //the reason that we add this condition is because without it an error will appear saying that you can not change a controlled input to be uncontrolled
            onChange={(e) => setName(e.target.value)}
          />
          <br />

          <input
            type={"text"}
            placeholder="Subject"
            onChange={(e) => setSubject(e.target.value)}
          />
          <br />

          {/* normally a textarea would not be a self closing tag but it still work perfectly fine   */}
          <textarea
            rows="4"
            cols="50"
            placeholder="Description"
            onChange={(e) => setBodyDescription(e.target.value)}
          />
          <br />

          {/* this input file is for uploading cv to cloudinary server */}

          <div>
            <h1>choose the way that you want to upload your cv</h1>
            {cvUrl ? (
              <>
                <a href={cvUrl} target="cv">
                  View Your Chosen Cv
                </a>
              </>
            ) : (
              <p>Please Upload A Cv</p>
            )}
          </div>

          {!savedCvChosen && (
            <>
              <div>
                <input
                  type="file"
                  onChange={(e) => {
                    setCv(e.target.files[0]);
                    setRequiredCv("");
                  }}
                ></input>
                <button onClick={uploadCv}>Upload Cv</button>
              </div>
            </>
          )}

          {/* this part to upload my saved cv */}
          <div>
            <button
              onClick={() => {
                setCvUrl(userAccountData.user_cv);
                // console.log("the data url for the cv");
                setCv(userAccountData.user_cv);
                setRequiredCv("has been uploaded");
                setSuccessMessage(""); //we add this so if we want to send another application form while staying on the page it will remove the success message to give the user a better understanding of his condition
                setSavedCvChosen(true); //we add this part in order if the user click on upload my saved cv the choose a cv buttons will disappear for better user experience
              }}
            >
              Upload My Saved Cv
            </button>
          </div>
          {console.log("the name of the cv is", cv)}

          <button onClick={sendFormApplication}>Send Form</button>

          {/* this part is for showing showing the user a success message for the user from the backend if his form was sent successfully */}
          {successMessage ? <p className="login-err">{successMessage}</p> : ""}

          {/* this part is for showing an error message for the validation */}
          {requiredMessage && <p>{requiredMessage}</p>}
        </div>
      ) : (
        <FadeLoader
          color={"blue"}
          height={45}
          width={5}
          radius={2}
          margin={25}
          css={"display: block; margin: 0 auto; margin-top: 200px;"}
        />
      )}

      {/* this part is for showing an error message from the backend */}
      {errMessage && <p>{errMessage}</p>}
    </>
  );
};

export default SendApplicationForm; //if we use export default then when we import we dont use {} or an error will appear
