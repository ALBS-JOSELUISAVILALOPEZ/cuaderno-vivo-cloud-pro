# Cuaderno Vivo Cloud Pro

Professional study ecosystem with React, Supabase, and Vercel.

## Features

- 📚 Multiple interconnected "tomos" (books)
- 🔐 User authentication with Supabase
- 💾 Auto-save functionality
- 📤 JSON and ZIP export for data portability
- 🌐 Cloud-hosted on Vercel
- 🛡️ Row-Level Security (RLS) for user data isolation

## Setup

### 1. Environment Variables

Create a `.env` file in the root directory:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 2. Database Setup

1. Create a new project in Supabase
2. Go to SQL Editor
3. Paste the contents of `supabase/migrations/0001_init.sql`
4. Execute

### 3. Install Dependencies

```bash
npm install
```

### 4. Run Locally

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### 5. Deploy to Vercel

1. Push to GitHub
2. Go to Vercel
3. Import the repository
4. Add the environment variables in Vercel project settings
5. Deploy

## Project Structure

```
cuaderno-vivo-cloud-pro/
├── src/
│   ├── components/
│   │   ├── Auth.tsx          # Login/signup
│   │   └── Tomos.tsx         # Main app
│   ├── lib/
│   │   ├── supabase.ts       # Supabase client
│   │   └── export.ts         # JSON/ZIP export
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── supabase/
│   └── migrations/
│       └── 0001_init.sql     # Database schema
├── vercel.json
├── package.json
└── vite.config.ts
```

## Data Portability

All your data can be exported as JSON or ZIP, ensuring you can:
- Migrate to another platform
- Keep offline backups
- Access your data even if platform access is lost

Export buttons are available in the app sidebar.
