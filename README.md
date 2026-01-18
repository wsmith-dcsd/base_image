# TypeScript React Base Image

A production-ready TypeScript React base template for DCSD microfront projects with authentication, routing, and modern development tooling.

## 🚀 Quick Start

### Prerequisites
- Node.js v24.13.0 (use `nvm use` to switch to the correct version)
- Docker (for containerized deployment)
- Git

### Installation
```bash
# Clone the repository
git clone <your-repo-url>
cd base_image

# Install dependencies
cd client
npm install

# Start development server
npm start
```

## 📁 Project Structure

```
base_image/
├── client/                    # Main React application
│   ├── docker/               # Docker configuration
│   │   ├── Dockerfile        # Production Docker image
│   │   └── .dockerignore     # Docker ignore rules
│   ├── public/               # Static assets
│   ├── server/               # Express server setup
│   ├── src/
│   │   ├── components/       # React components
│   │   │   ├── contextProvider/  # Global state management
│   │   │   ├── Auth components   # Authentication UI
│   │   │   └── Common components # Reusable UI elements
│   │   ├── const/            # Application constants
│   │   ├── dao/              # Data Access Objects
│   │   ├── styles/           # SCSS stylesheets
│   │   ├── types/            # TypeScript type definitions
│   │   ├── utils/            # Utility functions and helpers
│   │   │   └── auth/         # Authentication utilities
│   │   ├── App.tsx           # Main application component
│   │   └── index.tsx         # Application entry point
│   ├── webpack configs       # Build configurations
│   └── Configuration files   # ESLint, Babel, TypeScript, etc.
└── .nvmrc                    # Node version specification
```

## 🛠️ Available Scripts

```bash
# Development
npm start          # Start development server with hot reload
npm run eslint     # Run ESLint for code quality checks

# Building
npm run build-dev  # Build for development environment
npm run build-prod # Build for production environment

# Testing
npm test           # Run Jest test suite
```

## 🔧 Technology Stack

### Core Technologies
- **React 18.2.0** - UI library with modern hooks
- **TypeScript 5.9.3** - Type-safe JavaScript
- **React Router DOM 6.23.0** - Client-side routing
- **Webpack 5.104.1** - Module bundler with dev/prod configs

### Styling & UI
- **Bootstrap 5.3.3** - CSS framework
- **React Bootstrap 2.10.2** - Bootstrap components for React
- **SASS** - CSS preprocessor
- **Bootstrap Icons** - Icon library

### Development Tools
- **ESLint** - Code linting with TypeScript support
- **Prettier** - Code formatting
- **Babel** - JavaScript transpilation
- **Jest** - Testing framework

### Authentication & HTTP
- **Axios** - HTTP client
- **React Toastify** - Notification system

## 🏗️ Key Features

### Authentication System
- **PrivateRoute** component for protected routes
- **Auth utilities** for user management
- **ContextProvider** for global state management
- **Role-based Access (RbA)** component

### Development Features
- **Hot Module Replacement** for fast development
- **TypeScript path mapping** (`@/`, `@components/`, etc.)
- **Proxy setup** for API calls during development
- **Environment-based routing** (dev-only routes)

### Production Ready
- **Docker support** with Alpine Linux base
- **Webpack optimization** for production builds
- **CSS minimization** and code splitting
- **Express server** for serving static files

## 🔒 Environment Configuration

### Development Routes
The following routes are only available in development mode:
- `/backdoor` - Development login bypass
- `/loadtest/:userName` - Load testing component

### TypeScript Configuration
- Strict type checking enabled
- Path aliases configured for clean imports
- Modern ES features supported

## 🐳 Docker Deployment

```bash
# Build Docker image
cd client/docker
docker build -t your-app-name .

# Run container
docker run -p 3000:3000 your-app-name
```

## 📝 Development Guidelines

### Code Style
- Use TypeScript for all new files
- Follow ESLint and Prettier configurations
- Use arrow functions for components
- Implement proper error handling

### Component Structure
- Place reusable components in `/components`
- Use TypeScript interfaces for props
- Implement proper accessibility features
- Follow React best practices

### State Management
- Use ContextProvider for global state
- Implement proper error boundaries
- Handle loading states appropriately

## 🔄 Customization for New Projects

1. **Update package.json**
   - Change `name`, `description`, `repository` fields
   - Update author and license information

2. **Configure Authentication**
   - Update auth configuration in `utils/auth/config.ts`
   - Modify authentication endpoints

3. **Styling**
   - Customize global styles in `styles/global/`
   - Update color scheme in `Colors.scss`

4. **Routing**
   - Add new routes in `App.tsx`
   - Create corresponding components

5. **Environment Variables**
   - Configure API endpoints
   - Set up environment-specific settings

## 🤝 Contributing

1. Follow the established code style
2. Write TypeScript interfaces for new components
3. Add appropriate tests for new features
4. Update documentation as needed

## 📋 Version Information

- **Node.js**: v24.13.0
- **Webpack**: 5.104.1
- **TypeScript**: 5.9.3
- **React**: 18.2.0
- **Docker**: 24-alpine base image