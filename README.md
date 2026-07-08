# 🌟 Fabric Hub - Premium E-Commerce Store

Fabric Hub is a full-stack MERN (MongoDB, Express, React, Node.js) e-commerce application specializing in premium fabrics and apparel. It provides a complete, modern e-commerce experience including user authentication, product catalogs with advanced search and filters, shopping cart and wishlist management, order processing, and a detailed admin dashboard for store operations.

---

##  Key Features

### 👤 Customer Experience
*   **Secure Authentication**: JWT-based user authentication using secure, HTTP-only cookies.
*   **Interactive Catalog**: Browse categories and products with advanced client-side and server-side filtering (filter by categories, sizes, colors, price ranges, ratings).
*   **Wishlist & Cart**: Persistent shopping cart and user-specific wishlists.
*   **Product Reviews**: Add, edit, or delete product reviews. Real-time automatic recalculation of average ratings and total reviews for each product.
*   **Order Checkout**: Smooth checkout flow with real-time stock validations, delivery addresses, and automated email order confirmations.

###  Administrative Panel
*   **Admin Dashboard**: Overview of key store metrics (total revenue, orders, active customers, stock status).
*   **Category Management**: Complete CRUD operations for categories with image uploads (local and Cloudinary integration).
*   **Product Catalog Management**: Easily add, edit, or remove products (supporting image galleries, colors, sizes, stock levels, featured tags).
*   **Order Processing**: Track customer orders, update order status (Pending, Shipped, Delivered, Cancelled), and manage inventory.

---

## 🛠️ Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React (v19), Vite, Tailwind CSS (v4), Framer Motion, Lucide React, React Router (v7) |
| **Backend** | Node.js, Express.js, JWT, Cookie Parser, Cors, Joi (Payload Validation) |
| **Database & Storage** | MongoDB, Mongoose ORM, Cloudinary (Cloud media storage), Multer (File uploads) |
| **Notification** | Nodemailer (SMTP email integration) |

---

## 📁 Repository Structure

The project is structured as a monorepo containing distinct directories for the backend server and frontend client:

```
Fabric_Hub/
├── Backend/                 # Express.js REST API Server
│   ├── config/              # Database & Cloudinary configurations
│   ├── controllers/         # Request handlers & Business logic
│   ├── middlewares/         # Auth, validation & global error handlers
│   ├── models/              # Mongoose collection schemas
│   ├── routes/              # Express API route declarations
│   ├── seeders/             # Database initialization scripts and JSON data
│   ├── uploads/             # Local upload storage directory
│   ├── server.js            # Node app entry point
│   ├── .env.example         # Environment template configuration
│   └── package.json         # Backend dependencies & scripts
│
├── Frontend/                # Vite + React Client Application
│   ├── src/                 # React source code (components, hooks, pages, assets)
│   ├── public/              # Static assets (favicons, logos)
│   ├── vite.config.js       # Vite configuration
│   ├── tailwind.config.js   # Tailwind setup
│   └── package.json         # Frontend dependencies & scripts
│
├── database_design.md       # Detailed MongoDB schema specification document
├── implementation_plan.md   # Backend development architectural roadmap
└── README.md                # Project documentation (this file)
```

---

## ⚙️ Getting Started

### Prerequisites
Before running the application, make sure you have the following installed:
*   [Node.js](https://nodejs.org/) (v16+ recommended)
*   [MongoDB](https://www.mongodb.com/) (Local instance or MongoDB Atlas Cloud Database)
*   A [Cloudinary](https://cloudinary.com/) account (for product/category image uploads)
*   An SMTP Email service account (e.g. Mailtrap for development or Gmail/Sendgrid for production)

---

### Setup Instructions

#### 1. Clone the Repository
```bash
git clone https://github.com/your-username/Fabric_Hub.git
cd Fabric_Hub
```

#### 2. Configure Backend
1. Navigate to the `Backend` directory:
   ```bash
   cd Backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   Copy the `.env.example` file to `.env`:
   ```bash
   cp .env.example .env
   ```
   Open `.env` and fill in your connection strings and API credentials:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_uri
   JWT_SECRET=your_secret_key
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   # SMTP Settings
   EMAIL_HOST=your_smtp_host
   EMAIL_PORT=your_smtp_port
   EMAIL_USER=your_smtp_username
   EMAIL_PASS=your_smtp_password
   ```

#### 3. Seed Database (Optional)
To populate your MongoDB database with pre-configured category and product dummy data:
```bash
node seeders/seed.js
```

#### 4. Configure Frontend
1. Navigate to the `Frontend` directory:
   ```bash
   cd ../Frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

---

## 🏃 Running the Application

### Start Backend Server
From the `Backend` directory:
```bash
npm start
```
The server will start on [http://localhost:5000](http://localhost:5000) (or whichever port you specified in `.env`). You can check `/health` to verify it's active.

### Start Frontend Dev Server
From the `Frontend` directory:
```bash
npm run dev
```
The client app will launch on [http://localhost:5173](http://localhost:5173).

---


## 📄 License
This project is licensed under the ISC License.
