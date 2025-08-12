const express = require("express");
const mysql = require("mysql");
const session = require("express-session");
const bcrypt = require("bcrypt");


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

app.use(session({
  secret: "21Cabbage",
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, maxAge: 10 * 60 * 1000 } // 10 mins
}));


app.set("view engine", "ejs");

app.get("/", (req, res) => {
    res.render("index.ejs");
});

app.get("/login", (req, res) => {
  res.render("login.ejs");
});

app.post("/login", (req, res) => {
  const { identifier, password } = req.body; // identifier = username or email

  const sql = "SELECT * FROM users WHERE username = ? OR email = ?";
  dbConnection.query(sql, [identifier, identifier], async (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Error logging in");
    }

    if (results.length === 0) {
      return res.status(401).send("Invalid username/email or password");
    }

    const user = results[0];

    // Compare hashed password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).send("Invalid username/email or password");
    }

    // Here you can set up session or token logic
    res.send(`Welcome ${user.username}!`);
  });
});



// GET route for register page
app.get("/register", (req, res) => {
  res.render("register.ejs");
});

// POST route for handling registration
app.post("/register", async (req, res) => {
  const { name, username, email, phone, address, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    dbConnection.query(
      "INSERT INTO users (name, username, email, phone, address, password) VALUES (?, ?, ?, ?, ?, ?)",
      [name, username, email, phone, address, hashedPassword],
      (err) => {
        if (err) {
          console.error(err);
          return res.send("Error registering user");
        }
        res.redirect("/login");
      }
    );
  } catch (error) {
    console.error(error);
    res.send("Server error");
  }
});


// at the end of the routes -- we  start the app using listen method - telling node to run and wait incoming requests
app.listen(3000, () => {
    console.log("Server is running on port 3000");
  });

