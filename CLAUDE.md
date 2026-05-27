# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a full-stack TodoList application with:
- **Frontend**: Vue 3, Pinia, Vue Router, Axios
- **Backend**: Node.js, Express, MySQL, JWT

## Key Commands

### Backend
- `npm run dev`: Start development server with nodemon
- `npm start`: Start production server
- Requires MySQL setup (see README.md for details)

### Frontend
- `npm run dev`: Start Vite development server
- `npm run build`: Build for production
- `npm run preview`: Preview production build

## Architecture
- **Frontend**
  - State management: Pinia stores for auth and todos
  - Routing: Vue Router for navigation
  - API: Axios for HTTP requests to backend

- **Backend**
  - Routes: `/auth` for authentication, `/todos` for todo operations
  - Middleware: JWT authentication
  - Database: MySQL with SQL queries in `db.js`

## Key Files
- **Frontend**
  - `src/main.js`: Entry point with Pinia and Vue Router setup
  - `src/stores/auth.js`: Authentication state management
  - `src/router/index.js`: Route definitions

- **Backend**
  - `server.js`: Express server setup
  - `db.js`: Database connection and queries
  - `middleware/auth.js`: JWT authentication middleware