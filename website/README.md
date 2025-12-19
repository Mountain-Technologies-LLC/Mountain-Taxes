# Mountain Taxes

A TypeScript-based web application for visualizing and comparing state earned income tax obligations across different income levels.

## Features

- Interactive Chart.js visualizations with custom HTML legend
- Bootstrap 5.3 with Bootswatch Flatly theme (local assets)
- TypeScript for type safety
- Comprehensive testing with Jest and fast-check
- Responsive design for all devices
- Accessible HTML legend positioned at bottom-start
- **Smart Location Detection**: Automatically selects your state or all states based on location
- **Filer Details Component**: Filing type selection (Single or Married) with real-time tax calculations
- **Advanced Income Range Controls**: Step-by functionality with configurable base income
- **States Navigation Dropdown**: Easy access to individual state tax information
- **Theme Mode Switching**: Light, Dark, and Auto themes with system preference detection
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
│   ├── filerDetails.ts # Filing type selection component
│   ├── incomeRangeControls.ts # Income range step controls
│   ├── stateSelector.ts # Bulk state selection controls
│   ├── locationService.ts # Location detection service
│   ├── toastService.ts # Toast notification service
│   ├── themeService.ts # Theme switching service
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
- **Toast Notifications**: Bootstrap-based toast system for user feedback

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

### Theme Mode Switching

The application includes a comprehensive theme system with Bootstrap Color Mode support:

#### Available Themes

- **Light Theme**: Clean, bright interface optimized for daylight use
- **Dark Theme**: Dark interface that reduces eye strain in low-light conditions
- **Auto Theme**: Automatically switches between light and dark based on system preferences

#### Theme Features

- **Persistent Selection**: Theme choice is saved in localStorage and restored on page reload
- **System Integration**: Auto mode respects the user's OS-level dark/light mode preference
- **Real-time Switching**: Instant theme changes without page refresh
- **Accessible Icons**: Font Awesome icons clearly indicate each theme option
- **Dropdown Interface**: Clean dropdown menu in the navbar for easy theme selection

#### Theme Dropdown

The theme selector is located in the navbar and includes:

- **Sun Icon**: Light theme option
- **Moon Icon**: Dark theme option  
- **Half-Circle Icon**: Auto theme option (follows system preference)
- **Active State**: Currently selected theme is highlighted
- **Responsive Design**: Works seamlessly on all device sizes

#### Technical Implementation

- **Bootstrap Color Mode**: Uses Bootstrap 5.3's native color mode system
- **CSS Custom Properties**: Leverages CSS variables for smooth theme transitions
- **Event-Driven**: Theme changes trigger events for component updates
- **Error Handling**: Graceful fallback to auto mode if localStorage is unavailable
- **Performance Optimized**: Minimal overhead with efficient theme switching
- **Component Theming**: All UI components including chart legend adapt to selected theme
- **System Preference Detection**: Auto theme properly resolves to system preference on page load
- **Flash Prevention**: Theme applied immediately during page load to prevent visual flash

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

## Filer Details Component

The application includes a dedicated Filer Details component positioned above the Tax Comparison Chart that allows users to select their filing type:

### Filing Type Selection

- **Single Filing**: Default option for individual tax filers
- **Married Filing**: Option for married couples filing jointly
- **Real-time Updates**: Chart automatically recalculates when filing type changes
- **State Preservation**: Selected states remain active when switching filing types

### Features

- **Radio Button Interface**: Clean, accessible toggle between Single and Married
- **Bootstrap Styling**: Consistent with application theme using button groups
- **Responsive Design**: Adapts to all screen sizes
- **Accessibility**: Full keyboard navigation and screen reader support
- **Integration**: Seamlessly integrates with TaxChart component for automatic updates

### Default Behavior

- **Default Filing Type**: Single
- **Automatic Chart Updates**: Changes immediately trigger tax recalculations
- **Visual Feedback**: Selected option is clearly highlighted
- **Error Handling**: Graceful handling of edge cases and missing components

## Local Assets

The application uses local copies of Bootstrap and Bootswatch assets for improved reliability and offline functionality:

- **Bootstrap CSS**: `public/assets/css/bootstrap.min.css` (Bootswatch Flatly theme)
- **Bootstrap JS**: `public/assets/js/bootstrap.bundle.min.js`

These assets are served locally instead of relying on CDN links, ensuring the application works reliably in all environments.

## Smart Location Detection

The application automatically detects the user's location to provide intelligent default state selection:

### Location Detection Methods

- **Browser Geolocation API**: Primary method using GPS/WiFi positioning
- **IP-based Fallback**: Secondary method using IP geolocation services
- **Privacy-Conscious**: Requests permission and handles denials gracefully

### Default Selection Logic

- **US Users**: If location is detected within a specific US state, that state is pre-selected
- **Non-US Users**: All states are selected for comprehensive comparison
- **Detection Failure**: Falls back to selecting all states

### User Experience

- **Toast Notifications**: Friendly toast notifications positioned below the navbar about location detection and selection
- **Auto-Dismissing Messages**: Toast messages automatically disappear after 5-6 seconds
- **Loading Indicators**: Shows progress while detecting location
- **Manual Override**: Users can always add/remove states using the interactive legend
- **No Tracking**: Location data is used only for initial selection and not stored

### Privacy & Security

- **Permission-Based**: Only activates with user consent for geolocation
- **No Data Storage**: Location information is not saved or transmitted
- **Graceful Degradation**: Full functionality available even if location is denied
- **HTTPS Compatible**: Works with secure connections and modern browsers

### Technical Implementation

- **Coordinate Mapping**: Uses state boundary coordinates for accurate detection
- **Error Handling**: Comprehensive error handling for all failure scenarios
- **Performance Optimized**: Fast detection with configurable timeouts
- **Cross-Platform**: Works on desktop, tablet, and mobile devices