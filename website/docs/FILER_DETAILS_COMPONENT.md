# Filer Details Component

## Overview

The Filer Details component provides a user interface for selecting the tax filing type (Single or Married) in the Mountain Taxes application. This component is positioned above the Tax Comparison Chart and directly affects how tax calculations are performed across all selected states.

## Features

- **Filing Type Selection**: Radio button toggle between Single and Married filing types
- **Inline Form Design**: Compact horizontal layout that doesn't take up much space
- **Small Size**: Uses Bootstrap's `btn-group-sm` for smaller buttons
- **Default State**: Defaults to Single filing type on initialization
- **Real-time Updates**: Automatically recalculates and updates the tax chart when filing type changes
- **Accessibility**: Fully accessible with proper ARIA labels and keyboard navigation
- **Responsive Design**: Adapts to different screen sizes using Bootstrap flexbox classes

## Component Structure

### HTML Structure
```html
<div class="card">
    <div class="card-header bg-primary">
        <h5 class="card-title mb-0">
            <i class="fas fa-user me-2" aria-hidden="true"></i>
            Filer Details
        </h5>
    </div>
    <div class="card-body py-2">
        <div class="d-flex align-items-center justify-content-center">
            <label class="form-label me-3 mb-0 fw-bold text-nowrap">Filing Type:</label>
            <div class="btn-group btn-group-sm" role="group" aria-label="Filing Type Selection">
                <!-- Radio buttons for Single and Married -->
            </div>
        </div>
    </div>
</div>
```

### TypeScript Interface
```typescript
export interface FilerDetailsConfig {
    containerId: string;
    defaultFilingType: FilingTypeName;
    onFilingTypeChange?: (filingType: FilingTypeName) => void;
}
```

## Usage

### Basic Usage
```typescript
import { FilerDetails } from './filerDetails';
import { FilingTypeName } from './types';

// Initialize with default settings (Single filing type)
const filerDetails = new FilerDetails('filer-details-container');
```

### Advanced Usage with TaxChart Integration
```typescript
import { FilerDetails } from './filerDetails';
import { TaxChart } from './chartComponent';
import { FilingTypeName } from './types';

// Initialize tax chart first
const taxChart = new TaxChart('tax-chart');

// Initialize filer details with tax chart integration
const filerDetails = new FilerDetails('filer-details-container', taxChart, {
    defaultFilingType: FilingTypeName.Married,
    onFilingTypeChange: (filingType) => {
        console.log(`Filing type changed to: ${filingType}`);
    }
});
```

## API Reference

### Constructor
```typescript
constructor(
    containerId: string, 
    taxChart?: TaxChart, 
    config?: Partial<FilerDetailsConfig>
)
```

**Parameters:**
- `containerId`: ID of the HTML element where the component will be rendered
- `taxChart` (optional): TaxChart instance for automatic updates
- `config` (optional): Configuration options

### Public Methods

#### `setFilingType(filingType: FilingTypeName): void`
Programmatically sets the filing type and updates the UI and chart.

```typescript
filerDetails.setFilingType(FilingTypeName.Married);
```

#### `getFilingType(): FilingTypeName`
Returns the currently selected filing type.

```typescript
const currentType = filerDetails.getFilingType();
```

#### `setTaxChart(taxChart: TaxChart): void`
Sets or updates the TaxChart reference for automatic updates.

```typescript
filerDetails.setTaxChart(taxChart);
```

#### `destroy(): void`
Cleans up the component and removes all event listeners.

```typescript
filerDetails.destroy();
```

## Integration Points

### TaxChart Integration
The Filer Details component integrates seamlessly with the TaxChart component:

1. **Automatic Updates**: When filing type changes, the chart automatically recalculates all tax data
2. **Real-time Visualization**: Changes are immediately reflected in the chart visualization
3. **State Preservation**: Selected states remain selected when filing type changes

### Event Flow
1. User clicks on a filing type radio button
2. Component validates the selection
3. Internal state is updated
4. TaxChart.setFilingType() is called (if chart is available)
5. Chart recalculates all datasets with new filing type
6. Optional callback is triggered
7. UI is updated to reflect the new selection

## Styling and Theming

The component uses Bootstrap 5 classes for consistent styling:

- **Card Layout**: Uses Bootstrap card component for consistent appearance with other components
- **Compact Design**: Small button group with `btn-group-sm` and reduced padding (`py-2`) for minimal space usage
- **Primary Theme**: Header uses `bg-primary` class to match application theme
- **Inline Form**: Form content uses flexbox for horizontal layout within the card body
- **Button Groups**: Radio buttons are styled as Bootstrap button groups
- **Icons**: FontAwesome icons for visual enhancement
- **Responsive**: Fully responsive design that works on all screen sizes

### CSS Classes Used
- `.card`, `.card-header`, `.card-body`: Bootstrap card structure
- `.bg-primary`: Primary theme color for header
- `.py-2`: Reduced vertical padding for compact card body
- `.d-flex`, `.align-items-center`, `.justify-content-center`: Flexbox layout for inline form
- `.btn-group`, `.btn-group-sm`, `.btn-check`, `.btn-outline-primary`: Button group styling
- `.form-label`, `.fw-bold`, `.text-nowrap`: Form styling
- `.fas fa-user`, `.fas fa-users`: FontAwesome icons

## Accessibility Features

- **ARIA Labels**: Proper ARIA labeling for screen readers
- **Keyboard Navigation**: Full keyboard accessibility
- **Role Attributes**: Semantic HTML with proper role attributes
- **Focus Management**: Proper focus indicators and management
- **Screen Reader Support**: Descriptive labels and structure

## Error Handling

The component includes robust error handling:

- **Missing Container**: Gracefully handles missing DOM elements
- **Invalid Filing Types**: Validates filing type values
- **Chart Integration**: Works with or without TaxChart integration
- **Event Listener Cleanup**: Proper cleanup to prevent memory leaks

## Testing

Comprehensive test suite covers:

- Component initialization and rendering
- Filing type selection and updates
- TaxChart integration
- Public API methods
- Error handling scenarios
- Accessibility features
- UI state management

Run tests with:
```bash
npm test -- filerDetails.test.ts
```

## Performance Considerations

- **Minimal DOM Manipulation**: Efficient updates only when necessary
- **Event Delegation**: Proper event listener management
- **Memory Management**: Clean destruction and cleanup methods
- **Debounced Updates**: Prevents excessive chart updates

## Browser Support

Compatible with all modern browsers that support:
- ES6+ JavaScript features
- CSS Grid and Flexbox
- Bootstrap 5 requirements
- Chart.js compatibility

## Future Enhancements

Potential future improvements:
- Additional filing types (Head of Household, etc.)
- Dependent count selection
- State-specific filing options
- Advanced tax scenarios
- Integration with tax year selection