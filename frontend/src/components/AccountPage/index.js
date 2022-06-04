//import packages
import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import FadeLoader from "react-spinners/FadeLoader";

import fileDownload from "js-file-download";

import ChangePasswordModal from "./ChangePasswordModal";

//import the image in the component to use it
import profileImage from "../../assest/profile image.png";

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
  const { token, logout, tokenDecoded, setUserImgProfile, setUserAccountData } =
    useContext(AuthContext);

  const [userInfo, setUserInfo] = useState("");

  const [companyName, setCompanyName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [countries, setCountries] = useState({});
  const [phoneNum, setPhoneNum] = useState("");

  //states for the change password models
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isOpen, setIsOpen] = useState(false); //the reason that we created this state is for showing or hiding the model
  const [passwordErrMessage, setPasswordErrMessage] = useState("");
  const [passwordSuccessMsg, setPasswordSuccessMsg] = useState("");

  //this state is for the image
  const [image, setImage] = useState("");
  const [imgUrl, setImgUrl] = useState("");
  const [cv, setCv] = useState("");
  const [cvUrl, setCvUrl] = useState("");

  const [successMessage, setSuccessMessage] = useState("");

  const [errMessage, setErrMessage] = useState("");

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

      setUserInfo(userInfo.data.user);
      setCompanyName(userInfo.data.user.company_name);
      setFirstName(userInfo.data.user.first_name);
      setLastName(userInfo.data.user.last_name);
      setPhoneNum(userInfo.data.user.phone_number);

      setImgUrl(userInfo.data.user.image_profile);

      setCvUrl(userInfo.data.user.user_cv);

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

      console.log("the image url is this one", imgUrl);
      const response = await axios.put(
        `http://localhost:5000/users`,
        {
          // the data that is entered in the object that is sent using axios must have the same key name as the name in postman(the same field name in the DB) or an error will occur

          first_name: firstName, //the key has to be the same key in the backend
          last_name: lastName,
          company_name: companyName,
          country: countries.myCountry,
          phone_number: phoneNum,
          image_profile: imgUrl,
          user_cv: cvUrl,
        },

        //this is how to send a token using axios
        {
          headers: {
            Authorization: `Bearer ${token}`, //if we write Authorization or authorization(with small a) both will work fine
          },
        }
      );

      setUserAccountData({
        first_name: firstName,
        last_name: lastName,
        company_name: companyName,
        country: countries.myCountry,
        phone_number: phoneNum,
        image_profile: imgUrl,
        user_cv: cvUrl,
      });

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

  //this function is for uploading images on my account on cloudinary server
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
        setImgUrl(data.url);
      })
      .catch((err) => console.log(err));
  };

  //this function is for uploading pdf on my account on cloudinary server
  const uploadCv = () => {
    const data = new FormData();
    data.append("file", cv);
    data.append("upload_preset", "merakie");
    data.append("cloud_name", "dkqqtkt3b");
    fetch("https://api.cloudinary.com/v1_1/dkqqtkt3b/image/upload", {
      method: "post",
      body: data,
    })
      .then((resp) => resp.json())
      .then((data) => {
        setCvUrl(data.url);
      })
      .catch((err) => console.log(err));
  };

  //this function is for downloading the cv
  const downloadFile = () => {
    let filePath = cvUrl;
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

  return (
    <>
      {countries.myCountry ? (
        <div className="update-account">
          <div className="grid-center">
            <div className="title">
              <h1>Account Info:</h1>
            </div>

            {/* this input file is for uploading images to cloudinary server */}
            <div className="image-section">
              <h3>Uploaded Image Will Be Displayed Here</h3>
              <div className="account-image">
                {imgUrl ? (
                  <img src={imgUrl} alt="profile image" />
                ) : (
                  <img src={profileImage} alt="profile image" />
                )}
              </div>
            </div>

            <div className="upload-image-inputs">
              <div>
                <input
                  type="file"
                  onChange={(e) => setImage(e.target.files[0])}
                  className="custom-file-input-image"
                ></input>
              </div>
              <div>
                <button onClick={uploadImage}>Upload Image</button>
              </div>
            </div>

            {/* this input file is for uploading cv to cloudinary server */}

            <div className="download-cv-inputs">
              <div>
                <h3>Uploaded Cv Will Be Displayed Here</h3>
              </div>
              {cvUrl ? (
                <>
                  <div className="combine-buttons-for-cv-after-uploading">
                    <div>
                      <a href={cvUrl} target="cv">
                        Click Here To View Your Cv
                      </a>
                    </div>
                    <div>
                      <button onClick={downloadFile}>
                        download Your Saved Cv
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <p>you dont have a saved cv</p>
              )}
            </div>

            <div className="upload-cv-inputs">
              <div className="combiend-cv-btn-before-uploading">
                <div>
                  <input
                    type="file"
                    onChange={(e) => setCv(e.target.files[0])}
                    className="custom-file-input-cv"
                  ></input>
                </div>
                <div>
                  <button onClick={uploadCv} className="upload-cv-btn">
                    Upload A New Cv
                  </button>
                </div>
              </div>
            </div>
            <br></br>
            <br></br>
            <br></br>

            {/* the model component */}
            {/* we make a condition if the state is false then dont show the model else show it */}
            {isOpen && (
              <ChangePasswordModal
                oldPassword={oldPassword}
                setOldPassword={setOldPassword}
                newPassword={newPassword}
                setNewPassword={setNewPassword}
                confirmPassword={confirmPassword}
                setConfirmPassword={setConfirmPassword}
                passwordErrMessage={passwordErrMessage}
                setPasswordErrMessage={setPasswordErrMessage}
                passwordSuccessMsg={passwordSuccessMsg}
                setPasswordSuccessMsg={setPasswordSuccessMsg}
                logout={logout}
                setIsOpen={setIsOpen} //the reason that we send this state is to be able to close the model in the model component
                token={token}
              />
            )}

            {/* the reason that we set the state to true is to show the model */}
            <p>Click Here to Change Your Password</p>
            <div className="change-password">
              <button onClick={() => setIsOpen(true)}>change password</button>
            </div>

            <div className="user-form">
              <div className="fname-field">
                <label htmlFor="fname">Change Your First Name:</label>
                <input
                  type={"text"}
                  id="fname"
                  placeholder="First Name"
                  value={firstName}
                  onChange={(e) => {
                    setFirstName(e.target.value);
                    setSuccessMessage("");
                    setRequiredMessage("");
                  }}
                />
              </div>

              <div className="lname-field">
                <label htmlFor="lname">Change Your Last Name:</label>
                <input
                  type={"text"}
                  id="lname"
                  placeholder="Last Name"
                  value={lastName}
                  onChange={(e) => {
                    setLastName(e.target.value);
                    setSuccessMessage("");
                    setRequiredMessage("");
                  }}
                />
              </div>

              {tokenDecoded.role === "COMPANY" && (
                <>
                  <div className="company-field">
                    <label htmlFor="lname">Change Your Company Name:</label>
                    <input
                      type={"text"}
                      id="lname"
                      placeholder="Company Name"
                      value={companyName}
                      onChange={(e) => {
                        setCompanyName(e.target.value);
                        setSuccessMessage("");
                        setRequiredMessage("");
                      }}
                    />
                  </div>
                </>
              )}
              <br></br>
              <div className="country-field">
                <label htmlFor="country">Update Country:</label>
                <Select
                  name="country"
                  id="country"
                  className="react-select"
                  options={countriesSelect}
                  defaultValue={{
                    value: countries.myCountry,
                    label: countries.myCountry,
                  }}
                  styles={{ width: "2000px" }}
                  onChange={(e) => {
                    setCountries({
                      myCountry: e.value,
                      allCountries: countries.allCountries,
                    });
                    setSuccessMessage("");
                    setRequiredMessage("");
                  }}
                />
              </div>

              <div className="phone-filed">
                <label htmlFor="phone number">Update Phone Number:</label>
                <input
                  type={"text"}
                  placeholder="Phone Number"
                  id="phone number"
                  value={phoneNum}
                  onChange={(e) => {
                    setPhoneNum(e.target.value);
                    setSuccessMessage("");
                    setRequiredMessage("");
                  }}
                />
              </div>
              <br></br>

              <div className="update-btn">
                <button onClick={updateAccount} className="style-button">
                  Update Account
                </button>
              </div>
              {/* this part is for showing the user a success message for the user from the backend if his form was sent successfully */}
              {successMessage ? (
                <p className="account-updated-success">{successMessage}</p>
              ) : (
                ""
              )}
              {/* this part is for showing an error message for the validation */}
              {requiredMessage && (
                <p className="errMessage">{requiredMessage}</p>
              )}
            </div>
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
      {errMessage && <p>{errMessage}</p>}
    </>
  );
};
