# Appointment Booking System

A full-stack **MERN** application for managing appointments. This project utilizes a modern architecture with **Redux** for state management, **Axios** for API requests, and **Tailwind CSS** for styling, built for performance with **Vite**.

## 🚀 Tech Stack

### Client (Frontend)
* **Library:** React.js (Vite)
* **State Management:** Redux Toolkit
* **Styling:** Tailwind CSS
* **HTTP Client:** Axios
* **Routing:** React Router DOM

### Server (Backend)
* **Runtime:** Node.js
* **Framework:** Express.js
* **Database:** MongoDB (Mongoose)
* **Architecture:** MVC + Services Pattern

---

## 📂 Folder Structure

The project is divided into two main directories: `client` for the frontend and `server` for the backend.

```text
APPOINTMENT/
├── client/                 # Frontend (Vite + React)
│   ├── public/
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── config/         # Frontend configuration
│   │   ├── pages/          # Application pages/routes
│   │   ├── redux/          # Redux slices and store setup
│   │   ├── routing/        # Route protection and definitions
│   │   ├── utils/          # Helper functions
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env                # Frontend environment variables
│   ├── eslint.config.js
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── server/                 # Backend (Node + Express)
│   ├── src/
│   │   ├── config/         # DB connection and app config
│   │   ├── controllers/    # Request handlers
│   │   ├── middlewares/    # Custom middlewares (Auth, Error handling)
│   │   ├── models/         # Mongoose schemas
│   │   ├── routes/         # API route definitions
│   │   ├── services/       # Business logic layer
│   │   ├── utils/          # Utility functions
│   │   └── validators/     # Input validation logic
│   ├── .env                # Backend environment variables
│   └── index.js            # Server entry point
└── README.md
```

## 📡 API Endpoints

### 🔐 Authentication
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register a new user | Public |
| `POST` | `/api/auth/signin` | Login user | Public |

### 🛠️ Services
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/services/all` | Get all available services | Authenticated |
| `POST` | `/api/services/` | Create a new service | **Provider** |
| `GET` | `/api/services/` | Get services created by me | **Provider** |
| `PATCH` | `/api/services/:serviceId` | Update service details | **Provider** |
| `DELETE` | `/api/services/:serviceId` | Delete a service | **Provider** |

### 📅 Availability
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/availability/` | Set availability for a service | **Provider** |
| `GET` | `/api/availability/:serviceId` | Get availability settings | **Provider** |

### 🗓️ Appointments
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/appointments/slots` | Get available slots for a day | Authenticated |
| `POST` | `/api/appointments/` | Book a new appointment | Authenticated |
| `GET` | `/api/appointments/me` | Get my booked appointments | Authenticated |
| `PATCH` | `/api/appointments/:id/cancel` | Cancel an appointment | Authenticated |
| `PATCH` | `/api/appointments/:id/reschedule`| Reschedule an appointment | Authenticated |
| `GET` | `/api/appointments/provider` | Get bookings received | **Provider** |
| `PATCH` | `/api/appointments/:id/status` | Update status (Confirm/Reject) | **Provider** |

## ⚙️ Installation & Setup

### Prerequisites
* **Node.js** (v14 or higher)
* **MongoDB** (Local instance or MongoDB Atlas URL)

### 1. Clone the Repository
```bash
git clone https://github.com/Beast0E4/Appointment.git
cd Appointment
```

### 2. Backend Setup
Navigate to the server folder, install dependencies, and start the backend server.

```bash
cd server
npm install
```
#### **Configuration** Create a .env file in the server root and add the following:
```bash
PORT=8080
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```
#### Start server
```bash
npm run dev
# or
npm start
```

## 3. Frontend Setup

Open a new terminal, navigate to the client folder, and install dependencies.

### Bash

```bash
cd client
npm install
```

### Configuration

Create a `.env` file in the client root (if required):

```env
VITE_API_URL=http://localhost:8080/
```

### Start Client

```bash
npm run dev
```

The frontend will typically run on:

👉 [http://localhost:5173](http://localhost:5173)

---

## 🌟 Key Features

### Appointment Management

Book, view, and manage appointment slots.

### Slot Availability

Dynamic calculation of available time slots based on service duration (handled in `services/`).

### State Management
Global state handling using Redux for a smooth user experience.

### Validation

Strong backend validation using dedicated validator modules.

### Responsive UI

Fast and responsive
