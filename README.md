Mini Plant Store - Backend
Overview
This is the backend for the Mini Plant Store, built for the Urvann Software Development Intern Assignment. It provides RESTful APIs for plant catalog management, search/filter, and admin CRUD operations with image uploads.
Features

Plant Catalog API:
GET /api/plants: Fetch plants with optional search (name/category, case-insensitive) and category filter.


Categories API:
GET /api/categories: Returns unique categories from plants.


Admin CRUD:
POST /api/plants: Add plant with image upload (multipart/form-data).
PUT /api/plants/:id: Update plant, including optional image upload.
DELETE /api/plants/:id: Delete plant by ID.


Database:
MongoDB with 50+ seeded plants (realistic data: names, prices, categories like Indoor, Succulent, Air Purifying).


Extras:
Image uploads via multer (stored in /uploads, served statically).
Input validation with Joi.
Text index for fast search.



Tech Stack

Framework: Node.js + Express.js.
Database: MongoDB (Mongoose for schema).
File Uploads: Multer (stores images in /uploads).
Validation: Joi.
Environment: Dotenv for configuration.

Setup Instructions
Prerequisites

Node.js (v18+ recommended).
MongoDB (local or MongoDB Atlas free tier).

Installation

Clone the repository:git clone https://github.com/manikanta201104/Plant_Backend.git/mini-plant-store-backend.git
cd mini-plant-store-backend


Install dependencies:npm install


Create .env file in root:MONGO_URI=mongodb+srv://<user>:<pass>@cluster0.mongodb.net/plantstore?retryWrites=true&w=majority
PORT=5000



Seed Database
Populate with 50+ plants:
npm run seed

Run Locally
npm run dev


Runs at http://localhost:5000.
Endpoints:
GET /api/plants?search=query&categories=indoor,outdoor
GET /api/categories
POST /api/plants (multipart/form-data: image, name, price, categories (JSON), availability, description)
PUT /api/plants/:id (same as POST)
DELETE /api/plants/:id


Static Files: Images served at /Uploads/filename.jpg.

Deployment

Platform: Render (free tier).
Deployed URL: [https://urvann-yz2n.onrender.com] (replace with actual).
Configuration:
Set MONGO_URI in Render’s environment variables.
Build: npm install
Start: npm start


Notes: Use cloud storage (e.g., AWS S3) for images in production. Render’s disk is ephemeral, so /uploads may reset.

Usage

API Testing: Use Postman or curl.
Add plant: POST /api/plants with form-data (key: image, file: image.jpg; others: text/JSON).
Example body:name: "Money Plant"
price: 10.99
categories: ["Indoor", "Air Purifying"]
availability: true
description: "Low maintenance plant"
image: (file upload)




Seeding: seeds/seed.js populates 50+ plants with realistic data (no images by default; upload via admin).
Images: Stored in /uploads, served at http://localhost:5000/Uploads/filename.jpg.

Code Quality

Modularity: Routes in routes/plants.js, models in models/Plant.js.
Validation: Joi ensures valid inputs (e.g., unique name, positive price).
Performance: MongoDB text index on name/categories for fast searches.
Error Handling: Global middleware catches errors, returns JSON responses.
Scalability: RESTful APIs, indexed queries, extensible for cloud storage.

Troubleshooting

MongoDB Errors: Verify MONGO_URI and MongoDB connection.
Image Issues: Ensure /uploads folder exists, writable. Check http://localhost:5000/Uploads/... in browser.
API Failures: Test endpoints with Postman. Check console for errors.

For issues, contact [your-email].
