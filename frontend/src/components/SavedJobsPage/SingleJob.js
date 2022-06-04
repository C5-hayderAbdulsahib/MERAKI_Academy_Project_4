//importing packages
import axios from "axios";
import { Link } from "react-router-dom";

//import styling
import "./style.css";

//or we can use destructuring directly in the parameters like this {item, id} and use it directly without the need to use the word props
const SingleJob = (props) => {
  const {
    FavJob,
    jobDate,
    renderPage,
    setRenderPage,
    token,
    logout,
    setErrMessage,
    setFavorites,
    length,
  } = props; //we used destructuring to make it easier to use them

  const UnsaveJob = async () => {
    console.log("the id is for the deleted ", FavJob._id);
    try {
      await axios.put(
        `http://localhost:5000/jobs/${FavJob._id}/remove-from-favorites`,
        {}, //we add an empty object because in axios you have to make the order of the request is write and since we dont have a body in controller function we can't just remove it or an error will appear so we just add an empty object in this case
        {
          headers: {
            Authorization: `Bearer ${token}`, //if we write Authorization or authorization(with small a) both will work fine
          },
        }
      );

      //we add this condition to make the state transform to empty only with their is on single item left
      if (length <= 1) {
        setFavorites("");
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
      <div className="search-page">
        <div className="card-center">
          <div className="grid-card">
            <div className="first-row">
              <div className="job-title">
                <h2>Job Title: {FavJob.title}</h2>
              </div>
              <div className="published-at">
                <h2>published At: {jobDate}</h2>
              </div>
            </div>

            <div className="second-row">
              <div className="company-name">
                <h3>Company Name: {FavJob.company_name}</h3>
              </div>
              <div className="job-category">
                <h3>Category: {FavJob.category_id.name}</h3>
              </div>
            </div>

            <div className="third-row">
              <div className="job-country">
                <h3>Country: {FavJob.country}</h3>
              </div>
              <div className="job-type">
                <h3>Job Type: {FavJob.type}</h3>
              </div>
              <div className="job-salary">
                <h3>
                  Salary:
                  {`  ${FavJob.salary_min}-${FavJob.salary_max} ${FavJob.currency}`}
                </h3>
              </div>
            </div>

            <div className="un-saved-btn">
              <button
                onClick={() => {
                  UnsaveJob();
                }}
              >
                UnSave Job
              </button>
            </div>

            <div className="view-btn">
              <Link to={`/job/${FavJob._id}`}>
                <button>View Job</button>
              </Link>
            </div>
            <br></br>
          </div>
        </div>
      </div>
    </>
  );
};

export default SingleJob;
//if we use export directly without default then when we import we have to use {} or an error will appear
