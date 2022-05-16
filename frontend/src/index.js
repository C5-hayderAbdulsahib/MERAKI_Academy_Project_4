import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

// import BrowserRouter in order to be able to use it
import { BrowserRouter } from "react-router-dom";

//importing the context providers
import AuthProvider from "./contexts/authContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    {/* wrap BrowserRouter around the App component */}
    <BrowserRouter>
      {/* wrapping the App component between the AuthProvider in order to get the context hook data to make it available to the entire application, and doing this inside the index.js is better that doing that in the app.js file because we want the context data to be available to the entire project  */}
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
