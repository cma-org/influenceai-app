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

### Run the Development Server

```bash
npm run dev
```

Visit: [http://localhost:3000](http://localhost:3000)

---

## 🔒 Enable HTTPS for Localhost (Recommended for Auth Testing)

### 1. Generate Local Certificates

Install `mkcert`:

```bash
brew install mkcert        # macOS
choco install mkcert       # Windows
```

Generate certs:

```bash
mkcert -install
mkcert localhost
```

### 2. Update `server.js`

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

### 3. Run HTTPS Local Server

```bash
npm run dev
```

Now accessible via [https://localhost:3000](https://localhost:3000)

---

## 📊 Core Features

- Instagram account analytics (followers, engagement, demographics)
- Facebook account authentication and token exchange
- Magic Link login (passwordless auth)
- Dynamic charts and dashboards
- Extensible API routes

---

## 👥 Contributors


---

## 📄 License

This project is proprietary. All rights reserved. Unauthorized copying, modification, distribution, or use of this software, via any medium, is strictly prohibited.
