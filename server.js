const express = require("express");
const mysql = require("mysql");
const session = require("express-session");
const bcrypt = require("bcrypt");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const nodemailer = require("nodemailer");


const dbConnection = mysql.createConnection({
  host: "ballast.proxy.rlwy.net",
  user: "root",
  password: "HcyvppwcVjGtpneHrgVypkaUlDbsLmgk",
  database: "railway",
  port: 29259,
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
app.use(express.json()); // Parse JSON request bodies - REQUIRED for API endpoints
app.use(express.static("public")); //static files- css, js, images, etc. explanation: express.static is a middleware function that serves static files from the public directory.

app.use(session({
  secret: "21Cabbage",
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, maxAge: 10 * 60 * 1000000 } 
}));

// Make session data available to all EJS templates
app.use((req, res, next) => {
  res.locals.user = req.session; // makes session data available to EJS
  next();
});

// Admin authentication middleware
const requireAdmin = (req, res, next) => {
  if (!req.session.isLoggedIn) {
    return res.redirect('/login');
  }
  if (req.session.role !== 'admin') {
    return res.status(403).send('Access denied. Admin privileges required.');
  }
  next();
};

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


const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "plottosha@gmail.com",
    pass: "dyit tcdo whro jtto" // This should be an App Password, not your regular password
  },
});


