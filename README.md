# Link Manager Project

## Overview

This project consists of a full-stack application for managing links, with a React front-end and a TypeScript back-end using Supabase as the database. The extension allows users to create, update, and manage links with additional features like grouping and rating.

User needs to login with their google account to start using the functionalities. Also the links will be saved, and listed per user, and across all browser instances, given that user is signed in, and we set up to point to the same back end server.

## Technologies Used

### Front-end

- React (TypeScript)
- Vite
- React Query
- Chrome Extension support

### Back-end

- TypeScript
- Express.js
- Supabase
- PostgreSQL

## Project Structure

```text
.
├── back-end/              # Back-end code
│   ├── src/               # Source files
│   └── package.json       # Back-end dependencies
├── front-end/              # Front-end code
│   ├── src/               # Source files
│   ├── public/            # Static assets
│   └── package.json       # Front-end dependencies
```

## Installation Guide

1. Clone the repository

2. Install dependencies for both front-end and back-end:

```bash
cd back-end
npm install

cd ../front-end
npm install
```

## Environment Setup

Create `.env` files in both front-end and back-end directories with the following variables:

### Back-end .env

```env
PORT=3001
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
```

### Front-end .env

```env
VITE_API_BASE_URL=http://localhost:3001
```

- VITE_API_BASE_URL: your backend api url

## Running the Project

### Local

#### Local back-end server

```bash
cd back-end
npm run dev
```

- If you want to use local Supabase:
  - Ensure Docker installed. Run `npm run supabase -- start` and wait for its services to start up. Or `npm run supabase -- start --ignore-health-check` would be more convenient.
  - Use Supabase Url and Key to put into the `.env` file.

#### Local front-end chrome extension

```bash
cd front-end
npm run build
```

- Then go to any browser, go to "Manage Extensions". Enable "Developer mode", then click "Load unpacked", and select `front-end/dist` folder. Then you'll get your extension installed.

### Build for production

#### Start the back-end server

Note: for production, please set your environment variables accordingly before starting the below scripts.

```bash
cd back-end
npm run build && node dist/src/index
```

#### Start the front-end chrome extension

Same with the above setup. Also we may want to pack the extension and get user to install the packed one, or install from extension store (this will need publishing step).

## Design decision

- We want to save affiliate links with details. Thus designing the `Link` table with required information (url, title, description, group, rating).
- We don't want different users' links to be mixed up together, so I need to have user differentiation. For the scope of the project, I don't plan to scaffold a full scale authentication server and all of its authenticate, authorize logic, so decided to go with simple Google sign in on front end.
- We don't want to restrict user to access the extension functionalities, and as it's just an MVP product, so I just omitted the sign up flow.
- At this point, I only use user email as user's PII. So following KISS and YAGNI principles, just provide an additional `userEmail` column for the `Link` table, instead of spawning another table for storing user details. Then update and query links base on user email. More complex use cases should be handled later.

## Database Setup

The project uses Supabase with the following schema:

- links table with columns:
  - id (primary key)
  - url
  - title
  - description
  - group
  - rating
  - user_email

Migrations are available in `back-end/supabase/migrations/`

## API Documentation

The back-end provides the following endpoints:

- GET /links - Get all links
- POST /links - Create new link
- PUT /links/:id - Update existing link
- DELETE /links/:id - Delete link
