//importing packages
import { Link } from "react-router-dom";

//import styling
import "./style.css";

//or we can use destructuring directly in the parameters like this {item, id} and use it directly without the need to use the word props
const SingleJob = (props) => {
  const { job, jobDate } = props; //we used destructuring to make it easier to use them

  return (
    <>
      <h1>title {job.title}</h1>
      <p>{job.category_id.name}</p>
      <h3>{job.company_name}</h3>
      <h3>{job.country}</h3>
      <h3>{`${job.salary_min}-${job.salary_max} ${job.currency}`}</h3>
      <h3>{job.company_name}</h3>
      <h3>published At {jobDate}</h3>

      <Link to={`job/${job._id}`}>
        <button>view job</button>
      </Link>
    </>
  );
};

export default SingleJob;
//if we use export directly without default then when we import we have to use {} or an error will appear
