//import styling
import "./App.css";

//importing packages
import { Routes, Route } from "react-router-dom";

//importing components
import HomePage from "./components/HomePage"; //since the file inside the folder component has the name of index.js then there is no need to specify it in the import path like this "./components/Register/index" because if you specify a folder then it look inside it files and if it saw a file with the name index then it will import that one, but if we want to import a file with another name then we need so specify it in the import path or it will not be imported

import LoginPage from "./components/LoginPage"; //since the file inside the folder component has the name of index.js then there is no need to specify it in the import path like this "./components/Register/index" because if you specify a folder then it look inside it files and if it saw a file with the name index then it will import that one, but if we want to import a file with another name then we need so specify it in the import path or it will not be imported

import SignupPage from "./components/SignupPage"; //since the file inside the folder component has the name of index.js then there is no need to specify it in the import path like this "./components/Register/index" because if you specify a folder then it look inside it files and if it saw a file with the name index then it will import that one, but if we want to import a file with another name then we need so specify it in the import path or it will not be imported

function App() {
  return (
    <div className="App">
      {/* Routes are used to wrap the Route components, it is not possible to define a Route without it being wrapped by Routes */}
      <Routes>
        {/* Route: will render whatever JSX in the element prop if the path matches.
          path: is used to define the path that will be used to render the element, if the path is `/` then it should render `Home` when the path matches.
          Having the path set to `/` means that it is the root path, in other words it means that there is no path provided. */}

        <Route path="/" element={<h1>hello</h1>} />

        <Route path="/signup" element={<SignupPage />} />

        {/* <Route path="/login" element={<LoginPage />} /> */}

        {/* this is the not found page component in case the user entered a path that is not defined in the routes above it will send him to this route, and that's why we put the "*" so we tell the code that if the entered path is nothing like the above path's then it means that it is something else and "*" means anything so it will choose this route and render the not found component */}
        <Route path="*" element={<h1>Not Found Page</h1>} />
      </Routes>
    </div>
  );
}

export default App;