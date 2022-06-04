//import packages
import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import FadeLoader from "react-spinners/FadeLoader";

// import the context which we created in the authContext.js using the useContext hook
import { AuthContext } from "../../contexts/authContext";

//import styling
import "./style.css";

const CreateNewJobPage = () => {
  //   we can use the states that are send using the useContext by either calling it property from the object or by using destructuring
  //   const setIsLoggedIn = useContext(TokenContext).setIsLoggedIn;
  //   const setToken = useContext(TokenContext).setToken;

  //or we can use destructuring to get the state from the context hook
  // assign the context value to a variable so it can be used (we get this context value from the useContext hook)
  const { token, logout, userAccountData } = useContext(AuthContext);

  const [categories, setCategories] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("");
  const [salaryMin, setSalaryMin] = useState("");
  const [salaryMax, setSalaryMax] = useState("");
  const [currency, setCurrency] = useState("");

  const [allCurrencies, setAllCurrencies] = useState([]);
  const [allCategories, setAllCategories] = useState([]);

  const [companyName, setCompanyName] = useState(userAccountData.company_name);

  const [successMessage, setSuccessMessage] = useState("");

  const [errMessage, setErrMessage] = useState("");

  const [requiredMessage, setRequiredMessage] = useState("");

  // use the `useNavigate` hook in the component to gain access to the instance that is used to navigate
  const navigate = useNavigate();

  console.log("the company name is", userAccountData.company_name);

  const getCategoriesWithCurrencies = async () => {
    try {
      //getting all the categories from the backend
      const getCategories = await axios.get(
        "http://localhost:5000/categories",
        //this is how to send a token using axios
        {
          headers: {
            Authorization: `Bearer ${token}`, //if we write Authorization or authorization(with small a) both will work fine
          },
        }
      );

      const categoriesSelect = [];
      getCategories.data.categories.map((element) => {
        categoriesSelect.push({
          value: element._id,
          label: element.name,
        });
      });

      console.log("this is all the categories", getCategories.data);

      setAllCategories(categoriesSelect);

      //getting all the currencies from a third party api
      const getCurrencies = await axios.get(
        "https://restcountries.com/v3.1/all"
      );

      const currenciesSelect = [];
      let currentValue;
      getCurrencies.data.map((element) => {
        currentValue = element.currencies
          ? Object.keys(element.currencies)[0] //the reason that we added this condition is to check if the element exist or it still not and without it an error will appear
          : "";

        currenciesSelect.push({
          value: currentValue,
          label: currentValue,
        });
      });

      setAllCurrencies(currenciesSelect);

      //getting the company name from the token
      setCompanyName(userAccountData.company_name);
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

  const createJobPost = async () => {
    try {
      if (
        !(
          categories &&
          title &&
          description &&
          salaryMin &&
          salaryMax &&
          currency &&
          type &&
          companyName
        )
      ) {
        setRequiredMessage("you have to fill all the input field");
        return;
      }

      setRequiredMessage(""); //the reason for adding this line is that if the user does not have a validation error he might get a server error form the backend so and the problem is the both messages will appear at the same time and that is very confusion

      const response = await axios.post(
        `http://localhost:5000/categories/${categories}/jobs`,
        {
          // the data that is entered in the object that is sent using axios must have the same key name as the name in postman(the same field name in the DB) or an error will occur

          company_name: companyName,

          title, //the key has to be the same key in the backend
          description,
          type, //this is the same as type: type
          salary_min: salaryMin,
          salary_max: salaryMax,
          currency: currency,
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
    "hello i am first";
    if (!token) {
      navigate("/login");
    }

    //the reason that we add this condition is because when the page is refreshed it will take sometime in order to take the token from the context hook and until then it will take the default value first then it will take the token value so thats why we first add the condition and make sure that the token exist
    if (token && token !== "there is no token") {
      getCategoriesWithCurrencies();
    }
  }, [token, userAccountData.company_name]); //the reason that we put the token state inside the array dependency because in the beginning the value of the token state will be the default value and then it will change to the token value that why we add it in the dependency array so when it get change and take the decoded from of the token, then it make the real request

  return (
    <>
      {companyName ? (
        <div className="account-page">
          <div className="grid-center">
            <div className="title">
              <h1>Create Job Form:</h1>
            </div>

            <div className="company-field">
              <label htmlFor="CompanyName">View Your Company Name:</label>
              <input
                type={"text"}
                id="CompanyName"
                disabled
                placeholder="Company Name"
                value={companyName}
                onChange={(e) => {
                  setCompanyName(e.target.value);
                  setSuccessMessage("");
                  setRequiredMessage("");
                }}
                style={{ marginBottom: "20px" }}
              />
            </div>

            <div className="categories-field">
              <label htmlFor="categories">Choose A Category:</label>
              <Select
                name="categories"
                id="categories"
                options={allCategories}
                defaultValue={{
                  value: "",
                  label: "Select A Category",
                }}
                onChange={(e) => {
                  setCategories(e.value);
                  setSuccessMessage("");
                  setRequiredMessage("");
                }}
              />
            </div>

            <div className="lname-field">
              <label htmlFor="Title">Choose A Title:</label>
              <input
                type={"text"}
                placeholder="Title"
                onChange={(e) => {
                  setTitle(e.target.value);
                  setSuccessMessage("");
                  setRequiredMessage("");
                }}
                style={{ marginBottom: "20px" }}
              />
            </div>

            {/* normally a textarea would not be a self closing tag but it still work perfectly fine   */}
            <label htmlFor="lname">Choose A Description Job:</label>
            <textarea
              rows="4"
              cols="50"
              placeholder="Description Of The Job"
              onChange={(e) => {
                setDescription(e.target.value);
                setSuccessMessage("");
                setRequiredMessage("");
              }}
              style={{ marginBottom: "20px" }}
            />

            <div className="company-field">
              <label htmlFor="type">Choose A Job Type:</label>
              <select
                name="type"
                id="type"
                onChange={(e) => {
                  setType(e.target.value);
                  setSuccessMessage("");
                  setRequiredMessage("");
                }}
                style={{ marginBottom: "20px" }}
              >
                <option value="">Choose A Type</option>

                <option value="On-Site">On-Site</option>
                <option value="Remote">Remote</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>

            <div className="company-field">
              <label htmlFor="lname">Enter A Minimum Salary Expected:</label>
              <input
                type={"number"}
                placeholder="Minimum Salary Expected"
                onChange={(e) => {
                  setSalaryMin(e.target.value);
                  setSuccessMessage("");
                  setRequiredMessage("");
                }}
                style={{ marginBottom: "20px" }}
              />
            </div>

            <div className="company-field">
              <label htmlFor="lname">Enter a Maximum Salary Expected:</label>
              <input
                type={"number"}
                placeholder="Maximum Salary Expected"
                onChange={(e) => {
                  setSalaryMax(e.target.value);
                  setSuccessMessage("");
                  setRequiredMessage("");
                }}
                style={{ marginBottom: "20px" }}
              />
            </div>

            <div className="company-field">
              <label htmlFor="currency">Choose A Currency:</label>
              <Select
                name="currency"
                id="currency"
                options={allCurrencies}
                defaultValue={{
                  value: "",
                  label: "Select A Currency",
                }}
                onChange={(e) => {
                  setCurrency(e.value);
                  setSuccessMessage("");
                  setRequiredMessage("");
                }}
              />
            </div>
            <br></br>

            <div className="create-job-btn">
              <button onClick={createJobPost}>Create A New Job Post</button>
            </div>
            {/* this part is for showing the user a success message for the user from the backend if his form was sent successfully */}
            {successMessage ? (
              <p className="create-new-job-success">{successMessage}</p>
            ) : (
              ""
            )}

            {/* this part is for showing an error message for the validation */}
            {requiredMessage && (
              <p className="create-new-job-error">{requiredMessage}</p>
            )}
          </div>
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
      {errMessage && <p className="errMessage">{errMessage}</p>}
    </>
  );
};

export default CreateNewJobPage;
