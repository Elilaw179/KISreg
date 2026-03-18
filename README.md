# Kourrklys International School (KIS) - Admin Portal

A professional management system designed for Kourrklys International School to handle student registration, staff records, and administrative oversight.

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

The system uses **Google Firebase Firestore**, which is highly scalable:

- **Free Tier (Spark Plan)**:
  - **Storage**: 1 GB (Approx. 250,000+ full student/staff profiles).
  - **Daily Operations**: 50,000 Reads / 20,000 Writes (More than sufficient for daily administrative tasks).
- **Scalability**: For larger institutions, the system can scale to millions of records without code modifications.
- **Data Security**: Protected by robust Security Rules that ensure only authorized administrators can modify sensitive bio-data.

## 📁 Project Structure

```text
src/
├── ai/                # Genkit AI configurations and flows
├── app/               # Next.js App Router (Pages and Layouts)
│   ├── dashboard/     # Protected admin dashboard routes
│   │   ├── students/  # Student Directory (CRUD + CSV Export)
│   │   ├── teachers/  # Staff Registry (CRUD + CSV Export)
│   │   └── settings/  # System-wide admin settings (Firestore Persisted)
│   └── (auth)/        # Authentication routes
├── components/        # Reusable React components
│   └── dashboard-shell.tsx # Global dashboard layout with auth guards
├── firebase/          # Firebase core integration
└── lib/               # Utility functions and global schemas
```

## 🔐 Authentication & Security

- **Master Credentials**: Controlled via `src/lib/auth-config.ts`.
- **Auth Guard**: The `DashboardShell` automatically redirects unauthenticated users to `/login`.
- **Non-Blocking Mutations**: All database writes use an optimistic, non-blocking pattern for a "hang-free" user experience.

## 🛠 Features

1. **Student Enrollment**: Full bio-data, guardian details, and medical profile tracking.
2. **Staff Registry**: Professional record management with deactivation/activation toggles.
3. **Global Settings**: Live synchronization of academic sessions, terms, and school identity.
4. **Reporting**: One-click CSV exports for both Student and Staff directories, optimized for Excel.
5. **Analytics**: Real-time enrollment distribution charts for Primary and Secondary levels.

---
*Developed for Kourrklys International School Admin Portal.*
