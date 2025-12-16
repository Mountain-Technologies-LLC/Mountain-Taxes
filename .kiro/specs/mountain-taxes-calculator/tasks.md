# Implementation Plan

## Overview

This implementation plan converts the Mountain Taxes Calculator design into a series of incremental coding tasks. Each task builds on previous work and focuses on writing, modifying, or testing code components. The plan follows implementation-first development with property-based testing integrated throughout.

## Task List

- [x] 1. Set up project structure and dependencies
  - Initialize TypeScript project in ./website folder with proper tsconfig.json
  - Install and configure npm dependencies: Bootstrap 5.3, Chart.js, fast-check, Jest, @testing-library/dom
  - Set up build scripts for TypeScript compilation and bundling
  - Configure Bootswatch Brite theme integration
  - _Requirements: 5.1, 5.2, 5.3_

- [x] 2. Create core TypeScript interfaces and data models
  - Implement State, FilingType, TaxBracket, and supporting interfaces
  - Create enum for FilingTypeName (Single, Married)
  - Define ChartDataset and TaxCalculationResult interfaces
  - Add type definitions for Chart.js integration
  - _Requirements: 6.1, 6.5_

- [x] 2.1 Write property test for data model conformance
  - **Property 9: Data model conformance**
  - **Validates: Requirements 6.1, 6.5**

- [x] 3. Implement hardcoded state tax data
  - Create comprehensive state tax data based on Tax Foundation 2025 rates
  - Populate all 50 states with filing types, deductions, and tax brackets
  - Implement data validation to ensure completeness
  - Export state data as typed constants
  - _Requirements: 6.2, 6.5_

- [x] 3.1 Write property test for state data completeness
  - **Property 9: Data model conformance**
  - **Validates: Requirements 6.1, 6.5**

- [ ] 4. Create tax calculation engine
  - Implement core tax calculation logic for progressive tax brackets
  - Handle standard deductions and personal exemptions
  - Calculate effective and marginal tax rates
  - Support both Single and Married filing types
  - _Requirements: 1.3, 1.5_

- [ ] 4.1 Write property test for tax calculation accuracy
  - **Property 1: State selection adds correct tax calculations**
  - **Validates: Requirements 1.3**

- [ ] 4.2 Write property test for earned income only
  - **Property 3: Tax calculations use only earned income**
  - **Validates: Requirements 1.5**

- [ ] 4.3 Write unit tests for tax calculation edge cases
  - Test zero income, negative income, and boundary conditions
  - Test states with no income tax and flat tax rates
  - Verify calculation accuracy for extreme income values
  - _Requirements: 1.3, 1.5_

- [ ] 5. Build Chart.js integration component
  - Create Chart component class with TypeScript integration
  - Implement dynamic dataset management for multiple states
  - Configure responsive chart options and styling
  - Add income range adjustment functionality
  - _Requirements: 1.1, 1.2, 1.4_

- [ ] 5.1 Write property test for multiple state datasets
  - **Property 2: Multiple state datasets display independently**
  - **Validates: Requirements 1.4**

- [ ] 5.2 Write property test for chart legend updates
  - **Property 6: Chart legend reflects current selection**
  - **Validates: Requirements 3.5**

- [ ] 5.3 Write unit tests for chart initialization
  - Test initial chart setup with correct axes and range
  - Verify chart responsiveness across container sizes
  - Test chart update and re-render functionality
  - _Requirements: 1.1, 1.2_

- [ ] 6. Implement state selection and management
  - Create state selector component with button interface
  - Implement individual state toggle functionality
  - Add "All states" and "Remove all" operations
  - Manage selected state tracking and UI updates
  - _Requirements: 3.1, 3.2, 3.3, 3.4_

- [ ] 6.1 Write property test for state selection toggle
  - **Property 5: State selection toggle behavior**
  - **Validates: Requirements 3.1, 3.4**

- [ ] 6.2 Write unit tests for bulk state operations
  - Test "All states" selection functionality
  - Test "Remove all" deselection functionality
  - Verify UI state consistency after operations
  - _Requirements: 3.2, 3.3_

