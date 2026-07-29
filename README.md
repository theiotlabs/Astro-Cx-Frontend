# Astro Mobile Numerology - Frontend

This is the Next.js frontend application for the **Astro Mobile Numerology Platform**, providing the user-facing eCommerce experience, report viewing, and CRM profile management.

## 1. Technologies Used
- **Framework:** Next.js (App Router)
- **Styling:** Tailwind CSS
- **State Management:** Zustand
- **API Client:** Axios (with custom token refresh interceptors)

## 2. API Integration Map
The frontend connects to the Django backend using standardized endpoints managed in `src/constants/index.ts`. All authenticated requests automatically attach a JWT token.

### Endpoints
* **Auth**: `/api/auth/register/`, `/api/auth/login/`, `/api/auth/refresh/`
* **Profile**: `/api/me/profile/`
* **Commerce**: 
  * `/api/commerce/services/` (List catalog)
  * `/api/commerce/orders/create/` (Checkout)
  * `/api/commerce/payments/verify/` (Razorpay Success Verification)
* **Numerology Reports**:
  * `/api/mobile-numerology/reports/{id}/status/` (Live generation polling)
  * `/api/mobile-numerology/reports/{id}/preview/` (HTML preview)
  * `/api/mobile-numerology/reports/{id}/download/` (PDF download)

## 3. Getting Started

First, ensure your backend is running. Then, configure your environment variables:

1. Copy `.env.example` to `.env.local`
2. Ensure the `NEXT_PUBLIC_API_URL` points to your backend (e.g., `http://localhost:8000`).

Run the development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## 4. Key Features
- **Auto Token Refresh**: The Axios interceptor (`src/services/api.ts`) automatically intercepts `401 Unauthorized` responses and attempts a silent JWT refresh in the background without logging the user out.
- **Polling System**: When an order is paid, the frontend seamlessly polls the `/status/` API until the Celery backend finishes generating the report.
