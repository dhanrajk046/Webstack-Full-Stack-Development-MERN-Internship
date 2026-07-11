🍔 AI-Powered MERN Food Delivery Application

A production-ready Full-Stack Food Delivery Platform built using the MERN Stack (MongoDB, Express.js, React, Node.js) with modern architecture, secure authentication, online payments, intelligent AI features, and scalable backend design.

The application allows users to browse restaurants, order food online, make secure payments through Stripe, receive AI-generated food descriptions, analyze restaurant reviews using AI, and manage orders in real time.



🚀 Features
👤 Authentication & Authorization
JWT Authentication
HTTP-Only Cookie Sessions
Forgot Password & Reset Password
Password Encryption using Bcrypt
Role-Based Authorization (Admin/User)

🍽 Restaurant & Food Management
Browse Restaurants
Restaurant Search
Veg / Non-Veg Filters
Food Categories
Food Search
Restaurant Ratings & Reviews

🛒 Smart Shopping Cart
Backend synchronized cart
Quantity management
Automatic cart updates
Single Restaurant Cart Rule
Automatic cart reset when switching restaurants

💳 Secure Payments
Stripe Checkout Integration
Shipping Address Collection
Payment Verification
Order Creation after successful payment
Automatic Cart Cleanup

📦 Order Management
Order History
Order Details
Order Tracking
Order Cancellation
Automatic Stock Restoration

🤖 AI Features
AI Food Description Generator (Groq Llama)
AI Restaurant Review Sentiment Analysis
AI Verdict Generation
AI Pros & Cons Summary
Automatic AI Food Image Generation

📊 Performance Optimizations
MongoDB Indexing
Redux Toolkit State Management
Cached AI Responses
Optimized API Calls
Lazy Data Fetching

🏗 Tech Stack
Frontend
React
Vite
Redux Toolkit
React Router DOM
Axios
React Toastify
Font Awesome
Backend
Node.js
Express.js
MongoDB Atlas
Mongoose
JWT Authentication
BcryptJS
Cookie Parser
Third Party Services
Stripe
Groq AI
Pollinations AI
Cloudinary

📂 Project Structure
Food-Delivery-App
│
├── frontend/
│   ├── components/
│   ├── pages/
│   ├── redux/
│   ├── hooks/
│   └── utils/
│
├── backend/
│   ├── controllers/
│   ├── routes/
│   ├── middleware/
│   ├── models/
│   ├── utils/
│   ├── config/
│   └── server.js
│
└── README.md

🔒 Security Features
JWT Authentication
HTTP-Only Cookies
Password Hashing (Bcrypt)
Protected Routes
Role-Based Access
Password Reset Tokens
Request Size Limiting
Centralized Error Handling

🤖 AI Integrations
AI Food Description

Generates attractive menu descriptions using Groq Llama Models and stores them in MongoDB to reduce API usage.

AI Review Analyzer

Analyzes restaurant reviews and generates:

Overall Sentiment
Key Pros
Key Cons
AI Verdict

Results are cached for improved performance.

AI Food Images

Automatically generates food images using Pollinations AI for items without images.

💳 Payment Flow
User adds food to cart
Checkout initiated
Stripe Checkout Session created
Customer completes payment
Payment verified
Order created
Stock updated
Cart cleared
Order displayed to user

📊 Database Collections
Users
Restaurants
Menus
Food Items
Orders
Cart

⚡ API Highlights
Authentication APIs
Restaurant APIs
Menu APIs
Cart APIs
Payment APIs
Order APIs
AI APIs

🎯 Learning Outcomes

This project demonstrates:

Full-Stack Development
REST API Design
Authentication
Authorization
MongoDB Relationships
Redux Toolkit
Payment Gateway Integration
AI API Integration
State Management
MVC Architecture
Error Handling
Production Ready Backend
Cloud Database Integration
📈 Future Improvements
Real-Time Order Tracking
Delivery Partner Dashboard
Admin Analytics Dashboard
Push Notifications
Google Maps Integration
WebSockets
Docker Deployment
Kubernetes Support
CI/CD Pipeline

👨‍💻 Author

Dhanraj Kumar

Full Stack Developer

Django
MERN Stack
REST APIs
React
Node.js
MongoDB
AI Integrations
AWS (Learning)

⭐ If you found this project interesting, consider giving it a Star.
