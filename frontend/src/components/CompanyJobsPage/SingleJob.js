//importing packages
import axios from "axios";
import { Link } from "react-router-dom";

//import styling
import "./style.css";

//or we can use destructuring directly in the parameters like this {item, id} and use it directly without the need to use the word props
const SingleJob = (props) => {
  const {
    job,
    jobDate,
    renderPage,
    setRenderPage,
    token,
    logout,
    setErrMessage,
    setJobs,
    length,
  } = props; //we used destructuring to make it easier to use them

  const deleteJob = async () => {
    console.log("the id is for the deleted ", job._id);
    try {
      await axios.delete(`http://localhost:5000/jobs/${job._id}`, {
        headers: {
          Authorization: `Bearer ${token}`, //if we write Authorization or authorization(with small a) both will work fine
        },
      });

      //we add this condition to make the state transform to empty only with their is on single item left
      if (length <= 1) {
        setJobs("");
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
      <h1>title {job.title}</h1>
      <p>{job.category_id.name}</p>
      <h3>{job.company_name}</h3>
      <h3>{job.country}</h3>
      <h3>{`${job.salary_min}-${job.salary_max} ${job.currency}`}</h3>
      <h3>{job.company_name}</h3>
      <h3>published At {jobDate}</h3>

      <Link to={`/job/company_jobs/${job._id}/applicants`}>
        <button>View Applicants</button>
      </Link>

      <Link to={`/job/${job._id}/update`}>
        <button>Update Job</button>
      </Link>

      <button
        onClick={() => {
          deleteJob();
        }}
      >
        Delete Job
      </button>
    </>
  );
};

export default SingleJob;
//if we use export directly without default then when we import we have to use {} or an error will appear
