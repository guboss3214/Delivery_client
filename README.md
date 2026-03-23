# Food Delivery App - Frontend (Client Side)

This directory contains the Next.js (App Router) application for the Food Delivery service.

🌍 **Live Demo:** [https://delivery-client-wheat.vercel.app/](https://delivery-client-wheat.vercel.app/)

**Server Repo:** [https://github.com/guboss3214/Delivery_server](https://github.com/guboss3214/Delivery_server)

## 🚀 Advanced Level Features
- **Redux Toolkit**: Centralized state management with `redux-persist` for `localStorage` persistence.
- **Infinite Scroll**: Seamless product pagination on the Shops page.
- **Reorder Functionality**: Ability to repopulate the cart from past orders using search queries.
- **Coupons Logic**: Dynamic discount recalculation inside the Redux state.
- **Zod Validation**: Robust frontend form validation using React Hook Form + Zod.
- **Interactive Map Location (Leaflet)**: Smooth map integration for exact delivery address selection using OpenStreetMap & Nominatim API.
- **Responsive Navigation**: Adaptive UI with a mobile hamburger dropdown menu.
- **Smart Assistant Integration**: Context-aware chat for personalized food recommendations.

## 🛠 Tech Stack
- React 18 & Next.js 14+ (App Router)
- TypeScript
- Tailwind CSS
- Redux Toolkit & React-Redux
- React Hook Form
- Zod

## 📂 Project Structure
```
src/
├── app/              # Next.js pages & layouts
│   ├── page.tsx      # Main Shops page
│   ├── cart/         # Shopping cart & checkout
│   ├── history/      # Order history search
│   └── coupons/      # Promo codes page
├── components/       # Reusable UI components
├── store/            # Redux setup (store logic, slices)
├── types/            # TypeScript interfaces
└── lib/              # Utility functions and API helpers
```

## 🏃‍♂️ Getting Started
1. Run `npm install`
2. Create a `.env.local` file in the root of the `frontend` folder and add the following environment variable:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   ```
3. Run `npm run dev` to start the client locally on port 3000.
