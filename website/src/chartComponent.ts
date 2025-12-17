/**
 * Mountain Taxes - Chart.js Integration Component
 * 
 * This component manages the Chart.js visualization for displaying state income tax
 * obligations across different income levels. It handles dynamic dataset management,
 * responsive chart options, and income range adjustments.
 */

import { Chart, ChartConfiguration, ChartOptions } from 'chart.js';
import { ChartDataset, IncomeRange, FilingTypeName, LegendItem } from './types';
import { calculateTaxForIncomes, generateIncomeRange } from './taxCalculator';
import { getAllStateNames } from './stateData';
import { ErrorHandler, ErrorSeverity, UserFeedback, GracefulDegradation, StateDataValidator } from './validation';

/**
 * Chart component class for managing tax visualization
 */
export class TaxChart {
    private chart: Chart | null = null;
    private canvas: HTMLCanvasElement;
    private selectedStates: string[] = [];
    private incomeRange: IncomeRange = {
        min: 0,
        max: 100000,
        step: 10000
    };
    private currentFilingType: FilingTypeName = FilingTypeName.Single;
    private colorPalette: string[] = [
        '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
        '#FF9F40', '#FF6384', '#C9CBCF', '#4BC0C0', '#FF6384',
        '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40',
        '#FF6384', '#C9CBCF', '#4BC0C0', '#FF6384', '#36A2EB',
        '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#FF6384',
        '#C9CBCF', '#4BC0C0', '#FF6384', '#36A2EB', '#FFCE56',
        '#4BC0C0', '#9966FF', '#FF9F40', '#FF6384', '#C9CBCF',
        '#4BC0C0', '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0',
        '#9966FF', '#FF9F40', '#FF6384', '#C9CBCF', '#4BC0C0',
        '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'
    ];

    constructor(canvasId: string) {
        const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
        if (!canvas) {
            const error = new Error(`Canvas element with id '${canvasId}' not found`);
            ErrorHandler.logError('CANVAS_NOT_FOUND', error.message, ErrorSeverity.CRITICAL, { canvasId });
            throw error;
        }
        this.canvas = canvas;
        
        try {
            this.initializeChart();
        } catch (error) {
            ErrorHandler.handleChartError(error as Error, { canvasId });
            
            // Provide fallback if Chart.js is not available
            if (!GracefulDegradation.isChartJsAvailable()) {
                GracefulDegradation.handleUnavailableFeature('Chart.js', () => {
                    GracefulDegradation.provideChartFallback(canvasId, {
                        message: 'Chart visualization is not available',
                        selectedStates: this.selectedStates,
                        incomeRange: this.incomeRange
                    });
                });
            }
            throw error;
        }
    }

    /**
     * Initialize the Chart.js instance with default configuration
     */
    private initializeChart(): void {
        const ctx = this.canvas.getContext('2d');
        if (!ctx) {
            const error = new Error('Unable to get 2D context from canvas');
            ErrorHandler.handleChartError(error);
            throw error;
        }

        try {
            const config: ChartConfiguration = {
                type: 'line',
                data: {
                    labels: this.generateIncomeLabels(),
                    datasets: []
                },
                options: this.getChartOptions()
            };

            this.chart = new Chart(ctx, config);
            
            ErrorHandler.logError('CHART_INITIALIZED', 'Chart initialized successfully', ErrorSeverity.INFO);
        } catch (error) {
            ErrorHandler.handleChartError(error as Error);
            throw error;
        }
    }

    /**
     * Generate income labels for the X-axis
     */
    private generateIncomeLabels(): string[] {
        const incomes = generateIncomeRange(
            this.incomeRange.min,
            this.incomeRange.max,
            this.incomeRange.step
        );
        return incomes.map(income => this.formatIncomeLabel(income));
    }

    /**
     * Format income value as a readable label
     */
    private formatIncomeLabel(income: number): string {
        if (income >= 1000000) {
            return `$${(income / 1000000).toFixed(1)}M`;
        } else if (income >= 1000) {
            return `$${(income / 1000).toFixed(0)}K`;
        } else {
            return `$${income}`;
        }
    }

