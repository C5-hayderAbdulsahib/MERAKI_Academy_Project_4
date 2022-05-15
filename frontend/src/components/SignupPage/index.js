//import packages
import React, { useEffect, useState } from "react";
import axios from "axios";

//import styling
import "./style.css";

const SignupPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [countries, setCountries] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [accountType, setAccountType] = useState("");

  const [message, setMessage] = useState("");

  const [errorStyle, setErrorStyle] = useState("");

  const [showCompanyNameField, setShowCompanyNameField] = useState(false);

  const CreateUser = () => {
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
      })
      .catch((err) => {
        console.log("the error is", err);
        setMessage(err.response.data.message);
        setErrorStyle("err");
      });
  };

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

  const chooseRole = (eValue) => {
    setAccountType(eValue);

    if (eValue === "627cccac30d3541b35145ed7") {
      setShowCompanyNameField(true);
    } else {
      setShowCompanyNameField(false);
    }
  };

  return (
    <div className="login">
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

      <label htmlFor="roles">Choose an Account Type:</label>
      <select
        name="roles"
        id="roles"
        onChange={(e) => chooseRole(e.target.value)}
      >
        <option value="627ccc9c30d3541b35145ed5">Choose A Type</option>

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
      {message ? (
        <p className={errorStyle ? "login__err" : ""}>{message}</p>
      ) : (
        ""
      )}
    </div>
  );
};

export default SignupPage; //if we use export default then when we import we dont use {} or an error will appear