// Function to send message notification email
const sendMessageNotification = async (receiverEmail, senderName, messageText) => {
  try {
    const mailOptions = {
      from: "plottosha@gmail.com",
      to: receiverEmail,
      subject: "New Message from PLOTTOSHA",
      text: `You have received a new message from ${senderName}:\n\n${messageText}`
    };

    await transporter.sendMail(mailOptions);
    console.log("Message notification sent successfully");
  } catch (error) {
    console.error("Error sending message notification:", error);
  }
};


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

    // Save user session
    req.session.userId = user.id;
    req.session.username = user.username;
    req.session.email = user.email;
    req.session.isLoggedIn = true;
    req.session.role = user.role || 'user'; // Add role to session
    
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
    const role = 'user'; // Default role for new users

    dbConnection.query(
      "INSERT INTO users (name, username, email, phone, address, password, role) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [name, username, email, phone, address, hashedPassword, role],
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

// Route to create admin user (for initial setup)
app.post("/create-admin", async (req, res) => {
  const { name, username, email, phone, address, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const role = 'admin';

    dbConnection.query(
      "INSERT INTO users (name, username, email, phone, address, password, role) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [name, username, email, phone, address, hashedPassword, role],
      (err) => {
        if (err) {
          console.error(err);
          return res.send("Error creating admin user");
        }
        res.send("Admin user created successfully");
      }
    );
  } catch (error) {
    console.error(error);
    res.send("Server error");
  }
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


app.get("/listing/:id", (req, res) => {
  const landId = req.params.id;
  const sql = "SELECT * FROM lands WHERE id = ?";

  dbConnection.query(sql, [landId], (err, results) => {
    if (err) {
      console.error("Error fetching land details:", err);
      return res.status(500).send("Error fetching land details");
    }

    if (results.length === 0) {
      return res.status(404).send("Land not found");
    }

    const land = results[0];
    res.render("listing", { land });
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

app.get("/admin", requireAdmin, (req, res) => {
  dbConnection.query("SELECT * FROM lands", (err, results) => {
    if (err) throw err;
    // This renders the admin page and sends the data from the DB
    res.render("admin", { lands: results });
  });
});

// Route to fetch all users for admin management
app.get("/admin/users", requireAdmin, (req, res) => {
  dbConnection.query("SELECT id, name, username, email, phone, role, created_at FROM users ORDER BY created_at DESC", (err, users) => {
    if (err) {
      console.error("Error fetching users:", err);
      return res.status(500).send("Error fetching users");
    }
    res.json(users);
  });
});

// Route to update user role
app.post("/admin/users/update-role", requireAdmin, (req, res) => {
  const { userId, newRole } = req.body;
  
  if (!userId || !newRole) {
    return res.status(400).json({ error: "User ID and role are required" });
  }
  
  if (!['buyer', 'seller', 'admin'].includes(newRole)) {
    return res.status(400).json({ error: "Invalid role. Must be 'buyer', 'seller', or 'admin'" });
  }
  
  dbConnection.query("UPDATE users SET role = ? WHERE id = ?", [newRole, userId], (err, result) => {
    if (err) {
      console.error("Error updating user role:", err);
      return res.status(500).json({ error: "Error updating user role" });
    }
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    
    res.json({ success: true, message: "User role updated successfully" });
  });
});

app.post("/admin/add", requireAdmin, upload.single("image"), (req, res) => {
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


app.post("/admin/delete/:id", requireAdmin, (req, res) => {
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

app.get("/about", (req, res ) =>
  res.render("about")
)

app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) console.error(err);
    res.redirect("/login");
  });
});

// Forgot Password Routes
app.get("/forgot-password", (req, res) => {
  res.render("forgot-password.ejs");
});

app.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  
  try {
    // Check if email exists
    const sql = "SELECT id, username FROM users WHERE email = ?";
    dbConnection.query(sql, [email], async (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Error processing request");
      }
      
      if (results.length === 0) {
        return res.status(404).send("Email not found");
      }
      
      const user = results[0];
      const resetToken = require('crypto').randomBytes(32).toString('hex');
      const expiresAt = new Date(Date.now() + 3600000); // 1 hour from now
      
      // Store reset token in database
      const insertTokenSql = "INSERT INTO password_reset_tokens (user_id, token, expires_at) VALUES (?, ?, ?)";
      dbConnection.query(insertTokenSql, [user.id, resetToken, expiresAt], (err) => {
        if (err) {
          console.error(err);
          return res.status(500).send("Error generating reset token");
        }
        
        // Send reset email
        const resetUrl = `http://localhost:3000/reset-password?token=${resetToken}`;
        const mailOptions = {
          from: "plottosha@gmail.com",
          to: email,
          subject: "Password Reset - PLOTTOSHA",
          text: `Hello ${user.username},\n\nYou requested a password reset. Click the link below to reset your password:\n\n${resetUrl}\n\nThis link will expire in 1 hour.\n\nIf you didn't request this, please ignore this email.\n\nBest regards,\nPLOTTOSHA Team`
        };
        
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.error("Error sending reset email:", error);
            return res.status(500).send("Error sending reset email");
          }
          res.send("Password reset email sent successfully!");
        });
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

app.get("/reset-password", (req, res) => {
  const { token } = req.query;
  
  if (!token) {
    return res.status(400).send("Invalid reset link");
  }
  
  // Check if token is valid and not expired
  const sql = "SELECT * FROM password_reset_tokens WHERE token = ? AND expires_at > NOW()";
  dbConnection.query(sql, [token], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Error validating token");
    }
    
    if (results.length === 0) {
      return res.status(400).send("Invalid or expired reset link");
    }
    
    res.render("reset-password.ejs", { token });
  });
});

app.post("/reset-password", async (req, res) => {
  const { token, password } = req.body;
  
  try {
    // Verify token
    const verifySql = "SELECT user_id FROM password_reset_tokens WHERE token = ? AND expires_at > NOW()";
    dbConnection.query(verifySql, [token], async (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Error validating token");
      }
      
      if (results.length === 0) {
        return res.status(400).send("Invalid or expired reset link");
      }
      
      const userId = results[0].user_id;
      
      // Hash new password
      const hashedPassword = await bcrypt.hash(password, 10);
      
      // Update password
      const updateSql = "UPDATE users SET password = ? WHERE id = ?";
      dbConnection.query(updateSql, [hashedPassword, userId], (err) => {
        if (err) {
          console.error(err);
          return res.status(500).send("Error updating password");
        }
        
        // Delete used token
        const deleteSql = "DELETE FROM password_reset_tokens WHERE token = ?";
        dbConnection.query(deleteSql, [token], (err) => {
          if (err) console.error("Error deleting token:", err);
        });
        
        res.send("Password reset successfully! <a href='/login'>Click here to login</a>");
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

app.get("/messages/:listingId/:receiverId", (req, res) => {
  if (!req.session.userId) {
    return res.redirect("/login");
  }

  const { listingId, receiverId } = req.params;
  const senderId = req.session.userId;

  const sql = `
    SELECT * FROM messages 
    WHERE (sender_id = ? AND receiver_id = ?)
       OR (sender_id = ? AND receiver_id = ?)
    ORDER BY sent_at ASC
  `;

  dbConnection.query(sql, [senderId, receiverId, receiverId, senderId], (err, messages) => {
    if (err) return res.status(500).send("Error loading messages");

    res.render("chat.ejs", { messages, listingId, receiverId, senderId });
  });
});

app.post("/messages/send", (req, res) => {
  if (!req.session.userId) {
    return res.status(401).send('<p>Please <a href="/login">log in</a> first.</p>');
  }

  const { receiver_id, listing_id, message } = req.body;
  const sender_id = req.session.userId;

  const sql = "INSERT INTO messages (sender_id, receiver_id, listing_id, message) VALUES (?, ?, ?, ?)";
  dbConnection.query(sql, [sender_id, receiver_id, listing_id, message], (err) => {
    if (err) return res.status(500).send("Error sending message");

    // Fetch receiver's email and sender's username
    const getUserSql = "SELECT email, username FROM users WHERE id = ?";
    const getSenderSql = "SELECT username FROM users WHERE id = ?";
    
    dbConnection.query(getUserSql, [receiver_id], (err, userResult) => {
      if (err) return console.error(err);

      const receiverEmail = userResult[0].email;
      
      // Get sender's username
      dbConnection.query(getSenderSql, [sender_id], (err, senderResult) => {
        if (err) return console.error(err);
        
        const senderName = senderResult[0].username;
        sendMessageNotification(receiverEmail, senderName, message);
      });
    });

    res.redirect(`/messages/${listing_id}/${receiver_id}`);
  });
});

app.get("/messages", (req, res) => {
  if (!req.session.userId) {
    return res.redirect("/login");
  }

  const userId = req.session.userId;

  const sql = `
    SELECT m.*, 
           s.username AS sender_name,
           r.username AS receiver_name,
           l.title AS listing_title
    FROM messages m
    JOIN users s ON m.sender_id = s.id
    JOIN users r ON m.receiver_id = r.id
    LEFT JOIN lands l ON m.listing_id = l.id
    WHERE m.sender_id = ? OR m.receiver_id = ?
    ORDER BY m.sent_at DESC
  `;

  dbConnection.query(sql, [userId, userId], (err, results) => {
    if (err) {
      console.error("Error fetching messages:", err);
      return res.status(500).send("Error fetching messages");
    }

    res.render("messages", { messages: results, userId });
  });
});

app.post("/messages/reply/:id", (req, res) => {
  if (!req.session.userId) return res.redirect("/login");

  const { id } = req.params; // original message id
  const { reply } = req.body;

  // Find the original message to get receiver_id and listing_id
  const findSql = "SELECT * FROM messages WHERE id = ?";
  dbConnection.query(findSql, [id], (err, result) => {
    if (err || result.length === 0) {
      console.error(err);
      return res.status(404).send("Original message not found");
    }

    const original = result[0];
    const senderId = req.session.userId;
    const receiverId = original.sender_id === senderId ? original.receiver_id : original.sender_id;

    const insertSql = `
      INSERT INTO messages (sender_id, receiver_id, listing_id, message)
      VALUES (?, ?, ?, ?)
    `;
    dbConnection.query(insertSql, [senderId, receiverId, original.listing_id, reply], (err2) => {
      if (err2) {
        console.error("Error sending reply:", err2);
        return res.status(500).send("Error sending reply");
      }
      res.redirect("/messages");
    });
  });
});








// at the end of the routes -- we  start the app using listen method - telling node to run and wait incoming requests
app.listen(3000, () => {
    console.log("Server is running on port 3000");
  });
  

