/**
 * Mountain Taxes - Main Application Entry Point
 * 
 * This TypeScript application provides interactive visualization of state earned income tax obligations
 * using Chart.js and Bootstrap v5.3 with Bootswatch Brite theme.
 */

// Import Chart.js and register components
import { Chart, registerables } from 'chart.js';
import { TaxChart } from './chartComponent';
import { StateSelector } from './stateSelector';
import { IncomeRangeControls } from './incomeRangeControls';
import { HtmlLegend } from './htmlLegend';
import { FilerDetails } from './filerDetails';
import { Router, StateDetailView } from './router';
import { Navbar } from './navbar';
import { LocationService } from './locationService';
import { ToastService } from './toastService';
// STATE_TAX_DATA is used by the router component

// Register Chart.js components
Chart.register(...registerables);

/**
 * Application initialization
 */
class MountainTaxesApp {
    private taxChart: TaxChart | null = null;
    private stateSelector: StateSelector | null = null;
    private incomeRangeControls: IncomeRangeControls | null = null;
    private htmlLegend: HtmlLegend | null = null;
    private filerDetails: FilerDetails | null = null;
    private navbar: Navbar | null = null;
    private router: Router;
    private stateDetailView: StateDetailView;
    private locationService: LocationService;
    private toastService: ToastService;

    constructor() {
        this.router = new Router();
        this.stateDetailView = new StateDetailView('main-content');
        this.locationService = new LocationService();
        this.toastService = new ToastService();
        
        // Make router globally available for router links
        window.router = this.router;
        
        this.init();
    }

