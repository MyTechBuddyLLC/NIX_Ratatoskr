# Jules Anywhere PWA - Project Requirements

## Project Goal
Build a professional, mobile-first PWA client for the Google Jules API (v1alpha) that bridges the gap between Gemini brainstorming and automated repo management.

## 1. Core Architecture & UI
- **Tech Stack**: Preact (minimal footprint) + Tailwind CSS + Vite.
- **Deployment**: Client-side only PWA.
- **Responsive Design**:
  - **Mobile**: Bottom-tab navigation (Tasks, Scheduled, Config).
  - **Desktop**: Sidebar navigation with "Stacked Card" diff views.
- **Visuals**: Google-minimalist aesthetic (Product Sans/Roboto, clean whites, subtle shadows). Dark/Light mode support respecting system settings.

## 2. Smart Quota & Concurrency Engine
- **Dynamic Throttling**:
  - Detect/Set user tier (Free vs. Pro).
  - Implement a client-side queue in IndexedDB.
  - For Free tier, limit active API sessions to 3. Automatically fire the next "Pending" task when an active one reaches `COMPLETED` or `FAILED`.
- **Tier-Gating**:
  - Visually indicate Gemini 3-only features (like multi-agent reasoning or higher parallel limits).
  - Handle "Permission Denied" errors gracefully by offering a standard Gemini 2.5 fallback.

## 3. Native Mobile Integration (The "Bridge")
- **Web Share Target**: Configure `manifest.json` to accept `text/plain`, `url`, and `image/*`.
  - *Workflow*: Sharing a Gemini chat or a bug screenshot to this app should pre-fill the "New Task" prompt and attach the image as context.
- **Protocol Handler**: Register `web+jules://`. Clicking `web+jules://new?prompt=...` must launch the PWA and prepare the task.
- **Deep Linking**: Use Universal Links/Intents (`github://` or `x-github-client://`) for all PR and repo links to prioritize native app opening over web views.

## 4. Advanced Operational Features
- **Offline-First**: Use Background Sync API. If the user hits "Send" while offline, save the task to the Outbox (IndexedDB) and sync it immediately upon reconnection.
- **Notifications**: Implement Service Worker notifications for "Plan Ready for Review," "Task Complete," and "Jules Critic Intervention Required."
- **Cloudflare Dash**: Integrate a view that uses the Cloudflare API to track the live build/deploy status of the Workers/Pages associated with the current repo.
- **Scheduled Tasks**: Full CRUD UI for Jules’ proactive maintenance tasks (Listing, Deleting, and Re-creating for "edits").

## 5. Security & Sync
- **Secure API Proxy**: The PWA should talk to a Cloudflare Worker. The Worker stores the Jules API key in a Secret and adds it to requests to `jules.googleapis.com`. (Note: User has opted for a client-side only approach for the MVP).
- **Key Sync**: Implement Chrome Storage Sync or a "Scan QR Code" feature to move the configuration from Desktop to Mobile securely without manual typing.

## MVP Definition (Phase 1)
- Create and store this requirements document in `PROJECT_REQUIREMENTS.md`.
- **Core Functionality**:
    - View the current list of Jules Tasks.
    - View details for a specific task, including any messages or feedback from Jules.
    - Create new tasks, including selecting a repository.
- **UI**:
    - Clean, mobile-first interface based on Material Design principles.
    - Implement a toggle for Light/Dark mode that can also respect system settings.
- **Configuration**:
    - Allow the user to input and save their Jules API key.
    - Allow the user to manually select their service tier (e.g., Free/Pro) as a temporary measure.

## Future Features (Post-MVP)
- **Task Renaming**: Allow users to set a custom local alias or name for a task.
- **Usage Reporting**: Track time spent, number of prompts, commit comments, and Jules' feedback for reporting purposes.
- **Jules Settings Management**: Dynamically fetch and display Jules' own settings via its API, allowing users to configure them directly within the PWA.
