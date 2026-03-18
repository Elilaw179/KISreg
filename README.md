# Kourrklys International School (KIS) - Admin Portal

A high-performance, professional management system designed for Kourrklys International School to handle student registration, staff records, and administrative oversight.

## 🚀 Tech Stack

- **Framework**: [Next.js 15 (App Router)](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [Shadcn UI](https://ui.shadcn.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Charts**: [Recharts](https://recharts.org/)
- **Backend/Database**: [Firebase Firestore](https://firebase.google.com/docs/firestore)
- **Authentication**: [Firebase Auth](https://firebase.google.com/docs/auth)

## 📊 Database Scalability & Limits

The system uses **Google Firebase Firestore**, which is highly scalable and cost-efficient for educational institutions:

- **Free Tier (Spark Plan)**: 
  - **Duration**: Forever Free (No expiration date).
  - **Storage**: 1 GB (Sufficient for approximately 250,000+ full student/staff profiles).
  - **Daily Operations**: 50,000 Reads / 20,000 Writes (More than enough for the daily administrative tasks of a large institution).
- **Scalability**: For larger institutions, the system can scale to millions of records. Document-based storage ensures that data retrieval remains fast regardless of total record count.
- **Data Security**: Protected by robust Security Rules that ensure only authorized administrators can modify sensitive bio-data.

## 📁 Project Structure

```text
src/
├── app/               # Next.js App Router (Pages and Layouts)
│   ├── dashboard/     # Protected admin dashboard routes
│   │   ├── students/  # Student Directory (CRUD + CSV Export)
│   │   ├── teachers/  # Staff Registry (CRUD + CSV Export)
│   │   └── settings/  # System-wide admin settings (Firestore Persisted)
│   └── (auth)/        # Authentication routes
├── components/        # Reusable React components
│   └── dashboard-shell.tsx # Global dashboard layout with auth guards
├── firebase/          # Firebase core integration (SDK v11+)
└── lib/               # Utility functions and global schemas
```

## 🔐 Authentication & Security

- **Master Credentials**: Controlled via `src/lib/auth-config.ts`.
- **Auth Guard**: The `DashboardShell` automatically redirects unauthenticated users to `/login`.
- **Non-Blocking Mutations**: All database writes use an optimistic, non-blocking pattern for a high-performance, lag-free user experience.

## 🛠 Key Features

1. **Student Enrollment**: Comprehensive bio-data, guardian details, and medical profile tracking.
2. **Staff Registry**: Professional record management with active/inactive status toggles.
3. **Admin Identity Management**: High-fidelity personal profile customization with portrait uploads.
4. **Global Settings**: Live synchronization of academic sessions, terms, and school identity across the portal.
5. **Excel-Optimized Reporting**: One-click CSV exports with Excel-specific formatting to prevent scientific notation on phone numbers and ensure no data truncation.
6. **Real-Time Analytics**: Live enrollment distribution charts for both Primary and Secondary levels using a tabbed distribution interface.

---
*Developed for Kourrklys International School Administrative Infrastructure.*