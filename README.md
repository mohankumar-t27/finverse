# 💎 FinVerse — Quantum Personal Finance & Expense Tracker

> A modern, responsive, and intelligent monthly budget and expense management web application built with **Next.js 15**, **React 19**, **Tailwind CSS**, and **Firebase**.

---

## 🌟 Overview

**FinVerse** provides a seamless, glassmorphic dashboard for individuals to monitor their monthly income, plan category-based budgets, log daily expenses, and gain visual analytics into their spending distribution.

---

## ✨ Key Features

- 📅 **Monthly Budget Planning**: Set custom monthly budgets per category (e.g. Rent, Groceries, Dining, Entertainment). Easily copy budgets from previous months with one click.
- 💵 **Income & Expense Tracking**: Log earned income and daily expenses with categories, descriptions, timestamps, and real-time calculation of remaining budgets.
- 📊 **Interactive Analytics & Charts**:
  - **Budget vs. Actual**: Visual bar charts comparing budget caps against actual spending.
  - **Spending Distribution**: Dynamic donut/pie charts illustrating category breakdowns.
- 🔐 **Firebase Authentication**: Google OAuth single sign-on (SSO) with popup on desktop and redirect flow on mobile devices.
- ⚡ **Real-Time Data Sync**: Firestore integration ensures your financial data stays updated across all devices.
- 📱 **Mobile First & PWA Ready**: Fully responsive layout optimized for mobile screens, tablets, and desktop browsers with Progressive Web App capabilities.
- 🎨 **Modern Glassmorphic Design**: Clean UI with dark/light mode toggle, glowing accents, and micro-animations.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Library**: [React 19](https://react.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [Class Variance Authority](https://cva.style/)
- **UI Components**: [Radix UI](https://www.radix-ui.com/) & [Lucide Icons](https://lucide.dev/)
- **Charts**: [Recharts](https://recharts.org/)
- **Backend & Auth**: [Firebase](https://firebase.google.com/) (Firestore & Auth)
- **PWA**: `@ducanh2912/next-pwa`

---

## 📁 Project Structure

```text
finverse/
├── src/
│   ├── app/                  # Next.js App Router (pages, layout, globals.css)
│   ├── components/           # UI Components
│   │   ├── ui/               # Radix / Shadcn reusable primitives
│   │   ├── add-earned-dialog.tsx
│   │   ├── add-expense-dialog.tsx
│   │   ├── budget-setup-dialog.tsx
│   │   ├── category-spending.tsx
│   │   ├── header.tsx
│   │   ├── login.tsx
│   │   ├── logo.tsx
│   │   ├── month-selector.tsx
│   │   ├── overview-cards.tsx
│   │   ├── recent-transactions.tsx
│   │   └── spending-charts.tsx
│   ├── firebase/             # Firebase SDK setup, Auth hooks, & Firestore helpers
│   ├── hooks/                # Custom React hooks (use-toast, use-media-query)
│   └── lib/                  # TypeScript types, utils, & helper functions
├── public/                   # Static assets & PWA manifest
├── .env                      # Environment variables configuration
├── package.json              # Project dependencies and scripts
└── tsconfig.json             # TypeScript configuration
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have **Node.js 20+** installed on your system.

```bash
node --version
```

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/mohankumar-t27/finverse.git
   cd finverse
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up Environment Variables**:
   Create a `.env` file in the root directory (or update existing `.env`):
   ```env
   GEMINI_API_KEY=your_gemini_api_key
   ```

4. **Run the Development Server**:
   ```bash
   npm run dev
   ```

5. **Open in Browser**:
   Navigate to [http://localhost:9002](http://localhost:9002) in your browser.

---

## 📜 Available Scripts

| Script | Description |
| :--- | :--- |
| `npm run dev` | Cleans build cache and starts local development server on port 9002 |
| `npm run build` | Compiles production build of Next.js application |
| `npm run start` | Runs production server after build |
| `npm run typecheck` | Runs TypeScript compiler checks without emitting files |
| `npm run lint` | Runs Next.js ESLint rules |

---

## 🔒 Firebase Configuration

Firebase client configuration is maintained in `src/firebase/config.ts`. Ensure your Firebase project has **Google Sign-In** enabled in the Firebase Console under **Authentication > Sign-in method**.

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
