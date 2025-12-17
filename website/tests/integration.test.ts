/**
 * Integration Tests for Mountain Taxes
 * 
 * These tests verify end-to-end functionality of the complete application
 * including component integration, routing, and user workflows.
 */

// Mock Chart.js for integration tests
const mockChart = {
    register: jest.fn(),
    Chart: jest.fn().mockImplementation(() => ({
        destroy: jest.fn(),
        update: jest.fn(),
        data: { datasets: [] },
        options: {}
    }))
};

// Mock global Chart
(global as any).Chart = mockChart.Chart;

// Set up DOM environment
const setupDOM = () => {
    document.body.innerHTML = `
        <div id="app">
            <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
                <div class="container">
                    <a class="navbar-brand router-link" href="#/">Mountain Taxes</a>
                </div>
            </nav>
            <div class="container mt-4">
                <div id="main-content">
                    <div class="text-center">
                        <div class="spinner-border" role="status">
                            <span class="visually-hidden">Loading...</span>
                        </div>
                        <p class="mt-2">Loading Mountain Taxes...</p>
                    </div>
                </div>
            </div>
        </div>
    `;
};

// Mock canvas context
HTMLCanvasElement.prototype.getContext = jest.fn(() => ({
    fillRect: jest.fn(),
    clearRect: jest.fn(),
    getImageData: jest.fn(() => ({ data: new Array(4) })),
    putImageData: jest.fn(),
    createImageData: jest.fn(() => ({ data: new Array(4) })),
    setTransform: jest.fn(),
    drawImage: jest.fn(),
    save: jest.fn(),
    fillText: jest.fn(),
    restore: jest.fn(),
    beginPath: jest.fn(),
    moveTo: jest.fn(),
    lineTo: jest.fn(),
    closePath: jest.fn(),
    stroke: jest.fn(),
    translate: jest.fn(),
    scale: jest.fn(),
    rotate: jest.fn(),
    arc: jest.fn(),
    fill: jest.fn(),
    measureText: jest.fn(() => ({ width: 0 })),
    transform: jest.fn(),
    rect: jest.fn(),
    clip: jest.fn(),
})) as any;

