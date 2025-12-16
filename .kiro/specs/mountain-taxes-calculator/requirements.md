# Requirements Document

## Introduction

Mountain Taxes is a Bootstrap v5.3 web application that helps users visualize and compare state income tax obligations across different earned income levels. The application provides interactive charts and detailed state-by-state tax information to help users understand how their tax burden changes as their income increases.

## Glossary

- **Mountain_Taxes_System**: The complete web application including frontend interface, data models, and tax calculation logic
- **Tax_Calculator**: The component responsible for computing tax obligations based on income and state tax brackets
- **Chart_Component**: The Chart.js-based visualization that displays tax obligations across income levels
- **State_Data_Model**: The TypeScript interfaces defining tax bracket structures for each state
- **Filing_Type**: The tax filing status (Single or Married) that affects deductions and brackets
- **Tax_Bracket**: A range of income with an associated tax rate
- **Earned_Income**: Wages, salaries, and other compensation subject to income tax
- **Bootstrap_Framework**: The CSS framework (v5.3) used for responsive design and styling
- **Bootswatch_Theme**: The "Brite" theme variant of Bootstrap used for visual styling

## Requirements

### Requirement 1

**User Story:** As a taxpayer, I want to visualize how my tax burden changes across different income levels, so that I can understand the progressive nature of state income taxes.

#### Acceptance Criteria

1. WHEN the Mountain_Taxes_System loads THEN the system SHALL display a Chart.js line chart with earned income on the X-axis and taxes paid on the Y-axis
2. WHEN the chart initializes THEN the system SHALL set the X-axis range from zero to 100,000 in increments of 10,000
3. WHEN a user selects a state THEN the Tax_Calculator SHALL compute tax obligations for each income level and display as a dataset on the chart
4. WHEN multiple states are selected THEN the Chart_Component SHALL display each state as a separate colored line on the same chart
5. WHEN tax calculations are performed THEN the system SHALL consider only earned income and exclude other income types

### Requirement 2

**User Story:** As a user, I want to dynamically adjust the income range displayed on the chart, so that I can explore tax implications across different income scenarios.

#### Acceptance Criteria

1. WHEN a user clicks "Add 10k" THEN the Mountain_Taxes_System SHALL extend the X-axis maximum by 10,000 and recalculate all displayed tax lines
2. WHEN a user clicks "Add 100k" THEN the system SHALL extend the X-axis maximum by 100,000 and recalculate all displayed tax lines
3. WHEN a user clicks "Add 1m" THEN the system SHALL extend the X-axis maximum by 1,000,000 and recalculate all displayed tax lines
4. WHEN a user clicks "Add 10m" THEN the system SHALL extend the X-axis maximum by 10,000,000 and recalculate all displayed tax lines
5. WHEN a user clicks "Remove data set" THEN the system SHALL reduce the X-axis maximum by the last added increment and recalculate all displayed tax lines

### Requirement 3

**User Story:** As a user, I want to easily select and compare multiple states, so that I can quickly understand tax differences between jurisdictions.

#### Acceptance Criteria

1. WHEN a user clicks an individual state button THEN the Mountain_Taxes_System SHALL add that state's tax calculation to the chart as a new dataset
2. WHEN a user clicks "All states" THEN the system SHALL select all available states and display their tax calculations on the chart
3. WHEN a user clicks "Remove all" THEN the system SHALL deselect all states and clear all datasets from the chart
4. WHEN a state is already selected and its button is clicked again THEN the system SHALL remove that state's dataset from the chart
5. WHEN states are added or removed THEN the Chart_Component SHALL update the legend to reflect the current selection

### Requirement 4

**User Story:** As a user, I want to access detailed tax information for each state, so that I can understand the specific tax brackets and deductions that affect my calculations.

#### Acceptance Criteria

1. WHEN a user clicks a state link THEN the Mountain_Taxes_System SHALL navigate to a dedicated page showing that state's complete tax data model
2. WHEN displaying state details THEN the system SHALL show filing types, standard deductions, personal exemptions, and all tax brackets
3. WHEN state data is displayed THEN the system SHALL format the information in a clear, readable structure
4. WHEN viewing state details THEN the system SHALL provide navigation back to the main chart interface
5. WHEN state pages load THEN the system SHALL render the data without requiring external API calls

### Requirement 5

**User Story:** As a developer, I want the application built with TypeScript and Bootstrap v5.3, so that the codebase is type-safe and follows modern web development practices.

#### Acceptance Criteria

1. WHEN code is written THEN the Mountain_Taxes_System SHALL use only TypeScript and prohibit JavaScript files
2. WHEN the application renders THEN the system SHALL use Bootstrap v5.3 framework for responsive design
3. WHEN styling is applied THEN the system SHALL use Bootswatch's "Brite" theme for visual consistency
4. WHEN the application builds THEN the system SHALL compile TypeScript without errors
5. WHEN the application is deployed THEN the system SHALL serve from the ./website folder structure

### Requirement 6

**User Story:** As a system administrator, I want tax data to be hardcoded from reliable sources, so that the application loads quickly and provides accurate information without external dependencies.

#### Acceptance Criteria

1. WHEN tax data is implemented THEN the State_Data_Model SHALL conform to the specified TypeScript interfaces
2. WHEN state information is populated THEN the system SHALL use data from Tax Foundation's 2025 state income tax rates
3. WHEN tax calculations are performed THEN the Tax_Calculator SHALL use the hardcoded state data for all computations
4. WHEN the application loads THEN the system SHALL render state data immediately without external API calls
5. WHEN data structures are defined THEN the system SHALL include filing types, deductions, exemptions, and tax brackets for each state

### Requirement 7

**User Story:** As a user, I want the application to be responsive and accessible, so that I can use it effectively on different devices and screen sizes.

#### Acceptance Criteria

1. WHEN the application loads on mobile devices THEN the Mountain_Taxes_System SHALL display all functionality in a mobile-optimized layout
2. WHEN the chart is displayed THEN the Chart_Component SHALL be responsive and readable on all screen sizes
3. WHEN buttons are rendered THEN the system SHALL ensure they are appropriately sized for touch interaction
4. WHEN the application is used THEN the system SHALL maintain Bootstrap's accessibility standards
5. WHEN content is displayed THEN the system SHALL ensure proper contrast ratios and readable typography

### Requirement 8

**User Story:** As a developer, I want the existing CDK infrastructure optimized, so that the application deploys efficiently to the target domain.

#### Acceptance Criteria

1. WHEN infrastructure code is reviewed THEN the system SHALL identify and implement performance optimizations
2. WHEN the application deploys THEN the system SHALL serve content from the configured S3 bucket with CloudFront distribution
3. WHEN routing is configured THEN the system SHALL properly handle single-page application navigation
4. WHEN the domain is accessed THEN the system SHALL serve the application at http://taxes.mountaintechnologiesllc.com
5. WHEN builds are executed THEN the system SHALL use NPM for local development and build processes