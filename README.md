# 🏞️ PLOTTOSHA – Land eCommerce Platform

**PLOTTOSHA** is a comprehensive Kenyan-inspired online platform designed to simplify land discovery, showcasing, and purchasing for users across the country. With a clean, responsive interface and advanced features, the platform connects buyers, agents, and administrators in a seamless digital experience.

## 🌐 Live Preview
> myshamba-production.up.railway.app

---

## 🚀 Prominent Features

### 🔐 **Advanced Authentication System**
- **Multi-field Registration**: Complete user profiles with name, username, email, phone, and address
- **Secure Login**: Bcrypt-hashed passwords with session management
- **Password Recovery**: Complete forgot password system with email verification
- **Role-based Access**: Buyer, Seller, and Admin roles with different permissions
- **Session Management**: Secure session handling with configurable timeouts

### 💬 **Real-time Messaging System**
- **Direct Communication**: Buyers can message sellers directly about listings
- **Email Notifications**: Automatic email alerts for new messages
- **Message History**: Complete conversation tracking and history
- **Listing Context**: Messages are linked to specific property listings
- **Reply System**: Easy reply functionality for ongoing conversations

### 🛠️ **Comprehensive Admin Dashboard**
- **Listing Management**: Add, edit, and delete property listings with image uploads
- **User Management**: View all users and modify their roles dynamically
- **Role Assignment**: Promote users to sellers or admins
- **File Management**: Automatic image upload and deletion with file system cleanup
- **Analytics Ready**: User and listing statistics for business insights

### ❤️ **Smart Wishlist System**
- **Save Favorites**: Users can save plots for later consideration
- **Search & Filter**: Advanced search within saved items
- **Visual Feedback**: Interactive wishlist with real-time updates
- **Persistent Storage**: Wishlist items saved across sessions

### 🏠 **Property Management**
- **Detailed Listings**: Rich property information with images, descriptions, and specifications
- **Category System**: Organized by property types (Residential, Commercial, etc.)
- **Location-based**: Geographic organization for easy browsing
- **Price Display**: Formatted pricing with currency localization
- **Size Information**: Acre measurements for land properties

### 📧 **Email Integration**
- **Password Reset**: Secure token-based password recovery via email
- **Message Notifications**: Real-time email alerts for new messages
- **Professional Templates**: Branded email communications
- **SMTP Configuration**: Gmail integration for reliable delivery

### 🔍 **Search & Discovery**
- **Advanced Search**: Search by title, location, category, and price range
- **Real-time Filtering**: Dynamic search results without page reload
- **Responsive Grid**: Mobile-optimized property grid layout
- **Quick Actions**: One-click wishlist and view details

### 📱 **Mobile-First Design**
- **Responsive Layout**: Optimized for all device sizes
- **Touch-Friendly**: Mobile-optimized interactions
- **Fast Loading**: Optimized images and assets
- **Progressive Enhancement**: Works on all modern browsers

---

## 👥 User Roles & Permissions

| Role     | Description                                   | Key Features                                                                 |
|----------|-----------------------------------------------|------------------------------------------------------------------------------|
| **Buyer**| Regular user looking to explore and buy land  | - Browse listings<br>- Wishlist<br>- Book site visits<br>- Purchase land    |
| **Agent**| Authorized seller or representative           | - Add & manage listings<br>- View bookings<br>- Communicate with buyers     |
| **Admin**| Platform manager                              | - Full access to all data<br>- Manage users & listings<br>- View analytics  |

---

## 📂 Tech Stack

### **Backend Technologies**
- **Runtime:** Node.js
- **Framework:** Express.js 5.1.0
- **Database:** MySQL 2.18.1
- **Authentication:** Bcrypt 6.0.0 for password hashing
- **Sessions:** Express-session 1.18.2
- **File Upload:** Multer 2.0.2
- **Email Service:** Nodemailer 7.0.10

### **Frontend Technologies**
- **Templating:** EJS 3.1.10
- **Styling:** Custom CSS with responsive design
- **JavaScript:** Vanilla JS with modern ES6+ features
- **Fonts:** Google Fonts (Poppins)
- **Icons:** Unicode emojis and custom graphics

### **Development Tools**
- **Version Control:** Git
- **Package Manager:** npm
- **File System:** Node.js fs module
- **Path Handling:** Node.js path module
- **Crypto:** Node.js crypto module for secure tokens

### **Security Features**
- **Password Hashing:** Bcrypt with salt rounds
- **Session Security:** Secure session configuration
- **File Upload Security:** Multer with file type validation
- **Email Security:** App-specific passwords for Gmail
- **Token Security:** Cryptographically secure random tokens

---

## 🚧 Current Progress

### ✅ **Completed Features**
- [x] **Landing Page**: Mobile-responsive design with hero section and blur effects
- [x] **Authentication System**: Complete registration, login, and password recovery
- [x] **User Management**: Role-based access control (Buyer, Seller, Admin)
- [x] **Property Listings**: Browse, search, and view detailed property information
- [x] **Admin Dashboard**: Full CRUD operations for listings and user management
- [x] **Messaging System**: Real-time communication between buyers and sellers
- [x] **Wishlist Feature**: Save and manage favorite properties
- [x] **Email Integration**: Password reset and message notifications
- [x] **File Upload**: Image upload and management for property listings
- [x] **Responsive Design**: Mobile-first approach with touch-friendly interface

### 🔄 **In Development**
- [ ] Payment integration (M-Pesa, bank transfers)
- [ ] Advanced search filters (price range, location, size)
- [ ] Property comparison feature
- [ ] Site visit booking system
- [ ] Document upload for property verification


