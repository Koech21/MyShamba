const express = require("express");
const mysql = require("mysql");
// const session = require("express-session");


const dbConnection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "admin123",
  database: "land_ecommerce",
  port: 3307,
});
// test db connection
dbConnection.connect((error) => {
  if (!error) {
    console.log("DB connected");
  } else {
    console.log(error);
  }
});

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public")); //static files- css, js, images, etc. explanation: express.static is a middleware function that serves static files from the public directory.
// app.use(session({
//   secret: "GANGSHIT",
//   resave: false,
//   saveUninitialized: true,
//   cookie: { secure: false, maxAge: 10*60*1000}
// }));


app.set("view engine", "ejs");

app.get("/", (req, res) => {
    res.render("index.ejs");
});

app.get("/login", (req, res) => {
    res.render("login.ejs");
});

app.get("/register", (req, res) => {
    res.render("register.ejs");
});

// at the end of the routes -- we  start the app using listen method - telling node to run and wait incoming requests
app.listen(3000, () => {
    console.log("Server is running on port 3000");
  });

