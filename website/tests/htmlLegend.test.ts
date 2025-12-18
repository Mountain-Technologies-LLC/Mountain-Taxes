/**
 * Mountain Taxes - HTML Legend Component Tests
 * 
 * Comprehensive test suite for the HTML Legend component functionality,
 * including rendering, interaction, and accessibility features.
 */

import { HtmlLegend } from '../src/htmlLegend';
import { TaxChart } from '../src/chartComponent';
import { LegendItem } from '../src/types';

// Mock Chart.js
jest.mock('chart.js', () => ({
    Chart: jest.fn().mockImplementation(() => ({
        data: { datasets: [], labels: [] },
        update: jest.fn(),
        destroy: jest.fn(),
        isDatasetVisible: jest.fn().mockReturnValue(true),
        getDatasetMeta: jest.fn().mockReturnValue({ hidden: null })
    })),
    registerables: []
}));

// Mock DOM methods
Object.defineProperty(window, 'getComputedStyle', {
    value: () => ({
        getPropertyValue: () => ''
    })
});

// Mock getAllStateNames function
jest.mock('../src/stateData', () => ({
    getAllStateNames: jest.fn().mockReturnValue([
        'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia',
        'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland',
        'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey',
        'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina',
        'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
    ])
}));

describe('HtmlLegend', () => {
    let mockChart: jest.Mocked<TaxChart>;
    let container: HTMLElement;
    let htmlLegend: HtmlLegend;

    beforeEach(() => {
        // Setup DOM
        document.body.innerHTML = '<div id="test-legend-container"></div>';
        container = document.getElementById('test-legend-container')!;

        // Create mock chart with proper typing
        mockChart = {
            generateLegendItems: jest.fn().mockReturnValue([]),
            onLegendUpdate: jest.fn(),
            toggleDatasetVisibility: jest.fn(),
            addState: jest.fn(),
            removeState: jest.fn(),
            getSelectedStates: jest.fn().mockReturnValue([]),
            isStateSelected: jest.fn().mockReturnValue(false),
            toggleState: jest.fn(),
            addAllStates: jest.fn(),
            removeAllStates: jest.fn(),
            extendRange: jest.fn(),
            reduceRange: jest.fn(),
            setIncomeRange: jest.fn(),
            setFilingType: jest.fn(),
            getIncomeRange: jest.fn(),
            getFilingType: jest.fn(),
            getChartInstance: jest.fn(),
            destroy: jest.fn()
        } as unknown as jest.Mocked<TaxChart>;
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });

    describe('Constructor and Initialization', () => {
        test('should create HTML legend with default configuration', () => {
            htmlLegend = new HtmlLegend('test-legend-container', mockChart);
            
            expect(container.querySelector('.html-legend-container')).toBeTruthy();
            expect(container.querySelector('.legend-title h6')).toHaveTextContent('Selected States');
            expect(container.querySelector('.legend-items')).toBeTruthy();
            expect(mockChart.onLegendUpdate).toHaveBeenCalled();
        });

        test('should create HTML legend with custom configuration', () => {
            htmlLegend = new HtmlLegend('test-legend-container', mockChart, {
                position: 'top-center',
                showTitle: false,
                titleText: 'Custom Title'
            });
            
            expect(container.querySelector('.legend-position-top-center')).toBeTruthy();
            expect(container.querySelector('.legend-title')).toBeFalsy();
        });

        test('should throw error if container not found', () => {
            expect(() => {
                new HtmlLegend('non-existent-container', mockChart);
            }).toThrow('Container element with id \'non-existent-container\' not found');
        });
    });

    describe('Legend Rendering', () => {
        beforeEach(() => {
            htmlLegend = new HtmlLegend('test-legend-container', mockChart);
        });

        test('should render all states when no states are selected', () => {
            mockChart.generateLegendItems.mockReturnValue([]);
            mockChart.getSelectedStates.mockReturnValue([]);
            
            htmlLegend.updateLegend();
            
            // Should show all states, not an empty message
            const legendItems = container.querySelectorAll('.legend-item');
            expect(legendItems.length).toBeGreaterThan(0);
            
            // All items should be unselected (using btn-secondary class)
            legendItems.forEach(item => {
                expect(item).toHaveClass('btn-secondary');
            });
        });

        test('should render legend items correctly with selected and unselected states', () => {
            const mockLegendItems: LegendItem[] = [
                { label: 'California', color: '#FF6384', hidden: false, datasetIndex: 0 },
                { label: 'Texas', color: '#36A2EB', hidden: true, datasetIndex: 1 }
            ];
            mockChart.generateLegendItems.mockReturnValue(mockLegendItems);
            mockChart.getSelectedStates.mockReturnValue(['California', 'Texas']);
            
            htmlLegend.updateLegend();
            
            const legendItems = container.querySelectorAll('.legend-item');
            expect(legendItems.length).toBeGreaterThan(2); // Should show all states, not just selected ones
            
            // Find California and Texas items
            const californiaItem = Array.from(legendItems).find(item => 
                item.querySelector('.legend-label')?.textContent === 'California'
            );
            const texasItem = Array.from(legendItems).find(item => 
                item.querySelector('.legend-label')?.textContent === 'Texas'
            );
            
            expect(californiaItem).toBeTruthy();
            expect(texasItem).toBeTruthy();
            
            // California should be selected (btn-outline-secondary) and visible
            expect(californiaItem).toHaveClass('btn-outline-secondary');
            expect(californiaItem).not.toHaveClass('legend-item-hidden');
            
            // Texas should be selected (btn-outline-secondary) but hidden
            expect(texasItem).toHaveClass('btn-outline-secondary');
            expect(texasItem).toHaveClass('legend-item-hidden');
        });

        test('should set correct accessibility attributes', () => {
            const mockLegendItems: LegendItem[] = [
                { label: 'California', color: '#FF6384', hidden: false, datasetIndex: 0 }
            ];
            mockChart.generateLegendItems.mockReturnValue(mockLegendItems);
            mockChart.getSelectedStates.mockReturnValue(['California']);
            
            htmlLegend.updateLegend();
            
            // Find the California legend item specifically
            const legendItems = container.querySelectorAll('.legend-item');
            const californiaItem = Array.from(legendItems).find(item => 
                item.querySelector('.legend-label')?.textContent === 'California'
            );
            
            expect(californiaItem).toBeTruthy();
            expect(californiaItem).toHaveAttribute('type', 'button');
            expect(californiaItem).toHaveAttribute('aria-label', 'Hide California ');
            expect(californiaItem).toHaveAttribute('title', 'Click to hide California');
        });
    });

    describe('User Interactions', () => {
        beforeEach(() => {
            htmlLegend = new HtmlLegend('test-legend-container', mockChart);
            const mockLegendItems: LegendItem[] = [
                { label: 'California', color: '#FF6384', hidden: false, datasetIndex: 0 }
            ];
            mockChart.generateLegendItems.mockReturnValue(mockLegendItems);
            htmlLegend.updateLegend();
        });

        test('should handle click events on legend items to toggle visibility', async () => {
            // Test the actual behavior: clicking unselected states adds them
            mockChart.generateLegendItems.mockReturnValue([]);
            mockChart.getSelectedStates.mockReturnValue([]);
            htmlLegend.updateLegend();
            
            // Find an unselected state (California should be unselected)
            const californiaItem = container.querySelector('[data-state-name="California"]') as HTMLElement;
            
            expect(californiaItem).toBeTruthy();
            expect(californiaItem).toHaveClass('btn-secondary');
            expect(californiaItem.getAttribute('data-dataset-index')).toBe('-1');
            
            // Click the item to add the state
            californiaItem.click();
            
            // Wait for the setTimeout in the event handler to complete
            await new Promise(resolve => setTimeout(resolve, 10));
            
            expect(mockChart.addState).toHaveBeenCalledWith('California');
        });

        test('should handle keyboard events on legend items to add states', async () => {
            // Test the actual behavior: keyboard events on unselected states add them
            mockChart.generateLegendItems.mockReturnValue([]);
            mockChart.getSelectedStates.mockReturnValue([]);
            htmlLegend.updateLegend();
            
            // Find an unselected state (California should be unselected)
            const californiaItem = container.querySelector('[data-state-name="California"]') as HTMLElement;
            
            expect(californiaItem).toBeTruthy();
            expect(californiaItem).toHaveClass('btn-secondary');
            expect(californiaItem.getAttribute('data-dataset-index')).toBe('-1');
            
            // Test Enter key
            const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' });
            californiaItem.dispatchEvent(enterEvent);
            
            // Wait for the setTimeout in the event handler to complete
            await new Promise(resolve => setTimeout(resolve, 10));
            
            expect(mockChart.addState).toHaveBeenCalledWith('California');
            
            // Test Space key
            const spaceEvent = new KeyboardEvent('keydown', { key: ' ' });
            californiaItem.dispatchEvent(spaceEvent);
            
            // Wait for the setTimeout in the event handler to complete
            await new Promise(resolve => setTimeout(resolve, 10));
            
            expect(mockChart.addState).toHaveBeenCalledTimes(2);
        });

        test('should not handle other keyboard events', () => {
            // Setup a selected state
            const mockLegendItems: LegendItem[] = [
                { label: 'California', color: '#FF6384', hidden: false, datasetIndex: 0 }
            ];
            mockChart.generateLegendItems.mockReturnValue(mockLegendItems);
            mockChart.getSelectedStates.mockReturnValue(['California']);
            htmlLegend.updateLegend();
            
            const legendItem = container.querySelector('.legend-item') as HTMLElement;
            
            const escapeEvent = new KeyboardEvent('keydown', { key: 'Escape' });
            legendItem.dispatchEvent(escapeEvent);
            
            expect(mockChart.removeState).not.toHaveBeenCalled();
        });

        test('should handle click events on unselected states', () => {
            // Setup no selected states
            mockChart.generateLegendItems.mockReturnValue([]);
            mockChart.getSelectedStates.mockReturnValue([]);
            htmlLegend.updateLegend();
            
            // Find an unselected state (should have btn-secondary class)
            const unselectedItem = container.querySelector('.btn-secondary') as HTMLElement;
            expect(unselectedItem).toBeTruthy();
            
            unselectedItem.click();
            
            // Should call addState instead of removeState
            expect(mockChart.addState).toHaveBeenCalled();
            expect(mockChart.removeState).not.toHaveBeenCalled();
        });

        test('should handle click events on selected states', async () => {
            // Create a scenario where California is both selected and has a chart legend item
            const mockLegendItems: LegendItem[] = [
                { label: 'California', color: '#FF6384', hidden: false, datasetIndex: 0 }
            ];
            
            // Mock the chart to return California as both selected and in legend items
            mockChart.generateLegendItems.mockReturnValue(mockLegendItems);
            mockChart.getSelectedStates.mockReturnValue(['California']);
            
            // Create a new legend instance to ensure clean state
            new HtmlLegend('test-legend-container', mockChart);
            
            // Find the California legend item
            const californiaItem = container.querySelector('[data-state-name="California"]') as HTMLElement;
            
            expect(californiaItem).toBeTruthy();
            
            // Since California is selected (in getSelectedStates), clicking should call removeState
            californiaItem.click();
            
            await new Promise(resolve => setTimeout(resolve, 10));
            
            expect(mockChart.removeState).toHaveBeenCalledWith('California');
        });
    });

    describe('Chart Integration', () => {
        test('should register for chart updates', () => {
            htmlLegend = new HtmlLegend('test-legend-container', mockChart);
            
            expect(mockChart.onLegendUpdate).toHaveBeenCalledWith(expect.any(Function));
        });

        test('should update legend when chart callback is triggered', () => {
            const updateSpy = jest.spyOn(HtmlLegend.prototype, 'updateLegend');
            htmlLegend = new HtmlLegend('test-legend-container', mockChart);
            
            // Get the callback function that was registered
            const callback = mockChart.onLegendUpdate.mock.calls[0][0];
            
            // Trigger the callback
            callback();
            
            expect(updateSpy).toHaveBeenCalled();
        });
    });

    describe('Component Lifecycle', () => {
        test('should provide access to container element', () => {
            htmlLegend = new HtmlLegend('test-legend-container', mockChart);
            
            expect(htmlLegend.getContainer()).toBe(container);
        });

        test('should clean up on destroy', () => {
            htmlLegend = new HtmlLegend('test-legend-container', mockChart);
            
            htmlLegend.destroy();
            
            expect(container.innerHTML).toBe('');
        });
    });

    describe('Responsive Design', () => {
        test('should apply correct CSS classes for positioning', () => {
            htmlLegend = new HtmlLegend('test-legend-container', mockChart, {
                position: 'bottom-start'
            });
            
            expect(container.querySelector('.legend-position-bottom-start')).toBeTruthy();
        });

        test('should handle different position configurations', () => {
            const positions = ['bottom-start', 'bottom-center', 'bottom-end', 'top-start', 'top-center', 'top-end'] as const;
            
            positions.forEach(position => {
                document.body.innerHTML = '<div id="test-container"></div>';
                const testContainer = document.getElementById('test-container')!;
                
                new HtmlLegend('test-container', mockChart, { position });
                
                expect(testContainer.querySelector(`.legend-position-${position}`)).toBeTruthy();
            });
        });
    });

    describe('Highlighting Functionality', () => {
        beforeEach(() => {
            htmlLegend = new HtmlLegend('test-legend-container', mockChart);
        });

        test('should apply highlighted background color to selected states', () => {
            const mockLegendItems: LegendItem[] = [
                { label: 'California', color: '#FF6384', hidden: false, datasetIndex: 0 }
            ];
            mockChart.generateLegendItems.mockReturnValue(mockLegendItems);
            mockChart.getSelectedStates.mockReturnValue(['California']);
            
            htmlLegend.updateLegend();
            
            const californiaItem = container.querySelector('[data-state-name="California"]') as HTMLElement;
            expect(californiaItem).toBeTruthy();
            
            // Should have highlighted background color and border
            const style = californiaItem.getAttribute('style');
            expect(style).toContain('background-color: #');
            expect(style).toContain('border-color: #FF6384');
            expect(style).not.toContain('background-color: transparent');
        });

        test('should not apply highlighted background to unselected states', () => {
            mockChart.generateLegendItems.mockReturnValue([]);
            mockChart.getSelectedStates.mockReturnValue([]);
            
            htmlLegend.updateLegend();
            
            const californiaItem = container.querySelector('[data-state-name="California"]') as HTMLElement;
            expect(californiaItem).toBeTruthy();
            
            // Should have transparent background
            const style = californiaItem.getAttribute('style');
            expect(style).toContain('background-color: transparent');
            expect(style).not.toContain('border-color: #');
        });

        test('should not apply highlighted background to hidden selected states', () => {
            const mockLegendItems: LegendItem[] = [
                { label: 'California', color: '#FF6384', hidden: true, datasetIndex: 0 }
            ];
            mockChart.generateLegendItems.mockReturnValue(mockLegendItems);
            mockChart.getSelectedStates.mockReturnValue(['California']);
            
            htmlLegend.updateLegend();
            
            const californiaItem = container.querySelector('[data-state-name="California"]') as HTMLElement;
            expect(californiaItem).toBeTruthy();
            
            // Should have transparent background for hidden states
            const style = californiaItem.getAttribute('style');
            expect(style).toContain('background-color: transparent');
        });

        test('should lighten colors correctly', () => {
            // Access the private method through any to test it
            const legend = htmlLegend as unknown;
            
            // Test lightening a red color
            const lightRed = legend.lightenColor('#FF0000', 0.5);
            expect(lightRed).toBe('#ff8080');
            
            // Test lightening a blue color
            const lightBlue = legend.lightenColor('#0000FF', 0.8);
            expect(lightBlue).toBe('#ccccff');
            
            // Test with color without # prefix
            const lightGreen = legend.lightenColor('00FF00', 0.3);
            expect(lightGreen).toBe('#4dff4d');
        });
    });

    describe('Error Handling', () => {
        test('should handle missing legend container gracefully', () => {
            htmlLegend = new HtmlLegend('test-legend-container', mockChart);
            
            // Remove the legend items container
            const legendContainer = container.querySelector('#legend-items');
            legendContainer?.remove();
            
            // Should not throw when trying to update
            expect(() => {
                htmlLegend.updateLegend();
            }).not.toThrow();
        });

        test('should handle chart errors gracefully', () => {
            htmlLegend = new HtmlLegend('test-legend-container', mockChart);
            
            // Mock chart to throw error during legend generation
            mockChart.generateLegendItems.mockImplementation(() => {
                throw new Error('Chart error');
            });
            
            // Should not throw when chart has errors
            expect(() => {
                htmlLegend.updateLegend();
            }).not.toThrow();
        });
    });
});