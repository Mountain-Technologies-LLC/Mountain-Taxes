/**
 * Mountain Taxes - Filer Details Component Tests
 * 
 * Comprehensive test suite for the FilerDetails component including
 * UI rendering, event handling, and integration with TaxChart.
 */

import { FilerDetails } from '../src/filerDetails';
import { TaxChart } from '../src/chartComponent';
import { FilingTypeName } from '../src/types';

// Mock Chart.js
jest.mock('chart.js', () => ({
    Chart: jest.fn().mockImplementation(() => ({
        data: { labels: [], datasets: [] },
        update: jest.fn(),
        destroy: jest.fn(),
        getDatasetMeta: jest.fn(() => ({ hidden: false })),
        isDatasetVisible: jest.fn(() => true)
    })),
    registerables: []
}));

// Mock tax calculator
jest.mock('../src/taxCalculator', () => ({
    calculateTaxForIncomes: jest.fn(() => [100, 200, 300]),
    generateIncomeRange: jest.fn(() => [10000, 20000, 30000])
}));

// Mock state data
jest.mock('../src/stateData', () => ({
    getAllStateNames: jest.fn(() => ['Colorado', 'California', 'Texas'])
}));

describe('FilerDetails Component', () => {
    let container: HTMLElement;
    let mockTaxChart: jest.Mocked<TaxChart>;

    beforeEach(() => {
        // Setup DOM
        document.body.innerHTML = '<div id="test-container"></div>';
        container = document.getElementById('test-container')!;

        // Create mock TaxChart
        mockTaxChart = {
            setFilingType: jest.fn(),
            getFilingType: jest.fn(() => FilingTypeName.Single),
            addState: jest.fn(),
            removeState: jest.fn(),
            toggleState: jest.fn(),
            addAllStates: jest.fn(),
            removeAllStates: jest.fn(),
            setIncomeRange: jest.fn(),
            getIncomeRange: jest.fn(() => ({ min: 0, max: 100000, step: 10000 })),
            getSelectedStates: jest.fn(() => []),
            isStateSelected: jest.fn(() => false),
            extendRange: jest.fn(),
            reduceRange: jest.fn(),
            destroy: jest.fn(),
            getChartInstance: jest.fn(() => null),
            generateLegendItems: jest.fn(() => []),
            toggleDatasetVisibility: jest.fn(),
            onLegendUpdate: jest.fn()
        } as any;
    });

    afterEach(() => {
        document.body.innerHTML = '';
        jest.clearAllMocks();
    });

    describe('Component Initialization', () => {
        test('should render filer details card with inline form and default Single filing type', () => {
            new FilerDetails('test-container');

            const card = container.querySelector('.card');
            expect(card).toBeTruthy();

            const title = container.querySelector('.card-title');
            expect(title?.textContent?.trim()).toBe('Filer Details');

            const form = container.querySelector('.d-flex');
            expect(form).toBeTruthy();

            const label = container.querySelector('.form-label');
            expect(label?.textContent?.trim()).toBe('Filing Type:');

            const singleRadio = container.querySelector('#filing-single') as HTMLInputElement;
            const marriedRadio = container.querySelector('#filing-married') as HTMLInputElement;

            expect(singleRadio).toBeTruthy();
            expect(marriedRadio).toBeTruthy();
            expect(singleRadio.checked).toBe(true);
            expect(marriedRadio.checked).toBe(false);
        });

        test('should render with custom default filing type', () => {
            new FilerDetails('test-container', undefined, { 
                defaultFilingType: FilingTypeName.Married 
            });

            const singleRadio = container.querySelector('#filing-single') as HTMLInputElement;
            const marriedRadio = container.querySelector('#filing-married') as HTMLInputElement;

            expect(singleRadio.checked).toBe(false);
            expect(marriedRadio.checked).toBe(true);
        });

        test('should handle missing container gracefully', () => {
            const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
            
            new FilerDetails('non-existent-container');
            
            expect(consoleSpy).toHaveBeenCalledWith(
                "Container with ID 'non-existent-container' not found"
            );
            
            consoleSpy.mockRestore();
        });
    });

    describe('Filing Type Selection', () => {
        test('should update filing type when Single radio is selected', () => {
            const filerDetails = new FilerDetails('test-container', mockTaxChart, {
                defaultFilingType: FilingTypeName.Married
            });

            const singleRadio = container.querySelector('#filing-single') as HTMLInputElement;
            singleRadio.click();

            expect(filerDetails.getFilingType()).toBe(FilingTypeName.Single);
            expect(mockTaxChart.setFilingType).toHaveBeenCalledWith(FilingTypeName.Single);
        });

        test('should update filing type when Married radio is selected', () => {
            const filerDetails = new FilerDetails('test-container', mockTaxChart);

            const marriedRadio = container.querySelector('#filing-married') as HTMLInputElement;
            marriedRadio.click();

            expect(filerDetails.getFilingType()).toBe(FilingTypeName.Married);
            expect(mockTaxChart.setFilingType).toHaveBeenCalledWith(FilingTypeName.Married);
        });

        test('should not update if same filing type is selected', () => {
            new FilerDetails('test-container', mockTaxChart);

            // Single is already selected by default
            const singleRadio = container.querySelector('#filing-single') as HTMLInputElement;
            singleRadio.click();

            expect(mockTaxChart.setFilingType).not.toHaveBeenCalled();
        });

        test('should call onFilingTypeChange callback when filing type changes', () => {
            const mockCallback = jest.fn();
            new FilerDetails('test-container', mockTaxChart, {
                onFilingTypeChange: mockCallback
            });

            const marriedRadio = container.querySelector('#filing-married') as HTMLInputElement;
            marriedRadio.click();

            expect(mockCallback).toHaveBeenCalledWith(FilingTypeName.Married);
        });
    });

    describe('Public API Methods', () => {
        test('should set filing type programmatically', () => {
            const filerDetails = new FilerDetails('test-container', mockTaxChart);

            filerDetails.setFilingType(FilingTypeName.Married);

            expect(filerDetails.getFilingType()).toBe(FilingTypeName.Married);
            expect(mockTaxChart.setFilingType).toHaveBeenCalledWith(FilingTypeName.Married);

            const marriedRadio = container.querySelector('#filing-married') as HTMLInputElement;
            expect(marriedRadio.checked).toBe(true);
        });

        test('should get current filing type', () => {
            const filerDetails = new FilerDetails('test-container', undefined, {
                defaultFilingType: FilingTypeName.Married
            });

            expect(filerDetails.getFilingType()).toBe(FilingTypeName.Married);
        });

        test('should set tax chart reference', () => {
            const filerDetails = new FilerDetails('test-container');

            filerDetails.setTaxChart(mockTaxChart);
            filerDetails.setFilingType(FilingTypeName.Married);

            expect(mockTaxChart.setFilingType).toHaveBeenCalledWith(FilingTypeName.Married);
        });

        test('should destroy component and clear container', () => {
            const filerDetails = new FilerDetails('test-container');

            expect(container.innerHTML).not.toBe('');

            filerDetails.destroy();

            expect(container.innerHTML).toBe('');
        });
    });

    describe('UI Updates', () => {
        test('should update UI when filing type is set programmatically', () => {
            const filerDetails = new FilerDetails('test-container');

            filerDetails.setFilingType(FilingTypeName.Married);

            const singleRadio = container.querySelector('#filing-single') as HTMLInputElement;
            const marriedRadio = container.querySelector('#filing-married') as HTMLInputElement;

            expect(singleRadio.checked).toBe(false);
            expect(marriedRadio.checked).toBe(true);
        });

        test('should maintain proper radio button group behavior', () => {
            new FilerDetails('test-container');

            const singleRadio = container.querySelector('#filing-single') as HTMLInputElement;
            const marriedRadio = container.querySelector('#filing-married') as HTMLInputElement;

            // Both radios should have the same name attribute
            expect(singleRadio.name).toBe('filingType');
            expect(marriedRadio.name).toBe('filingType');

            // Only one should be checked at a time
            marriedRadio.click();
            expect(singleRadio.checked).toBe(false);
            expect(marriedRadio.checked).toBe(true);

            singleRadio.click();
            expect(singleRadio.checked).toBe(true);
            expect(marriedRadio.checked).toBe(false);
        });
    });

    describe('Accessibility', () => {
        test('should have proper ARIA labels and roles', () => {
            new FilerDetails('test-container');

            const buttonGroup = container.querySelector('[role="group"]');
            expect(buttonGroup).toBeTruthy();
            expect(buttonGroup?.getAttribute('aria-label')).toBe('Filing Type Selection');

            const singleLabel = container.querySelector('label[for="filing-single"]');
            const marriedLabel = container.querySelector('label[for="filing-married"]');

            expect(singleLabel).toBeTruthy();
            expect(marriedLabel).toBeTruthy();
        });

        test('should have proper form labels', () => {
            new FilerDetails('test-container');

            const formLabel = container.querySelector('.form-label');
            expect(formLabel?.textContent?.trim()).toBe('Filing Type:');
        });
    });

    describe('Integration with TaxChart', () => {
        test('should work without TaxChart initially and accept it later', () => {
            const filerDetails = new FilerDetails('test-container');

            // Should not throw when no tax chart is set
            filerDetails.setFilingType(FilingTypeName.Married);

            // Should work after setting tax chart
            filerDetails.setTaxChart(mockTaxChart);
            filerDetails.setFilingType(FilingTypeName.Single);

            expect(mockTaxChart.setFilingType).toHaveBeenCalledWith(FilingTypeName.Single);
        });

        test('should log filing type changes', () => {
            const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
            const filerDetails = new FilerDetails('test-container', mockTaxChart);

            filerDetails.setFilingType(FilingTypeName.Married);

            expect(consoleSpy).toHaveBeenCalledWith('Filing type changed to: Married');
            
            consoleSpy.mockRestore();
        });
    });

    describe('Error Handling', () => {
        test('should handle missing container in updateUI gracefully', () => {
            const filerDetails = new FilerDetails('test-container');
            
            // Remove the container
            document.body.innerHTML = '';
            
            // Should not throw
            expect(() => {
                filerDetails.setFilingType(FilingTypeName.Married);
            }).not.toThrow();
        });

        test('should handle missing container in destroy gracefully', () => {
            const filerDetails = new FilerDetails('test-container');
            
            // Remove the container
            document.body.innerHTML = '';
            
            // Should not throw
            expect(() => {
                filerDetails.destroy();
            }).not.toThrow();
        });
    });
});