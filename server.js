const express = require("express");
const mysql = require("mysql");
const session = require("express-session");
const bcrypt = require("bcrypt");
const multer = require("multer");
const path = require("path");
const fs = require("fs");


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


// Set storage engine
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images"); // Folder to store uploads
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // unique filename
  }
});

const upload = multer({ storage });

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
    res.redirect("/listings");
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

app.get("/404", (req, res) => {
  res.render("404.ejs");
});

app.get('/listings', (req, res) => {
  const sql = "SELECT * FROM lands WHERE is_sold = 0";
  dbConnection.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching listings:', err);
      return res.status(500).send('Error fetching listings');
    }
    res.render('listings', { listings: results });
  });
});

app.get('/about', (req, res) => {
  res.render('about.ejs');
});

app.get('/contact', (req, res) => {
  res.render('contact.ejs');
});


// GET route for viewing a specific listing
app.get('/listing/:id', (req, res) => {
  const landId = req.params.id;
  const sql = "SELECT * FROM lands WHERE id = ?";
  dbConnection.query(sql, [landId], (err, results) => {
    if (err) throw err;
    res.render('listing', { land: results[0] });
  });
});

app.get('/wishlist', (req, res) => {
  const sql = `
    SELECT * FROM wishlist `;
  dbConnection.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching wishlist:', err);
      return res.status(500).send('Error fetching wishlist');
    }
    res.render('wishlist', { wishlist: results });
  });
});

app.get("/admin", (req, res) => {
  dbConnection.query("SELECT * FROM lands", (err, results) => {
    if (err) throw err;
    // This renders the admin page and sends the data from the DB
    res.render("admin", { lands: results });
  });
});

app.post("/admin/add", upload.single("image"), (req, res) => {
  const { title, description, location, price, size_in_acres, category, seller_id } = req.body;
  const image_url = `/images/${req.file.filename}`;

  const sql = `
    INSERT INTO lands (title, description, location, price, size_in_acres, category, seller_id, image_url, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())
  `;
  dbConnection.query(sql, [title, description, location, price, size_in_acres, category, seller_id, image_url], (err) => {
    if (err) throw err;
    res.redirect("/admin");
  });
});

// DELETE listing by ID (from Admin Panel)


app.post("/admin/delete/:id", (req, res) => {
  const landId = req.params.id;

  // Step 1: Fetch the image path from the DB
  const getImageQuery = "SELECT image_url FROM lands WHERE id = ?";
  dbConnection.query(getImageQuery, [landId], (err, results) => {
    if (err) {
      console.error("Error retrieving image info:", err);
      return res.status(500).send("Error retrieving image info");
    }

    if (results.length === 0) {
      console.warn("No land found with that ID.");
      return res.redirect("/admin");
    }

    const imageUrl = results[0].image_url;

    // remove the leading '/images/' part
    const imageFile = imageUrl.replace("/images/", "");
    const imagePath = path.join(__dirname, "public", "images", imageFile);

    // Step 2: Delete the image file
    fs.unlink(imagePath, (fsErr) => {
      if (fsErr && fsErr.code !== "ENOENT") {
        console.error("Error deleting image file:", fsErr);
      } else {
        console.log(`Deleted image file: ${imageFile}`);
      }

      // Step 3: Delete the land record
      const deleteSQL = "DELETE FROM lands WHERE id = ?";
      dbConnection.query(deleteSQL, [landId], (dbErr) => {
        if (dbErr) {
          console.error("Error deleting land:", dbErr);
          return res.status(500).send("Error deleting land");
        }

        console.log(`Deleted land with ID: ${landId}`);
        res.redirect("/admin");
      });
    });
  });
});




// at the end of the routes -- we  start the app using listen method - telling node to run and wait incoming requests
app.listen(3000, () => {
    console.log("Server is running on port 3000");
  });

