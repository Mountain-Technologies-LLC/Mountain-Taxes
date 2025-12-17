/**
 * Mountain Taxes - Income Range Controls Tests
 * 
 * This file contains unit tests for the Income Range Controls component.
 */

import { IncomeRangeControls } from '../src/incomeRangeControls';
import { TaxChart } from '../src/chartComponent';

// Mock Chart.js
jest.mock('chart.js', () => ({
    Chart: jest.fn().mockImplementation((_ctx, config) => ({
        destroy: jest.fn(),
        update: jest.fn(),
        data: { 
            datasets: [],
            labels: []
        },
        options: config?.options || {
            responsive: true,
            maintainAspectRatio: false
        }
    })),
    registerables: []
}));

describe('IncomeRangeControls Component', () => {
    let mockCanvas: HTMLCanvasElement;
    let mockContext: CanvasRenderingContext2D;
    let taxChart: TaxChart;
    let controlsContainer: HTMLElement;

    beforeEach(() => {
        // Create mock canvas and context
        mockCanvas = document.createElement('canvas');
        mockCanvas.id = 'test-chart';
        mockContext = {
            getContext: jest.fn()
        } as any;
        
        // Mock getContext to return our mock context
        jest.spyOn(mockCanvas, 'getContext').mockReturnValue(mockContext);
        
        // Create controls container
        controlsContainer = document.createElement('div');
        controlsContainer.id = 'test-controls';
        
        // Add elements to document
        document.body.appendChild(mockCanvas);
        document.body.appendChild(controlsContainer);
        
        // Initialize tax chart
        taxChart = new TaxChart('test-chart');
    });

    afterEach(() => {
        // Clean up DOM
        document.body.innerHTML = '';
        jest.clearAllMocks();
        taxChart.destroy();
    });

    describe('Component Initialization', () => {
        test('should initialize controls with correct container', () => {
            const controls = new IncomeRangeControls('test-controls', taxChart);
            expect(controls).toBeDefined();
            
            // Verify buttons are rendered
            expect(document.getElementById('add-10k')).toBeTruthy();
            expect(document.getElementById('add-100k')).toBeTruthy();
            expect(document.getElementById('add-1m')).toBeTruthy();
            expect(document.getElementById('add-10m')).toBeTruthy();
            expect(document.getElementById('remove-data-set')).toBeTruthy();
        });

        test('should throw error if container not found', () => {
            expect(() => new IncomeRangeControls('nonexistent-container', taxChart))
                .toThrow('Container element with id \'nonexistent-container\' not found');
        });

        test('should display initial range information', () => {
            new IncomeRangeControls('test-controls', taxChart);
            
            const rangeInfo = document.getElementById('range-info');
            expect(rangeInfo).toBeTruthy();
            expect(rangeInfo?.textContent).toContain('Current range: $0 - $100K');
        });
    });

    describe('Range Extension Functionality', () => {
        let controls: IncomeRangeControls;

        beforeEach(() => {
            controls = new IncomeRangeControls('test-controls', taxChart);
        });

        test('should extend range by 10k when Add 10k button is clicked', () => {
            const initialRange = taxChart.getIncomeRange();
            const add10kBtn = document.getElementById('add-10k') as HTMLButtonElement;
            
            add10kBtn.click();
            
            const newRange = taxChart.getIncomeRange();
            expect(newRange.max).toBe(initialRange.max + 10000);
            expect(controls.getLastIncrement()).toBe(10000);
        });

        test('should extend range by 100k when Add 100k button is clicked', () => {
            const initialRange = taxChart.getIncomeRange();
            const add100kBtn = document.getElementById('add-100k') as HTMLButtonElement;
            
            add100kBtn.click();
            
            const newRange = taxChart.getIncomeRange();
            expect(newRange.max).toBe(initialRange.max + 100000);
            expect(controls.getLastIncrement()).toBe(100000);
        });

        test('should extend range by 1m when Add 1m button is clicked', () => {
            const initialRange = taxChart.getIncomeRange();
            const add1mBtn = document.getElementById('add-1m') as HTMLButtonElement;
            
            add1mBtn.click();
            
            const newRange = taxChart.getIncomeRange();
            expect(newRange.max).toBe(initialRange.max + 1000000);
            expect(controls.getLastIncrement()).toBe(1000000);
        });

        test('should extend range by 10m when Add 10m button is clicked', () => {
            const initialRange = taxChart.getIncomeRange();
            const add10mBtn = document.getElementById('add-10m') as HTMLButtonElement;
            
            add10mBtn.click();
            
            const newRange = taxChart.getIncomeRange();
            expect(newRange.max).toBe(initialRange.max + 10000000);
            expect(controls.getLastIncrement()).toBe(10000000);
        });

        test('should update range information after extension', () => {
            const add100kBtn = document.getElementById('add-100k') as HTMLButtonElement;
            
            add100kBtn.click();
            
            const rangeInfo = document.getElementById('range-info');
            expect(rangeInfo?.textContent).toContain('Current range: $0 - $200K');
        });

        test('should enable remove button after extension', () => {
            const add10kBtn = document.getElementById('add-10k') as HTMLButtonElement;
            const removeBtn = document.getElementById('remove-data-set') as HTMLButtonElement;
            
            expect(removeBtn.disabled).toBe(true);
            
            add10kBtn.click();
            
            expect(removeBtn.disabled).toBe(false);
        });
    });

    describe('Range Reduction Functionality', () => {
        let controls: IncomeRangeControls;

        beforeEach(() => {
            controls = new IncomeRangeControls('test-controls', taxChart);
        });

        test('should reduce range when Remove data set button is clicked after extension', () => {
            const initialRange = taxChart.getIncomeRange();
            const add50kBtn = document.getElementById('add-100k') as HTMLButtonElement;
            const removeBtn = document.getElementById('remove-data-set') as HTMLButtonElement;
            
            // First extend the range
            add50kBtn.click();
            const extendedRange = taxChart.getIncomeRange();
            expect(extendedRange.max).toBe(initialRange.max + 100000);
            
            // Then reduce it
            removeBtn.click();
            const reducedRange = taxChart.getIncomeRange();
            expect(reducedRange.max).toBe(initialRange.max);
            expect(controls.getLastIncrement()).toBe(0);
        });

        test('should disable remove button after reduction', () => {
            const add10kBtn = document.getElementById('add-10k') as HTMLButtonElement;
            const removeBtn = document.getElementById('remove-data-set') as HTMLButtonElement;
            
            // Extend then reduce
            add10kBtn.click();
            expect(removeBtn.disabled).toBe(false);
            
            removeBtn.click();
            expect(removeBtn.disabled).toBe(true);
        });

        test('should update range information after reduction', () => {
            const add100kBtn = document.getElementById('add-100k') as HTMLButtonElement;
            const removeBtn = document.getElementById('remove-data-set') as HTMLButtonElement;
            
            add100kBtn.click();
            removeBtn.click();
            
            const rangeInfo = document.getElementById('range-info');
            expect(rangeInfo?.textContent).toContain('Current range: $0 - $100K');
        });

        test('should not reduce range if no previous increment exists', () => {
            const initialRange = taxChart.getIncomeRange();
            const removeBtn = document.getElementById('remove-data-set') as HTMLButtonElement;
            
            // Try to remove without any previous increment
            removeBtn.click();
            
            const rangeAfterClick = taxChart.getIncomeRange();
            expect(rangeAfterClick.max).toBe(initialRange.max);
        });
    });

    describe('Multiple Operations', () => {
        let controls: IncomeRangeControls;

        beforeEach(() => {
            controls = new IncomeRangeControls('test-controls', taxChart);
        });

        test('should handle multiple extensions correctly', () => {
            const initialRange = taxChart.getIncomeRange();
            
            // Add 10k
            const add10kBtn = document.getElementById('add-10k') as HTMLButtonElement;
            add10kBtn.click();
            expect(taxChart.getIncomeRange().max).toBe(initialRange.max + 10000);
            expect(controls.getLastIncrement()).toBe(10000);
            
            // Add 100k (should update last increment)
            const add100kBtn = document.getElementById('add-100k') as HTMLButtonElement;
            add100kBtn.click();
            expect(taxChart.getIncomeRange().max).toBe(initialRange.max + 110000);
            expect(controls.getLastIncrement()).toBe(100000);
        });

        test('should only remove the last increment', () => {
            const initialRange = taxChart.getIncomeRange();
            
            // Add 10k then 100k
            const add10kBtn = document.getElementById('add-10k') as HTMLButtonElement;
            const add100kBtn = document.getElementById('add-100k') as HTMLButtonElement;
            const removeBtn = document.getElementById('remove-data-set') as HTMLButtonElement;
            
            add10kBtn.click();
            add100kBtn.click();
            
            // Remove should only remove the 100k (last increment)
            removeBtn.click();
            expect(taxChart.getIncomeRange().max).toBe(initialRange.max + 10000);
        });

        test('should refresh controls correctly', () => {
            // Manually change the chart range
            taxChart.setIncomeRange(0, 500000, 10000);
            
            // Refresh controls
            controls.refresh();
            
            const rangeInfo = document.getElementById('range-info');
            expect(rangeInfo?.textContent).toContain('Current range: $0 - $500K');
        });

        test('should reset last increment correctly', () => {
            const add10kBtn = document.getElementById('add-10k') as HTMLButtonElement;
            const removeBtn = document.getElementById('remove-data-set') as HTMLButtonElement;
            
            add10kBtn.click();
            expect(controls.getLastIncrement()).toBe(10000);
            expect(removeBtn.disabled).toBe(false);
            
            controls.resetLastIncrement();
            expect(controls.getLastIncrement()).toBe(0);
            expect(removeBtn.disabled).toBe(true);
        });
    });

    describe('Currency Formatting', () => {
        test('should format currency values correctly in range display', () => {
            const controls = new IncomeRangeControls('test-controls', taxChart);
            
            // Test different range values
            taxChart.setIncomeRange(0, 5000, 100);
            controls.refresh();
            let rangeInfo = document.getElementById('range-info');
            expect(rangeInfo?.textContent).toContain('$5,000');
            
            taxChart.setIncomeRange(0, 50000, 1000);
            controls.refresh();
            rangeInfo = document.getElementById('range-info');
            expect(rangeInfo?.textContent).toContain('$50K');
            
            taxChart.setIncomeRange(0, 2000000, 10000);
            controls.refresh();
            rangeInfo = document.getElementById('range-info');
            expect(rangeInfo?.textContent).toContain('$2.0M');
        });
    });
});