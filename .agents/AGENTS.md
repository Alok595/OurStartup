# Project Context & Architecture

**Project Description:** 
We are a technology-driven software development agency helping startups, businesses, and enterprises build high-quality digital products. From websites and mobile applications to AI-powered solutions, automation, branding, and custom software, we deliver scalable, secure, and innovative solutions tailored to business needs.

**Features:**
- Public facing agency website
- Admin panel (Dashboard) for managing content, users, and leads

---

## Folder Structure

The following folder structure must be strictly adhered to when adding new features or files to this Next.js application. Please note that everything here is placed inside the `src/` directory.

```
src/
├── app/                    # App Router
│   ├── (auth)/             # Route Group for Admin Login
│   │   ├── login/
│   │   └── register/
│   │
│   ├── (dashboard)/        # Admin Panel / Dashboard
│   │   ├── dashboard/
│   │   ├── users/
│   │   ├── services/       # Manage agency services
│   │   ├── portfolio/      # Manage case studies/work
│   │   └── settings/
│   │
│   ├── (marketing)/        # Public Agency Website
│   │   ├── about/
│   │   ├── services/
│   │   ├── contact/
│   │   └── page.tsx        # Agency Landing Page
│   │
│   ├── api/                # API Routes
│   │   ├── auth/
│   │   ├── users/
│   │   ├── leads/          # Contact form submissions
│   │   └── portfolio/
│   │
│   ├── layout.tsx
│   ├── loading.tsx
│   ├── error.tsx
│   └── not-found.tsx
│
├── components/
│   ├── ui/                 # Reusable UI (Buttons, Inputs, etc.)
│   ├── forms/              # Contact forms, Login forms
│   ├── layout/             # Navbar, Footer, Sidebar
│   ├── cards/              # Service cards, Portfolio cards
│   └── common/
│
├── features/               # Feature-based modules
│   ├── auth/               # Authentication
│   ├── admin/              # Admin panel specific logic
│   ├── portfolio/          # Case studies and past work
│   └── leads/              # Customer inquiries and contact
│
├── lib/                    # Shared libraries
│   ├── axios.ts
│   ├── auth.ts
│   ├── mongodb.ts
│   └── utils.ts
│
├── hooks/
│   ├── useAuth.ts
│   └── useDebounce.ts
│
├── services/               # API calling functions
│   ├── auth.service.ts
│   ├── leads.service.ts
│   └── portfolio.service.ts
│
├── store/                  # Zustand/Redux state
│   └── ui.store.ts
│
├── context/
│   └── ThemeProvider.tsx
│
├── types/
│   ├── auth.ts
│   └── portfolio.ts
│
├── schemas/                # Zod validation schemas
│   └── contact.schema.ts
│
├── constants/
│   ├── routes.ts
│   └── config.ts
│
├── middleware.ts
```
