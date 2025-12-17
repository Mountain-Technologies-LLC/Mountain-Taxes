/**
 * Mountain Taxes - Chart Component Tests
 * 
 * This file contains unit tests and property-based tests for the Chart.js integration component.
 */

import { TaxChart } from '../src/chartComponent';
import { FilingTypeName } from '../src/types';
import { getAllStateNames } from '../src/stateData';
import * as fc from 'fast-check';

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

describe('TaxChart Component', () => {
    let mockCanvas: HTMLCanvasElement;
    let mockContext: CanvasRenderingContext2D;

    beforeEach(() => {
        // Create mock canvas and context
        mockCanvas = document.createElement('canvas');
        mockCanvas.id = 'test-chart';
        mockContext = {
            getContext: jest.fn()
        } as any;
        
        // Mock getContext to return our mock context
        jest.spyOn(mockCanvas, 'getContext').mockReturnValue(mockContext);
        
        // Add canvas to document
        document.body.appendChild(mockCanvas);
    });

    afterEach(() => {
        // Clean up DOM
        document.body.innerHTML = '';
        jest.clearAllMocks();
    });

    describe('Error Handling Tests', () => {
        test('Chart rendering failure scenarios', () => {
            // Test canvas not found error
            expect(() => new TaxChart('nonexistent-canvas'))
                .toThrow('Canvas element with id \'nonexistent-canvas\' not found');
            
            // Test context creation failure
            jest.spyOn(mockCanvas, 'getContext').mockReturnValue(null);
            expect(() => new TaxChart('test-chart'))
                .toThrow('Unable to get 2D context from canvas');
            
            // Restore mock for other tests
            jest.spyOn(mockCanvas, 'getContext').mockReturnValue(mockContext);
        });

        test('Invalid state handling in chart operations', () => {
            const chart = new TaxChart('test-chart');
            
            // Test adding invalid state
            expect(() => chart.addState('InvalidState')).toThrow('State not found: InvalidState');
            expect(() => chart.addState('')).toThrow('State not found: ');
            
            // Test that chart state remains consistent after errors
            chart.addState('Colorado');
            expect(chart.getSelectedStates()).toContain('Colorado');
            
            try {
                chart.addState('InvalidState');
            } catch (error) {
                // Error expected
            }
            
            // Chart should still have Colorado selected
            expect(chart.getSelectedStates()).toContain('Colorado');
            expect(chart.getSelectedStates()).toHaveLength(1);
            
            chart.destroy();
        });

        test('Error message display and recovery', () => {
            const chart = new TaxChart('test-chart');
            
            // Test that removing non-existent state doesn't throw
            expect(() => chart.removeState('NonExistentState')).not.toThrow();
            expect(() => chart.toggleState('NonExistentState')).toThrow('State not found: NonExistentState');
            
            // Test that chart operations continue to work after errors
            chart.addState('Colorado');
            expect(chart.isStateSelected('Colorado')).toBe(true);
            
            // Try invalid operation
            try {
                chart.addState('InvalidState');
            } catch (error) {
                // Expected error
            }
            
            // Valid operations should still work
            chart.addState('California');
            expect(chart.isStateSelected('California')).toBe(true);
            expect(chart.getSelectedStates()).toHaveLength(2);
            
            chart.destroy();
        });

        test('Graceful degradation for unsupported features', () => {
            const chart = new TaxChart('test-chart');
            
            // Test extreme range values - should be sanitized
            expect(() => chart.setIncomeRange(-1000000, 1000000, 10000)).not.toThrow();
            expect(() => chart.setIncomeRange(0, 10000000, 1000000)).not.toThrow(); // More reasonable max
            
            // Test extreme range extensions - should be limited
            expect(() => chart.extendRange(1000000000)).not.toThrow(); // Large but not MAX_SAFE_INTEGER
            expect(() => chart.reduceRange(1000000000)).not.toThrow();
            
            // Test invalid inputs
            expect(() => chart.setIncomeRange(NaN, 100000, 10000)).not.toThrow();
            expect(() => chart.setIncomeRange(0, NaN, 10000)).not.toThrow();
            expect(() => chart.setIncomeRange(0, 100000, NaN)).not.toThrow();
            expect(() => chart.setIncomeRange(0, 100000, 0)).not.toThrow();
            expect(() => chart.setIncomeRange(0, 100000, -10000)).not.toThrow();
            
            // Test that chart maintains valid state even with extreme inputs
            const range = chart.getIncomeRange();
            expect(typeof range.min).toBe('number');
            expect(typeof range.max).toBe('number');
            expect(typeof range.step).toBe('number');
            expect(range.max).toBeGreaterThanOrEqual(range.min);
            expect(range.step).toBeGreaterThan(0);
            expect(isFinite(range.min)).toBe(true);
            expect(isFinite(range.max)).toBe(true);
            expect(isFinite(range.step)).toBe(true);
            
            chart.destroy();
        });

        test('Chart destruction and cleanup', () => {
            const chart = new TaxChart('test-chart');
            const chartInstance = chart.getChartInstance();
            
            expect(chartInstance).toBeDefined();
            
            // Test that destroy works properly
            expect(() => chart.destroy()).not.toThrow();
            
            // Test that operations after destroy don't crash
            expect(chart.getChartInstance()).toBeNull();
            
            // Test that multiple destroy calls don't crash
            expect(() => chart.destroy()).not.toThrow();
        });

        test('Memory management and resource cleanup', () => {
            // Test creating and destroying multiple charts
            for (let i = 0; i < 10; i++) {
                const canvas = document.createElement('canvas');
                canvas.id = `test-chart-${i}`;
                jest.spyOn(canvas, 'getContext').mockReturnValue(mockContext);
                document.body.appendChild(canvas);
                
                const chart = new TaxChart(canvas.id);
                chart.addState('Colorado');
                chart.extendRange(50000);
                
                expect(() => chart.destroy()).not.toThrow();
                document.body.removeChild(canvas);
            }
            
            // Verify no memory leaks or hanging references
            expect(document.querySelectorAll('canvas')).toHaveLength(1); // Only original test canvas
        });
    });

    describe('Chart Initialization', () => {
        test('should initialize chart with correct canvas', () => {
            const chart = new TaxChart('test-chart');
            expect(chart).toBeDefined();
            expect(mockCanvas.getContext).toHaveBeenCalledWith('2d');
        });

        test('should throw error if canvas not found', () => {
            expect(() => new TaxChart('nonexistent-canvas')).toThrow('Canvas element with id \'nonexistent-canvas\' not found');
        });

        test('should throw error if context cannot be obtained', () => {
            jest.spyOn(mockCanvas, 'getContext').mockReturnValue(null);
            expect(() => new TaxChart('test-chart')).toThrow('Unable to get 2D context from canvas');
        });

        test('should initialize with correct axes and range', () => {
            const chart = new TaxChart('test-chart');
            const range = chart.getIncomeRange();
            
            // Verify initial range settings
            expect(range.min).toBe(0);
            expect(range.max).toBe(100000);
            expect(range.step).toBe(10000);
            
            // Verify chart instance exists
            const chartInstance = chart.getChartInstance();
            expect(chartInstance).toBeDefined();
            
            chart.destroy();
        });

        test('should be responsive across container sizes', () => {
            // Test different canvas sizes
            const testSizes = [
                { width: 300, height: 200 },
                { width: 800, height: 400 },
                { width: 1200, height: 600 }
            ];

            testSizes.forEach(size => {
                // Create canvas with specific size
                const sizedCanvas = document.createElement('canvas');
                sizedCanvas.id = `sized-chart-${size.width}x${size.height}`;
                sizedCanvas.width = size.width;
                sizedCanvas.height = size.height;
                sizedCanvas.style.width = `${size.width}px`;
                sizedCanvas.style.height = `${size.height}px`;
                
                jest.spyOn(sizedCanvas, 'getContext').mockReturnValue(mockContext);
                document.body.appendChild(sizedCanvas);

                const chart = new TaxChart(sizedCanvas.id);
                const chartInstance = chart.getChartInstance();
                
                // Verify chart is responsive
                expect(chartInstance).toBeDefined();
                expect(chartInstance?.options?.responsive).toBe(true);
                expect(chartInstance?.options?.maintainAspectRatio).toBe(false);
                
                chart.destroy();
                document.body.removeChild(sizedCanvas);
            });
        });

        test('should handle chart update and re-render functionality', () => {
            const chart = new TaxChart('test-chart');
            const chartInstance = chart.getChartInstance();
            
            // Mock the update method to track calls
            const updateSpy = jest.spyOn(chartInstance!, 'update');
            
            // Trigger operations that should cause updates
            chart.addState('Colorado');
            expect(updateSpy).toHaveBeenCalled();
            
            updateSpy.mockClear();
            chart.extendRange(50000);
            expect(updateSpy).toHaveBeenCalled();
            
            updateSpy.mockClear();
            chart.setFilingType(FilingTypeName.Married);
            expect(updateSpy).toHaveBeenCalled();
            
            updateSpy.mockClear();
            chart.removeState('Colorado');
            expect(updateSpy).toHaveBeenCalled();
            
            chart.destroy();
        });
    });

    describe('State Management', () => {
        let chart: TaxChart;

        beforeEach(() => {
            chart = new TaxChart('test-chart');
        });

        afterEach(() => {
            chart.destroy();
        });

        test('should add state to chart', () => {
            chart.addState('Colorado');
            expect(chart.getSelectedStates()).toContain('Colorado');
        });

        test('should remove state from chart', () => {
            chart.addState('Colorado');
            chart.removeState('Colorado');
            expect(chart.getSelectedStates()).not.toContain('Colorado');
        });

        test('should toggle state selection', () => {
            chart.toggleState('Colorado');
            expect(chart.isStateSelected('Colorado')).toBe(true);
            
            chart.toggleState('Colorado');
            expect(chart.isStateSelected('Colorado')).toBe(false);
        });

        test('should add all states', () => {
            chart.addAllStates();
            const allStates = getAllStateNames();
            expect(chart.getSelectedStates()).toEqual(expect.arrayContaining(allStates));
        });

        test('should remove all states', () => {
            chart.addState('Colorado');
            chart.addState('California');
            chart.removeAllStates();
            expect(chart.getSelectedStates()).toHaveLength(0);
        });
    });

    describe('Income Range Management', () => {
        let chart: TaxChart;

        beforeEach(() => {
            chart = new TaxChart('test-chart');
        });

        afterEach(() => {
            chart.destroy();
        });

        test('should extend income range', () => {
            const initialRange = chart.getIncomeRange();
            chart.extendRange(10000);
            const newRange = chart.getIncomeRange();
            expect(newRange.max).toBe(initialRange.max + 10000);
        });

        test('should reduce income range', () => {
            chart.extendRange(50000); // First extend to have room to reduce
            const extendedRange = chart.getIncomeRange();
            chart.reduceRange(10000);
            const reducedRange = chart.getIncomeRange();
            expect(reducedRange.max).toBe(extendedRange.max - 10000);
        });

        test('should set specific income range', () => {
            chart.setIncomeRange(0, 200000, 20000);
            const range = chart.getIncomeRange();
            expect(range.min).toBe(0);
            expect(range.max).toBe(200000);
            expect(range.step).toBe(20000);
        });

        // Unit tests for specific range increments
        describe('Specific Range Increment Tests', () => {
            test('should extend range by 10k correctly', () => {
                const initialRange = chart.getIncomeRange();
                chart.extendRange(10000);
                const newRange = chart.getIncomeRange();
                
                expect(newRange.max).toBe(initialRange.max + 10000);
                expect(newRange.min).toBe(initialRange.min);
                expect(newRange.step).toBe(initialRange.step);
            });

            test('should extend range by 100k correctly', () => {
                const initialRange = chart.getIncomeRange();
                chart.extendRange(100000);
                const newRange = chart.getIncomeRange();
                
                expect(newRange.max).toBe(initialRange.max + 100000);
                expect(newRange.min).toBe(initialRange.min);
                expect(newRange.step).toBe(initialRange.step);
            });

            test('should extend range by 1m correctly', () => {
                const initialRange = chart.getIncomeRange();
                chart.extendRange(1000000);
                const newRange = chart.getIncomeRange();
                
                expect(newRange.max).toBe(initialRange.max + 1000000);
                expect(newRange.min).toBe(initialRange.min);
                expect(newRange.step).toBe(initialRange.step);
            });

            test('should extend range by 10m correctly', () => {
                const initialRange = chart.getIncomeRange();
                chart.extendRange(10000000);
                const newRange = chart.getIncomeRange();
                
                expect(newRange.max).toBe(initialRange.max + 10000000);
                expect(newRange.min).toBe(initialRange.min);
                expect(newRange.step).toBe(initialRange.step);
            });

            test('should reduce range with "Remove data set" functionality', () => {
                // First extend the range to have something to remove
                chart.extendRange(50000);
                const extendedRange = chart.getIncomeRange();
                
                // Now reduce by the same amount
                chart.reduceRange(50000);
                const reducedRange = chart.getIncomeRange();
                
                expect(reducedRange.max).toBe(extendedRange.max - 50000);
                expect(reducedRange.min).toBe(extendedRange.min);
                expect(reducedRange.step).toBe(extendedRange.step);
            });

            test('should handle multiple range extensions and reductions', () => {
                const initialRange = chart.getIncomeRange();
                
                // Add some states to test data preservation
                chart.addState('Colorado');
                chart.addState('California');
                
                // Extend by 10k
                chart.extendRange(10000);
                expect(chart.getIncomeRange().max).toBe(initialRange.max + 10000);
                expect(chart.getSelectedStates()).toEqual(['Colorado', 'California']);
                
                // Extend by 100k
                chart.extendRange(100000);
                expect(chart.getIncomeRange().max).toBe(initialRange.max + 110000);
                expect(chart.getSelectedStates()).toEqual(['Colorado', 'California']);
                
                // Reduce by 50k
                chart.reduceRange(50000);
                expect(chart.getIncomeRange().max).toBe(initialRange.max + 60000);
                expect(chart.getSelectedStates()).toEqual(['Colorado', 'California']);
            });

            test('should recalculate chart data after range changes', () => {
                // Add a state to have data to verify
                chart.addState('Colorado');
                
                const chartInstance = chart.getChartInstance();
                if (!chartInstance) return;
                
                // Get initial data length
                const initialDataLength = chartInstance.data.datasets[0]?.data.length || 0;
                
                // Extend range and verify data was recalculated
                chart.extendRange(50000);
                const newDataLength = chartInstance.data.datasets[0]?.data.length || 0;
                
                // Should have more data points after extending range
                expect(newDataLength).toBeGreaterThan(initialDataLength);
                
                // Verify chart update was called
                expect(chartInstance.update).toHaveBeenCalled();
            });

            test('should not reduce range below minimum threshold', () => {
                const initialRange = chart.getIncomeRange();
                
                // Try to reduce more than the current range allows
                chart.reduceRange(initialRange.max + 10000);
                const reducedRange = chart.getIncomeRange();
                
                // Should not go below min + step
                expect(reducedRange.max).toBeGreaterThanOrEqual(initialRange.min + initialRange.step);
            });
        });
    });

    describe('Filing Type Management', () => {
        let chart: TaxChart;

        beforeEach(() => {
            chart = new TaxChart('test-chart');
        });

        afterEach(() => {
            chart.destroy();
        });

        test('should change filing type', () => {
            chart.setFilingType(FilingTypeName.Married);
            expect(chart.getFilingType()).toBe(FilingTypeName.Married);
        });

        test('should default to Single filing type', () => {
            expect(chart.getFilingType()).toBe(FilingTypeName.Single);
        });
    });

    // Property-Based Tests
    describe('Property-Based Tests', () => {
        let chart: TaxChart;

        beforeEach(() => {
            chart = new TaxChart('test-chart');
        });

        afterEach(() => {
            chart.destroy();
        });

        /**
         * **Feature: mountain-taxes-calculator, Property 2: Multiple state datasets display independently**
         * **Validates: Requirements 1.4**
         */
        test('Property 2: Multiple state datasets display independently', () => {
            fc.assert(fc.property(
                fc.array(fc.constantFrom(...getAllStateNames()), { minLength: 1, maxLength: 10 }),
                (selectedStates) => {
                    // Remove all states first to start clean
                    chart.removeAllStates();
                    
                    // Add each selected state
                    selectedStates.forEach(stateName => {
                        chart.addState(stateName);
                    });
                    
                    // Verify each state is independently tracked
                    const chartStates = chart.getSelectedStates();
                    const uniqueStates = [...new Set(selectedStates)]; // Remove duplicates
                    
                    // Each unique state should be in the chart
                    uniqueStates.forEach(stateName => {
                        expect(chartStates).toContain(stateName);
                        expect(chart.isStateSelected(stateName)).toBe(true);
                    });
                    
                    // Chart should have exactly the unique states
                    expect(chartStates).toHaveLength(uniqueStates.length);
                    
                    // Remove one state and verify independence
                    if (uniqueStates.length > 1) {
                        const stateToRemove = uniqueStates[0];
                        chart.removeState(stateToRemove);
                        
                        expect(chart.isStateSelected(stateToRemove)).toBe(false);
                        // Other states should still be selected
                        uniqueStates.slice(1).forEach(stateName => {
                            expect(chart.isStateSelected(stateName)).toBe(true);
                        });
                    }
                }
            ), { numRuns: 100 });
        });

        /**
         * **Feature: mountain-taxes-calculator, Property 6: Chart legend reflects current selection**
         * **Validates: Requirements 3.5**
         */
        test('Property 6: Chart legend reflects current selection', () => {
            fc.assert(fc.property(
                fc.array(fc.constantFrom(...getAllStateNames()), { minLength: 0, maxLength: 15 }),
                fc.array(fc.constantFrom(...getAllStateNames()), { minLength: 0, maxLength: 10 }),
                (initialStates, statesToToggle) => {
                    // Start with a clean chart
                    chart.removeAllStates();
                    
                    // Add initial states
                    const uniqueInitialStates = [...new Set(initialStates)];
                    uniqueInitialStates.forEach(stateName => {
                        chart.addState(stateName);
                    });
                    
                    // Get chart instance to check datasets
                    const chartInstance = chart.getChartInstance();
                    if (!chartInstance) return; // Skip if chart not available
                    
                    // Verify initial legend reflects selection
                    const initialSelectedStates = chart.getSelectedStates();
                    expect(chartInstance.data.datasets).toHaveLength(initialSelectedStates.length);
                    
                    // Each dataset should have a label matching a selected state
                    chartInstance.data.datasets.forEach((dataset) => {
                        expect(initialSelectedStates).toContain(dataset.label);
                    });
                    
                    // Toggle states and verify legend updates
                    const uniqueToggleStates = [...new Set(statesToToggle)];
                    uniqueToggleStates.forEach(stateName => {
                        chart.toggleState(stateName);
                        
                        // Verify the chart datasets reflect the change
                        const currentSelectedStates = chart.getSelectedStates();
                        expect(chartInstance.data.datasets).toHaveLength(currentSelectedStates.length);
                        
                        // Each dataset label should match a currently selected state
                        chartInstance.data.datasets.forEach(dataset => {
                            expect(currentSelectedStates).toContain(dataset.label);
                        });
                        
                        // Each selected state should have a corresponding dataset
                        currentSelectedStates.forEach(selectedState => {
                            const hasDataset = chartInstance.data.datasets.some(
                                dataset => dataset.label === selectedState
                            );
                            expect(hasDataset).toBe(true);
                        });
                    });
                }
            ), { numRuns: 100 });
        });

        /**
         * **Feature: mountain-taxes-calculator, Property 4: Range extension preserves existing data**
         * **Validates: Requirements 2.1, 2.2, 2.3, 2.4, 2.5**
         */
        test('Property 4: Range extension preserves existing data', () => {
            fc.assert(fc.property(
                fc.array(fc.constantFrom(...getAllStateNames()), { minLength: 1, maxLength: 5 }),
                fc.array(fc.constantFrom(10000, 100000, 1000000, 10000000), { minLength: 1, maxLength: 10 }),
                (selectedStates, rangeExtensions) => {
                    // Start with a clean chart
                    chart.removeAllStates();
                    chart.setIncomeRange(0, 100000, 10000); // Reset to initial range
                    
                    // Add selected states
                    const uniqueStates = [...new Set(selectedStates)];
                    uniqueStates.forEach(stateName => {
                        chart.addState(stateName);
                    });
                    
                    // Get initial chart data
                    const chartInstance = chart.getChartInstance();
                    if (!chartInstance) return; // Skip if chart not available
                    
                    // Store initial data for comparison
                    const initialDatasets = chartInstance.data.datasets.map(dataset => ({
                        label: dataset.label,
                        dataLength: dataset.data.length,
                        firstValues: dataset.data.slice(0, Math.min(5, dataset.data.length))
                    }));
                    
                    const initialRange = chart.getIncomeRange();
                    
                    // Apply range extensions
                    rangeExtensions.forEach(extension => {
                        const rangeBeforeExtension = chart.getIncomeRange();
                        chart.extendRange(extension);
                        const rangeAfterExtension = chart.getIncomeRange();
                        
                        // Verify range was extended correctly
                        expect(rangeAfterExtension.max).toBe(rangeBeforeExtension.max + extension);
                        expect(rangeAfterExtension.min).toBe(rangeBeforeExtension.min);
                        expect(rangeAfterExtension.step).toBe(rangeBeforeExtension.step);
                        
                        // Verify all states are still selected
                        const currentSelectedStates = chart.getSelectedStates();
                        expect(currentSelectedStates).toEqual(expect.arrayContaining(uniqueStates));
                        expect(currentSelectedStates).toHaveLength(uniqueStates.length);
                        
                        // Verify datasets still exist for all states
                        expect(chartInstance.data.datasets).toHaveLength(uniqueStates.length);
                        
                        // Verify each dataset has the correct label and extended data
                        chartInstance.data.datasets.forEach((dataset, index) => {
                            const initialDataset = initialDatasets[index];
                            if (initialDataset) {
                                // Label should be preserved
                                expect(dataset.label).toBe(initialDataset.label);
                                
                                // Data should be extended (more points)
                                expect(dataset.data.length).toBeGreaterThanOrEqual(initialDataset.dataLength);
                                
                                // Initial values should be preserved (within reasonable tolerance for recalculation)
                                const currentFirstValues = dataset.data.slice(0, initialDataset.firstValues.length);
                                currentFirstValues.forEach((value, valueIndex) => {
                                    const initialValue = initialDataset.firstValues[valueIndex];
                                    if (typeof value === 'number' && typeof initialValue === 'number') {
                                        // Allow small differences due to recalculation
                                        expect(Math.abs(value - initialValue)).toBeLessThan(0.01);
                                    }
                                });
                            }
                        });
                    });
                    
                    // Verify final range is correct
                    const finalRange = chart.getIncomeRange();
                    const expectedMaxRange = initialRange.max + rangeExtensions.reduce((sum, ext) => sum + ext, 0);
                    expect(finalRange.max).toBe(expectedMaxRange);
                }
            ), { numRuns: 100 });
        });
    });
});