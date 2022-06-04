//import packages
import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import FadeLoader from "react-spinners/FadeLoader";

// import the context which we created in the authContext.js using the useContext hook
import { AuthContext } from "../../contexts/authContext";

//import Components
import SingleApplicantForm from "./SingleApplicantForm";

//import styling
import "./style.css";

//since we used export directly then when we import we have to add the {} or an error will occur
export const MessagesFromApplicants = () => {
  //   we can use the states that are send using the useContext by either calling it property from the object or by using destructuring
  //   const setIsLoggedIn = useContext(TokenContext).setIsLoggedIn;
  //   const setToken = useContext(TokenContext).setToken;

  //or we can use destructuring to get the state from the context hook
  // assign the context value to a variable so it can be used (we get this context value from the useContext hook)
  const { token, logout } = useContext(AuthContext);

  const [applicants, setApplicants] = useState([]);

  const [renderPage, setRenderPage] = useState(false);

  const [successMessage, setSuccessMessage] = useState("");

  const [errMessage, setErrMessage] = useState("");

  // `useParams` returns an object that contains the URL parameters
  const { jobId } = useParams();

  // use the `useNavigate` hook in the component to gain access to the instance that is used to navigate
  const navigate = useNavigate();

  const getCompanyApplicantsForms = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/jobs/${jobId}/candidates`,
        //this is how to send a token using axios
        {
          headers: {
            Authorization: `Bearer ${token}`, //if we write Authorization or authorization(with small a) both will work fine
          },
        }
      );

      console.log("the Applicants List is", response.data.jobApplications);

      if (response.data.message === "No One Have Send a Job Application Yet") {
        setSuccessMessage(response.data.message);
      } else {
        setApplicants(response.data.jobApplications);
      }
    } catch (err) {
      console.log(err);
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

  // and the reason that i used useEffect is that i want the data to be displayed the moment the component is loaded, and if did not apply useEffect and only used axios without the useEffect then it will continue to bring and display the posts without a stop because there is no condition to make it stop, so thats why we apply useEffect and give it an empty array so it only run(render) one time
  useEffect(() => {
    if (!token) {
      navigate("/login");
    }

    //the reason that we add this condition is because when the page is refreshed it will take sometime in order to take the token from the context hook and until then it will take the default value first then it will take the token value so thats why we first add the condition and make sure that the token exist
    if (token && token !== "there is no token") {
      getCompanyApplicantsForms();
    }
  }, [token, renderPage]); //the reason that we put the token state inside the array dependency because in the beginning the value of the token state will be the default value and then it will change to the token value that why we add it in the dependency array so when it get change and take the decoded from of the token, then it make the real request

  //we used map to iterate over the array and send data as a prop to the single item component
  let applicantsList;
  if (typeof applicants !== "string") {
    applicantsList = applicants.map((element) => {
      console.log("the unique index is", element._id);
      console.log(element);

      //we created this part in order to view the date as a string and not a number
      const createdApplicationDate = new Date(element.createdAt)
        .toString()
        .substring(4, 10);

      return (
        <SingleApplicantForm
          key={element._id}
          applicant={element}
          applicantDate={createdApplicationDate}
          renderPage={renderPage}
          setRenderPage={setRenderPage}
          token={token}
          logout={logout}
          setApplicants={setApplicants}
          length={applicants.length}
          setErrMessage={setErrMessage}
          jobId={jobId}
        />
      ); //the key has to be named that way and if we tried to change it and give it a name of id an error will appear on the console, and also it value has to be unique or an error will also occur so that why we usually  give it the value of the id, so if there is an array of element in jsx and they all have the same name for example <p> we have to give each one of them a key attribute or an error will appear
    });
  }

  return (
    <>
      {applicants || successMessage ? (
        <>
          <div>{applicantsList}</div>

          {/* we add this condition because there might be no job post that have been created yet so thats why instead of an array a string message will appear */}
          {successMessage && <p className="no-candidates">{successMessage}</p>}
        </>
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

      {errMessage && <div>{errMessage}</div>}
    </>
  );
};
