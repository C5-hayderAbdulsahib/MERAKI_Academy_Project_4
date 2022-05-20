//import packages
import axios from "axios";

//import styling
import "./style.css";

//import icon from react icons
import { RiCloseLine } from "react-icons/ri";

const ChangePasswordModal = (props) => {
  const {
    oldPassword,
    setOldPassword,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    passwordErrMessage,
    setPasswordErrMessage,
    passwordSuccessMsg,
    setPasswordSuccessMsg,
    logout,
    setIsOpen,
    token,
  } = props;

  const changePassword = async () => {
    try {
      console.log(oldPassword);
      console.log(newPassword);

      const response = await axios.put(
        `http://localhost:5000/users/change_password`,
        {
          password: oldPassword, //the key has to be the same key in the backend
          new_password: newPassword,
          confirm_password: confirmPassword,
        },
        //this is how to send a token using axios
        {
          headers: {
            Authorization: `Bearer ${token}`, //if we write Authorization or authorization(with small a) both will work fine
          },
        }
      );

      setPasswordErrMessage("");
      setPasswordSuccessMsg(response.data.message);

      console.log(response.data.message);
    } catch (err) {
      console.log(err);
      setPasswordSuccessMsg("");
      //we add this condition to check if the user login or not
      if (err.response.data.message === "The token is invalid or expired") {
        return logout(); //i dont need to use navigate since i already did in the useEffect under and this function will change the value of the state so it will make the useEffect run again and it will see the condition so it will apply the navigate
      }

      //we add this condition in the case something went wrong and we were unable to get the error message from the backed then there will be a default error message to view it to the user
      if (err.response.data) {
        return setPasswordErrMessage(err.response.data.message);
      }

      setPasswordErrMessage("Error happened while Get Data, please try again");
    }
  };

  return (
    <>
      {/* the onclick event that we add so that if the user click outside the model anywhere in the window it will close the model and we can remove this part if we want to */}
      <div className="darkBG" onClick={() => setIsOpen(false)} />
      <div className="centered">
        <div className="modal">
          <div className="modalHeader">
            <h5 className="heading">Dialog</h5>
          </div>
          <button className="closeBtn" onClick={() => setIsOpen(false)}>
            <RiCloseLine style={{ marginBottom: "-3px" }} />
          </button>
          <div className="modalContent">
            {/* ///////////////////////////////the body f the model */}
            Are you sure you want to change your password?
            <input
              type={"text"}
              placeholder="Old Password"
              onChange={(e) => setOldPassword(e.target.value)}
            />
            <input
              type={"text"}
              placeholder="New Password"
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <input
              type={"text"}
              placeholder="Confirm Password"
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <br />
            {/* the update button */}
            <button
              onClick={() => {
                changePassword();
              }}
              className="deleteBtn"
            >
              change Password
            </button>
            {/* the cancel model button */}
            <button className="cancelBtn" onClick={() => setIsOpen(false)}>
              Cancel
            </button>
            {/* this part is for showing an error message from the backend */}
            {passwordSuccessMsg && <p>{passwordSuccessMsg}</p>}
            {/* this part is for showing an error message from the backend */}
            {passwordErrMessage && <p>{passwordErrMessage}</p>}
          </div>
          {/* // ... */}
        </div>
      </div>
    </>
  );
};

export default ChangePasswordModal;
