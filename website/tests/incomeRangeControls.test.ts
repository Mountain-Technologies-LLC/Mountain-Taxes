/**
 * Mountain Taxes - Income Range Step Controls Tests
 * 
 * This file contains unit tests for the Income Range Controls component
 * with step-by functionality and base income configuration.
 */

import { IncomeRangeControls } from '../src/incomeRangeControls';
import { TaxChart } from '../src/chartComponent';
import { StepControlConfig } from '../src/types';

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
        } as unknown as CanvasRenderingContext2D;
        
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
            
            // Verify step size radio buttons are rendered
            expect(document.getElementById('step-1k')).toBeTruthy();
            expect(document.getElementById('step-10k')).toBeTruthy();
            expect(document.getElementById('step-100k')).toBeTruthy();
            expect(document.getElementById('step-1m')).toBeTruthy();
            expect(document.getElementById('step-10m')).toBeTruthy();
            expect(document.getElementById('step-100m')).toBeTruthy();
            
            // Verify step count controls are rendered
            expect(document.getElementById('step-count')).toBeTruthy();
            expect(document.getElementById('step-count-minus')).toBeTruthy();
            expect(document.getElementById('step-count-plus')).toBeTruthy();
            
            // Verify base income input is rendered
            expect(document.getElementById('base-income')).toBeTruthy();
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

        test('should have default configuration', () => {
            const controls = new IncomeRangeControls('test-controls', taxChart);
            const config = controls.getConfig();
            
            expect(config.stepSize).toBe(10000); // 10k default
            expect(config.stepCount).toBe(10);   // 10 steps default
            expect(config.baseIncome).toBe(0);   // $0 base default
        });

        test('should have 10k step selected by default', () => {
            new IncomeRangeControls('test-controls', taxChart);
            
            const step10kInput = document.getElementById('step-10k') as HTMLInputElement;
            expect(step10kInput.checked).toBe(true);
        });

        test('should have default step count of 10', () => {
            new IncomeRangeControls('test-controls', taxChart);
            
            const stepCountInput = document.getElementById('step-count') as HTMLInputElement;
            expect(stepCountInput.value).toBe('10');
        });

        test('should have default base income of 0', () => {
            new IncomeRangeControls('test-controls', taxChart);
            
            const baseIncomeInput = document.getElementById('base-income') as HTMLInputElement;
            expect(baseIncomeInput.value).toBe('0');
        });
    });

    describe('Step Size Selection', () => {
        let controls: IncomeRangeControls;

        beforeEach(() => {
            controls = new IncomeRangeControls('test-controls', taxChart);
        });

        test('should change step size when different radio button is selected', () => {
            const step1kInput = document.getElementById('step-1k') as HTMLInputElement;
            const step100kInput = document.getElementById('step-100k') as HTMLInputElement;
            
            // Select 1k step
            step1kInput.checked = true;
            step1kInput.dispatchEvent(new Event('change'));
            
            expect(controls.getConfig().stepSize).toBe(1000);
            
            // Select 100k step
            step100kInput.checked = true;
            step100kInput.dispatchEvent(new Event('change'));
            
            expect(controls.getConfig().stepSize).toBe(100000);
        });

        test('should update chart when step size changes', () => {
            const step1mInput = document.getElementById('step-1m') as HTMLInputElement;
            
            step1mInput.checked = true;
            step1mInput.dispatchEvent(new Event('change'));
            
            const range = taxChart.getIncomeRange();
            expect(range.step).toBe(1000000);
            expect(range.max).toBe(10000000); // 10 steps * 1m = 10m
        });

        test('should update range info when step size changes', () => {
            const step100kInput = document.getElementById('step-100k') as HTMLInputElement;
            
            step100kInput.checked = true;
            step100kInput.dispatchEvent(new Event('change'));
            
            const rangeInfo = document.getElementById('range-info');
            expect(rangeInfo?.textContent).toContain('Current range: $0 - $1.0M'); // 10 steps * 100k = 1m
        });
    });

    describe('Step Count Controls', () => {
        let controls: IncomeRangeControls;

        beforeEach(() => {
            controls = new IncomeRangeControls('test-controls', taxChart);
        });

        test('should increase step count when plus button is clicked', () => {
            const stepCountPlus = document.getElementById('step-count-plus') as HTMLButtonElement;
            const stepCountInput = document.getElementById('step-count') as HTMLInputElement;
            
            stepCountPlus.click();
            
            expect(controls.getConfig().stepCount).toBe(11);
            expect(stepCountInput.value).toBe('11');
        });

        test('should decrease step count when minus button is clicked', () => {
            const stepCountMinus = document.getElementById('step-count-minus') as HTMLButtonElement;
            const stepCountInput = document.getElementById('step-count') as HTMLInputElement;
            
            stepCountMinus.click();
            
            expect(controls.getConfig().stepCount).toBe(9);
            expect(stepCountInput.value).toBe('9');
        });

        test('should not decrease step count below 1', () => {
            const stepCountMinus = document.getElementById('step-count-minus') as HTMLButtonElement;
            
            // Set to 1 first
            controls.setConfig({ stepCount: 1 });
            
            // Try to decrease below 1
            stepCountMinus.click();
            
            expect(controls.getConfig().stepCount).toBe(1);
        });

        test('should not increase step count above 100', () => {
            const stepCountPlus = document.getElementById('step-count-plus') as HTMLButtonElement;
            
            // Set to 100 first
            controls.setConfig({ stepCount: 100 });
            
            // Try to increase above 100
            stepCountPlus.click();
            
            expect(controls.getConfig().stepCount).toBe(100);
        });

        test('should update chart when step count changes', () => {
            const stepCountInput = document.getElementById('step-count') as HTMLInputElement;
            
            stepCountInput.value = '20';
            stepCountInput.dispatchEvent(new Event('input'));
            
            const range = taxChart.getIncomeRange();
            expect(range.max).toBe(200000); // 20 steps * 10k = 200k
        });

        test('should handle direct input in step count field', () => {
            const stepCountInput = document.getElementById('step-count') as HTMLInputElement;
            
            stepCountInput.value = '15';
            stepCountInput.dispatchEvent(new Event('input'));
            
            expect(controls.getConfig().stepCount).toBe(15);
        });
    });

    describe('Base Income Controls', () => {
        let controls: IncomeRangeControls;

        beforeEach(() => {
            controls = new IncomeRangeControls('test-controls', taxChart);
        });

        test('should update base income when input changes', () => {
            const baseIncomeInput = document.getElementById('base-income') as HTMLInputElement;
            
            baseIncomeInput.value = '50000';
            baseIncomeInput.dispatchEvent(new Event('input'));
            
            expect(controls.getConfig().baseIncome).toBe(50000);
        });

        test('should update chart when base income changes', () => {
            const baseIncomeInput = document.getElementById('base-income') as HTMLInputElement;
            
            baseIncomeInput.value = '25000';
            baseIncomeInput.dispatchEvent(new Event('input'));
            
            const range = taxChart.getIncomeRange();
            expect(range.min).toBe(25000);
            expect(range.max).toBe(125000); // 25k base + (10 steps * 10k) = 125k
        });

        test('should update range info when base income changes', () => {
            const baseIncomeInput = document.getElementById('base-income') as HTMLInputElement;
            
            baseIncomeInput.value = '30000';
            baseIncomeInput.dispatchEvent(new Event('input'));
            
            const rangeInfo = document.getElementById('range-info');
            expect(rangeInfo?.textContent).toContain('Current range: $30K - $130K');
        });

        test('should handle zero base income', () => {
            const baseIncomeInput = document.getElementById('base-income') as HTMLInputElement;
            
            baseIncomeInput.value = '0';
            baseIncomeInput.dispatchEvent(new Event('input'));
            
            expect(controls.getConfig().baseIncome).toBe(0);
            
            const range = taxChart.getIncomeRange();
            expect(range.min).toBe(0);
        });

        test('should not allow negative base income', () => {
            const baseIncomeInput = document.getElementById('base-income') as HTMLInputElement;
            
            baseIncomeInput.value = '-1000';
            baseIncomeInput.dispatchEvent(new Event('input'));
            
            // Should default to 0 for negative values
            expect(controls.getConfig().baseIncome).toBe(0);
        });
    });

    describe('Configuration Management', () => {
        let controls: IncomeRangeControls;

        beforeEach(() => {
            controls = new IncomeRangeControls('test-controls', taxChart);
        });

        test('should get current configuration', () => {
            const config = controls.getConfig();
            
            expect(config).toEqual({
                stepSize: 10000,
                stepCount: 10,
                baseIncome: 0
            });
        });

        test('should set configuration and update UI', () => {
            const newConfig: StepControlConfig = {
                stepSize: 100000,
                stepCount: 5,
                baseIncome: 50000
            };
            
            controls.setConfig(newConfig);
            
            const config = controls.getConfig();
            expect(config).toEqual(newConfig);
            
            // Check UI updates
            const step100kInput = document.getElementById('step-100k') as HTMLInputElement;
            const stepCountInput = document.getElementById('step-count') as HTMLInputElement;
            const baseIncomeInput = document.getElementById('base-income') as HTMLInputElement;
            
            expect(step100kInput.checked).toBe(true);
            expect(stepCountInput.value).toBe('5');
            expect(baseIncomeInput.value).toBe('50000');
        });

        test('should partially update configuration', () => {
            controls.setConfig({ stepCount: 15 });
            
            const config = controls.getConfig();
            expect(config.stepCount).toBe(15);
            expect(config.stepSize).toBe(10000); // Should remain unchanged
            expect(config.baseIncome).toBe(0);   // Should remain unchanged
        });

        test('should refresh controls correctly', () => {
            // Change configuration programmatically
            controls.setConfig({
                stepSize: 1000000,
                stepCount: 5,
                baseIncome: 100000
            });
            
            // Refresh should update range info
            controls.refresh();
            
            const rangeInfo = document.getElementById('range-info');
            expect(rangeInfo?.textContent).toContain('Current range: $100K - $5.1M'); // 100k + (5 * 1m) = 5.1m
        });
    });

    describe('Integration Tests', () => {
        let controls: IncomeRangeControls;

        beforeEach(() => {
            controls = new IncomeRangeControls('test-controls', taxChart);
        });

        test('should handle complex configuration changes', () => {
            // Change step size to 100k
            const step100kInput = document.getElementById('step-100k') as HTMLInputElement;
            step100kInput.checked = true;
            step100kInput.dispatchEvent(new Event('change'));
            
            // Change step count to 20
            const stepCountInput = document.getElementById('step-count') as HTMLInputElement;
            stepCountInput.value = '20';
            stepCountInput.dispatchEvent(new Event('input'));
            
            // Change base income to 50k
            const baseIncomeInput = document.getElementById('base-income') as HTMLInputElement;
            baseIncomeInput.value = '50000';
            baseIncomeInput.dispatchEvent(new Event('input'));
            
            // Verify final configuration
            const config = controls.getConfig();
            expect(config.stepSize).toBe(100000);
            expect(config.stepCount).toBe(20);
            expect(config.baseIncome).toBe(50000);
            
            // Verify chart range
            const range = taxChart.getIncomeRange();
            expect(range.min).toBe(50000);
            expect(range.max).toBe(2050000); // 50k + (20 * 100k) = 2.05m
            expect(range.step).toBe(100000);
        });

        test('should maintain consistency between UI and configuration', () => {
            // Make multiple changes
            controls.setConfig({ stepSize: 1000, stepCount: 50, baseIncome: 10000 });
            
            // Verify UI reflects configuration
            const step1kInput = document.getElementById('step-1k') as HTMLInputElement;
            const stepCountInput = document.getElementById('step-count') as HTMLInputElement;
            const baseIncomeInput = document.getElementById('base-income') as HTMLInputElement;
            
            expect(step1kInput.checked).toBe(true);
            expect(stepCountInput.value).toBe('50');
            expect(baseIncomeInput.value).toBe('10000');
            
            // Verify range info
            const rangeInfo = document.getElementById('range-info');
            expect(rangeInfo?.textContent).toContain('Current range: $10K - $60K'); // 10k + (50 * 1k) = 60k
        });
    });

    describe('Currency Formatting', () => {
        test('should format currency values correctly in range display', () => {
            const controls = new IncomeRangeControls('test-controls', taxChart);
            
            // Test different range values
            controls.setConfig({ stepSize: 1000, stepCount: 5, baseIncome: 0 });
            let rangeInfo = document.getElementById('range-info');
            expect(rangeInfo?.textContent).toContain('$5,000');
            
            controls.setConfig({ stepSize: 10000, stepCount: 5, baseIncome: 0 });
            rangeInfo = document.getElementById('range-info');
            expect(rangeInfo?.textContent).toContain('$50K');
            
            controls.setConfig({ stepSize: 1000000, stepCount: 2, baseIncome: 0 });
            rangeInfo = document.getElementById('range-info');
            expect(rangeInfo?.textContent).toContain('$2.0M');
        });
    });
});