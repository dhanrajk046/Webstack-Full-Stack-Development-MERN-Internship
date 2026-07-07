# FoodProject Production Checklist

## Core Customer Flow

- Customer registers at `/users/register`.
- User record is saved in MongoDB database `FOODAPP`, collection `users`.
- Customer logs in with email and password.
- Customer selects a restaurant, opens a menu, adds items to cart, checks out, and places an order.
- Orders are saved in MongoDB and visible in `/orders` and `/account`.

## Required Environment

Copy `backend/config/config.example.env` to `backend/config/config.env` and set real values.

Important production values:

- `NODE_ENV=production`
- `DB_URL` pointing to the production MongoDB Atlas database
- A long random `JWT_SECRET`
- `FRONTEND_URL` set to the deployed frontend URL
- Cloudinary keys for image upload
- Stripe keys if Stripe checkout is enabled

## MongoDB Atlas

1. Create or select the `FOODAPP` database.
2. Ensure Network Access allows the deployed backend server IP.
3. Create a database user with read/write access.
4. Put the full connection string in `DB_URL`.

## Local Run

Backend:

```bash
cd backend
npm install
npm start
```

Frontend:

```bash
cd frontend
npm install
npm run dev
```

Build frontend:

```bash
cd frontend
npm run build
```

## Deployment Notes

- Deploy the backend as a Node service.
- Deploy the frontend `dist` folder from `npm run build`.
- Configure the frontend host to proxy `/api` to the backend, or set the frontend API base URL for production.
- Never commit real `config.env` secrets.
- Keep MongoDB Atlas IP allowlisting updated for the deployed backend.

## Verification Before Demo

- Register a new customer.
- Confirm the customer appears in MongoDB `FOODAPP.users`.
- Login after registration.
- Add one item from a restaurant menu to cart.
- Place an order from checkout.
- Confirm order appears in MongoDB `FOODAPP.orders`.
- Open `/account` and verify profile plus recent orders.
