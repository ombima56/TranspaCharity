# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/e95a2fa6-e1d3-4d15-99e3-c48efadf7d4f

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/e95a2fa6-e1d3-4d15-99e3-c48efadf7d4f) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- Go (backend)
- SQLite (database)

## Environment Setup

This project uses environment variables for configuration. There are several environment files:

1. `.env` - Contains the actual environment variables for the backend. This file is not committed to the repository.
2. `.env.example` - A template for the `.env` file.
3. `.env.frontend` - Contains environment variables for the frontend.

### Backend Setup

To set up the backend environment:

1. Copy `.env.example` to `.env`
2. Update the values in `.env` to match your environment

```sh
cp .env.example .env
# Edit .env with your preferred text editor
```

### Frontend Setup

The frontend uses environment variables prefixed with `VITE_`. These are defined in `.env.frontend`.

The main environment variable is:

- `VITE_API_URL` - The URL of the backend API

## Running the Project

### Backend

To run the backend:

1. Navigate to the backend directory
2. Run the seed script to populate the database (first time only)
3. Run the API server

```sh
cd backend/cmd/seed
go run .
cd ../api
go run .
```

The API server will start on port 8080 (or the port specified in your `.env` file).

### Frontend

To run the frontend:

```sh
npm run dev
```

The frontend will start on port 8081 (or another available port if 8081 is in use).

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/e95a2fa6-e1d3-4d15-99e3-c48efadf7d4f) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
