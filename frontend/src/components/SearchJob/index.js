//import packages
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Select from "react-select";
import FadeLoader from "react-spinners/FadeLoader";

// import the context which we created in the authContext.js using the Context hook
import { AuthContext } from "../../contexts/authContext";

//importing components
import SingleJob from "./SingleJob";

const HomePage = () => {
  //   we can use the states that are send using the useContext by either calling it property from the object or by using destructuring
  //   const setIsLoggedIn = useContext(TokenContext).setIsLoggedIn;
  //   const setToken = useContext(TokenContext).setToken;

  //or we can use destructuring to get the state from the context hook
  // assign the context value to a variable so it can be used (we get this context value from the useContext hook)
  const { token, logout } = useContext(AuthContext);

  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);

  const [categorySearch, setCategorySearch] = useState("");
  const [allCategories, setAllCategories] = useState([]);

  const [countrySearch, setCountrySearch] = useState("");
  const [allCountries, setAllCountries] = useState([]);

  const [searchTitle, setSearchTitle] = useState("");

  const [emptyMessage, setEmptyMessage] = useState("");

  const [errorMessage, setErrorMessage] = useState("");

  const getAllJobs = () => {
    axios
      .get(
        "http://localhost:5000/jobs",
        //this is how to send a token using axios
        {
          headers: {
            Authorization: `Bearer ${token}`, //if we write Authorization or authorization(with small a) both will work fine
          },
        }
      )
      .then((result) => {
        if (result.data.message === "No Jobs Have Been Created Yet") {
          setEmptyMessage(result.data.message);
        } else {
          setJobs(result.data.jobs);
        }
      })
      .catch((err) => {
        console.log(err);
        //we add this condition to check if the user login or not
        if (err.response.data.message === "The token is invalid or expired") {
          return logout(); //i dont need to use navigate since i already did in the useEffect under and this function will change the value of the state so it will make the useEffect run again and it will see the condition so it will apply the navigate
        }

        //we add this condition in the case something went wrong and we were unable to get the error message from the backed then there will be a default error message to view it to the user
        if (err.response.data) {
          return setErrorMessage(err.response.data.message);
        }

        setErrorMessage("Error happened while Get Data, please try again");
      });
  };

  const getCategories = async () => {
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

      console.log("this is all the categories", categoriesSelect);

      setAllCategories(categoriesSelect);
    } catch (err) {
      console.log(err);
      //we add this condition to check if the user login or not
      if (err.response.data.message === "The token is invalid or expired") {
        return logout(); //i dont need to use navigate since i already did in the useEffect under and this function will change the value of the state so it will make the useEffect run again and it will see the condition so it will apply the navigate
      }

      //we add this condition in the case something went wrong and we were unable to get the error message from the backed then there will be a default error message to view it to the user
      if (err.response.data) {
        return setErrorMessage(err.response.data.message);
      }

      setErrorMessage("Error happened while Get Data, please try again");
    }
  };

  const getCountries = async () => {
    try {
      //getting all the categories from the backend
      const countriesName = await axios.get(
        "https://restcountries.com/v3.1/all"
      );

      const countriesSelect = [];
      countriesName.data.map((element) => {
        countriesSelect.push({
          value: element.name.common,
          label: element.name.common,
        });
      });

      setAllCountries(countriesSelect);
      //   console.log("all the countries are", countriesSelect);
    } catch (err) {
      console.log(err);
      //we add this condition to check if the user login or not
      if (err.response.data.message === "The token is invalid or expired") {
        return logout(); //i dont need to use navigate since i already did in the useEffect under and this function will change the value of the state so it will make the useEffect run again and it will see the condition so it will apply the navigate
      }

      //we add this condition in the case something went wrong and we were unable to get the error message from the backed then there will be a default error message to view it to the user
      if (err.response.data) {
        return setErrorMessage(err.response.data.message);
      }

      setErrorMessage("Error happened while Get Data, please try again");
    }
  };

  // and the reason that i used useEffect is that i want the data to be displayed the moment the component is loaded, and if did not apply useEffect and only used axios without the useEffect then it will continue to bring and display the posts without a stop because there is no condition to make it stop, so thats why we apply useEffect and give it an empty array so it only run(render) one time
  useEffect(() => {
    if (!token) {
      navigate("/login");
    }

    //the reason that we add this condition is because when the page is refreshed it will take sometime in order to take the token from the context hook and until then it will take the default value first then it will take the token value so thats why we first add the condition and make sure that the token exist
    if (token && token !== "there is no token") {
      getAllJobs();
      getCategories();
      getCountries();
    }
  }, [token]); //the reason that we put the token state inside the array dependency because in the beginning the value of the token state will be the default value and then it will change to the token value that why we add it in the dependency array so when it get change and take the decoded from of the token, then it make the real request

  //we used map to iterate over the array and send data as a prop to the single item component
  let jobList = [];

  //the first iteration is used to search depending on the input search bar to search by title or category or country
  if (searchTitle) {
    jobList = jobs
      .filter((element) => {
        //we add the filter to make the filtration but since our item will be view in another component thats why we add the map to send our component item by item to the other component that will view it, because using filter alone will not work because our return will be an array of the filtered item and that is not we want we want each item to be separated and not inside an array so that why we added that map to bring each array alone
        return (
          element.title.toLowerCase().includes(searchTitle.toLowerCase()) ||
          element.country.toLowerCase().includes(searchTitle.toLowerCase()) ||
          element.category_id.name
            .toLowerCase()
            .includes(searchTitle.toLowerCase())
        );
      })
      .map((element) => {
        //we created this part in order to view the date as a string and not a number
        const createdJobDate = new Date(element.createdAt)
          .toString()
          .substring(4, 10);

        return (
          <SingleJob key={element._id} job={element} jobDate={createdJobDate} />
        ); //the key has to be named that way and if we tried to change it and give it a name of id an error will appear on the console, and also it value has to be unique or an error will also occur so that why we usually  give it the value of the id, so if there is an array of element in jsx and they all have the same name for example <p> we have to give each one of them a key attribute or an error will appear
      });
  }

  if (categorySearch) {
    jobList = jobs
      .filter((element) => {
        //we add the filter to make the filtration but since our item will be view in another component thats why we add the map to send our component item by item to the other component that will view it, because using filter alone will not work because our return will be an array of the filtered item and that is not we want we want each item to be separated and not inside an array so that why we added that map to bring each array alone
        return element.category_id.name
          .toLowerCase()
          .includes(categorySearch.toLowerCase());
      })
      .map((element) => {
        // console.log("the unique index is", element._id);

        //we created this part in order to view the date as a string and not a number
        const createdJobDate = new Date(element.createdAt)
          .toString()
          .substring(4, 10);

        return (
          <SingleJob key={element._id} job={element} jobDate={createdJobDate} />
        ); //the key has to be named that way and if we tried to change it and give it a name of id an error will appear on the console, and also it value has to be unique or an error will also occur so that why we usually  give it the value of the id, so if there is an array of element in jsx and they all have the same name for example <p> we have to give each one of them a key attribute or an error will appear
      });
  }

  if (countrySearch) {
    jobList = jobs
      .filter((element) => {
        //we add the filter to make the filtration but since our item will be view in another component thats why we add the map to send our component item by item to the other component that will view it, because using filter alone will not work because our return will be an array of the filtered item and that is not we want we want each item to be separated and not inside an array so that why we added that map to bring each array alone
        return element.country
          .toLowerCase()
          .includes(countrySearch.toLowerCase());
      })
      .map((element) => {
        //we created this part in order to view the date as a string and not a number
        const createdJobDate = new Date(element.createdAt)
          .toString()
          .substring(4, 10);

        return (
          <SingleJob key={element._id} job={element} jobDate={createdJobDate} />
        ); //the key has to be named that way and if we tried to change it and give it a name of id an error will appear on the console, and also it value has to be unique or an error will also occur so that why we usually  give it the value of the id, so if there is an array of element in jsx and they all have the same name for example <p> we have to give each one of them a key attribute or an error will appear
      });
  }

  return (
    <>
      {allCountries.length ? (
        <>
          <input
            type={"text"}
            placeholder={"Search Based On Job Title Or Country Or Category"}
            onChange={(e) => {
              setSearchTitle(e.target.value);
              setCountrySearch("");
              setCategorySearch("");
            }}
          />
          <br />

          <Select
            name="country"
            id="country"
            options={allCountries}
            defaultValue={{ value: "", label: "Select A Country" }}
            onChange={(e) => {
              setCountrySearch(e.label);
              setCategorySearch("");
              setSearchTitle("");
            }}
            className="react-select"
          />
          <br />

          <Select
            name="category"
            id="category"
            options={allCategories}
            defaultValue={{ value: "", label: "Select A Country" }}
            onChange={(e) => {
              setCategorySearch(e.label);
              setCountrySearch("");
              setSearchTitle("");
            }}
            className="react-select"
          />
          <br />

          {jobList.length !== 0 ? (
            jobList
          ) : (
            <div>The Job That You Searched For Is Not Found</div>
          )}

          {/* we add this condition because there might be no job post that have been created yet so thats why instead of an array a string message will appear */}
          {emptyMessage ? emptyMessage : ""}
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

      {errorMessage && <div>{errorMessage}</div>}
    </>
  );
};

export default HomePage; //if we use export default then when we import we dont use {} or an error will appear
