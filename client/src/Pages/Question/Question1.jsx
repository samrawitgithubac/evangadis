import React, { useRef, useState, useContext } from "react";
import { DataContext } from "../../Component/DataProvider/DataProvider";
import { axiosBase } from "../../Api/axiosConfig";
import { Link, useNavigate } from "react-router-dom";
import classes from "./style.module.css";
import Layout from "../../Component/Layout/LayoutForquestion&ans";

function Question1() {
  const [state] = useContext(DataContext);
  const [success, setSuccess] = useState(false);
  const [questionLength, setQuestionLength] = useState(0); // State for character count
  const user = state.user;
  const titleDome = useRef(null);
  const questionDome = useRef(null);
  const navigate = useNavigate();

  const postQuestion = async (e) => {
    e.preventDefault();
    const title = titleDome.current.value;
    const question = questionDome.current.value;

    // Reset styles
    titleDome.current.style.border = "1px solid #ccc";
    titleDome.current.style.backgroundColor = "#fff";
    questionDome.current.style.border = "1px solid #ccc";
    questionDome.current.style.backgroundColor = "#fff";

    let hasError = false;

    if (!title.trim()) {
      titleDome.current.style.border = "1px solid red";
      titleDome.current.style.backgroundColor = "pink";
      hasError = true;
    }

    if (!question.trim()) {
      questionDome.current.style.border = "1px solid red";
      questionDome.current.style.backgroundColor = "pink";
      hasError = true;
    }

    if (hasError) {
      return; // Stop submission if there are validation errors
    }

    try {
      const result = await axiosBase.post("/question", {
        title,
        description: question,
      });
      console.log(result);
      setSuccess(true);


      // Handle successful post
      // Redirect to home page
      setTimeout(() => {
        navigate("/landing");
      }, 2000); // Redirect after 2 seconds to allow the success message to be seen
    } catch (error) {
      alert(error?.response?.data?.msg || "An error occurred.");
      console.log(error.response?.data || error);
    }
  };

  const handleQuestionChange = (e) => {
    setQuestionLength(e.target.value.length);
  };

  return (
    <Layout>
      <section className={classes.questionSection_wrapper}>
        <div className={classes.title__wrapper}>
          <h1>Steps To Write A Good Question</h1>
          <div className={classes.description__Wrapper}>
            <ul>
              <li>Summarize your problems in a one-line title</li>
              <li>Describe your problem in more detail.</li>
              <li>Describe what you tried and what you expected to happen</li>
              <li>Review your question and post it here</li>
            </ul>
          </div>
        </div>
        <div className={classes.answerForm}>
          <h1>Post Your Question</h1>
          <form onSubmit={postQuestion}>
            {success && (
              <p style={{ color: "green", fontSize: "18px" }}>
                Question Posted Successfully. Redirecting to home page...
              </p>
            )}
            <div>
              <input ref={titleDome} type="text" placeholder="Question title" />
            </div>
            <br />
            <div>
              <textarea
                ref={questionDome}
                rows="4"
                cols="50"
                placeholder="Question detail"
                onChange={handleQuestionChange} // Update character count on change
              />
              <br />
              <span className={classes.charCount}>{questionLength}/200</span>
            </div>
            <br />
            <div className={classes.Submit}>
              <button type="submit">Post Question</button>
            </div>
          </form>
        </div>
      </section>
    </Layout>
  );
}

export default Question1;
