# Kourrklys International School (KIS) - Admin Portal

A professional management system designed for Kourrklys International School to handle student registration, staff records, and administrative oversight.

## 🚀 Tech Stack

- **Framework**: [Next.js 15 (App Router)](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [Shadcn UI](https://ui.shadcn.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Charts**: [Recharts](https://recharts.org/)
- **Forms**: [React Hook Form](https://react-hook-form.com/) + [Zod Validation](https://zod.dev/)
- **Backend/Database**: [Firebase Firestore](https://firebase.google.com/docs/firestore)
- **Authentication**: [Firebase Auth](https://firebase.google.com/docs/auth)

## 📁 Project Structure

```text
src/
├── ai/                # Genkit AI configurations and flows
├── app/               # Next.js App Router (Pages and Layouts)
│   ├── dashboard/     # Protected admin dashboard routes
│   │   ├── students/  # Student Directory (CRUD)
│   │   ├── teachers/  # Staff Registry (CRUD)
│   │   └── settings/  # System-wide admin settings
│   └── (auth)/        # Authentication routes (Login, Forgot Password)
├── components/        # Reusable React components
│   ├── ui/            # Shadcn atomic components
│   └── dashboard-shell.tsx # Global dashboard layout and sidebar
├── firebase/          # Firebase core integration
│   ├── firestore/     # Custom hooks (useCollection, useDoc)
│   ├── auth/          # Auth hooks (useUser)
│   └── provider.tsx   # Context providers for Firebase services
├── hooks/             # Custom React hooks (toasts, mobile detection)
└── lib/               # Utility functions, constants, and global schemas
```

## 🔐 Backend & Database Integration

### Firebase Configuration
The core configuration resides in `src/firebase/config.ts`. All Firebase services (Auth, Firestore) are initialized in `src/firebase/index.ts` and provided globally via the `FirebaseClientProvider` in the root layout.

### Data Modeling (`docs/backend.json`)
We use `backend.json` as an Intermediate Representation (IR) to define the database schema.
- **/students**: Collection for student bio-data, academic status, and guardian details.
- **/teachers**: Collection for staff professional profiles and next-of-kin info.

### Custom Hooks
For real-time data sync, always use the provided hooks:
- `useFirestore()`: Returns the initialized Firestore instance.
- `useCollection(query)`: Listens to a live collection/query.
- `useDoc(ref)`: Listens to a specific document.

### Error Architecture
The system uses a centralized error-handling pattern for Security Rules:
- `src/firebase/errors.ts`: Defines `FirestorePermissionError`.
- `src/firebase/error-emitter.ts`: An `EventEmitter` to signal permission issues.
- `src/components/FirebaseErrorListener.tsx`: A global listener that displays descriptive toasts or developer overlays when a database operation is denied.

## 🛠 Development Workflow

1. **Authentication**: Redirects to `/login` by default. Session state is managed via `useUser()`.
2. **Forms**: All mutations use Zod schemas for strict validation before hitting the database.
3. **Analytics**: The dashboard charts (`src/app/dashboard/page.tsx`) process live Firestore collections to provide dynamic enrollment stats.

---
*Developed for Kourrklys International School Admin Portal.*