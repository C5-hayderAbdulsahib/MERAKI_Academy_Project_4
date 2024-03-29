//import packages
import React, { useEffect, useState } from "react";
import axios from "axios";
import Select from "react-select";

//import styling
import "./style.css";

const SignupPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [companyName, setCompanyName] = useState("none"); //we add a default value instead of keeping it to empty array in order to make the validation work
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [countries, setCountries] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [accountType, setAccountType] = useState("");

  const [message, setMessage] = useState("");

  const [errorStyle, setErrorStyle] = useState("");

  const [showCompanyNameField, setShowCompanyNameField] = useState(false);

  const [requiredMessage, setRequiredMessage] = useState("");

  const CreateUser = () => {
    setMessage(""); //we add this state here in the case if the user get an error message from the backend and solve it but in the same time he changed an input to empty so that why we add this line in order to remove the old message from the backend each time the user click on the signup button

    if (
      !(
        email &&
        password &&
        firstName &&
        lastName &&
        selectedCountry &&
        accountType &&
        companyName
      )
    ) {
      setRequiredMessage(
        "you have to fill all the input field and to select all the choices"
      );
      return;
    }

    setRequiredMessage(""); //the reason for adding this line is that if the user does not have a validation error he might get a server error form the backend so and the problem is the both messages will appear at the same time and that is very confusion

    axios
      .post("http://localhost:5000/users/signup", {
        // the data that is entered in the object that is dent using axios must have the same key name as the name in postman(the same field name in the DB) or an error will occur

        email, //this is the same as email: email
        password, //the key has to be the same key in the backend
        company_name: companyName,
        first_name: firstName,
        last_name: lastName,
        country: selectedCountry,
        role_id: accountType,
      })
      .then((result) => {
        console.log(result);
        setMessage(result.data.message);
        setErrorStyle("success");
      })
      .catch((err) => {
        console.log("the error is", err);
        setMessage(err.response.data.message);
        setErrorStyle("err");
      });
  };

  // and the reason that i used useEffect is that i want the data to be displayed the moment the component is loaded, and if did not apply useEffect and only used axios without the useEffect then it will continue to bring and display the posts without a stop because there is no condition to make it stop, so thats why we apply useEffect and give it an empty array so it only run(render) one time
  useEffect(() => {
    const getCountriesFun = async () => {
      try {
        const countriesName = await axios.get(
          "https://restcountries.com/v3.1/all"
        );

        //   console.log(countriesName.data[0].name.common);
        setCountries(countriesName.data);
        console.log(countriesName.data);
      } catch (err) {
        console.log(err);

        //we add this condition in the case something went wrong and we were unable to get the error message from the backed then there will be a default error message to view it to the user
        if (err.response.data) {
          return setMessage(err.response.data.message);
        }

        setMessage("Error happened while Get Data, please try again");
      }
    };
    getCountriesFun();
  }, []);

  const countriesSelect = [];

  if (countries) {
    // console.log("i am inside useeefct");
    countries.map((element) => {
      countriesSelect.push({
        value: element.name.common,
        label: element.name.common,
      });
    });
  }

  const chooseRole = (eValue) => {
    setAccountType(eValue); //this is to change the value of the state to the selected role

    //this condition is to check if the chosen role is a company role or not
    if (eValue === "627cccac30d3541b35145ed7") {
      setShowCompanyNameField(true); //we add this state to show the company name input field
      setCompanyName(""); //we add this state for the validation
      setRequiredMessage(""); //we add this state for the validation
    } else {
      setShowCompanyNameField(false);
      setCompanyName("none");
      setRequiredMessage("");
    }
  };

  return (
    <div className="signup-page">
      <div className="card-center">
        <div className="grid-card">
          <div className="title">
            <h3>Signup Form:</h3>
          </div>

          <div className="paragraph">
            <h3>Please Enter Your Information Here:</h3>
          </div>

          <div className="email-field">
            <label htmlFor="email">Choose a Email:</label>
            <input
              type={"email"}
              id="email"
              placeholder="Email"
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
          </div>

          <div className="password-field">
            <label htmlFor="password">Choose a Password:</label>
            <input
              type={"password"}
              id="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="fname-field">
            <label htmlFor="fname">Choose a First Name:</label>
            <input
              type={"text"}
              id="fname"
              placeholder="First Name"
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>

          <div className="lname-field">
            <label htmlFor="lname">Choose a Last Name:</label>
            <input
              type={"text"}
              id="lname"
              placeholder="Last Name"
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>

          <div className="country-field">
            <label htmlFor="country">Choose an Country:</label>
            <Select
              id="country"
              options={countriesSelect}
              defaultValue={{ value: "", label: "Select A Country" }}
              onChange={(e) => setSelectedCountry(e.value)}
              className="react-select"
            />
          </div>

          <div className="type-field">
            <label htmlFor="roles">Choose an Account Type:</label>
            <select
              id="roles"
              onChange={(e) => chooseRole(e.target.value)}
              className="the-select"
            >
              <option value="">Choose A Type</option>

              <option value="627ccc9c30d3541b35145ed5">
                Individual Account
              </option>
              <option value="627cccac30d3541b35145ed7">Company Account</option>
            </select>
          </div>

          {showCompanyNameField ? (
            <>
              <div className="company-filed">
                <label htmlFor="companyN">Choose a Company Name:</label>
                <input
                  type={"text"}
                  id="companyN"
                  placeholder="Company Name"
                  onChange={(e) => setCompanyName(e.target.value)}
                />
              </div>
            </>
          ) : (
            ""
          )}

          <div className="signup-btn">
            <button onClick={CreateUser}>Signup</button>
          </div>

          {/* this part is for showing an error message depending on the message from the backend */}
          {message ? (
            <p
              className={
                errorStyle !== "success" ? "signup__err" : "signup__success"
              }
            >
              {message}
            </p>
          ) : (
            ""
          )}

          {/* this part is for showing an error message for the validation */}
          {requiredMessage ? (
            <p className={requiredMessage ? "signup__err" : ""}>
              {requiredMessage}
            </p>
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
};

export default SignupPage; //if we use export default then when we import we dont use {} or an error will appear
