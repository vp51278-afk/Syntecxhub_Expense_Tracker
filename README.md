# ExpenseFlow — Syntecxhub Week 1

A responsive expense tracker built with React.

## Features

- Responsive dashboard
- Mock API data loaded with `useEffect`
- Expense form using `useState`
- Add, edit and delete expenses
- Search and category filtering
- Category-wise analytics
- `useRef` for form-field focus
- `useMemo` for calculated totals and filtered data
- `useCallback` for event handlers
- Clean responsive CSS

## Run locally

```bash
npm install
npm run dev
```

For a production build:

```bash
npm run build
```

## Project structure

```text
src/
  App.jsx
  main.jsx
  styles.css
public/
  expenses.json
```

## Design

The interface uses a clean navy-blue and soft-blue palette for a modern finance dashboard style.
# Expense Tracker – Syntecxhub Internship

A full-stack Expense Tracker project developed as part of the Syntecxhub Web Development Internship.

## Week 2 – User Management System

For Week 2, a RESTful User Management API has been integrated with the Expense Tracker project using Node.js, Express.js, MongoDB, and Mongoose.

## Features

- User Registration
- Get all users
- Get user by ID
- Update user details
- Delete user
- Basic Authentication
- Password hashing using bcrypt
- Input validation
- MongoDB database integration
- RESTful API architecture
- Postman API testing collection
- Proper HTTP status codes and error handling

## Tech Stack

### Frontend
- React.js
- Vite
- JavaScript
- CSS

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- bcrypt
- Basic Authentication

### Tools
- Git & GitHub
- Postman
- MongoDB Atlas
- VS Code

## Project Structure

```text
Syntecxhub_Expense_Tracker/
│
├── backend/
│   ├── src/
│   │   ├── middleware/
│   │   │   └── basicAuth.js
│   │   ├── models/
│   │   │   └── User.js
│   │   ├── routes/
│   │   │   └── users.js
│   │   ├── db.js
│   │   └── server.js
│   ├── .env.example
│   ├── package.json
│   └── README.md
│
├── postman/
│   └── Syntecxhub_Week2_User_Management.postman_collection.json
│
├── public/
├── src/
├── index.html
├── package.json
├── README.md
└── WEEK2_IMPLEMENTATION.md