## 📡 API Routes

### Authentication & User Management
| Method | Endpoint   | Description |
|--------|-----------|-------------|
| GET    | `/register` | Render the registration form |
| POST   | `/register` | Save new user with hashed password |
| GET    | `/login`    | Render the login form |
| POST   | `/login`    | Authenticate user via email or username |
| GET    | `/logout`   | Destroy user session and redirect to login |
| POST   | `/create-admin` | Create admin user (initial setup) |
| GET    | `/forgot-password` | Render forgot password form |
| POST   | `/forgot-password` | Send password reset email |
| GET    | `/reset-password` | Render password reset form with token |
| POST   | `/reset-password` | Update password with token verification |

### Property Listings
| Method | Endpoint   | Description |
|--------|-----------|-------------|
| GET    | `/`        | Render homepage |
| GET    | `/listings` | Display all available properties |
| GET    | `/listing/:id` | Show detailed property information |
| GET    | `/about`   | Render about page |

### Admin Panel
| Method | Endpoint   | Description |
|--------|-----------|-------------|
| GET    | `/admin`   | Admin dashboard (requires admin role) |
| GET    | `/admin/users` | Fetch all users for management |
| POST   | `/admin/users/update-role` | Update user role |
| POST   | `/admin/add` | Add new property listing |
| POST   | `/admin/delete/:id` | Delete property listing |

### Messaging System
| Method | Endpoint   | Description |
|--------|-----------|-------------|
| GET    | `/messages` | Display user's message history |
| GET    | `/messages/:listingId/:receiverId` | Open chat with specific user |
| POST   | `/messages/send` | Send new message |
| POST   | `/messages/reply/:id` | Reply to existing message |

### User Features
| Method | Endpoint   | Description |
|--------|-----------|-------------|
| GET    | `/wishlist` | Display user's saved properties |

---

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MySQL (v8.0 or higher)
- npm or yarn package manager

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/MyShamba.git
   cd MyShamba
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Database Setup**
   ```sql
   CREATE DATABASE land_ecommerce;
   ```
   
   Create the following tables:
   ```sql
   -- Users table
   CREATE TABLE users (
     id INT AUTO_INCREMENT PRIMARY KEY,
     name VARCHAR(255) NOT NULL,
     username VARCHAR(100) UNIQUE NOT NULL,
     email VARCHAR(255) UNIQUE NOT NULL,
     phone VARCHAR(20),
     address TEXT,
     password VARCHAR(255) NOT NULL,
     role ENUM('buyer', 'seller', 'admin') DEFAULT 'buyer',
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );

   -- Lands table
   CREATE TABLE lands (
     id INT AUTO_INCREMENT PRIMARY KEY,
     title VARCHAR(255) NOT NULL,
     description TEXT,
     location VARCHAR(255) NOT NULL,
     price DECIMAL(15,2) NOT NULL,
     size_in_acres DECIMAL(10,2),
     category VARCHAR(100),
     seller_id INT,
     image_url VARCHAR(500),
     is_sold BOOLEAN DEFAULT FALSE,
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     FOREIGN KEY (seller_id) REFERENCES users(id)
   );

   -- Messages table
   CREATE TABLE messages (
     id INT AUTO_INCREMENT PRIMARY KEY,
     sender_id INT NOT NULL,
     receiver_id INT NOT NULL,
     listing_id INT,
     message TEXT NOT NULL,
     sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     FOREIGN KEY (sender_id) REFERENCES users(id),
     FOREIGN KEY (receiver_id) REFERENCES users(id),
     FOREIGN KEY (listing_id) REFERENCES lands(id)
   );

   -- Wishlist table
   CREATE TABLE wishlist (
     id INT AUTO_INCREMENT PRIMARY KEY,
     user_id INT NOT NULL,
     land_id INT NOT NULL,
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     FOREIGN KEY (user_id) REFERENCES users(id),
     FOREIGN KEY (land_id) REFERENCES lands(id)
   );

   -- Password reset tokens table
   CREATE TABLE password_reset_tokens (
     id INT AUTO_INCREMENT PRIMARY KEY,
     user_id INT NOT NULL,
     token VARCHAR(255) NOT NULL,
     expires_at TIMESTAMP NOT NULL,
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     FOREIGN KEY (user_id) REFERENCES users(id)
   );
   ```

4. **Environment Configuration**
   Update the database connection in `server.js`:
   ```javascript
   const dbConnection = mysql.createConnection({
     host: "localhost",
     user: "your_username",
     password: "your_password",
     database: "land_ecommerce",
     port: 3306,
   });
   ```

5. **Email Configuration**
   Update Gmail credentials in `server.js`:
   ```javascript
   const transporter = nodemailer.createTransport({
     service: "gmail",
     auth: {
       user: "your-email@gmail.com",
       pass: "your-app-password"
     },
   });
   ```

6. **Start the application**
   ```bash
   npm start
   ```

7. **Access the application**
   - Open your browser and navigate to `http://localhost:3000`
   - Create an admin account using the `/create-admin` endpoint

---


 

---

## 📸 Screenshots

### 🏠 **Landing Page**
![PLOTTOSHA Landing Page](/images/Screenshot%202025-10-23%20165850.png)

*Beautiful, responsive landing page showcasing the Kenyan land marketplace with hero section, features, and call-to-action elements.*

---

## 📜 License

This project is for educational purposes and personal portfolio use. All assets used (images/icons) are subject to their respective licenses.
