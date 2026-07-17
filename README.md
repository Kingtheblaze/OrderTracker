# 📦 OrderTracker — Full-Stack Order Management System

A **secure, role-based** order tracking and management platform built with **Next.js 16**, **MongoDB**, and **JWT Authentication**. Designed with a premium Amazon-inspired dark UI featuring glassmorphism, real-time order tracking timelines, and responsive design.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-green?logo=mongodb)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel)

---

## ✨ Features

### 🛡️ Role-Based Access Control
- **Manager**: Create orders, update order status, delete orders, view all orders
- **Customer**: View only their assigned orders, track order status with visual timeline

### 📍 Amazon-Style Order Tracking
- Step-by-step visual timeline: `Order Placed → Confirmed → Processing → Shipped → Out for Delivery → Delivered`
- Timestamps and "updated by" info on each tracking step

### 🔐 Secure Authentication
- JWT tokens stored in HTTP-only cookies
- Passwords hashed with bcryptjs (12 rounds)
- Protected API endpoints with role-based authorization

### 🎨 Premium UI
- Dark mode glassmorphism design
- Responsive across all devices
- Micro-animations and smooth transitions
- Google Fonts (Outfit)

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16 (App Router), React 19, TypeScript |
| Backend | Next.js API Routes |
| Database | MongoDB (via Mongoose) |
| Auth | JWT + bcryptjs |
| Styling | Vanilla CSS (Glassmorphism) |
| Deployment | Vercel |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- MongoDB running locally (or MongoDB Atlas URI)

### Installation

```bash
# Clone the repo
git clone https://github.com/Kingtheblaze/OrderTracker.git
cd OrderTracker

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local
# Edit .env.local with your MongoDB URI and JWT secret

# Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Environment Variables

Create a `.env.local` file:

```env
MONGODB_URI=mongodb://localhost:27017/orderTrackerDb
JWT_SECRET=your-super-secret-key-change-this
```

---

## 👥 User Roles

### Creating a Manager Account
1. Sign up as a regular user via the UI
2. Open MongoDB Compass
3. Go to `orderTrackerDb` → `users` collection
4. Find your user and change `role` from `"customer"` to `"manager"`
5. Log out and log back in

### Customer Flow
1. Sign up → automatically assigned `customer` role
2. Orders assigned by a manager will appear in the dashboard
3. Click "Track Order" to see the Amazon-style timeline

---

## 📁 Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── login/route.ts
│   │   │   ├── signup/route.ts
│   │   │   ├── logout/route.ts
│   │   │   └── me/route.ts
│   │   └── orders/
│   │       ├── route.ts
│   │       └── [id]/route.ts
│   ├── login/page.tsx
│   ├── signup/page.tsx
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── Navbar.tsx
│   ├── OrderCard.tsx
│   ├── OrderDashboard.tsx
│   ├── OrderForm.tsx
│   └── OrderTimeline.tsx
├── context/
│   └── AuthContext.tsx
├── lib/
│   ├── auth.ts
│   └── mongodb.ts
└── models/
    ├── Order.ts
    └── User.ts
```

---

## 🌐 Deploying to Vercel

1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) and import the repo
3. Add environment variables in Vercel dashboard:
   - `MONGODB_URI` — your MongoDB Atlas connection string
   - `JWT_SECRET` — a strong random secret
4. Deploy! ✅

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
