//import packages
import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import Select from "react-select";
import FadeLoader from "react-spinners/FadeLoader";

import fileDownload from "js-file-download";

import testingCloudenary from "./testingCloudenary";

// import the context which we created in the authContext.js using the useContext hook
import { AuthContext } from "../../contexts/authContext";

//import styling
import "./style.css";

//since we used export directly then when we import we have to add the {} or an error will occur
export const AccountPage = () => {
  //   we can use the states that are send using the useContext by either calling it property from the object or by using destructuring
  //   const setIsLoggedIn = useContext(TokenContext).setIsLoggedIn;
  //   const setToken = useContext(TokenContext).setToken;

  //or we can use destructuring to get the state from the context hook
  // assign the context value to a variable so it can be used (we get this context value from the useContext hook)
  const { token, logout, tokenDecoded } = useContext(AuthContext);

  const [userInfo, setUserInfo] = useState("");

  const [companyName, setCompanyName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [countries, setCountries] = useState({});
  const [selectedCountry, setSelectedCountry] = useState("");
  const [phoneNum, setPhoneNum] = useState("");

  const [successMessage, setSuccessMessage] = useState("");

  const [errMessage, setErrMessage] = useState("");

  //   const [hide, setHide] = useState(false); //we add this state to either hide the form or show it depending on the case

  const [requiredMessage, setRequiredMessage] = useState("");

  // use the `useNavigate` hook in the component to gain access to the instance that is used to navigate
  const navigate = useNavigate();

  console.log("the role of the user", tokenDecoded.role);

  const getUserInfo = async () => {
    try {
      const userInfo = await axios.get(
        "http://localhost:5000/users",
        //this is how to send a token using axios
        {
          headers: {
            Authorization: `Bearer ${token}`, //if we write Authorization or authorization(with small a) both will work fine
          },
        }
      );

      console.log("the User Info", userInfo.data.user);
      setUserInfo(userInfo.data.user);

      setCompanyName(userInfo.data.user.company_name);

      setFirstName(userInfo.data.user.first_name);
      setLastName(userInfo.data.user.last_name);
      //   setCountries(userInfo.data.user.country);
      setPhoneNum(userInfo.data.user.phone_number);

      const countriesName = await axios.get(
        "https://restcountries.com/v3.1/all"
      );

      //   console.log(countriesName.data[0].name.common);
      setCountries({
        myCountry: userInfo.data.user.country,
        allCountries: countriesName.data,
      });
      console.log(countriesName.data);
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

  const updateAccount = async () => {
    try {
      if (
        !(
          companyName &&
          firstName &&
          lastName &&
          countries.myCountry &&
          phoneNum
        )
      ) {
        setRequiredMessage("you have to fill all the input field");
        return;
      }

      setRequiredMessage(""); //the reason for adding this line is that if the user does not have a validation error he might get a server error form the backend so and the problem is the both messages will appear at the same time and that is very confusion

      const response = await axios.put(
        `http://localhost:5000/users`,
        {
          // the data that is entered in the object that is sent using axios must have the same key name as the name in postman(the same field name in the DB) or an error will occur

          first_name: firstName, //the key has to be the same key in the backend
          last_name: lastName,
          company_name: companyName,
          country: countries.myCountry,
          phone_number: phoneNum,
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

  const countriesSelect = [];

  if (countries.allCountries) {
    console.log("i am in the country loop", countries);
    countries.allCountries.map((element) => {
      countriesSelect.push({
        value: element.name.common,
        label: element.name.common,
      });
    });
  }

  // and the reason that i used useEffect is that i want the data to be displayed the moment the component is loaded, and if did not apply useEffect and only used axios without the useEffect then it will continue to bring and display the posts without a stop because there is no condition to make it stop, so thats why we apply useEffect and give it an empty array so it only run(render) one time
  useEffect(() => {
    if (!token) {
      navigate("/login");
    }

    //the reason that we add this condition is because when the page is refreshed it will take sometime in order to take the token from the context hook and until then it will take the default value first then it will take the token value so thats why we first add the condition and make sure that the token exist
    if (token && token !== "there is no token") {
      getUserInfo();
    }
  }, [token]); //the reason that we put the token state inside the array dependency because in the beginning the value of the token state will be the default value and then it will change to the token value that why we add it in the dependency array so when it get change and take the decoded from of the token, then it make the real request

  const downloadFile = () => {
    console.log("enterd");
    let filePath =
      "https://res.cloudinary.com/dkqqtkt3b/image/upload/v1652973859/q7zdpdazy9silluse1jb.pdf";
    axios
      .get(`${filePath}`, {
        responseType: "blob",
      })
      .then((res) => {
        let filename = filePath.replace(/^.*[\\\/]/, "");
        let fileExtension;
        fileExtension = filePath.split(".");
        fileExtension = fileExtension[fileExtension.length - 1];
        fileDownload(res.data, `${filename}.${fileExtension}`);
      });
  };

  const [image, setImage] = useState("");
  const [url, setUrl] = useState("");

  const uploadImage = () => {
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "merakie");
    data.append("cloud_name", "dkqqtkt3b");
    fetch("https://api.cloudinary.com/v1_1/dkqqtkt3b/image/upload", {
      method: "post",
      body: data,
    })
      .then((resp) => resp.json())
      .then((data) => {
        setUrl(data.url);
      })
      .catch((err) => console.log(err));
  };

  return (
    <>
      {countries.myCountry ? (
        <div>
          <h3>Account Info:</h3>
          <br />
          <button onClick={downloadFile}>download</button>
          <br></br>

          {/* ////////////////////////////////////////// */}

          <div>
            <div>
              <input
                type="file"
                onChange={(e) => setImage(e.target.files[0])}
              ></input>
              <button onClick={uploadImage}>Upload</button>
            </div>
            <div>
              <h1>Uploaded image will be displayed here</h1>
              <img src={url} />
            </div>
          </div>

          <a
            href={
              "https://res.cloudinary.com/dkqqtkt3b/image/upload/v1652973859/q7zdpdazy9silluse1jb.pdf"
            }
            target="_blank"
          >
            LinkedIn handle
          </a>

          {/* //////////////////////////////////////////////// */}

          <input
            type={"text"}
            placeholder="First Name"
            value={firstName}
            onChange={(e) => {
              setFirstName(e.target.value);
              setSuccessMessage("");
              setRequiredMessage("");
            }}
          />
          <br />
          <input
            type={"text"}
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => {
              setLastName(e.target.value);
              setSuccessMessage("");
              setRequiredMessage("");
            }}
          />
          <br />
          {tokenDecoded.role === "COMPANY" && (
            <>
              <input
                type={"text"}
                placeholder="Company Name"
                value={companyName}
                onChange={(e) => {
                  setCompanyName(e.target.value);
                  setSuccessMessage("");
                  setRequiredMessage("");
                }}
              />
              <br />
            </>
          )}
          <label htmlFor="country">Choose an Country:</label>
          <Select
            name="country"
            id="country"
            options={countriesSelect}
            defaultValue={{
              value: countries.myCountry,
              label: countries.myCountry,
            }}
            onChange={(e) => {
              setCountries({
                myCountry: e.value,
                allCountries: countries.allCountries,
              });
              setSuccessMessage("");
              setRequiredMessage("");
            }}
          />
          <br />
          <br />
          <input
            type={"text"}
            placeholder="Phone Number"
            value={phoneNum}
            onChange={(e) => {
              setPhoneNum(e.target.value);
              setSuccessMessage("");
              setRequiredMessage("");
            }}
          />
          <br />
          <button onClick={updateAccount}>Update Account</button>
          {/* this part is for showing the user a success message for the user from the backend if his form was sent successfully */}
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
