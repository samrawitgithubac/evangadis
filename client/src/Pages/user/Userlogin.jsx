
import React, { useState, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { axiosConfig } from "../../Api/axiosConfig";
import { DataContext } from "../../Component/DataProvider/DataProvider";
import { Type } from "../../utility/actiontype";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Import visibility icons
import classes from "./signUp.module.css";

const UserLogin = ({ onSwitch }) => {
  const [, dispatch] = useContext(DataContext);
  const navigate = useNavigate();
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const [error, setError] = useState({emptyRequiredFields:false,dataError:false});
    const [isPasswordVisible, setPasswordVisible] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    const emailValue = emailRef.current.value;
    const passwordValue = passwordRef.current.value;

    if (!emailValue || !passwordValue) {
      // emailRef.current.style.border = "2px solid lightRed";
      setError({emptyRequiredFields:true})
      return 
    }
    // if (!passwordValue) {
    //   passwordRef.current.style.backgroundColor = "lightpink";
    // }

    try {
      const response = await axiosConfig.post("/user/login", {
        email: emailValue,
        password: passwordValue,
      });
      const { token, username } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify({ username }));
      // dispatch({ type: Type.SET_USER, user: { Username } });
      // dispatch({ type: Type.SET_TOKEN, token });
      navigate("/landing");
    } catch (error) {
      console.log(error?.response?.data?.msg || "An error occurred");
      setError({dataError:true});
    }
  };
  const togglePasswordVisibility = () => {
    setPasswordVisible((prev) => !prev);
  };
  return (
    <>
      <div className={classes.form_Wrapper}>
        <div className={classes.signIn_Wrapper}>
          <form onSubmit={handleLogin}>
            <h6>Login to your account</h6>
            <p>
              Don’t have an account?
              <button
                type="button"
                style={{
                  backgroundColor: "white",
                  color: "#FE8402",
                }}
                onClick={() => onSwitch("signUp")}
              >
                Create a new account
              </button>
              {error.dataError ? (
                <div style={{ color: "red", padding: "15px" }}>
                  Either the user name or password your entered is incorrect
                </div>
              ) : (
                ""
              )}
              {error.emptyRequiredFields ? (
                <div style={{ color: "red", padding: "15px" }}>
                 All fields are required
                </div>
              ) : (
                ""
              )}
            </p>

            <div className={classes.email_Wrapper}>
              <input ref={emailRef} type="email" placeholder="Email" />
            </div>
            <div
              className={`${classes.input_wrapper} ${classes.passwordContainer}`}
            >
              <input
                className={`${classes.signup__input} ${
                  error.form ? classes.error : ""
                }`}
                type={isPasswordVisible ? "text" : "password"}
                placeholder="Password"
                ref={passwordRef}
              />
              <button
                type="button"
                className={classes.passwordToggle}
                onClick={togglePasswordVisibility}
              >
                {isPasswordVisible ? (
                  <FaEyeSlash color="#E9C1C1" size={25} />
                ) : (
                  <FaEye color="#E9C1C1" size={25} />
                )}
              </button>
            </div>
            <button
              type="button"
              className={classes.password_Wrapper}
              style={{
                backgroundColor: "white",
                color: "#FE8402",
              }}
              onClick={() => onSwitch("passwordReset")}
            >
              Forgot password?
            </button>
            <button type="submit" className={classes.LoginWrapper}>
              Login
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default UserLogin;
