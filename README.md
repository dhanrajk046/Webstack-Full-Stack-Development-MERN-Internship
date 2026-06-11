# Food Genie – Full-Stack Food Delivery Application

Food Genie is a robust, responsive **MERN Stack** food aggregation and delivery web application. Developed as a capstone project during the **WebStack Academy (WSA) Full-Stack Web Development Internship**, this application replicates real-world platforms like Swiggy or Zomato, allowing users to effortlessly browse local restaurants, customize orders, manage a live cart, and complete secure payments.

---

## 🚀 Key Features

* **Secure Authentication & Profiling:** User registration, secure login via JWT, profile updates, and email-based password recovery (implemented via Mailtrap/SendGrid).
* **Smart Restaurant Discovery:** Filter and search restaurants by cuisine, reviews, or delivery speed. Toggle quickly for "Pure Veg" options.
* **Interactive Menu & Live Cart:** Dynamic item selection with real-time price updates, quantity modifiers, and state synchronization across views.
* **Stripe Payment Gateway Integration:** A fully functional, secure checkout pipeline handling credit/debit card transactions safely.
* **Comprehensive Order History:** Track previous orders, check real-time order processing statuses (e.g., Processing, Delivered), and view detailed invoices.
* **Responsive, Modern UI:** Clean user interface optimized across desktop, tablet, and mobile devices using Bootstrap and custom CSS.

---

## 🛠️ Tech Stack

### Frontend
* **React.js** (Functional Components & Hooks)
* **Redux Toolkit** (Global State Management)
* **Bootstrap 5** & **CSS3** (Responsive Layouts)

### Backend
* **Node.js** & **Express.js** (REST API Architecture)
* **JSON Web Tokens (JWT)** (Secure Authorization)
* **Bcrypt.js** (Password Hashing)

### Database & Cloud Storage
* **MongoDB Atlas** (Cloud NoSQL Database)
* **Cloudinary** (Optimized Image Hosting for Restaurants & Dishes)

---

## 📂 Project Architecture & Directory Structure

```text
food-genie/
├── backend/
│   ├── config/          # Database connection & environment configurations
│   ├── controllers/     # Controller functions handling core business logic
│   ├── models/          # MongoDB schemas (User, Restaurant, Order)
│   ├── routes/          # Express API route definitions
│   ├── utils/           # Helper scripts (seeding scripts, JWT tokens, email handlers)
│   └── server.js        # Backend entry point
│
├── frontend/
│   ├── public/          # Static assets and index.html
│   └── src/
│       ├── actions/     # Redux asynchronous actions (API fetching)
│       ├── components/  # Reusable UI elements (Navbar, Footer, Cards, Loaders)
│       ├── reducers/    # Redux reducers for state modification
│       ├── App.js       # Main routing and application layout
│       └── index.js     # Frontend DOM entry point