    /**
     * Get Chart.js configuration options
     */
    private getChartOptions(): ChartOptions {
        return {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Earned Income'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Taxes Owed ($)'
                    },
                    ticks: {
                        callback: function(value) {
                            if (value === null || value === undefined) return '$0';
                            const numValue = typeof value === 'number' ? value : parseFloat(value as string);
                            if (isNaN(numValue)) return '$0';
                            if (numValue >= 1000000) {
                                return `$${(numValue / 1000000).toFixed(1)}M`;
                            } else if (numValue >= 1000) {
                                return `$${(numValue / 1000).toFixed(0)}K`;
                            } else {
                                return `$${numValue}`;
                            }
                        }
                    }
                }
            },
            plugins: {
                legend: {
                    display: false // Disable default legend to use HTML legend
                },
                tooltip: {
                    enabled: true,
                    callbacks: {
                        label: function(context) {
                            const value = context.parsed.y;
                            if (value === null || value === undefined || typeof value !== 'number') {
                                return `${context.dataset.label}: $0`;
                            }
                            const formattedValue = value >= 1000 ? 
                                `$${(value / 1000).toFixed(1)}K` : 
                                `$${value.toFixed(0)}`;
                            return `${context.dataset.label}: ${formattedValue}`;
                        }
                    }
                }
            }
        };
    }

    /**
     * Add a state to the chart
     */
    public addState(stateName: string): void {
        if (this.selectedStates.includes(stateName)) {
            return; // State already selected
        }

        const incomes = generateIncomeRange(
            this.incomeRange.min,
            this.incomeRange.max,
            this.incomeRange.step
        );

        try {
            const taxData = calculateTaxForIncomes(incomes, stateName, this.currentFilingType);
            const colorIndex = this.selectedStates.length % this.colorPalette.length;
            
            const dataset: ChartDataset = {
                label: stateName,
                data: taxData,
                borderColor: this.colorPalette[colorIndex],
                backgroundColor: this.colorPalette[colorIndex] + '20', // Add transparency
                tension: 0.1
            };

            this.selectedStates.push(stateName);
            if (this.chart) {
                this.chart.data.datasets.push(dataset);
                this.chart.update();
                // Use setTimeout to ensure the chart update completes before triggering legend update
                setTimeout(() => {
                    this.triggerLegendUpdate();
                }, 0);
            }
        } catch (error) {
            ErrorHandler.handleStateDataError(stateName, error as Error);
            UserFeedback.showMessage(
                `Failed to add ${stateName} to chart: ${(error as Error).message}`,
                ErrorSeverity.ERROR
            );
            throw error;
        }
    }

    /**
     * Remove a state from the chart
     */
    public removeState(stateName: string): void {
        const stateIndex = this.selectedStates.indexOf(stateName);
        if (stateIndex === -1) {
            return; // State not selected
        }

        this.selectedStates.splice(stateIndex, 1);
        if (this.chart) {
            this.chart.data.datasets.splice(stateIndex, 1);
            this.chart.update();
            // Use setTimeout to ensure the chart update completes before triggering legend update
            setTimeout(() => {
                this.triggerLegendUpdate();
            }, 0);
        }
    }

    /**
     * Toggle state selection (add if not selected, remove if selected)
     */
    public toggleState(stateName: string): void {
        if (this.selectedStates.includes(stateName)) {
            this.removeState(stateName);
        } else {
            this.addState(stateName); // This will throw if state is invalid
        }
    }

    /**
     * Add all states to the chart
     */
    public addAllStates(): void {
        const allStates = getAllStateNames();
        allStates.forEach(stateName => {
            if (!this.selectedStates.includes(stateName)) {
                this.addState(stateName);
            }
        });
    }

    /**
     * Remove all states from the chart
     */
    public removeAllStates(): void {
        this.selectedStates = [];
        if (this.chart) {
            this.chart.data.datasets = [];
            this.chart.update();
            // Use setTimeout to ensure the chart update completes before triggering legend update
            setTimeout(() => {
                this.triggerLegendUpdate();
            }, 0);
        }
    }

    /**
     * Extend the income range by a specified amount
     */
    public extendRange(increment: number): void {
        if (isFinite(increment) && increment > 0) {
            // Prevent overflow and keep within reasonable bounds
            const maxAllowed = Number.MAX_SAFE_INTEGER / 2; // Conservative limit
            const newMax = Math.min(maxAllowed, this.incomeRange.max + increment);
            this.incomeRange.max = newMax;
            this.updateChart();
        }
    }

    /**
     * Reduce the income range by removing the last increment
     */
    public reduceRange(decrement: number): void {
        if (isFinite(decrement) && decrement > 0) {
            const newMax = Math.max(this.incomeRange.min + this.incomeRange.step, this.incomeRange.max - decrement);
            this.incomeRange.max = newMax;
            this.updateChart();
        }
    }

    /**
     * Set a specific income range
     */
    public setIncomeRange(min: number, max: number, step: number): void {
        // Validate income range
        const validationResult = StateDataValidator.validateIncomeRange({ min, max, step });
        
        if (!validationResult.isValid) {
            ErrorHandler.handleValidationError(validationResult, { min, max, step });
            UserFeedback.showValidationErrors(validationResult);
        }
        
        // Sanitize inputs even if validation fails to ensure chart continues working
        const sanitizedMin = Math.max(0, isFinite(min) ? min : 0);
        const sanitizedMax = isFinite(max) && max > sanitizedMin ? max : sanitizedMin + 100000;
        const sanitizedStep = isFinite(step) && step > 0 ? step : 10000;
        
        this.incomeRange = { 
            min: sanitizedMin, 
            max: sanitizedMax, 
            step: sanitizedStep 
        };
        
        try {
            this.updateChart();
        } catch (error) {
            ErrorHandler.handleChartError(error as Error, { incomeRange: this.incomeRange });
            UserFeedback.showMessage(
                'Failed to update chart with new income range',
                ErrorSeverity.ERROR
            );
        }
    }

    /**
     * Change the filing type and recalculate all datasets
     */
    public setFilingType(filingType: FilingTypeName): void {
        this.currentFilingType = filingType;
        this.updateChart();
    }

    /**
     * Update the entire chart with current settings
     */
    private updateChart(): void {
        if (!this.chart) return;

        // Update labels
        this.chart.data.labels = this.generateIncomeLabels();

        // Recalculate all datasets
        const incomes = generateIncomeRange(
            this.incomeRange.min,
            this.incomeRange.max,
            this.incomeRange.step
        );

        this.chart.data.datasets.forEach((dataset, index) => {
            const stateName = this.selectedStates[index];
            if (stateName) {
                try {
                    const taxData = calculateTaxForIncomes(incomes, stateName, this.currentFilingType);
                    dataset.data = taxData;
                } catch (error) {
                    console.error(`Error updating data for state ${stateName}:`, error);
                }
            }
        });

        this.chart.update();
        // Use setTimeout to ensure the chart update completes before triggering legend update
        setTimeout(() => {
            this.triggerLegendUpdate();
        }, 0);
    }

    /**
     * Get currently selected states
     */
    public getSelectedStates(): string[] {
        return [...this.selectedStates];
    }

    /**
     * Get current income range
     */
    public getIncomeRange(): IncomeRange {
        return { ...this.incomeRange };
    }

    /**
     * Get current filing type
     */
    public getFilingType(): FilingTypeName {
        return this.currentFilingType;
    }

    /**
     * Check if a state is currently selected
     */
    public isStateSelected(stateName: string): boolean {
        return this.selectedStates.includes(stateName);
    }

    /**
     * Destroy the chart instance
     */
    public destroy(): void {
        if (this.chart) {
            this.chart.destroy();
            this.chart = null;
        }
    }

    /**
     * Get the Chart.js instance (for advanced operations)
     */
    public getChartInstance(): Chart | null {
        return this.chart;
    }

    /**
     * Generate HTML legend items for the current datasets
     */
    public generateLegendItems(): LegendItem[] {
        if (!this.chart) return [];

        return this.chart.data.datasets.map((dataset, index) => {
            let hidden = false;
            try {
                // Check if isDatasetVisible method exists and use it
                if (this.chart && typeof this.chart.isDatasetVisible === 'function') {
                    hidden = !this.chart.isDatasetVisible(index);
                } else {
                    // Fallback: check dataset meta if available
                    const meta = this.chart?.getDatasetMeta?.(index);
                    hidden = meta?.hidden === true;
                }
            } catch (error) {
                // If there's an error, assume dataset is visible
                hidden = false;
            }
            
            return {
                label: dataset.label || `Dataset ${index + 1}`,
                color: dataset.borderColor as string || this.colorPalette[index % this.colorPalette.length],
                hidden,
                datasetIndex: index
            };
        });
    }

    /**
     * Toggle dataset visibility (for HTML legend clicks)
     */
    public toggleDatasetVisibility(datasetIndex: number): void {
        if (!this.chart) return;

        try {
            const meta = this.chart.getDatasetMeta(datasetIndex);
            const isCurrentlyHidden = meta.hidden === true;
            (meta as any).hidden = isCurrentlyHidden ? null : true;
            this.chart.update();
        } catch (error) {
            console.warn('Failed to toggle dataset visibility:', error);
        }
    }

    /**
     * Register callback for legend updates
     */
    public onLegendUpdate(callback: () => void): void {
        this.legendUpdateCallback = callback;
    }

    private legendUpdateCallback?: () => void;

    /**
     * Trigger legend update callback
     */
    private triggerLegendUpdate(): void {
        if (this.legendUpdateCallback) {
            this.legendUpdateCallback();
        }
    }
}