# Reverse Proxy Logger

A full-stack TypeScript application that implements a reverse proxy with logging capabilities, built using the MERN stack (MongoDB, Express.js, React, Node.js) and shadcn/ui.

## Features

- Reverse proxy server that forwards requests to JSONPlaceholder API
- Request logging with MongoDB storage
- Secure admin dashboard with authentication
- Real-time log monitoring and filtering
- Proxy rule management (enable/disable logging, whitelist endpoints)
- Modern UI built with shadcn/ui components

## Tech Stack

- **Frontend**: React, TypeScript, shadcn/ui, Vite
- **Backend**: Node.js, Express.js, TypeScript
- **Database**: MongoDB
- **Authentication**: JWT
- **Development**: ESLint, Prettier, Husky

## Prerequisites

- Node.js (v18 or higher)
- MongoDB (v6 or higher)
- npm or yarn

## Project Structure

```
.
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/        # Page components
│   │   ├── hooks/        # Custom React hooks
│   │   ├── lib/          # Utility functions
│   │   └── types/        # TypeScript types
├── server/                # Express backend
│   ├── src/
│   │   ├── controllers/  # Route controllers
│   │   ├── middleware/   # Custom middleware
│   │   ├── models/       # MongoDB models
│   │   ├── routes/       # API routes
│   │   └── services/     # Business logic
└── shared/               # Shared types and utilities
```

## Getting Started

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd reverse-proxy-logger
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env` in both client and server directories
   - Update the variables with your configuration

4. Start MongoDB:
   ```bash
   # Make sure MongoDB is running on your system
   mongod
   ```

5. Start the development servers:
   ```bash
   npm run dev
   ```

The application will be available at:
- Frontend: http://localhost:5173
- Backend: http://localhost:3000

## Development

- `npm run dev` - Start both frontend and backend in development mode
- `npm run build` - Build both frontend and backend
- `npm run test` - Run tests
- `npm run lint` - Run linting

## API Documentation

### Authentication Endpoints

- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/me` - Get current user

### Proxy Endpoints

- `GET /api/proxy/users` - Proxy to JSONPlaceholder users
- `GET /api/logs` - Get request logs
- `POST /api/proxy/rules` - Update proxy rules

## Security Considerations

- All API endpoints (except login/register) require authentication
- JWT tokens are used for session management
- Passwords are hashed using bcrypt
- CORS is properly configured
- Rate limiting is implemented
- Input validation is enforced

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 