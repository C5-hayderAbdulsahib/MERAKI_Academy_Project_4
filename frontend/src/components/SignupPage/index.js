//import packages
import React, { useEffect, useState } from "react";
import axios from "axios";
import Select from "react-select";

//import styling
import "./style.css";

const SignupPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [companyName, setCompanyName] = useState("something"); //we add a default value instead of keeping it to empty array in order to make the validation work
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
      const countriesName = await axios.get(
        "https://restcountries.com/v3.1/all"
      );

      //   console.log(countriesName.data[0].name.common);
      setCountries(countriesName.data);
      console.log(countriesName.data);
    };
    getCountriesFun();
  }, []);

  const testing = [];

  if (countries) {
    // console.log("i am inside useeefct");
    countries.map((element) => {
      testing.push({
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
      setCompanyName("something");
      setRequiredMessage("");
    }
  };

  const options = [
    { value: "chocolate", view: "Chocolate" },
    { value: "strawberry", label: "Strawberry" },
    { value: "vanilla", label: "Vanilla" },
  ];

  return (
    <div className="signup">
      <h3>Signup Form:</h3>
      <br />

      <label htmlFor="email">Choose a Email:</label>
      <input
        type={"email"}
        name="email"
        id="email"
        placeholder="Email"
        onChange={(e) => {
          setEmail(e.target.value);
        }}
      />
      <br />

      <label htmlFor="password">Choose a Password:</label>
      <input
        type={"password"}
        name="password"
        id="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <br />

      <label htmlFor="fname">Choose a First Name:</label>
      <input
        type={"text"}
        name="fname"
        id="fname"
        placeholder="First Name"
        onChange={(e) => setFirstName(e.target.value)}
      />
      <br />

      <label htmlFor="lname">Choose a Last Name:</label>
      <input
        type={"text"}
        name="lname"
        id="lname"
        placeholder="Last Name"
        onChange={(e) => setLastName(e.target.value)}
      />
      <br />

      <label htmlFor="country">Choose an Country:</label>

      <select
        name="country"
        id="country"
        onChange={(e) => setSelectedCountry(e.target.value)}
      >
        <option value="">Select A Country</option>
        {countries
          ? countries.map((element, index) => {
              return (
                <option value={element.name.common} key={index}>
                  {element.name.common}
                </option>
              );
            })
          : ""}
      </select>
      <br />
      <br />

      <Select
        options={testing}
        defaultValue={{ value: "vanilla", label: "Vanilla" }}
        className="react-select"
      />

      <label htmlFor="roles">Choose an Account Type:</label>
      <select
        name="roles"
        id="roles"
        onChange={(e) => chooseRole(e.target.value)}
      >
        <option value="">Choose A Type</option>

        <option value="627ccc9c30d3541b35145ed5">Individual Account</option>
        <option value="627cccac30d3541b35145ed7">Company Account</option>
      </select>
      <br />

      {showCompanyNameField ? (
        <>
          <label htmlFor="companyN">Choose a Company Name:</label>
          <input
            type={"text"}
            name="companyN"
            id="companyN"
            placeholder="Company Name"
            onChange={(e) => setCompanyName(e.target.value)}
          />
          <br />
        </>
      ) : (
        ""
      )}

      <button onClick={CreateUser}>Signup</button>
      <br />

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
  );
};

export default SignupPage; //if we use export default then when we import we dont use {} or an error will appear
