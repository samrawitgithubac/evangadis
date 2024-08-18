require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const port = 5000;
const authMiddleware = require("./middleware/authMiddleware");

/************************************************************************************** */
/******************************db connection*********************************************/
/************************************************************************************** */

const dbconnection = require("./db/dbConfig");
app.use(
  cors({
    orgin: ["https://deploy-1whq.vercel.app"],
    methods: ["post", "get"],
    credentials: true,
  })
);

/************************************************************************************** */
/*************************Route middleware for creating tables***************************/
/************************************************************************************** */

const createTablesRoute = require("./db/create-Tables");
app.use("/install", createTablesRoute);

/************************************************************************************** */
/*************************user routes middleware file***********************************/
/************************************************************************************** */

const userRoutes = require("./routes/userRoutes");

//user middleware to extract json data
app.use(express.json());

/************************************************************************************** */
/*************************user routes middleware****************************************/
/************************************************************************************** */

app.use("/api/user", userRoutes);

async function start() {
  try {
    const result = await dbconnection.execute("select'test'");
    await app.listen(port);
    console.log(result);
    console.log(`listing to ${port}`);
  } catch (error) {
    console.log(error.message);
  }
}
start();

/************************************************************************************** */
/************************question routes middleware file*********************************/
/************************************************************************************** */

const questionRoutes = require("./routes/questionRoutes");

/************************************************************************************** */
/************************question routes middleware*************************************/
/************************************************************************************** */

app.use("/api/question", authMiddleware, questionRoutes);

/************************************************************************************** */
/************************answer routes middleware file*********************************/
/************************************************************************************** */

const answerRoutes = require("./routes/answerRoute");

/************************************************************************************** */
/************************Answer routes middleware*********************************/
/************************************************************************************** */

app.use("/api/answer", authMiddleware, answerRoutes);
