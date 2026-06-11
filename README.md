# Portfolio

A zero-configuration, auto-populating portfolio that fetches your public GitHub repositories and displays them in a clean, responsive grid.

## Features

- 🔄 **Auto-populating** – fetches all your public repos via the GitHub REST API
- 🏷️ **Smart status badges** – *Active*, *Hiatus*, or *Completed* based on repo activity
- 🔍 **Filterable** – filter projects by status with one click
- ⚡ **Fast** – built with React + Vite
- 🎨 **Styled** – Tailwind CSS v4, responsive grid layout

## Status logic

| Status | Condition |
|-----------|--------------------------------------------------|
| **Active** | Not archived, last push ≤ 45 days ago |
| **Hiatus** | Not archived, last push > 45 days ago |
| **Completed** | Repository is archived |

Forks and the profile README repository (name === username) are automatically excluded.

## Setup

### 1. Clone and install

```bash
git clone https://github.com/mapletini/portfolio.git
cd portfolio
npm install
```

### 2. Configure environment variables

```bash
cp .env.example .env
```

Open `.env` and set your values:

```env
VITE_GITHUB_USERNAME=your_github_username
VITE_GITHUB_TOKEN=your_github_personal_access_token
```

> **Token**: Create a fine-grained personal access token at <https://github.com/settings/tokens> with **read-only** public repository access. Without a token, GitHub limits you to 60 unauthenticated requests per hour.

### 3. Run locally

```bash
npm run dev
```

Open <http://localhost:5173> in your browser.

### 4. Build for production

```bash
npm run build
npm run preview   # optional local preview
```

The `dist/` folder is ready to deploy to any static host (Vercel, Netlify, GitHub Pages, etc.).

## Docker

Build the image (pass your Vite env vars as build args):

```bash
docker build \
  --build-arg VITE_GITHUB_USERNAME=your_github_username \
  --build-arg VITE_GITHUB_TOKEN=your_github_personal_access_token \
  -t portfolio:latest .
```

Run the container:

```bash
docker run --rm -p 8080:80 portfolio:latest
```

Open <http://localhost:8080>.

## Project structure

```
src/
├── components/
│   └── ProjectCard.jsx   # Individual project card with status badge
├── hooks/
│   └── useGitHubRepos.js # Fetches and filters repos from GitHub API
├── lib/
│   └── status.js         # Status calculation logic & style maps
├── App.jsx               # Main layout, filter UI, grid
└── main.jsx              # React entry point
```
