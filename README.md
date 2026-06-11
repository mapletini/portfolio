# Portfolio

A **zero-configuration, auto-populating developer portfolio** built with React, Vite, and Tailwind CSS v4. Point it at any GitHub user — it fetches all their public repositories, calculates activity status, and renders a filterable, responsive card grid. The only configuration required is two environment variables.

---

## What is this?

Most portfolio sites require you to manually curate a project list and keep it up to date. This template removes that friction entirely. You set your GitHub username once, and every public repository you own (excluding forks and your profile README) is automatically pulled in via the GitHub REST API and displayed as a styled project card.

---

## Features

| Feature | Description |
|---|---|
| 🔄 **Auto-populating** | Fetches all public repos via the GitHub REST API, paginating until all are loaded |
| 🏷️ **Smart status badges** | Automatically calculates *Active*, *Hiatus*, or *Completed* status from repo metadata |
| 🔍 **Status filter tabs** | Click to filter the grid by All, Active, Hiatus, or Completed |
| 🌐 **Primary language indicator** | Colour-coded dot and label showing each repo's primary language |
| ⏳ **Skeleton loading** | Animated placeholder cards shown while data is being fetched |
| ⚠️ **Error states** | Clear in-app error message with guidance when config is missing or the API fails |
| 🔗 **GitHub profile link** | Header link directly to the configured user's GitHub profile |
| 📦 **Docker ready** | Multi-stage Dockerfile (Node build → Nginx runtime) for one-command deployment |
| ⚡ **Fast** | Vite-powered dev server and build pipeline |
| 🎨 **Responsive** | Tailwind CSS v4 grid: 1 → 2 → 3 columns |

---

## Status logic

Each project card is automatically assigned one of three statuses based on the repository's GitHub metadata — no manual tagging required.

| Status | Badge colour | Condition |
|---|---|---|
| 🟢 **Active** | Green | Not archived, last push was **≤ 45 days** ago |
| 🟡 **Hiatus** | Yellow | Not archived, last push was **> 45 days** ago |
| 🔵 **Completed** | Blue | Repository is **archived** on GitHub |

> The 45-day threshold is defined in `src/lib/status.js` (`ACTIVE_THRESHOLD_DAYS`) and can be changed to any value.

---

## Filtering

The repository list is automatically filtered **before** it reaches the UI:

- **Forks** (`fork: true`) are excluded — only original work is shown.
- **The profile README repository** (a repo whose name exactly matches the username) is excluded.

In the UI, the filter tab bar lets visitors narrow the grid to a specific status without a page reload.

---

## GitHub API

All data comes from the public GitHub REST API endpoint:

```
GET https://api.github.com/users/{username}/repos
```

The hook (`src/hooks/useGitHubRepos.js`) paginates with `per_page=100` until every page is loaded, so accounts with many repositories work without any extra configuration.

**Rate limits:**
- Unauthenticated: 60 requests / hour
- Authenticated (token): 5,000 requests / hour

Using a token is strongly recommended to avoid hitting the unauthenticated limit.

---

## Project structure

```
portfolio/
├── src/
│   ├── components/
│   │   └── ProjectCard.jsx   # Card with status badge, language dot, and GitHub link
│   ├── hooks/
│   │   └── useGitHubRepos.js # Paginated GitHub API fetch hook; filters forks and README repo
│   ├── lib/
│   │   └── status.js         # getRepoStatus() logic and Tailwind badge/dot style map
│   ├── App.jsx               # Root layout: header, filter tabs, grid, skeleton, error states
│   └── main.jsx              # React entry point
├── public/                   # Static assets
├── .env.example              # Template for required environment variables
├── .dockerignore
├── Dockerfile                # Multi-stage production image
├── index.html
├── vite.config.js
└── package.json
```

---

## Setup

### Prerequisites

- Node.js ≥ 18
- npm ≥ 9
- A GitHub account (and optionally a personal access token)

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

Open `.env` and fill in your values:

```env
VITE_GITHUB_USERNAME=your_github_username
VITE_GITHUB_TOKEN=your_github_personal_access_token
```

> **Creating a token:** Go to <https://github.com/settings/tokens> → *Fine-grained personal access tokens* → New token. Public repository read access is sufficient — no additional scopes are needed.

### 3. Run locally

```bash
npm run dev
```

Open <http://localhost:5173> in your browser. The page hot-reloads as you edit source files.

### 4. Build for production

```bash
npm run build
npm run preview   # optional local preview of the built output
```

The `dist/` folder can be deployed to any static host:

| Host | Command / method |
|---|---|
| **Vercel** | `vercel deploy` or connect the repo |
| **Netlify** | Drag-and-drop `dist/` or connect the repo |
| **GitHub Pages** | Push `dist/` to the `gh-pages` branch |
| **Docker** | See section below |

---

## Docker

The included `Dockerfile` is a two-stage build:

1. **Build stage** (`node:22-alpine`) — installs dependencies and runs `vite build`, accepting the Vite env vars as `ARG` values so the API credentials are baked into the static bundle.
2. **Runtime stage** (`nginx:1.27-alpine`) — copies only the compiled `dist/` output; no Node.js or source code is present in the final image.

### Build the image

```bash
docker build \
  --build-arg VITE_GITHUB_USERNAME=your_github_username \
  --build-arg VITE_GITHUB_TOKEN=your_github_personal_access_token \
  -t portfolio:latest .
```

### Run the container

```bash
docker run --rm -p 8080:80 portfolio:latest
```

Open <http://localhost:8080>.

> **Note on secrets in the image:** Because `VITE_*` variables are inlined into the JavaScript bundle at build time, the token will be present in the compiled output. This is standard practice for client-side Vite apps, but means the image should be treated as sensitive. Use a read-only token with minimal scope.

---

## Todo

Planned features for future development:

- [ ] **Tech Stack Badges from GitHub Topics**
  Read the `topics` array returned by the GitHub API for each repository and render them as badges on the project card. This automatically documents the tech stack (e.g. `react`, `fastapi`, `python`) without any manual input — just tag your repos on GitHub.

- [ ] **Star and Fork Counts**
  Surface `stargazers_count` and `forks_count` on each card as social proof, letting visitors quickly see which projects have traction.

- [ ] **Smart Caching (LocalStorage)**
  After the first successful fetch, save the repository list to `localStorage` alongside an expiry timestamp (e.g. 1 hour). On subsequent page loads within the TTL, serve the cached data instantly and skip the API call — reducing latency and avoiding rate-limit pressure.

- [ ] **Manual Status Override via Topics**
  Allow repository owners to override the automatic timestamp logic by adding a specific topic tag to their repo on GitHub (e.g. `status-completed` or `status-featured`). The status logic will check for these tags first and respect them over the `pushed_at` calculation.
