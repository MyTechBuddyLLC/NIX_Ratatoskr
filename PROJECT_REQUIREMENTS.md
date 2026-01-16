# Ratatoskr PWA - Project Requirements

## Project Goal
Build a professional, mobile-first, and installable Progressive Web App (PWA) client for the Google Jules API (v1alpha). The application, named Ratatoskr, will serve as a responsive front-end to manage Jules tasks, repositories, and AI-suggested actions.

## 1. Core Architecture & UI
- **Tech Stack**: React (with Vite) + Tailwind CSS.
- **PWA**: Must be installable from Chrome/Chromium browsers.
- **Deployment**: Client-side only, deployed to Cloudflare Pages.
- **Responsive Design**:
  - **Mobile**: Bottom-tab navigation (Tasks, Suggested, Repos, Config).
  - **Desktop**: Sidebar navigation.
- **Visuals**: Google-minimalist aesthetic. Dark/Light mode support.
- **Deep Links**: Logo links for GitHub and Cloudflare that attempt to open the native mobile/desktop apps first.

## 2. MVP Definition
- **Core Functionality**:
    - View the list of current Jules Tasks.
    - View the list of AI-suggested tasks from Jules.
    - A dedicated view for repositories.
- **State Management**: For the MVP, all state (including the API key) will be held in-memory using React Context. It will not persist between sessions.
- **UI**:
    - Implement the responsive layout with the four main navigation tabs.
    - Build a placeholder UI for each of the four main views.
    - Implement the "Config" page UI with an input for the user to provide their Jules API key.

## 3. Future Features (Post-MVP)
- **Hardened Key Derivation & Encryption**:
  - Use Argon2id to derive a master key from a user-provided password.
  - Encrypt all sensitive data (API keys, config) before storing it in `chrome.storage.sync`.
- **Multi-Model AI Orchestrator**:
  - Implement a "Synergy Mode" that sends prompts to multiple AI models (Gemini, Grok, Claude) in parallel.
  - Use a master synthesis step to harmonize the results.
  - Integrate voice input via WebSockets or REST.
- **Task & Repo Management**:
  - Full CRUD operations for tasks and repositories.
  - View conversations with Jules tied to specific repos.
- **Security Updates**:
  - Implement a `version.json` polling hook on Cloudflare to prompt users to update the app for security patches.
- **Offline-First & Notifications**:
  - Use Background Sync and IndexedDB for offline capabilities.
  - Implement Service Worker notifications for task updates.