    private init(): void {
        console.log('Mountain Taxes initializing...');
        
        // Set up routes
        this.setupRoutes();
        
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupApplication());
        } else {
            this.setupApplication();
        }
    }

    /**
     * Set up application routes
     */
    private setupRoutes(): void {
        // Home route - main chart view
        this.router.addRoute('', () => this.renderMainView());
        this.router.addRoute('home', () => this.renderMainView());
        this.router.addRoute('#/', () => this.renderMainView());
        
        // State detail routes
        this.router.addRoute('state/:stateName', (params) => {
            this.renderStateDetail(params.stateName);
        });
        this.router.addRoute('#/state/:stateName', (params) => {
            this.renderStateDetail(params.stateName);
        });
    }

    /**
     * Setup application after DOM is ready
     */
    private setupApplication(): void {
        // Initialize navbar component
        this.initializeNavbar();
        
        // Add global router link handler for navbar
        this.setupGlobalRouterLinks();
        
        // Start the router to handle initial route
        this.router.start();
        
        console.log('Mountain Taxes initialized successfully');
    }

    /**
     * Initialize navbar component
     */
    private initializeNavbar(): void {
        try {
            this.navbar = new Navbar('states-dropdown-content', this.router);
            console.log('Navbar initialized successfully');
        } catch (error) {
            console.error('Error initializing navbar:', error);
        }
    }

    /**
     * Setup global router link handlers
     */
    private setupGlobalRouterLinks(): void {
        // Handle navbar router links
        document.addEventListener('click', (event) => {
            const target = event.target as HTMLElement;
            if (target.classList.contains('router-link') || target.closest('.router-link')) {
                event.preventDefault();
                const link = target.classList.contains('router-link') ? target : target.closest('.router-link');
                const href = (link as HTMLAnchorElement).getAttribute('href');
                if (href && this.router) {
                    this.router.navigate(href);
                }
            }
        });
    }

    /**
     * Render the main chart view
     */
    private renderMainView(): void {
        const mainContent = document.getElementById('main-content');
        if (!mainContent) {
            console.error('Main content container not found');
            return;
        }

        // Render the main application interface with enhanced responsive design and SEO optimization
        mainContent.innerHTML = `
            <article>
                <header class="row">
                    <div class="col-12">
                        <div class="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4">
                            <div>
                                <h1 class="mb-2 mb-md-0">State Income Taxes—On Earned Income</h1>
                                <p class="lead mb-0">Compare state earned income tax obligations across different income levels for all 50 US states</p>
                                <p class="text-muted small mt-2 mb-0">Interactive tax calculator and visualization tool for informed financial planning</p>
                            </div>
                        </div>
                    </div>
                </header>
                
                <section class="row mb-4" aria-labelledby="filer-details-heading">
                    <div class="col-12">
                        <div id="filer-details-container">
                            <!-- Filer Details will be rendered here -->
                        </div>
                    </div>
                </section>
                
                <section class="row mb-4" aria-labelledby="chart-heading">
                    <div class="col-12">
                        <div class="card">
                            <div class="card-header bg-primary">
                                <h2 id="chart-heading" class="card-title mb-0 h5">
                                    <i class="fas fa-chart-line me-2" aria-hidden="true"></i>
                                    Interactive Tax Comparison Chart
                                </h2>
                            </div>
                            <div class="card-body p-3">
                                <div class="chart-container">
                                    <canvas id="tax-chart" role="img" aria-label="Interactive tax comparison chart showing tax obligations across income levels for selected states" aria-describedby="chart-description"></canvas>
                                    <div id="chart-description" class="visually-hidden">
                                        This interactive chart displays state income tax obligations across different income levels. 
                                        Select states from the dropdown menu to compare their tax rates and obligations. 
                                        The chart updates in real-time as you modify income ranges and state selections.
                                    </div>
                                </div>
                                <div id="chart-legend-container" role="region" aria-label="Chart legend">
                                    <!-- HTML Legend will be rendered here -->
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                
                <section class="row mb-4">
                    <div class="col-12 mb-3">
                        <div class="card">
                            <div class="card-header bg-primary">
                                <h2 class="card-title mb-0 h5" id="income-controls-heading">
                                    <i class="fas fa-sliders-h me-2" aria-hidden="true"></i>
                                    Income Range Controls
                                </h2>
                            </div>
                            <div class="card-body">
                                <div id="income-range-controls" role="region" aria-labelledby="income-controls-heading">
                                    <!-- Income range controls will be rendered here -->
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="col-12">
                        <div class="card">
                            <div class="card-header bg-primary">
                                <h2 class="card-title mb-0 h5" id="state-selection-heading">
                                    <i class="fas fa-map-marker-alt me-2" aria-hidden="true"></i>
                                    State Selection
                                </h2>
                            </div>
                            <div class="card-body">
                                <div id="state-selector-container" role="region" aria-labelledby="state-selection-heading">
                                    <!-- State selector will be rendered here -->
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section class="row mb-4" aria-labelledby="data-source-heading">
                    <div class="col-12">
                        <div class="card">
                            <div class="card-body text-center text-muted">
                                <h3 id="data-source-heading" class="visually-hidden">Data Source Information</h3>
                                <small>
                                    Tax data sourced from <a href="https://taxfoundation.org/data/all/state/state-income-tax-rates/" target="_blank" rel="noopener noreferrer" aria-label="View Tax Foundation 2025 state income tax rates data">Tax Foundation 2025</a> state income tax rates. 
                                    Data includes current tax brackets, rates, and standard deductions for accurate tax obligation calculations.
                                </small>
                            </div>
                        </div>
                    </div>
                </section>
            </article>
        `;

        this.initializeComponents();
    }

    /**
     * Render state detail view
     */
    private renderStateDetail(stateName: string): void {
        this.stateDetailView.render(stateName);
    }

    /**
     * Initialize chart and state selector components
     */
    private async initializeComponents(): Promise<void> {
        try {
            // Initialize the tax chart
            this.taxChart = new TaxChart('tax-chart');
            
            // Initialize the filer details
            this.filerDetails = new FilerDetails('filer-details-container', this.taxChart);
            
            // Initialize the HTML legend
            this.htmlLegend = new HtmlLegend('chart-legend-container', this.taxChart);
            
            // Initialize the income range controls
            this.incomeRangeControls = new IncomeRangeControls('income-range-controls', this.taxChart);
            
            // Initialize the state selector
            this.stateSelector = new StateSelector('state-selector-container', this.taxChart);
            
            // Apply location-based default state selection
            await this.applyLocationBasedDefaults();
            
            console.log('Components initialized successfully');
        } catch (error) {
            console.error('Error initializing components:', error);
            this.showError('Failed to initialize application components. Please refresh the page.');
        }
    }

    /**
     * Apply location-based default state selection
     */
    private async applyLocationBasedDefaults(): Promise<void> {
        try {
            console.log('Detecting user location for default state selection...');
            
            // Show loading toast
            const loadingToastId = this.toastService.showLocationToast('Detecting your location...', 'info', 0);
            
            const locationResult = await this.locationService.detectLocation();
            const recommendedStates = this.locationService.getRecommendedStates(locationResult);
            const selectionMessage = this.locationService.getSelectionMessage(locationResult);
            
            // Hide loading toast
            this.toastService.hideToast(loadingToastId);
            
            // Apply the recommended state selection
            if (this.stateSelector && recommendedStates.length > 0) {
                this.stateSelector.setSelectedStates(recommendedStates);
            }
            
            // Show success toast with the selection message
            this.toastService.showLocationToast(selectionMessage, 'success', 6000);
            
            console.log('Location-based defaults applied:', {
                locationResult,
                recommendedStates: recommendedStates.length,
                message: selectionMessage
            });
        } catch (error) {
            console.warn('Failed to apply location-based defaults:', error);
            // Don't show error to user, just log it and continue with no selection
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

    /**
     * Get the HTML legend instance
     */
    public getHtmlLegend(): HtmlLegend | null {
        return this.htmlLegend;
    }

    /**
     * Get the navbar instance
     */
    public getNavbar(): Navbar | null {
        return this.navbar;
    }

    /**
     * Get the filer details instance
     */
    public getFilerDetails(): FilerDetails | null {
        return this.filerDetails;
    }

    /**
     * Get the toast service instance
     */
    public getToastService(): ToastService {
        return this.toastService;
    }
}

// Initialize the application
new MountainTaxesApp();