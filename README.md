# urbanIQ Backend Services

This is the backend API for **urbanIQ**, built with **Node.js, Express.js (v5), and TypeScript**. It implements a modular domain-driven architecture to deliver scale, decoupling, and high performance.

---

## 🛠️ Tech Stack & Key Libraries

* **Framework**: Express.js (v5) with TypeScript
* **Database**: MongoDB via Mongoose (v9)
* **Caching & Stores**: Redis (v6) via `redis` client
* **Real-time Engine**: Socket.io (v4)
* **Authentication**: Credentials & Google OAuth 2.0 (`google-auth-library`), Bcryptjs, JWT
* **Asset Pipeline**: Multer, Sharp (WebP compression), `@aws-sdk/client-s3`
* **Billing Gateway**: Razorpay SDK
* **Mail Server**: Nodemailer
* **Validation**: Joi (Request body verification middlewares)

---

## 📁 Domain Modules (`src/modules/`)

The backend is modularized around specific domain logic:

* **`admin`**: Handles global platform administration, dashboard metrics/analytics, user management, and property approvals.
* **`auth`**: Manages credential login/registration, Google OAuth integration, session refreshing, token revocation, password reset, and email OTP verification.
* **`interaction`**: Encapsulates all interactions between platform users (Buyers, Owners, Agents) including real-time messaging/chat, inquiry dispatch, offer submissions, review posting, and physical/virtual visit scheduling.
* **`notification`**: In-app notification persistence, read/unread status updates, and fetching.
* **`payment`**: Process payments and order creations via Razorpay.
* **`property`**: Core property listing management (CRUD, status updates, agent assignment/routing, and comprehensive search filter queries for price, size, city, type, amenities, etc.).
* **`upload`**: Asset upload pipeline for listing photos and agent verification documents.
* **`user`**: User profile operations.

---

## 🔒 Security & Middleware Layer (`src/core/middlewares/`)

* **`auth.middleware.ts`**: Verifies incoming requests via JWT tokens, handles authentication state, and enforces role-based access control (RBAC) (Buyer, Owner, Agent, Admin).
* **`error.middleware.ts`**: Global centralized Express error-handling middleware that intercepts application-level errors (using `AppError`) and responds with consistent JSON payloads.
* **`upload.middleware.ts`**: Configures Multer memory storage and image processing via Sharp. Automatically resizes images to WebP formats for two tiers (Original at 80% quality, and Thumbnails at 400x300 at 70% quality) and uploads to AWS S3.
* **`validate.middleware.ts`**: Integrates Joi schemas to validate incoming request bodies before reaching controller layers.

---

## ⚡ Redis Caching & Token Blacklisting

Redis is utilized as a fast in-memory key-value store for three critical tasks:
1. **Pending Registration Payload**: Caches user registration details temporarily during the OTP step (TTL: 10 minutes) so records are only persisted to MongoDB after validation.
2. **OTP Verification**: Stores generated email OTP codes mapped to users (TTL: 5 minutes).
3. **Session Revocation (Refresh Token Blacklisting)**: Stores active refresh token identifiers (`jti`). Upon logout, the identifier is deleted/blacklisted from Redis, instantly invalidating the session.

---

## 🔌 Socket.io Real-time Communication

Real-time notification and chat systems are driven by `Socket.io` configured in `src/socket.ts`:
* On connection, clients emit a `'register'` event passing their `userId`.
* The server maps `userId` to `socketId` in an active connections map.
* Provides utility functions such as `emitToUser(userId, event, data)` to target notifications or messages directly to a specific user.
* Real-time events include:
  * `new_notification` (for status updates, offers, visits)
  * `new_message` (for real-time chat)
  * `new_interaction` (new visit request or inquiry on owned property)
  * `visit_updated` (visit rescheduled or approved/cancelled)
  * `new_assignment_request` (notifying an agent of a management assignment request)
  * `assignment_responded` (notifying the owner that the agent accepted/declined)

---

## ⚙️ Environment Variables (`.env`)

Create a `.env` file in the root of `urbaniq-backend/` containing:

```env
PORT=5001
MONGO_URI=your_mongodb_connection_uri
JWT_SECRET=your_jwt_access_secret
JWT_REFRESH_SECRET=your_jwt_refresh_secret
NODE_ENV=development
CLIENT_URL=http://localhost:3000

# Redis
REDIS_URL=redis://localhost:6379

# Nodemailer SMTP
EMAIL_USER=your_smtp_email
EMAIL_PASS=your_smtp_password

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id

# AWS S3 Storage
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=us-east-1
AWS_S3_BUCKET_NAME=your_s3_bucket_name

# Razorpay Payments
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret
```

---

## 🏃 Getting Started

### Local Development

1. **Install Dependencies**:
   ```bash
   npm install
   ```
2. **Start Redis**:
   Make sure Redis is running on port 6379 locally or set `REDIS_URL` in `.env`.
3. **Run Dev Server**:
   ```bash
   npm run dev
   ```

### Running with Docker

Build and run the multi-stage production container locally:
```bash
docker build -t urbaniq-backend .
docker run -p 5001:5001 --env-file .env urbaniq-backend
```