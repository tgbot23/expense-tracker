# 💰 Expense Tracker PWA — Setup Guide

---

## Step 1 — Supabase Database Setup

Supabase dashboard mein jaao aur **SQL Editor** mein yeh query run karo:

```sql
-- Transactions table
create table transactions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  amount numeric not null,
  type text check (type in ('expense', 'income')) not null,
  date date not null,
  created_at timestamp with time zone default now()
);

-- User limits table
create table user_limits (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users unique not null,
  daily_limit numeric default 500,
  monthly_limit numeric default 5000,
  updated_at timestamp with time zone default now()
);

-- Row Level Security (important!)
alter table transactions enable row level security;
alter table user_limits enable row level security;

create policy "Users can manage own transactions"
  on transactions for all using (auth.uid() = user_id);

create policy "Users can manage own limits"
  on user_limits for all using (auth.uid() = user_id);
```

---

## Step 2 — Google Auth Enable karo

1. Supabase Dashboard → **Authentication → Providers**
2. **Google** ko enable karo
3. Google Cloud Console mein jaao → OAuth credentials banao
4. Client ID aur Secret Supabase mein daalo
5. Authorized redirect URI: `https://your-project.supabase.co/auth/v1/callback`

---

## Step 3 — .env file banao

`.env.example` file ko copy karke `.env` naam do:

```
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Yeh values Supabase Dashboard → **Settings → API** mein milegi.

---

## Step 4 — Vercel pe Deploy karo (FREE)

1. [vercel.com](https://vercel.com) pe jaao → GitHub se sign in karo
2. Is project folder ko GitHub pe upload karo (ya ZIP import karo)
3. **New Project** → Import karo
4. **Environment Variables** mein daalo:
   - `VITE_SUPABASE_URL` = apna URL
   - `VITE_SUPABASE_ANON_KEY` = apni key
5. **Deploy** dabao — 2 minute mein live! 🚀

---

## Step 5 — Phone pe Install karo (PWA)

- Chrome mein open karo apna Vercel URL
- Address bar ke paas **"Install"** button aayega
- Ya Chrome menu → **"Add to Home Screen"**
- App bilkul native app jaisa kaam karega! 📱

---

## Features

- ✅ Google Sign In via Supabase
- ✅ Daily + Monthly expense limits
- ✅ 80% warning + limit exceeded alerts
- ✅ Monthly PDF download (transactions + summary)
- ✅ Month-wise history browser
- ✅ Offline support (PWA)
- ✅ Install on home screen
