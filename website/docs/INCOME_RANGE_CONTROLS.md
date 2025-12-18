# Income Range Controls Documentation

## Overview

The Income Range Controls component provides advanced functionality for configuring the income range displayed on the tax comparison chart. It features step-by functionality with configurable base income and step sizes, allowing users to customize the chart to focus on specific income ranges.

## Features

### Step Size Selection
- **Available Options**: 1k, 10k, 100k, 1m, 10m, 100m
- **Default**: 10k (10,000)
- **Implementation**: Bootstrap radio button group with `btn-check` styling
- **Behavior**: Chart updates immediately when step size changes

### Step Count Controls
- **Range**: 1-100 steps
- **Default**: 10 steps
- **Controls**: 
  - Direct input field with number validation
  - Plus (+) and minus (-) buttons for increment/decrement
- **Validation**: Prevents values below 1 or above 100

### Base Income Configuration
- **Range**: $0 and above (non-negative values)
- **Default**: $0
- **Implementation**: Number input field with step="1000" for easier large value entry
- **Validation**: Automatically corrects negative values to 0

### Real-time Updates
- **Chart Integration**: All changes immediately update the chart via `TaxChart.setIncomeRange()`
- **Range Display**: Shows current range (e.g., "$0 - $100K") with formatted currency values
- **UI Synchronization**: Controls stay in sync with programmatic configuration changes

## Default Configuration

```typescript
{
  stepSize: 10000,    // 10k increments
  stepCount: 10,      // 10 steps
  baseIncome: 0       // Starting at $0
}
// Results in: $0 - $100,000 range with $10,000 steps
```

## API Reference

### Constructor
```typescript
constructor(containerId: string, taxChart: TaxChart)
```

### Public Methods

#### `getConfig(): StepControlConfig`
Returns the current configuration object.

#### `setConfig(config: Partial<StepControlConfig>): void`
Updates the configuration and refreshes the UI and chart.

#### `refresh(): void`
Refreshes the controls to reflect current state (useful after external chart changes).

### Configuration Interface
```typescript
interface StepControlConfig {
  stepSize: number;    // Step increment (1000, 10000, 100000, etc.)
  stepCount: number;   // Number of steps (1-100)
  baseIncome: number;  // Starting income level (>= 0)
}
```

## HTML Structure

The component renders a responsive Bootstrap form with two main sections:

### Step By Controls
```html
<form class="row g-3 align-items-center mb-3">
  <div class="col-auto">
    <label class="col-form-label">Step by</label>
  </div>
  <div class="col-auto">
    <div class="btn-group" role="group">
      <!-- Radio buttons for step sizes -->
    </div>
  </div>
  <div class="col-auto">
    <div class="input-group input-group-sm">
      <span class="input-group-text">Step Count</span>
      <!-- Step count controls -->
    </div>
  </div>
</form>
```

### Base Income Controls
```html
<form class="row g-3 align-items-center mb-3">
  <div class="col-auto">
    <label for="base-income" class="col-form-label">Start Base Income at</label>
  </div>
  <div class="col-auto">
    <input type="number" class="form-control form-control-sm" id="base-income">
  </div>
</form>
```

## Usage Examples

### Basic Usage
```typescript
const taxChart = new TaxChart('chart-canvas');
const controls = new IncomeRangeControls('income-controls', taxChart);
```

### Programmatic Configuration
```typescript
// Set custom configuration
controls.setConfig({
  stepSize: 100000,  // 100k steps
  stepCount: 20,     // 20 steps
  baseIncome: 50000  // Start at $50k
});
// Results in: $50,000 - $2,050,000 range with $100,000 steps

// Partial updates
controls.setConfig({ stepCount: 15 }); // Only change step count
```

### Getting Current Configuration
```typescript
const config = controls.getConfig();
console.log(`Range: $${config.baseIncome} - $${config.baseIncome + (config.stepSize * config.stepCount)}`);
```

## Event Handling

The component handles the following events:

- **Step Size Change**: Radio button `change` events
- **Step Count Change**: Input field `input` events and button `click` events
- **Base Income Change**: Input field `input` events

All events trigger immediate chart updates and range information refresh.

## Accessibility Features

- **Keyboard Navigation**: Full keyboard support for all controls
- **Screen Reader Support**: Proper labels and ARIA attributes
- **Focus Management**: Logical tab order through controls
- **Input Validation**: Clear feedback for invalid inputs

## Responsive Design

The component uses Bootstrap's responsive grid system:
- **Desktop**: Horizontal layout with all controls on same row
- **Mobile**: Stacked layout with proper spacing
- **Form Controls**: Appropriately sized for touch interfaces

## Currency Formatting

The component includes intelligent currency formatting:
- **< $10,000**: Full number with commas (e.g., "$5,000")
- **>= $10,000**: Abbreviated with "K" (e.g., "$50K")
- **>= $1,000,000**: Abbreviated with "M" (e.g., "$2.0M")
- **>= $1,000,000,000**: Abbreviated with "B" (e.g., "$1.5B")

## Integration with Chart Component

The Income Range Controls integrate seamlessly with the TaxChart component:

1. **Initialization**: Controls automatically set the chart to default range
2. **Updates**: All control changes call `taxChart.setIncomeRange(min, max, step)`
3. **Validation**: Chart component validates inputs and provides fallbacks
4. **Synchronization**: Controls can be refreshed to reflect external chart changes

## Testing

The component includes comprehensive test coverage:
- **Component Initialization**: Proper rendering and default values
- **Step Size Selection**: Radio button functionality and chart updates
- **Step Count Controls**: Input validation and increment/decrement buttons
- **Base Income Controls**: Input validation and chart integration
- **Configuration Management**: Get/set methods and UI synchronization
- **Integration Tests**: Complex scenarios with multiple control changes
- **Currency Formatting**: Proper display formatting for various ranges

## Migration from Previous Version

The new Income Range Controls replace the previous simple button-based system:

### Previous Implementation
- Fixed increment buttons: "Add 10k", "Add 100k", "Add 1m", "Add 10m"
- "Remove data set" button for reducing range
- Limited flexibility in range configuration

### New Implementation Benefits
- **Flexible Step Sizes**: Choose from 6 different increment options
- **Custom Step Counts**: Set any number of steps from 1-100
- **Base Income Configuration**: Start chart at any income level
- **Better UX**: More intuitive controls with immediate feedback
- **Backward Compatibility**: Default settings match previous behavior

### Migration Path
No code changes required for existing integrations. The component maintains the same constructor signature and integrates with the same TaxChart methods.