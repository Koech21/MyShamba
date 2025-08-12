# 🏞️ PLOTTOSHA – Land eCommerce Platform

**PLOTTOSHA** is a Kenyan-inspired online platform designed to simplify land discovery, showcasing, and purchasing for users across the country. With a clean, responsive interface and smart features, the platform connects buyers, agents, and administrators in a seamless digital experience.

## 🌐 Live Preview
> https://koech21.github.io/LANDTOSHA-TEST/

---

## 📌 Key Features

- 🔍 Browse and search available plots
- 📝 Create and manage user accounts (**with username, email, phone, and address**)
- 🔑 Secure user login with hashed passwords
- ❤️ Wishlist plots for later
- 📅 Book site visits with agents
- 💳 Secure payment integration (planned)
- 🛠 Admin panel to manage listings and users
- 📲 Mobile-responsive UI with dynamic menu and blur background effects

---

## 👥 User Roles & Permissions

| Role     | Description                                   | Key Features                                                                 |
|----------|-----------------------------------------------|------------------------------------------------------------------------------|
| **Buyer**| Regular user looking to explore and buy land  | - Browse listings<br>- Wishlist<br>- Book site visits<br>- Purchase land    |
| **Agent**| Authorized seller or representative           | - Add & manage listings<br>- View bookings<br>- Communicate with buyers     |
| **Admin**| Platform manager                              | - Full access to all data<br>- Manage users & listings<br>- View analytics  |

---

## 📂 Tech Stack

- **Frontend:** HTML, CSS, JavaScript (with EJS for templating)
- **Backend:** Node.js + Express.js
- **Database:** MySQL
- **Templating Engine:** EJS
- **Styling:** Tailwind CSS (optionally) / Custom CSS
- **Security:** Bcrypt for password hashing
- **Other Tools:** Git for version control

---

## 🚧 Current Progress

- [x] Landing page completed (mobile responsive + blur effect)
- [x] Navbar partial integrated
- [x] Register & login pages styled and functional

- [ ] Wishlist feature (coming)
- [ ] Payment module (planned)
- [ ] Admin dashboard (planned)

---

## 📡 API Routes

### Authentication
| Method | Endpoint   | Description |
|--------|-----------|-------------|
| GET    | `/register` | Render the registration form |
| POST   | `/register` | Save new user with hashed password |
| GET    | `/login`    | Render the login form |
| POST   | `/login`    | Authenticate user via email or username |

---

## 📸 Screenshots
_Add screenshots of the landing page, register page, or mobile menu here._

---

## 📜 License

This project is for educational purposes and personal portfolio use. All assets used (images/icons) are subject to their respective licenses.
