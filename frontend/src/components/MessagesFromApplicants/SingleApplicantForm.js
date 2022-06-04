//importing packages
import axios from "axios";
import { Link } from "react-router-dom";

//import styling
import "./style.css";

//or we can use destructuring directly in the parameters like this {item, id} and use it directly without the need to use the word props
const SingleJob = (props) => {
  const {
    applicant,
    applicantDate,
    renderPage,
    setRenderPage,
    token,
    logout,
    setErrMessage,
    setApplicants,
    length,
    jobId,
  } = props; //we used destructuring to make it easier to use them

  const deleteJobApplication = async () => {
    console.log("the id is for the deleted ", applicant._id);
    try {
      await axios.delete(
        `http://localhost:5000/jobs/${jobId}/candidates/${applicant._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`, //if we write Authorization or authorization(with small a) both will work fine
          },
        }
      );

      //we add this condition to make the state transform to empty only with their is on single item left
      if (length <= 1) {
        setApplicants("");
      }

      //we add this state so that the changes will be shown on the screen without the need of refresh
      setRenderPage(!renderPage);
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

  return (
    <>
      <div className="messages-from-applicants-page">
        <div className="card-center">
          <div className="grid-card">
            <div className="email">
              <h3>Candidate Email: {applicant.preferred_email}</h3>
            </div>

            <div className="c-name">
              <h4>Candidate Name: {applicant.name}</h4>
            </div>

            <div className="subject">
              <h4>Subject: {applicant.subject}</h4>
            </div>

            <div className="application-description">
              <p>Description: {applicant.body_description}</p>
            </div>

            <div className="country">
              <h4>Candidate Country: {applicant.country}</h4>
            </div>

            <div className="send-date">
              <h4>Application Was Send Since {applicantDate}</h4>
            </div>

            <div>
              <div className="candidate-cv">
                <h4>Candidate Cv:</h4>
                {console.log(applicant.candidate_cv)}
                {applicant.candidate_cv ? (
                  <>
                    <div>
                      <a href={applicant.candidate_cv} target="candidate_cv">
                        Click Here To View Candidate Cv
                      </a>
                    </div>
                  </>
                ) : (
                  <p>Please Upload A Cv</p>
                )}
              </div>
            </div>

            <br></br>

            <div className="delete-btn">
              <button
                onClick={() => {
                  deleteJobApplication();
                }}
              >
                Delete Candidate Application
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SingleJob;
//if we use export directly without default then when we import we have to use {} or an error will appear
