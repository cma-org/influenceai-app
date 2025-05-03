# InfluenceAI App

A modern web application for Instagram and Facebook influencer insights, built using Next.js with App Router, TypeScript, and API routes for auth and analytics.

---

## 🔧 Tech Stack

- **Framework**: Next.js (App Router)
- **Language**: TypeScript
- **Styling**: CSS Modules
- **Auth**: Facebook OAuth, Magic Link
- **Data**: Instagram Graph API
- **Deployment**: Custom HTTPS-ready dev server

---

## 📁 Project Structure

```
app/
├── api/                    # Serverless API routes (auth, insights, media)
├── auth/                   # Authentication pages and states
├── components/             # UI components (auth buttons, charts, layout)
├── config/                 # Facebook auth configurations
├── dashboard/              # Dashboard pages for insights and user profiles
├── hooks/                  # Custom React Hooks
├── instagram/              # Instagram landing page
├── lib/                    # Utility functions and types
├── user-type-selection/    # Page to choose user role
├── layout.tsx              # Root layout
├── middleware.ts           # Route handling middleware
├── page.tsx                # Home page
├── globals.css             # Global styles
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 14+
- npm or yarn

### Install

```bash
git clone https://github.com/cma-org/influenceai-app.git
cd influenceai-app
npm install
```

## 🔒 HTTPS for Localhost

To enable HTTPS for local development:

### ✅ Recommended: Using `mkcert`

1. Install `mkcert`:

```bash
brew install mkcert    # macOS
choco install mkcert   # Windows (with Chocolatey)
```

2. Setup local CA:

```bash
mkcert -install
```

3. Generate certs:

```bash
mkcert localhost
```

4. Update `server.js`:

```js
const fs = require("fs");
const https = require("https");
const next = require("next");

const app = next({ dev: true });
const handle = app.getRequestHandler();

const httpsOptions = {
  key: fs.readFileSync("./localhost-key.pem"),
  cert: fs.readFileSync("./localhost.pem"),
};

app.prepare().then(() => {
  https
    .createServer(httpsOptions, (req, res) => {
      handle(req, res);
    })
    .listen(3000, () => {
      console.log("> Ready on https://localhost:3000");
    });
});
```

### Run the Development Server

```bash
npm run dev
```

## Now, your application should be accessible at https://localhost:3000

# 📁 `app/` Folder Documentation — InfluenceAI App

## 🌐 Overview

The `app/` directory in the InfluenceAI App follows the modern **Next.js App Router** structure and is the core of the application, handling routing, API endpoints, authentication, UI components, and integration with Instagram and Facebook APIs.

---

## 🔧 Root Level Files

| File                         | Description                                          |
| ---------------------------- | ---------------------------------------------------- |
| `layout.tsx`                 | Global layout component, wraps all pages.            |
| `middleware.ts`              | Middleware logic, likely for route handling or auth. |
| `page.tsx`                   | Default landing page.                                |
| `global.css` / `globals.css` | Global CSS styles.                                   |

---

## 📂 Key Directories

### 1. **`api/`** — Serverless Functions (Next.js API Routes)

Handles back-end logic such as authentication, data fetching from Instagram, Facebook, etc.

#### ➤ `api/auth/`

- `facebook/`: OAuth routes for Facebook login (`accounts`, `callback`, `complete`, `exchange-token`)
- `instagram/`: Routes for Instagram login & token exchange.
- `magic-link/`: Routes to handle magic link auth (email-based).

#### ➤ `api/instagram/`

- `insights/`: Fetches Instagram analytics like:

  - `account/`, `current-month-likes/`, `demographics/`, `follower-growth/`, `post-engagements/`

- `media/`: Endpoint to fetch and interact with post-level media data.
- `media/[id]/`: Dynamic route for individual Instagram media items.

#### ➤ `api/user/`

- `me/`: Returns the logged-in user's info.

---

### 2. **`auth/`** — Pages for Authentication

Pages supporting various auth states:

- `auth/page.tsx`: Main login view.
- `error/page.tsx`: Error screen.
- `facebook/account-selection/`: Page to select FB account post-login.
- `magic-link-*`: Pages for expired, invalid, successful, and verification steps.

---

### 3. **`components/`** — Reusable React Components

| Subfolder    | Purpose                                               |
| ------------ | ----------------------------------------------------- |
| `auth/`      | Login buttons & magic link forms                      |
| `common/`    | UI elements like `Button`, `Card`, `Header`           |
| `dashboard/` | Charts and navigation for Instagram dashboard         |
| `functools/` | Utilities like `JsonViewer` for debugging or data viz |

📊 **Insights Charts** include:

- `FollowersGrowthChart.tsx`
- `GenderSplitChart.tsx`
- `LocationByCountryChart.tsx`
- `PostEngagementsChart.tsx` etc.

---

### 4. **`config/`**

- `facebook-auth.ts`: Centralized Facebook App ID, redirect URIs, scopes.

---

### 5. **`dashboard/`**

Main dashboard pages with analytics and user profile:

- `dashboard/instagram-insights/`
- `dashboard/instagram-posts/`
- `dashboard/magic-link/`
- `dashboard/profile/`

Each contains its own `page.tsx`.

---

### 6. **`hooks/`**

- `useInstagramInsights.ts`: Custom React Hook to fetch and manage Instagram analytics data.

---

### 7. **`instagram/`**

- Contains root-level Instagram UI `page.tsx`.

---

### 8. **`lib/`**

Utility and service layer.

| Subfolder | Content                                                                    |
| --------- | -------------------------------------------------------------------------- |
| `auth/`   | `authService.ts` — login, token verification                               |
| `types/`  | TypeScript interfaces                                                      |
| `utils/`  | Cookie utilities for server and client (`cookies.ts`, `server-cookies.ts`) |

---

### 9. **`user-type-selection/`**

- `page.tsx`: UI to select user role or experience type post-login.

---

## 📊 Core Features

- Instagram account analytics (followers, engagement, demographics)
- Facebook account authentication and token exchange
- Magic Link login (passwordless auth)
- Dynamic charts and dashboards
- Extensible API routes

---

## 🧠 Developer Tips

- Use `lib/types/` to define and share global types.
- Modify `hooks/` for all API data fetching logic to follow a standard.
- Reuse `components/common/` and keep them pure/presentational.
- Organize pages under `dashboard/` based on user flows (insights, posts, profile).
- Keep auth logic in `auth/` and routes in `api/auth/`.

## 👥 Contributors

cma-org

## 📄 License

This project is proprietary. All rights reserved. Unauthorized copying, modification, distribution, or use of this software, via any medium, is strictly prohibited.

---

---