- [ ] 7. Create income range adjustment controls
  - Implement "Add 10k", "Add 100k", "Add 1m", "Add 10m" buttons
  - Add "Remove data set" functionality for range reduction
  - Integrate range changes with chart updates and recalculation
  - Maintain chart data consistency during range modifications
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

- [ ] 7.1 Write property test for range extension behavior
  - **Property 4: Range extension preserves existing data**
  - **Validates: Requirements 2.1, 2.2, 2.3, 2.4, 2.5**

- [ ] 7.2 Write unit tests for specific range increments
  - Test each increment button (10k, 100k, 1m, 10m) individually
  - Test range reduction with "Remove data set"
  - Verify chart recalculation after range changes
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

- [ ] 8. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 9. Implement client-side routing
  - Create router component for SPA navigation
  - Set up routes for main chart view and state detail pages
  - Implement browser history management
  - Handle deep linking and URL updates
  - _Requirements: 4.1, 8.3_

- [ ] 9.1 Write property test for SPA routing
  - **Property 11: SPA routing functionality**
  - **Validates: Requirements 8.3**

- [ ] 10. Create state detail pages
  - Build state detail view component
  - Display comprehensive tax information (brackets, deductions, exemptions)
  - Format state data in readable structure
  - Add navigation back to main chart interface
  - _Requirements: 4.1, 4.2, 4.4_

- [ ] 10.1 Write property test for state detail navigation
  - **Property 7: State detail navigation**
  - **Validates: Requirements 4.1, 4.2**

- [ ] 10.2 Write unit tests for state detail display
  - Test state detail page rendering with sample data
  - Verify all required information is displayed
  - Test navigation back to main interface
  - _Requirements: 4.2, 4.4_

- [ ] 11. Implement main application and UI layout
  - Create main application entry point with Bootstrap layout
  - Integrate all components into cohesive interface
  - Apply Bootswatch Brite theme styling
  - Ensure responsive design across device sizes
  - _Requirements: 5.2, 5.3, 7.1, 7.2, 7.3_

- [ ] 11.1 Write property test for responsive design
  - **Property 10: Responsive design behavior**
  - **Validates: Requirements 7.1, 7.2, 7.3, 7.4, 7.5**

- [ ] 11.2 Write unit tests for Bootstrap integration
  - Test Bootstrap CSS loading and theme application
  - Verify responsive breakpoints and layout behavior
  - Test accessibility features and ARIA attributes
  - _Requirements: 5.2, 5.3, 7.4, 7.5_

- [ ] 12. Add data validation and error handling
  - Implement runtime data validation for state information
  - Add error handling for chart rendering failures
  - Create user feedback for error conditions
  - Ensure graceful degradation for unsupported features
  - _Requirements: 6.1, 6.3_

- [ ] 12.1 Write property test for local data usage
  - **Property 8: Local data usage**
  - **Validates: Requirements 4.5, 6.3, 6.4**

- [ ] 12.2 Write unit tests for error handling
  - Test invalid input handling and validation
  - Test chart rendering failure scenarios
  - Verify error message display and recovery
  - _Requirements: 6.1, 6.3_

- [ ] 13. Optimize build process and deployment integration
  - Configure TypeScript compilation for production builds
  - Set up npm build scripts for bundling and optimization
  - Integrate with existing CDK deployment pipeline
  - Update infrastructure deployment path for TypeScript output
  - _Requirements: 5.1, 5.4, 5.5_

- [ ] 14. Update CDK infrastructure for SPA support
  - Modify CloudFront error responses to return index.html for 404/403
  - Update deployment source path to use npm build output
  - Configure caching policies for static assets
  - Ensure proper SPA routing support in infrastructure
  - _Requirements: 8.2, 8.3, 8.5_

- [ ] 15. Final integration and testing
  - Integrate all components into complete application
  - Perform end-to-end functionality verification
  - Test deployment pipeline with sample build
  - Verify application works correctly at target domain
  - _Requirements: 8.4_

- [ ] 16. Final Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.