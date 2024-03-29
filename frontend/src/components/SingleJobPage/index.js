//import packages
import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import axios from "axios";

// import the context which we created in the authContext.js using the Context hook
import { AuthContext } from "../../contexts/authContext";

//import styling
import "./style.css";

//since we used export directly then when we import we have to add the {} or an error will occur
export const SingleJobPage = () => {
  //   we can use the states that are send using the useContext by either calling it property from the object or by using destructuring
  //   const setIsLoggedIn = useContext(TokenContext).setIsLoggedIn;
  //   const setToken = useContext(TokenContext).setToken;

  //or we can use destructuring to get the state from the context hook
  // assign the context value to a variable so it can be used (we get this context value from the useContext hook)
  const { token, logout, tokenDecoded } = useContext(AuthContext);

  const navigate = useNavigate();

  const [singleJob, setSingleJob] = useState({});

  const [jobDate, setJobDate] = useState(null);

  const [errMessage, setErrMessage] = useState("");

  // `useParams` returns an object that contains the URL parameters
  const { id } = useParams();
  console.log("the id from the params is", id);
  console.log(tokenDecoded.role);

  const getSingleJob = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/jobs/${id}`,
        //this is how to send a token using axios
        {
          headers: {
            Authorization: `Bearer ${token}`, //if we write Authorization or authorization(with small a) both will work fine
          },
        }
      );

      console.log("the single job is", response.data.job);
      setSingleJob(response.data.job);

      //we created this part in order to view the date as a string and not a number
      const convertDate = new Date(response.data.job.createdAt)
        .toString()
        .substring(4, 10);

      setJobDate(convertDate);
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
      getSingleJob();
    }
  }, [token]); //the reason that we put the token state inside the array dependency because in the beginning the value of the token state will be the default value and then it will change to the token value that why we add it in the dependency array so when it get change and take the decoded from of the token, then it make the real request

  console.log("the token in the single job page", token);

  const saveJob = async () => {
    try {
      const response = await axios.put(
        `http://localhost:5000/jobs/${id}/add_to_favorites`,
        {}, //we add an empty object because in axios you have to make the order of the request is write and since we dont have a body in controller function we can't just remove it or an error will appear  so we just add an empty object in this case
        //this is how to send a token using axios
        {
          headers: {
            Authorization: `Bearer ${token}`, //if we write Authorization or authorization(with small a) both will work fine
          },
        }
      );

      console.log("the single job is", response.data.job);
      setSingleJob(response.data.job);
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

  const unSaveJob = async () => {
    try {
      const response = await axios.put(
        `http://localhost:5000/jobs/${id}/remove-from-favorites`,
        {}, //we add an empty object because in axios you have to make the order of the request is write and since we dont have a body in controller function we can't just remove it or an error will appear  so we just add an empty object in this case
        //this is how to send a token using axios
        {
          headers: {
            Authorization: `Bearer ${token}`, //if we write Authorization or authorization(with small a) both will work fine
          },
        }
      );

      console.log("the single job is", response.data.job);
      setSingleJob(response.data.job);
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

  console.log("the time date is", jobDate);

  return (
    <>
      {singleJob.title && (
        <>
          <div className="search-page">
            <div className="card-center">
              <div className="grid-card-single-page">
                <div className="first-row">
                  <div className="job-title">
                    <h2>Job Title: {singleJob.title}</h2>
                  </div>
                  <div className="published-at">
                    <h2>Published At: {jobDate}</h2>
                  </div>
                </div>

                <div className="second-row">
                  <div className="company-name">
                    <h3>Company Name: {singleJob.company_name}</h3>
                  </div>
                  <div className="job-category">
                    <h3>Category: {singleJob.category_id.name}</h3>
                  </div>
                </div>

                <div className="third-row">
                  <div className="job-country">
                    <h3>Country: {singleJob.country}</h3>
                  </div>
                  <div className="job-type">
                    <h3>Job Type: {singleJob.type}</h3>
                  </div>
                  <div className="job-salary">
                    <h3>
                      Salary:{" "}
                      {` ${singleJob.salary_min}-${singleJob.salary_max} ${singleJob.currency}`}
                    </h3>
                  </div>
                </div>

                <div className="description">
                  <p>Job Description: {singleJob.description}</p>
                </div>

                {singleJob.inFavorites.includes(tokenDecoded.userId) ? (
                  <div className="un-saved-btn">
                    <button onClick={unSaveJob}>Unsave Job</button>
                  </div>
                ) : (
                  <div className="saved-btn">
                    <button onClick={saveJob}>Save Job</button>
                  </div>
                )}

                <br></br>
                {tokenDecoded.role === "INDIVIDUAL" && (
                  <div className="view-btn">
                    <Link to={`/job/${id}/application_Form`}>
                      <button>Apply For Job</button>
                    </Link>
                  </div>
                )}

                <br></br>
                <br></br>
              </div>
            </div>
          </div>
        </>
      )}
      {errMessage ? errMessage : ""}
    </>
  );
};
