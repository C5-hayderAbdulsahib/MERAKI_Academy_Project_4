//importing packages
import { Link } from "react-router-dom";

//import styling
import "./style.css";

//or we can use destructuring directly in the parameters like this {item, id} and use it directly without the need to use the word props
const SingleJob = (props) => {
  const { job, jobDate } = props; //we used destructuring to make it easier to use them
  console.log("the single job data is", jobDate);

  return (
    <>
      <div className="home-page">
        <div className="card-center">
          <div className="grid-card">
            <div className="first-row">
              <div className="job-title">
                <h2>Job Title: {job.title}</h2>
              </div>

              <div className="published-at">
                <h2>Published At: {jobDate}</h2>
              </div>
            </div>

            <div className="second-row">
              <div className="company-name">
                <h2>Company Name: {job.company_name}</h2>
              </div>
              <div className="job-category">
                <h2>Job Category: {job.category_id.name}</h2>
              </div>
            </div>

            <div className="third-row">
              <div className="job-country">
                <h3>Company Country: {job.country}</h3>
              </div>

              <div className="job-type">
                <h3>Job Type: {job.type}</h3>
              </div>

              <div className="job-salary">
                <h3>
                  Expected Salary:
                  {` ${job.salary_min}-${job.salary_max} ${job.currency}`}
                </h3>
              </div>
            </div>

            <div className="view-btn">
              <Link to={`job/${job._id}`}>
                <button>view job</button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SingleJob;
//if we use export directly without default then when we import we have to use {} or an error will appear