describe('Mountain Taxes - Integration Tests', () => {
    beforeEach(() => {
        // Set up DOM
        setupDOM();
        
        // Clear any existing router state
        if ((global as any).router) {
            delete (global as any).router;
        }
        
        // Reset mocks
        jest.clearAllMocks();
    });

    describe('Data Integrity', () => {
        test('should load state data without errors', async () => {
            // Import state data
            const { STATE_TAX_DATA } = await import('../src/stateData');
            
            expect(STATE_TAX_DATA).toBeDefined();
            expect(Array.isArray(STATE_TAX_DATA)).toBe(true);
            expect(STATE_TAX_DATA.length).toBeGreaterThan(0);
            
            // Verify data structure
            const firstState = STATE_TAX_DATA[0];
            expect(firstState).toHaveProperty('name');
            expect(firstState).toHaveProperty('filingType');
            expect(Array.isArray(firstState.filingType)).toBe(true);
        });

        test('should validate tax calculations', async () => {
            const { calculateTax } = await import('../src/taxCalculator');
            const { FilingTypeName } = await import('../src/types');
            
            // Test basic calculation
            expect(() => calculateTax(50000, 'Colorado', FilingTypeName.Single)).not.toThrow();
            
            // Test invalid state handling
            expect(() => calculateTax(50000, 'InvalidState', FilingTypeName.Single)).toThrow();
        });
    });

    describe('Build Integration', () => {
        test('should have proper module structure', async () => {
            // Verify all main modules can be imported
            await expect(import('../src/chartComponent')).resolves.toBeDefined();
            await expect(import('../src/stateSelector')).resolves.toBeDefined();
            await expect(import('../src/incomeRangeControls')).resolves.toBeDefined();
            await expect(import('../src/router')).resolves.toBeDefined();
            await expect(import('../src/taxCalculator')).resolves.toBeDefined();
            await expect(import('../src/stateData')).resolves.toBeDefined();
            await expect(import('../src/validation')).resolves.toBeDefined();
            await expect(import('../src/types')).resolves.toBeDefined();
        });

        test('should export required interfaces', async () => {
            const types = await import('../src/types');
            
            expect(types.FilingTypeName).toBeDefined();
            expect(types.FilingTypeName.Single).toBe('Single');
            expect(types.FilingTypeName.Married).toBe('Married');
        });
    });

    describe('Component Integration', () => {
        test('should create TaxChart component without errors', async () => {
            // Add canvas element to DOM
            const canvas = document.createElement('canvas');
            canvas.id = 'test-chart';
            document.body.appendChild(canvas);
            
            const { TaxChart } = await import('../src/chartComponent');
            
            // Should create without throwing
            expect(() => new TaxChart('test-chart')).not.toThrow();
        });

        test('should create StateSelector component without errors', async () => {
            // Add container element to DOM
            const container = document.createElement('div');
            container.id = 'test-container';
            document.body.appendChild(container);
            
            // Add canvas for chart
            const canvas = document.createElement('canvas');
            canvas.id = 'test-chart';
            document.body.appendChild(canvas);
            
            const { StateSelector } = await import('../src/stateSelector');
            const { TaxChart } = await import('../src/chartComponent');
            
            const chart = new TaxChart('test-chart');
            
            // Should create without throwing
            expect(() => new StateSelector('test-container', chart)).not.toThrow();
        });

        test('should create IncomeRangeControls component without errors', async () => {
            // Add container element to DOM
            const container = document.createElement('div');
            container.id = 'test-container';
            document.body.appendChild(container);
            
            // Add canvas for chart
            const canvas = document.createElement('canvas');
            canvas.id = 'test-chart';
            document.body.appendChild(canvas);
            
            const { IncomeRangeControls } = await import('../src/incomeRangeControls');
            const { TaxChart } = await import('../src/chartComponent');
            
            const chart = new TaxChart('test-chart');
            
            // Should create without throwing
            expect(() => new IncomeRangeControls('test-container', chart)).not.toThrow();
        });

        test('should create Router component without errors', async () => {
            const { Router } = await import('../src/router');
            
            // Should create without throwing
            expect(() => new Router()).not.toThrow();
        });

        test('should create HtmlLegend component without errors', async () => {
            // Add container element to DOM
            const container = document.createElement('div');
            container.id = 'test-legend-container';
            document.body.appendChild(container);
            
            // Add canvas for chart
            const canvas = document.createElement('canvas');
            canvas.id = 'test-chart';
            document.body.appendChild(canvas);
            
            const { HtmlLegend } = await import('../src/htmlLegend');
            const { TaxChart } = await import('../src/chartComponent');
            
            const chart = new TaxChart('test-chart');
            
            // Should create without throwing
            expect(() => new HtmlLegend('test-legend-container', chart)).not.toThrow();
        });

        test('should integrate chart and HTML legend components', async () => {
            // Setup DOM elements
            const chartCanvas = document.createElement('canvas');
            chartCanvas.id = 'integration-chart';
            document.body.appendChild(chartCanvas);
            
            const legendContainer = document.createElement('div');
            legendContainer.id = 'integration-legend';
            document.body.appendChild(legendContainer);
            
            const { TaxChart } = await import('../src/chartComponent');
            const { HtmlLegend } = await import('../src/htmlLegend');
            
            // Create components
            const chart = new TaxChart('integration-chart');
            new HtmlLegend('integration-legend', chart);
            
            // Test integration
            chart.addState('Colorado');
            
            // Legend should show all states by default
            const legendItems = legendContainer.querySelectorAll('.legend-item');
            expect(legendItems.length).toBeGreaterThan(0);
            
            // Legend should show Colorado as selected (not unselected)
            const coloradoLegend = Array.from(legendItems).find(item => 
                item.querySelector('.legend-label')?.textContent === 'Colorado'
            );
            expect(coloradoLegend).toBeTruthy();
            expect(coloradoLegend).not.toHaveClass('legend-item-unselected');
        });
    });

    describe('Accessibility', () => {
        test('should have proper ARIA attributes in DOM', () => {
            setupDOM();
            
            // Check for loading spinner accessibility
            const spinner = document.querySelector('.spinner-border');
            expect(spinner).toBeTruthy();
            
            const visuallyHidden = document.querySelector('.visually-hidden');
            expect(visuallyHidden).toBeTruthy();
            expect(visuallyHidden?.textContent).toBe('Loading...');
        });

        test('should have semantic navigation structure', () => {
            setupDOM();
            
            const navbar = document.querySelector('nav.navbar');
            expect(navbar).toBeTruthy();
            
            const brandLink = document.querySelector('.navbar-brand');
            expect(brandLink).toBeTruthy();
            expect(brandLink?.textContent).toBe('Mountain Taxes');
        });
    });

    describe('Error Handling', () => {
        test('should handle missing canvas element gracefully', async () => {
            const { TaxChart } = await import('../src/chartComponent');
            
            // Should throw for missing canvas (this is expected behavior)
            expect(() => new TaxChart('nonexistent-canvas')).toThrow('Canvas element with id \'nonexistent-canvas\' not found');
        });

        test('should handle invalid state data gracefully', async () => {
            const { calculateTax } = await import('../src/taxCalculator');
            const { FilingTypeName } = await import('../src/types');
            
            // Should throw for invalid state
            expect(() => calculateTax(50000, 'InvalidState', FilingTypeName.Single)).toThrow('State not found: InvalidState');
            
            // Should throw for invalid filing type
            expect(() => calculateTax(50000, 'Colorado', 'InvalidType' as any)).toThrow();
        });
    });

    describe('End-to-End Workflow', () => {
        test('should support complete tax calculation workflow', async () => {
            // Import required modules
            const { calculateTax, calculateTaxForIncomes } = await import('../src/taxCalculator');
            const { STATE_TAX_DATA } = await import('../src/stateData');
            const { FilingTypeName } = await import('../src/types');
            
            // Get a valid state
            const testState = STATE_TAX_DATA[0];
            
            // Calculate tax for single income
            const singleTax = calculateTax(50000, testState.name, FilingTypeName.Single);
            expect(singleTax).toHaveProperty('income', 50000);
            expect(singleTax).toHaveProperty('taxOwed');
            expect(singleTax).toHaveProperty('effectiveRate');
            expect(singleTax).toHaveProperty('marginalRate');
            
            // Calculate tax for income range
            const incomes = [10000, 20000, 30000, 40000, 50000];
            const taxResults = calculateTaxForIncomes(incomes, testState.name, FilingTypeName.Single);
            
            expect(taxResults).toHaveLength(incomes.length);
            expect(taxResults[0]).toBe(calculateTax(10000, testState.name, FilingTypeName.Single).taxOwed);
        });

        test('should support chart data generation workflow', async () => {
            // Add canvas element
            const canvas = document.createElement('canvas');
            canvas.id = 'test-chart';
            document.body.appendChild(canvas);
            
            const { TaxChart } = await import('../src/chartComponent');
            const { STATE_TAX_DATA } = await import('../src/stateData');
            
            const chart = new TaxChart('test-chart');
            const testState = STATE_TAX_DATA[0];
            
            // Should be able to add state data
            expect(() => chart.addState(testState.name)).not.toThrow();
            
            // Should be able to remove state data
            expect(() => chart.removeState(testState.name)).not.toThrow();
            
            // Should be able to toggle state
            expect(() => chart.toggleState(testState.name)).not.toThrow();
        });
    });
});