# TranspaCharity

A blockchain-powered charity platform that ensures complete transparency in the donation process.

## What is TranspaCharity?

TranspaCharity is a revolutionary platform that combines traditional charitable giving with blockchain technology to create a fully transparent donation ecosystem. Our mission is to restore trust in charitable giving by providing donors with complete visibility into how their contributions are used.

Through our platform, donors can:
- Support verified causes with confidence
- Track exactly where their donations go in real-time
- Verify the impact of their contributions through immutable blockchain records
- Connect directly with causes they care about without intermediaries

## Features

- **No middleman fees**: 100% of your donation goes directly to the charity.
- **Transparent tracking**: Every donation is recorded on the blockchain and can be verified by anyone.
- **Immutable records**: Once a donation is made, the record cannot be altered or deleted.
- **Real-time updates**: See donations as they happen and track how funds are used.
- **Secure transactions**: Donations are made directly from your wallet, ensuring your funds are safe.
- **Dual donation methods**: Support causes through traditional payment methods or blockchain transactions using USDC stablecoin.
- **Impact metrics**: View detailed statistics about how donations are making a difference.
- **Verified causes**: All charitable organizations on our platform undergo thorough vetting.


## Prerequisites

- Node.js 18 or higher
- npm 9 or higher
- Go 1.21 or higher
- PostgreSQL 14 or higher

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone https://github.com/ombima56/TranspaCharity.git

# Step 2: Navigate to the project directory.
cd TranspaCharity

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
- Ethereum (blockchain)
- Solidity (smart contracts)
- Web3.js (blockchain integration)
- USDC (stablecoin)
- MetaMask (wallet integration)

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

## Blockchain Integration

This project includes blockchain integration for transparent donations:

### Smart Contracts

The project uses the following smart contracts:

- `CharityDonation.sol`: Manages donations, charity verification, and fund withdrawals

### Dependencies

- OpenZeppelin Contracts: `npm install @openzeppelin/contracts`

### Wallet Integration

To use the blockchain features:

1. Install MetaMask or another Web3 wallet
2. Connect your wallet to the application
3. Make sure you have USDC tokens for donations
