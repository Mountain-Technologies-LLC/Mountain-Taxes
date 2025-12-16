/**
 * Mountain Taxes Calculator - Main Application Entry Point
 * 
 * This TypeScript application provides interactive visualization of state income tax obligations
 * using Chart.js and Bootstrap v5.3 with Bootswatch Brite theme.
 */

// Import Chart.js and register components
import { Chart, registerables } from 'chart.js';
import { TaxChart } from './chartComponent';
import { StateSelector } from './stateSelector';
import { IncomeRangeControls } from './incomeRangeControls';

// Register Chart.js components
Chart.register(...registerables);

/**
 * Application initialization
 */
class MountainTaxesApp {
    private taxChart: TaxChart | null = null;
    private stateSelector: StateSelector | null = null;
    private incomeRangeControls: IncomeRangeControls | null = null;

    constructor() {
        this.init();
    }

    private init(): void {
        console.log('Mountain Taxes Calculator initializing...');
        
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.render());
        } else {
            this.render();
        }
    }

    private render(): void {
        const mainContent = document.getElementById('main-content');
        if (!mainContent) {
            console.error('Main content container not found');
            return;
        }

        // Render the main application interface
        mainContent.innerHTML = `
            <div class="row">
                <div class="col-12">
                    <h1 class="mb-4">Mountain Taxes Calculator</h1>
                    <p class="lead">Compare state income tax obligations across different income levels</p>
                </div>
            </div>
            
            <div class="row mb-4">
                <div class="col-12">
                    <div class="card">
                        <div class="card-header">
                            <h5 class="card-title mb-0">Tax Comparison Chart</h5>
                        </div>
                        <div class="card-body">
                            <div class="chart-container">
                                <canvas id="tax-chart"></canvas>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="row mb-4">
                <div class="col-12">
                    <div class="card">
                        <div class="card-header">
                            <h5 class="card-title mb-0">Income Range Controls</h5>
                        </div>
                        <div class="card-body">
                            <div id="income-range-controls">
                                <!-- Income range controls will be rendered here -->
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="row">
                <div class="col-12">
                    <div class="card">
                        <div class="card-header">
                            <h5 class="card-title mb-0">State Selection</h5>
                        </div>
                        <div class="card-body">
                            <div id="state-selector-container">
                                <!-- State selector will be rendered here -->
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        this.initializeComponents();
        console.log('Mountain Taxes Calculator initialized successfully');
    }

    /**
     * Initialize chart and state selector components
     */
    private initializeComponents(): void {
        try {
            // Initialize the tax chart
            this.taxChart = new TaxChart('tax-chart');
            
            // Initialize the income range controls
            this.incomeRangeControls = new IncomeRangeControls('income-range-controls', this.taxChart);
            
            // Initialize the state selector
            this.stateSelector = new StateSelector('state-selector-container', this.taxChart);
            
            console.log('Components initialized successfully');
        } catch (error) {
            console.error('Error initializing components:', error);
            this.showError('Failed to initialize application components. Please refresh the page.');
        }
    }

    /**
     * Show error message to user
     */
    private showError(message: string): void {
        const mainContent = document.getElementById('main-content');
        if (mainContent) {
            mainContent.innerHTML = `
                <div class="row">
                    <div class="col-12">
                        <div class="alert alert-danger" role="alert">
                            <h4 class="alert-heading">Error</h4>
                            <p>${message}</p>
                        </div>
                    </div>
                </div>
            `;
        }
    }

    /**
     * Get the tax chart instance
     */
    public getTaxChart(): TaxChart | null {
        return this.taxChart;
    }

    /**
     * Get the state selector instance
     */
    public getStateSelector(): StateSelector | null {
        return this.stateSelector;
    }

    /**
     * Get the income range controls instance
     */
    public getIncomeRangeControls(): IncomeRangeControls | null {
        return this.incomeRangeControls;
    }
}

// Initialize the application
new MountainTaxesApp();