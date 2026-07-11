# 🍔 AI-Powered MERN Food Delivery Application

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)](https://expressjs.com/)
[![Stripe](https://img.shields.io/badge/Stripe-626CD9?style=for-the-badge&logo=Stripe&logoColor=white)](https://stripe.com/)

A production-ready Full-Stack Food Delivery Platform built using the MERN Stack. This application features a modern architecture, secure role-based authentication, seamless online payments, and scalable backend design. 

What sets this project apart are its **intelligent AI features**: leveraging AI to generate dynamic food descriptions, analyze restaurant review sentiments, and automatically generate food imagery.

---

## 🚀 Key Features

### 👤 Security & Authentication
* **JWT & Sessions:** Secure authentication using JSON Web Tokens and HTTP-Only Cookie sessions.
* **Role-Based Access:** Distinct authorization levels for Users and Admins.
* **Data Protection:** Password encryption using Bcrypt, request size limiting, and protected routes.
* **Account Recovery:** Forgot/Reset password functionality with secure tokens.

### 🍽 Restaurant & Menu Management
* **Browse & Filter:** Search for restaurants and filter menus by Veg/Non-Veg and specific food categories.
* **Dynamic Menus:** Detailed food items with rich descriptions and user-generated restaurant ratings.

### 🛒 Smart Shopping Cart & Order Flow
* **Synchronized Cart:** Backend-synchronized cart with dynamic quantity management and automatic updates.
* **Restaurant Rules:** Single-restaurant cart rules (automatically resets when switching restaurants).
* **Order Lifecycle:** Track order history, view details, cancel orders, and restore stock automatically upon cancellation.

### 💳 Secure Payments (Stripe)
* **Checkout Integration:** Secure Stripe checkout sessions with shipping address collection.
* **Automated Workflow:** Payment verification triggers automated order creation, stock updates, and cart cleanup.

---

## 🤖 AI Integrations (The USP)

This application leverages multiple AI models to enhance the user experience and reduce manual data entry:

* **AI Food Descriptions:** Utilizes **Groq Llama Models** to generate appetizing menu descriptions. Responses are cached in MongoDB to optimize API usage and reduce costs.
* **AI Review Sentiment Analysis:** Analyzes raw customer reviews to generate:
  * Overall Sentiment
  * Key Pros & Cons
  * Final AI Verdict
* **AI Image Generation:** Automatically creates placeholder food images using **Pollinations AI** for menu items lacking photography.

---

## 🏗 Tech Stack

| Domain | Technologies |
| :--- | :--- |
| **Frontend** | React, Vite, Redux Toolkit, React Router DOM, Axios, Tailwind/CSS |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB Atlas, Mongoose |
| **Security** | JWT, BcryptJS, Cookie Parser |
| **Third-Party APIs** | Stripe (Payments), Cloudinary (Image Hosting) |
| **AI Services** | Groq AI, Pollinations AI |

---

## ⚙️ Local Development & Setup

Follow these steps to set up the project locally on your machine.

### 1. Clone the repository
```bash
git clone [https://github.com/yourusername/Food-Delivery-App.git](https://github.com/yourusername/Food-Delivery-App.git)
cd Food-Delivery-App
