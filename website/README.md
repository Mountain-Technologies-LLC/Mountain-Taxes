# Mountain Taxes

A TypeScript-based web application for visualizing and comparing state earned income tax obligations across different income levels.

## Features

- Interactive Chart.js visualizations with custom HTML legend
- Bootstrap 5.3 with Bootswatch Flatly theme (local assets)
- TypeScript for type safety
- Comprehensive testing with Jest and fast-check
- Responsive design for all devices
- Accessible HTML legend positioned at bottom-start
- Local asset hosting for improved reliability

## Development Setup

### Prerequisites

- Node.js (v18 or higher)
- npm

### Installation

```bash
npm install
```

### Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Run tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Type checking
npm run type-check

# Lint code
npm run lint
```

### Project Structure

```
website/
├── src/                 # TypeScript source files
├── tests/              # Test files
├── public/             # Static assets
│   └── assets/         # Local CSS and JS files
│       ├── css/        # Bootstrap/Bootswatch CSS
│       └── js/         # Bootstrap JavaScript
├── dist/               # Built output (generated)
├── index.html          # Main HTML file
├── package.json        # Dependencies and scripts
├── tsconfig.json       # TypeScript configuration
├── jest.config.js      # Jest testing configuration
├── vite.config.ts      # Vite build configuration
└── .eslintrc.json      # ESLint configuration
```

## Technology Stack

- **TypeScript**: Type-safe JavaScript development
- **Bootstrap 5.3**: Responsive CSS framework (local assets)
- **Bootswatch Flatly**: Modern theme for Bootstrap (local assets)
- **Chart.js**: Interactive charts and visualizations
- **Vite**: Fast build tool and development server
- **Jest**: Testing framework
- **fast-check**: Property-based testing library
- **ESLint**: Code linting and quality

## Testing

The project uses a dual testing approach:

- **Unit Tests**: Specific examples and edge cases
- **Property-Based Tests**: Universal properties using fast-check

Tests are located in the `tests/` directory and use the `.test.ts` extension.

## Local Assets

The application uses local copies of Bootstrap and Bootswatch assets for improved reliability and offline functionality:

- **Bootstrap CSS**: `public/assets/css/bootstrap.min.css` (Bootswatch Flatly theme)
- **Bootstrap JS**: `public/assets/js/bootstrap.bundle.min.js`

These assets are served locally instead of relying on CDN links, ensuring the application works reliably in all environments.