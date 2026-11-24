# Job Tracker 🚀

A full-stack MERN (MongoDB, Express.js, React, Node.js) web application designed to help job seekers organize, track, and manage their job applications efficiently.

---

## ✨ Features

- **📊 Interactive Dashboard & Overview:** Visual statistics and charts (powered by Recharts) showing application statuses and progress.
- **📋 Kanban Board:** Drag-and-drop interface (using `@hello-pangea/dnd`) to manage job statuses (Applied, Interviewing, Offered, Rejected).
- **🔍 Job Search:** Search live job listings directly within the app using the RapidAPI job search integration.
- **🔒 Authentication & Security:** Secure user registration and login with JWT (JSON Web Tokens) and bcrypt password hashing.
- **🎨 Modern Responsive UI:** Built with React 19, Vite, Tailwind CSS v4, Lucide React icons, and dark/light mode toggle.
- **🔔 Toast Notifications:** Real-time feedback using `react-hot-toast`.

---

## 🛠️ Tech Stack

### Frontend (`/client`)
- **Framework:** React 19 (Vite)
- **Routing:** React Router v7
- **Styling:** Tailwind CSS v4
- **Icons:** Lucide React
- **Drag & Drop:** `@hello-pangea/dnd`
- **Charts:** Recharts
- **HTTP Client:** Axios
- **Notifications:** React Hot Toast

### Backend (`/server`)
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (via Mongoose)
- **Authentication:** JSON Web Tokens (`jsonwebtoken`) & `bcryptjs`
- **External API:** RapidAPI (JSearch / Jobs API)
- **Dev Tooling:** Nodemon, Dotenv, Cors

---

## 📁 Project Structure

```text
job-tracker/
├── client/                 # Frontend React application
│   ├── public/             # Static assets
│   ├── src/                # Source code (components, pages, context, api)
│   ├── package.json        # Frontend dependencies & scripts
│   ├── vercel.json         # Vercel deployment configuration
│   └── vite.config.js      # Vite configuration
├── server/                 # Backend Node/Express API
│   ├── src/                # Backend source (controllers, models, routes, config)
│   ├── .env.example        # Environment variables template
│   ├── package.json        # Backend dependencies & scripts
│   └── server.js           # Express server entry point
└── README.md               # Main project documentation
```

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [MongoDB](https://www.mongodb.com/) (Local instance or MongoDB Atlas connection string)
- [Git](https://git-scm.com/)

---

### 1. Server Setup (Backend)

1. Open terminal and navigate to the server folder:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file from `.env.example`:
   ```bash
   cp .env.example .env
   ```

4. Configure your `.env` variables:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   RAPIDAPI_KEY=your_rapidapi_key
   ```

5. Start the backend development server:
   ```bash
   npm run dev
   ```
   Backend will run on `http://localhost:5000`.

---

### 2. Client Setup (Frontend)

1. Open a new terminal and navigate to the client folder:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   Frontend will run on `http://localhost:5173` (or the port shown in terminal).

---

## 🌐 Deployment

### Frontend (Vercel)
The `client` folder includes a `vercel.json` configured with SPA rewrites to ensure client-side routing works smoothly without 404 errors on page reloads.

### Backend (Render / Railway / Heroku)
Deploy the `server` directory as a web service. Ensure all environment variables from `.env.example` are configured in your hosting platform dashboard.

---

## 📄 License
This project is open source and available under the ISC License.
