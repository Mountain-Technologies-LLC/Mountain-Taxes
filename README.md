# Mountain Taxes
An interactive state income tax calculator built with TypeScript, Bootstrap v5.3, and Chart.js. Visualize and compare tax obligations across different states and income levels.

## ✨ Features

- **Interactive Chart.js Visualizations**: Compare state tax obligations with dynamic line charts
- **Custom HTML Legend**: Accessible legend positioned at bottom-start for better user experience
- **States Navigation Dropdown**: Easy access to individual state tax information via responsive navbar
- **Responsive Design**: Bootstrap 5.3 with Bootswatch Brite theme for all device sizes
- **Mobile-Optimized Navigation**: Collapsible hamburger menu with touch-friendly state selection
- **TypeScript**: Full type safety and modern development experience
- **Comprehensive Testing**: Unit tests, property-based tests, and integration tests
- **State Tax Data**: Hardcoded 2025 tax rates from Tax Foundation for fast loading

## 🚀 Quick Start

### Production Deployment
```bash
./deploy.sh taxes.mountaintechnologiesllc.com
```

### Local Development
```bash
cd website
npm install
npm run dev
```

### Local Build & Preview
```bash
./build-local.sh
cd website
npm run preview
```

## 📦 Build Process

The application uses an optimized TypeScript build process with:
- **Vite** for fast bundling and development
- **TypeScript** compilation with strict type checking
- **Terser** minification for production builds
- **Code splitting** for vendor libraries (Bootstrap, Chart.js)
- **Source maps** for debugging

### Build Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for development |
| `npm run build:prod` | Build for production with optimizations |
| `npm run preview` | Preview production build locally |
| `npm run test` | Run test suite |
| `npm run lint` | Check code quality |

## 🏗️ Infrastructure

The application deploys to AWS using CDK with:
- **S3** static website hosting
- **CloudFront** CDN with SSL certificate
- **Route 53** DNS management
- **Optimized caching** for static assets

### Deployment Commands

| Command | Description |
|---------|-------------|
| `./deploy.sh <domain>` | Full build and deploy |
| `./build-local.sh` | Local build only |

## 🧪 Testing

Comprehensive test suite with:
- **Unit tests** for component functionality
- **Property-based tests** using fast-check
- **Integration tests** for Chart.js components
- **Type checking** with TypeScript compiler

Run tests: `npm run test`


# Initial Prompt
I want to create a taxes website called Mountain Taxes. I want the website to be a Bootstrap v5.3 web app. I want the web app to be placed in the ./website folder. I want to only write TypeScript. JavaScript will not be allowed.

In the ./infrastructure folder, I have copied .NET cdk code to deploy a website to a s3 bucket, with distributions and routing. I will be deploying to http://taxes.mountaintechnologiesllc.com. I am using NPM to locally run builds. Please do implement fixes and optimizations to existing cdk code.

I want the Bootstrap v5.3 web app to be made to create a Taxes app. I will help people see how much taxes one will pay as their earned income increases. I want to use Bootswatch's Brite theme. I want data to be used form https://taxfoundation.org/data/all/state/state-income-tax-rates/. Data is also in .kiro/steering/2025-State-Individual-Income-Tax-Rates-and-Brackets-2025.xlsx.

Each state should have a data model like below:

export interface State {
  name: string;
  filingType: FilingType[];
  dependentDeduction: number;
}

export interface FilingType {
  type: FilingTypeName;
  standardDeduction: number;
  personalExemption: number;
  taxBrackets: TaxBracket[];
}

enum FilingTypeName {
  Single = "Single",
  Married = "Married"
}

export interface TaxBracket {
  bracket: number;
  rate: number;
}

I want the index page to use a chart.js line chart. I want the earned income to be on the X axis. I want taxes paid to be on the Y axis. I want the initial data on the X axis to start from zero and go to 100k in increments of 10k. Each state selected will be a dataset shown in the chart. Beneath the chart I want buttons to add data. The buttons will be: "Add 10k", "Add 100k", "Add 1m", "Add 10m", and "Remove data set". On another row, I want to show another list of buttons that includes: an "All states" as a button that if pressed will select each state and added to the line chart, a "Remove all" button that will uncheck all state buttons and remove them from the line chart, and each state as a button that if pressed will add the state to the chart. Each state will have a chart that will show the amount of taxes paid on earned income. I also want links to each state that shows the data model of how earned income is taxed. I want The state data to be populated from form https://taxfoundation.org/data/all/state/state-income-tax-rates/. Data is also in .kiro/steering/2025-State-Individual-Income-Tax-Rates-and-Brackets-2025.xlsx. I want it to be hardcoded so that it can be rendered quickly to the user when they are using this website. But I want the website to be dynamic enough to allow for the functionality above. As stated before, I only want the chart to only consider earned income.
