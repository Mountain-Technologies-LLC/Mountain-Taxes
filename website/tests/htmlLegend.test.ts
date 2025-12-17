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

describe('HtmlLegend', () => {
    let mockChart: jest.Mocked<TaxChart>;
    let container: HTMLElement;
    let htmlLegend: HtmlLegend;

    beforeEach(() => {
        // Setup DOM
        document.body.innerHTML = '<div id="test-legend-container"></div>';
        container = document.getElementById('test-legend-container')!;

        // Create mock chart
        mockChart = {
            generateLegendItems: jest.fn().mockReturnValue([]),
            onLegendUpdate: jest.fn(),
            toggleDatasetVisibility: jest.fn(),
            addState: jest.fn(),
            removeState: jest.fn(),
            getSelectedStates: jest.fn().mockReturnValue([]),
            isStateSelected: jest.fn().mockReturnValue(false)
        } as unknown;
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

        test('should render empty state message when no legend items', () => {
            mockChart.generateLegendItems.mockReturnValue([]);
            
            htmlLegend.updateLegend();
            
            expect(container.querySelector('.no-states-message')).toBeTruthy();
            expect(container.querySelector('.no-states-message')).toHaveTextContent('No states selected');
        });

        test('should render legend items correctly', () => {
            const mockLegendItems: LegendItem[] = [
                { label: 'California', color: '#FF6384', hidden: false, datasetIndex: 0 },
                { label: 'Texas', color: '#36A2EB', hidden: true, datasetIndex: 1 }
            ];
            mockChart.generateLegendItems.mockReturnValue(mockLegendItems);
            
            htmlLegend.updateLegend();
            
            const legendItems = container.querySelectorAll('.legend-item');
            expect(legendItems).toHaveLength(2);
            
            // Check first item (visible)
            const firstItem = legendItems[0];
            expect(firstItem.querySelector('.legend-label')).toHaveTextContent('California');
            const colorBox = firstItem.querySelector('.legend-color-box') as HTMLElement;
            expect(colorBox.style.backgroundColor).toBe('rgb(255, 99, 132)');
            expect(firstItem).not.toHaveClass('legend-item-hidden');
            
            // Check second item (hidden)
            const secondItem = legendItems[1];
            expect(secondItem.querySelector('.legend-label')).toHaveTextContent('Texas');
            expect(secondItem).toHaveClass('legend-item-hidden');
        });

        test('should set correct accessibility attributes', () => {
            const mockLegendItems: LegendItem[] = [
                { label: 'California', color: '#FF6384', hidden: false, datasetIndex: 0 }
            ];
            mockChart.generateLegendItems.mockReturnValue(mockLegendItems);
            
            htmlLegend.updateLegend();
            
            const legendItem = container.querySelector('.legend-item');
            expect(legendItem).toHaveAttribute('role', 'button');
            expect(legendItem).toHaveAttribute('tabindex', '0');
            expect(legendItem).toHaveAttribute('aria-label', 'Toggle California visibility');
            expect(legendItem).toHaveAttribute('title', 'Click to toggle California visibility');
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

        test('should handle click events on legend items', () => {
            const legendItem = container.querySelector('.legend-item') as HTMLElement;
            
            legendItem.click();
            
            expect(mockChart.toggleDatasetVisibility).toHaveBeenCalledWith(0);
        });

        test('should handle keyboard events on legend items', () => {
            const legendItem = container.querySelector('.legend-item') as HTMLElement;
            
            // Test Enter key
            const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' });
            legendItem.dispatchEvent(enterEvent);
            
            expect(mockChart.toggleDatasetVisibility).toHaveBeenCalledWith(0);
            
            // Test Space key
            const spaceEvent = new KeyboardEvent('keydown', { key: ' ' });
            legendItem.dispatchEvent(spaceEvent);
            
            expect(mockChart.toggleDatasetVisibility).toHaveBeenCalledTimes(2);
        });

        test('should not handle other keyboard events', () => {
            const legendItem = container.querySelector('.legend-item') as HTMLElement;
            
            const escapeEvent = new KeyboardEvent('keydown', { key: 'Escape' });
            legendItem.dispatchEvent(escapeEvent);
            
            expect(mockChart.toggleDatasetVisibility).not.toHaveBeenCalled();
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