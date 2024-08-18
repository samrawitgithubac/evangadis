import { useNavigate } from "react-router-dom";
import React, { useRef, useState } from "react";
import { axiosConfig } from "../../Api/axiosConfig";
import classes from "./signUp.module.css";
import { ClipLoader } from "react-spinners";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Import visibility icons

const SignUp = ({ onSwitch }) => {
  const navigate = useNavigate();
  const usernameRef = useRef(null);
  const firstnameRef = useRef(null);
  const lastnameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const [data, setData] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState({
    password: false,
    userFullName: false,
    form: false,
  });
  const [isPasswordVisible, setPasswordVisible] = useState(false);

  async function handleSignUp(e) {
    e.preventDefault();

    const usernameValue = usernameRef.current.value;
    const firstnameValue = firstnameRef.current.value;
    const lastnameValue = lastnameRef.current.value;
    const emailValue = emailRef.current.value;
    const passwordValue = passwordRef.current.value;

    // Regular expression for validating names (letters and optional spaces)
    const nameRegex = /^[A-Za-z]+(?: [A-Za-z]+)*$/;

    // Clear previous errors
    setError({ password: false, userFullName: false, form: false });

    if (
      !usernameValue ||
      !firstnameValue ||
      !lastnameValue ||
      !emailValue ||
      !passwordValue
    ) {
      setError((prevState) => ({
        ...prevState,
        form: true,
      }));
      return;
    }

    if (passwordValue.length < 8) {
      setError((prevState) => ({
        ...prevState,
        password: true,
      }));
      return;
    }

    if (!nameRegex.test(firstnameValue) || !nameRegex.test(lastnameValue)) {
      setError((prevState) => ({
        ...prevState,
        userFullName: true,
      }));
      return;
    }

    try {
      setLoading(true);
      await axiosConfig.post("/user/register", {
        username: usernameValue,
        first_name: firstnameValue,
        last_name: lastnameValue,
        email: emailValue,
        password: passwordValue,
      });

  setSuccess(true);
      // Delay to show success message
      setTimeout(() => onSwitch("login"), 1000);
    } catch (error) {
      console.error("Something went wrong:", error);
      setData(error.response?.data?.msg);
    } finally {
      setLoading(false);
    }
  }

  const togglePasswordVisibility = () => {
    setPasswordVisible((prev) => !prev);
  };

  return success ? (
    <div>Registration successful, please login!</div>
  ) : (
    <div>
      <form onSubmit={handleSignUp}>
        <div className={classes.signup__title}>
          <h6>Join the network</h6>
        </div>
        <div className={classes.signUp__Description}>
          <p>
            Already have an account?
            <button
              type="button"
              onClick={() => onSwitch("login")}
              className={classes.signup_Description_orange}
            >
              Sign in
            </button>
          </p>
        </div>
        <div>
          {error.userFullName && (
            <div className={classes.errorHandling}>
              Numbers are not allowed in the full name field. Kindly enter only
              letters.
            </div>
          )}
          {error.password && (
            <div className={classes.errorHandling}>
              Please use a password with more than 8 characters
            </div>
          )}
          {error.form && (
            <div className={classes.errorHandling}>All fields are required</div>
          )}
          {data && <div className={classes.errorHandling}>{data}</div>}
        </div>
        <div>
          <input
            className={`${classes.signup__input} ${
              error.form ? classes.error : ""
            }`}
            type="text"
            placeholder="User Name"
            ref={usernameRef}
          />
          <div className={classes.firstLast_names}>
            <input
              className={`${classes.signup__input} ${
                error.form ? classes.error : ""
              }`}
              type="text"
              placeholder="First Name"
              ref={firstnameRef}
            />
            <input
              className={`${classes.signup__input} ${
                error.form ? classes.error : ""
              }`}
              type="text"
              placeholder="Last Name"
              ref={lastnameRef}
            />
          </div>
          <input
            className={`${classes.signup__input} ${
              error.form ? classes.error : ""
            }`}
            type="email"
            placeholder="Email"
            ref={emailRef}
          />
          <div className={classes.passwordContainer}>
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
        </div>
        <button type="submit" className={classes.signup__btn}>
          {isLoading ? <ClipLoader color="#000" size={15} /> : "Agree and Join"}
        </button>
        <div className={classes.signup_Description_orange}>
          <button type="button" onClick={() => onSwitch("login")}>
            <p> Already have an account?</p>
          </button>
        </div>
      </form>
    </div>
  );
};

export default SignUp;
