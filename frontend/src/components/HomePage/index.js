//import packages
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// import the context which we created in the authContext.js using the Context hook
import { AuthContext } from "../../contexts/authContext";

const HomePage = () => {
  //   we can use the states that are send using the useContext by either calling it property from the object or by using destructuring
  //   const setIsLoggedIn = useContext(TokenContext).setIsLoggedIn;
  //   const setToken = useContext(TokenContext).setToken;

  //or we can use destructuring to get the state from the context hook
  // assign the context value to a variable so it can be used (we get this context value from the useContext hook)
  const { token, isLoggedIn } = useContext(AuthContext);

  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);

  const [renderPage, setRenderPage] = useState(false); //we add this state for the useEffect to put it inside the array dependency in order to make it run again when this state change it value, and we give it an initial value of boolean to make it easy to change by just give it a not logical operator

  // useEffect(() => {
  //   if (!isLoggedIn) {
  //     console.log("the user is inside the home page");
  //     // navigate("/login"); //make the condition inside the request
  //   }
  // }, []);

  // and the reason that i used useEffect is that i want the data to be displayed the moment the component is loaded, and if did not apply useEffect and only used axios without the useEffect then it will continue to bring and display the posts without a stop because there is no condition to make it stop, so thats why we apply useEffect and give it an empty array so it only run(render) one time
  useEffect(() => {
    //we add a condition which will be applied if the user was not logged in and it will redirect the user to the login page
    // if (!token) {
    //   navigate("/login");
    //   return; //and the reason that we add the return is because if the user is not log in then i don't to use axios to fetch the data so we used return to get out from the useEffect function and stop it's execution
    // }

    axios
      .get(
        "http://localhost:5000/categories",
        //this is how to send a token using axios
        {
          headers: {
            Authorization: `Bearer ${token}`, //if we write Authorization or authorization(with small a) both will work fine
          },
        }
      )
      .then((result) => {
        console.log(result);
        setCategories(result.data.jobs);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [renderPage]); //the reason that we put the renderPage state inside the array dependency because when the renderPage state change it will make the useEffect function run again so it will bring all the articles from the api using axios, which means it will bring all the articles again but with the new changes that we made from update or delete so it will bring all the new data without the need to refresh the page

  //we used map to iterate over the todos array and send data as a prop to the ListItem item component so we can have multiple li inside the ul each of them containing an element form the todos array
  const todosList = categories.map((element) => {
    console.log("the unique index is", element.id);
    // return <ListItem key={element.id} todo={element.todo} id={element.id} />; //the key has to be named that way and if we tried to change it and give it a name of id an error will appear on the console, and also it has to be unique or an error will also occur so that why we usually  give it the value of the index, so if there is an array of element in jsx and they all have the same name for example <p> we have to give each one of them a key attribute or an error will appear
  });

  return (
    <>
      <ul className="unordered-list">{todosList}</ul>
    </>
  );
};

export default HomePage; //if we use export default then when we import we dont use {} or an error will appear
