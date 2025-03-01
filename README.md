# Affiliate Link Manager Extension

## Overview

This project consists of a full-stack application for managing links, with a React front-end and a TypeScript back-end using local or Supabase Postgres database. The extension allows users to create, update, and manage links with additional features like grouping and rating.

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

```
back-end/
  src/ - Backend source code
    dto/ - Data transfer objects
    middleware/ - Express middleware
    migration/ - Database migrations
    model/ - Database models
    routes/ - API routes
    services/ - Business logic
    utils/ - Utility functions
  docker-compose.yml - Docker configuration
  package.json - Backend dependencies

front-end/
  public/ - Static assets and icons
  src/ - Frontend source code
    api/ - API client
    assets/ - Static assets
    components/ - React components
    dashboard/ - Dashboard page
    hooks/ - Custom hooks
    popup/ - Popup page
    providers/ - Context providers
  package.json - Frontend dependencies
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
DATABASE_URL=your_database_url
```

### Front-end .env

```env
VITE_API_BASE_URL=your_backend_api_url
```

## Running the Project

### Local

#### Local back-end server

First, start the local Postgres DB.

```bash
cd back-end
docker compose up -d
```

Create an `.env` file and add this database url: `DATABASE_URL=postgres://admin:password@127.0.0.1:5432/piaz` (Change to other url if you plan to use other database source)

```bash
cd back-end
npm run dev
```

#### Local front-end chrome extension

**Important**: Ensure your backend API URL is included in `host_permissions` of `manifest.json` file.

```bash
cd front-end
npm run build
```

- Then go to any browser, go to "Manage Extensions". Enable "Developer mode", then click "Load unpacked", and select `front-end/dist` folder. Then you'll get your extension installed.

### Production

#### Start the back-end server

```bash
cd back-end
npm run build && node dist/src/index
```

*Note*: please set your environment variables accordingly before starting the below scripts. Meaning you can either set environment in your server, or create an `.env` file inside build folder (`./back-end/dist`).

```bash
npm run start
```

#### Start the front-end chrome extension

Same with the above setup. We may also want to pack the extension and get user to install the packed one, or install from extension store (this will need publishing step).

## Design decision

- We want to save affiliate links with details. Thus designing the `Link` table with required information (url, title, description, group, rating).
- We don't want different users' links to be mixed up together, so I need to have user differentiation. For the scope of the project, I don't plan to scaffold a full scale authentication server and all of its authenticate, authorize logic, so decided to go with simple Google sign in on front end.
- We don't want to restrict user to access the extension functionalities, and as it's just an MVP product, so I just omitted the sign up flow.
- At this point, I only use user email as user's PII. So following KISS and YAGNI principles, just provide an additional `userEmail` column for the `Link` table, instead of spawning another table for storing user details. Then update and query links base on user email. More complex use cases should be handled later.
- For frontend: I use simply 1 popup and 1 page for dashboard. React Query is chosen as it can be used to manage server state effectively. MUI for its ready, customizable components, also MUI provides DataGrid component which I make use for the link dashboard.
- Google sign in implemented and user data is saved to Sync Storage so user can view their own saved selection from whichever browser/ machine (as long as it is chrome-based and signed in with their account)

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

Migrations are available in `back-end/src/migration/`

## API Documentation

The back-end provides the following endpoints:

- GET /links - Get all links
- POST /links - Create new link
- PUT /links/:id - Update existing link
- DELETE /links/:id - Delete link

## Backend AWS deployment guide

- Create an EC2 AWS instance (preferably a Linux OS one).
- Setup instance security group with inbound and outbound rules including the PostgreSQL database server.
- Log into EC2 instance.
- Ensure these things are installed:

  - Git: `sudo apt install git`
  - NodeJS, NPM: `sudo apt install nodejs npm -y`
  - Install PM2: `sudo npm i -g pm2`. This is for service management.

- Clone this repository
- Go to backend folder `cd back-end`
- Run `npm i && npm run build`
- Go to `dist` folder of backend and add `.env` file containing the PORT and DATABASE_URL.
- In `dist` folder, run `pm2 start index.js`
- Now you can monitor the backend server in terminal with `pm2 monit` or use `pm2 monitor` to watch its logs on PM2 webpage
