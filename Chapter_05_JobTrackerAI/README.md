# Job Tracking App

A lightweight job application tracker for managing applications, follow-ups, interviews, and offers in one place. The app helps users organize their job search pipeline, track resume versions, monitor progress across stages, and review analytics for better decision-making.

## Live Demo

https://job-tracking-app-bay.vercel.app/

## Features

- Kanban-style job pipeline board
- Detailed application records and notes
- Follow-up reminders and timeline tracking
- Resume version tracking
- Analytics dashboard for pipeline insights
- Export/import support for job data
- Local browser storage for quick, private access

## Tech Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS
- @dnd-kit for drag-and-drop interactions
- IndexedDB for local browser data persistence
- Google GenAI integration for AI-assisted features

## Data Storage

This application stores job data locally in the browser using IndexedDB. Because the data stays on the device, it is not synced across devices or shared automatically with a backend.

## Getting Started

1. Install dependencies:
   npm install
2. Start the development server:
   npm run dev
3. Build for production:
   npm run build

## License

This project is licensed under the [MIT License](LICENSE).
