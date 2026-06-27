# Booky

A library web app where members sign in, browse the catalog, borrow books, leave reviews, and track their borrowing history. Admins can manage books, users, and loans. It's a single-page React app that talks to a hosted REST API.

## Tech stack

- React + TypeScript, built with Vite
- Tailwind CSS + shadcn/ui
- React Router for routing
- Redux Toolkit for auth/UI/cart state
- TanStack Query for data fetching, caching, and optimistic updates
- Axios, react-hook-form + Zod, date-fns, lucide-react

## Getting started

Requires Node 20+.

```bash
# install dependencies
npm install

# copy the env file and adjust if needed
cp .env.example .env

# start the dev server
npm run dev
```

The app runs at http://localhost:5173.

### Environment

| Variable | Description |
| --- | --- |
| `VITE_API_BASE_URL` | Base URL of the Library API (all requests are sent to `${VITE_API_BASE_URL}/api`). |

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the dev server with HMR |
| `npm run build` | Type-check and build for production (`dist/`) |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Run the linter |

## Project structure

```
src/
  app/          Redux store and typed hooks
  components/   shared UI — ui/ (shadcn), layout/, book/, common/
  features/     feature folders (auth, home, books, authors, cart, loans, reviews, profile, admin)
  hooks/        reusable hooks
  lib/          api client, query client/keys, formatting, utils
  types/        API and domain types
```

Each feature keeps its API calls, query/mutation hooks, and pages together. Pages are code-split per route.

## Notes

- All API responses use a `{ success, message, data }` envelope; the Axios layer unwraps it and surfaces the server's message on errors.
- Reviews can only be left for a book you've borrowed and returned.
- The borrow and add-to-cart actions update the UI optimistically and reconcile with the server.
