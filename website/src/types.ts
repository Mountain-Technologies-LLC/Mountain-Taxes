/**
 * Mountain Taxes - Core TypeScript Interfaces and Data Models
 * 
 * This file defines all the core data structures used throughout the application
 * for state tax data, calculations, and Chart.js integration.
 */

/**
 * Enumeration for tax filing types
 */
export enum FilingTypeName {
    Single = "Single",
    Married = "Married"
}

/**
 * Represents a tax bracket with income threshold and rate
 */
export interface TaxBracket {
    /** Income threshold for this bracket (in dollars) */
    bracket: number;
    /** Tax rate for this bracket (as decimal, e.g., 0.0440 for 4.4%) */
    rate: number;
}

/**
 * Represents tax information for a specific filing type
 */
export interface FilingType {
    /** The filing type (Single or Married) */
    type: FilingTypeName;
    /** Standard deduction amount for this filing type */
    standardDeduction: number;
    /** Personal exemption amount for this filing type */
    personalExemption: number;
    /** Array of tax brackets for progressive taxation */
    taxBrackets: TaxBracket[];
}

/**
 * Represents complete tax information for a state
 */
export interface State {
    /** Full name of the state */
    name: string;
    /** Array of filing types supported by this state */
    filingType: FilingType[];
    /** Dependent deduction amount */
    dependentDeduction: number;
}

/**
 * Represents the result of a tax calculation
 */
export interface TaxCalculationResult {
    /** The income amount used for calculation */
    income: number;
    /** Total tax owed for this income level */
    taxOwed: number;
    /** Effective tax rate (total tax / income) */
    effectiveRate: number;
    /** Marginal tax rate (rate on next dollar earned) */
    marginalRate: number;
}

/**
 * Represents a Chart.js dataset for displaying state tax data
 */
export interface ChartDataset {
    /** Display label for this dataset (typically state name) */
    label: string;
    /** Array of tax amounts corresponding to income levels */
    data: number[];
    /** Border color for the line chart */
    borderColor: string;
    /** Background color for the line chart */
    backgroundColor: string;
    /** Line tension for smooth curves (0 = straight lines, 0.4 = curved) */
    tension: number;
}

/**
 * Configuration options for Chart.js integration
 */
export interface ChartConfiguration {
    /** Chart type (typically 'line' for tax visualization) */
    type: string;
    /** Chart data including datasets and labels */
    data: {
        labels: string[];
        datasets: ChartDataset[];
    };
    /** Chart options for styling and behavior */
    options: {
        responsive: boolean;
        maintainAspectRatio: boolean;
        scales: {
            x: {
                title: {
                    display: boolean;
                    text: string;
                };
            };
            y: {
                title: {
                    display: boolean;
                    text: string;
                };
            };
        };
        plugins: {
            legend: {
                display: boolean;
                position: string;
            };
            tooltip: {
                enabled: boolean;
            };
        };
    };
}

/**
 * Represents income range configuration for chart display
 */
export interface IncomeRange {
    /** Minimum income value */
    min: number;
    /** Maximum income value */
    max: number;
    /** Increment step between data points */
    step: number;
}

/**
 * Represents application state for managing selected states and UI
 */
export interface AppState {
    /** Array of currently selected state names */
    selectedStates: string[];
    /** Current income range configuration */
    incomeRange: IncomeRange;
    /** Current filing type for calculations */
    currentFilingType: FilingTypeName;
}

/**
 * Represents a legend item for HTML legend display
 */
export interface LegendItem {
    /** Display label for the legend item */
    label: string;
    /** Color associated with this legend item */
    color: string;
    /** Whether this dataset is currently hidden */
    hidden: boolean;
    /** Index of the dataset in the chart */
    datasetIndex: number;
}

/**
 * Configuration for HTML legend component
 */
export interface HtmlLegendConfig {
    /** Container element ID where legend will be rendered */
    containerId: string;
    /** Position of the legend (bottom-start, bottom-center, etc.) */
    position: 'bottom-start' | 'bottom-center' | 'bottom-end' | 'top-start' | 'top-center' | 'top-end';
    /** Whether to show legend title */
    showTitle: boolean;
    /** Custom title text (defaults to "Selected States") */
    titleText?: string;
}