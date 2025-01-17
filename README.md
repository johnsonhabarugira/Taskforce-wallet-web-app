# Taskforce-wallet-web-app
Code of Africa Challenge "A MERN stack Wallet Web Application to track transactions, manage budgets, and visualize expenses"

## Table of Contents
- [Features](#features)
- [Demo](#demo)
- [Screenshots](#screenshots)
- [Installation](#installation)
- [Usage](#usage)
- [Technologies Used](#technologies-used)
- [Contributing](#contributing)


## Features
- Add Accounts
- Track income and expenses
- Generate detailed financial reports
- Manage categories 
- Visualize data with charts
- Export Excel File


## Demo
[Live Demo](https://taskforce-wallet-web-app-lswk.vercel.app/)

## Screenshots
- Landing Page
![Landing Page](Screenshots/1.png)

![Login ](Screenshots/2.png)

![Dashboard](Screenshots/5.png)

![Transactions Management](Screenshots/6.png)

![Accounts Management](Screenshots/8.png)
- Add Acoount and allow user to set limit for account
![Add Acoount and allow user to set limit for account ](Screenshots/11.png)

![All Transactions ](Screenshots/9.png)
- Filter Dates and Export Excel file
![Filter Dates and Export Excel file](Screenshots/10.png)

## Installation

To set up the Wallet Web Application locally, follow these steps

1. Clone the Repository
git clone https://github.com/johnsonhabarugira/Taskforce-wallet-web-app.git

Navigate into the project directory: 
cd Taskforce-wallet-web-app
 
2. Set Up the Backend
 1. Navigate to the backend folder
 cd backend
 2. Install dependencies:
 npm install
 3. Create a .env file in backend and config invironment variables:
 PORT=
 MONGO_URI=
 JWT_SECRET=
 4. Start backend server
 npm start
3. Set Up Frontend 
 1. Navigate to the frontend folder:
 cd ../frontend
 2. Install Dependencies
 npm install
 3. Create a .env file in frontend and config invironment variables:
 REACT_APP_BACKEND_URL=
 PORT = 
 4. Start the frontend development server:
 npm install
4. Set Up MongoDB
 1. Create an Atlas cluster and get your connection string.

## Usage
1. Sign up or log in to the application.
2. Add Accounts and set Limit.
3. Start tracking your income and expenses.
4. View reports and visual summaries on the dashboard.
5. filter dates and Export Excel.