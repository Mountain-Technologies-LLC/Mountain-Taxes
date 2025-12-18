# Mountain Taxes

A TypeScript-based web application for visualizing and comparing state earned income tax obligations across different income levels.

## Features

- Interactive Chart.js visualizations with custom HTML legend
- Bootstrap 5.3 with Bootswatch Flatly theme (local assets)
- TypeScript for type safety
- Comprehensive testing with Jest and fast-check
- Responsive design for all devices
- Accessible HTML legend positioned at bottom-start
- **Advanced Income Range Controls**: Step-by functionality with configurable base income
- **States Navigation Dropdown**: Easy access to individual state tax information
- **Responsive Navbar**: Mobile-friendly navigation with collapsible menu
- **State Detail Pages**: Comprehensive tax information for each state
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
│   ├── main.ts         # Application entry point
│   ├── navbar.ts       # Navigation bar component
│   ├── router.ts       # Client-side routing
│   ├── chartComponent.ts # Chart visualization
│   ├── incomeRangeControls.ts # Income range step controls
│   ├── stateSelector.ts # Bulk state selection controls
│   ├── stateData.ts    # State tax data
│   ├── types.ts        # TypeScript interfaces
│   └── ...             # Other components
├── tests/              # Test files
│   ├── navbar.test.ts  # Navbar component tests
│   └── ...             # Other test files
├── public/             # Static assets
│   └── assets/         # Local CSS and JS files
│       ├── css/        # Bootstrap/Bootswatch CSS
│       └── js/         # Bootstrap JavaScript
├── dist/               # Built output (generated)
├── index.html          # Main HTML file with navbar
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

## Navigation Features

### States Dropdown Menu

The application includes a responsive states dropdown in the navigation bar that provides:

- **Alphabetical State Listing**: All 50 US states sorted alphabetically
- **Tax Status Indicators**: Visual indicators for states without income tax
- **Direct State Navigation**: Click any state to view detailed tax information
- **Mobile-Responsive Design**: Optimized layout for small screens
- **Keyboard Accessibility**: Full keyboard navigation support

### Responsive Design

The navbar adapts to different screen sizes:

- **Desktop**: Horizontal dropdown with two-column state layout
- **Tablet**: Single-column dropdown with full-width menu
- **Mobile**: Collapsible hamburger menu with touch-friendly state selection

## Income Range Controls

The application features advanced income range controls that allow users to customize the chart display:

### Step-by Configuration

- **Step Size Selection**: Choose from 1k, 10k, 100k, 1m, 10m, or 100m increments
- **Step Count Adjustment**: Use +/- buttons or direct input to set the number of steps (1-100)
- **Base Income Setting**: Configure the starting income level (default: $0)

### Default Configuration

- **Step Size**: 10k (10,000)
- **Step Count**: 10 steps
- **Base Income**: $0
- **Default Range**: $0 - $100,000 with $10,000 increments

### Interactive Features

- **Real-time Updates**: Chart updates immediately when controls are changed
- **Range Display**: Shows current income range (e.g., "$0 - $100K")
- **Responsive Design**: Controls adapt to different screen sizes
- **Accessibility**: Full keyboard navigation and screen reader support

## Local Assets

The application uses local copies of Bootstrap and Bootswatch assets for improved reliability and offline functionality:

- **Bootstrap CSS**: `public/assets/css/bootstrap.min.css` (Bootswatch Flatly theme)
- **Bootstrap JS**: `public/assets/js/bootstrap.bundle.min.js`

These assets are served locally instead of relying on CDN links, ensuring the application works reliably in all environments.