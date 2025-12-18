/**
 * Mountain Taxes - HTML Legend Component
 * 
 * This component creates a custom HTML legend for the Chart.js visualization,
 * positioned at the bottom-start as specified. It provides better accessibility
 * and styling control compared to the default Canvas legend.
 */

import { TaxChart } from './chartComponent';
import { LegendItem, HtmlLegendConfig } from './types';
import { getAllStateNames } from './stateData';

/**
 * HTML Legend component for managing custom chart legend
 */
export class HtmlLegend {
    private container: HTMLElement;
    private chart: TaxChart;
    private legendContainer: HTMLElement | null = null;
    private config: HtmlLegendConfig;

    constructor(containerId: string, chart: TaxChart, config?: Partial<HtmlLegendConfig>) {
        const container = document.getElementById(containerId);
        if (!container) {
            throw new Error(`Container element with id '${containerId}' not found`);
        }
        this.container = container;
        this.chart = chart;
        this.config = {
            containerId,
            position: 'bottom-start',
            showTitle: true,
            titleText: 'Selected States',
            ...config
        };
        
        this.render();
        this.setupChartCallback();
    }

    /**
     * Render the HTML legend container
     */
    private render(): void {
        const titleHtml = this.config.showTitle ? `
            <div class="legend-title">
                <h6 class="mb-2">${this.config.titleText}</h6>
            </div>
        ` : '';

        this.container.innerHTML = `
            <div class="html-legend-container legend-position-${this.config.position}">
                ${titleHtml}
                <div id="legend-items" class="legend-items">
                    <!-- Legend items will be rendered here -->
                </div>
            </div>
        `;

        this.legendContainer = document.getElementById('legend-items');
        this.updateLegend();
    }

    /**
     * Setup callback to update legend when chart changes
     */
    private setupChartCallback(): void {
        this.chart.onLegendUpdate(() => {
            this.updateLegend();
        });
    }

    /**
     * Update the legend items based on all available states
     */
    public updateLegend(): void {
        if (!this.legendContainer) return;

        try {
            const allStates = getAllStateNames();
            const selectedStates = this.chart.getSelectedStates();
            const chartLegendItems = this.chart.generateLegendItems();
            
            // Create legend items for all states
            const legendItems: LegendItem[] = allStates.map((stateName, index) => {
                const isSelected = selectedStates.includes(stateName);
                const chartItem = chartLegendItems.find(item => item.label === stateName);
                
                return {
                    label: stateName,
                    color: chartItem?.color || this.getStateColor(index),
                    hidden: chartItem?.hidden || false,
                    datasetIndex: chartItem?.datasetIndex || -1,
                    isSelected: isSelected
                };
            });

            const legendHtml = legendItems.map(item => {
                // Determine Bootstrap button classes based on selection state
                // Unselected states use btn-secondary, selected states use btn-outline-secondary
                const buttonClass = !item.isSelected ? 'btn btn-secondary' : 'btn btn-outline-secondary';
                const hiddenClass = item.hidden ? 'legend-item-hidden' : '';
                
                // Create highlighted background color (lighter version of the main color)
                const highlightedBgColor = item.isSelected && !item.hidden ? this.lightenColor(item.color, 0.8) : 'transparent';
                
                return `
                    <button class="legend-item ${buttonClass} ${hiddenClass}" 
                            data-state-name="${item.label}"
                            data-dataset-index="${item.datasetIndex}"
                            type="button"
                            aria-label="${item.isSelected ? 'Hide' : 'Show'} ${item.label} ${item.isSelected && item.hidden ? '(currently hidden)' : ''}"
                            title="Click to ${item.isSelected ? (item.hidden ? 'show' : 'hide') : 'add'} ${item.label}"
                            style="background-color: ${highlightedBgColor}; ${item.isSelected && !item.hidden ? 'border-color: ' + item.color + ';' : ''}">
                        <div class="legend-color-box" 
                             style="background-color: ${item.color}; ${!item.isSelected ? 'opacity: 0.3;' : (item.hidden ? 'opacity: 0.5;' : '')}">
                        </div>
                        <span class="legend-label ${!item.isSelected ? 'text-muted' : (item.hidden ? 'text-muted' : '')}">${item.label}</span>
                    </button>
                `;
            }).join('');

            this.legendContainer.innerHTML = legendHtml;
            this.attachLegendEventListeners();
        } catch (error) {
            console.warn('Failed to generate legend items:', error);
            this.legendContainer.innerHTML = `
                <div class="no-states-message text-muted">
                    <small>Legend temporarily unavailable.</small>
                </div>
            `;
        }
    }

    /**
     * Get a consistent color for a state based on its index
     */
    private getStateColor(index: number): string {
        const colorPalette = [
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
        return colorPalette[index % colorPalette.length];
    }

    /**
     * Lighten a hex color by a given amount (0-1, where 1 is white)
     */
    private lightenColor(color: string, amount: number): string {
        // Remove # if present
        const hex = color.replace('#', '');
        
        // Parse RGB values
        const r = parseInt(hex.substr(0, 2), 16);
        const g = parseInt(hex.substr(2, 2), 16);
        const b = parseInt(hex.substr(4, 2), 16);
        
        // Lighten each component
        const newR = Math.round(r + (255 - r) * amount);
        const newG = Math.round(g + (255 - g) * amount);
        const newB = Math.round(b + (255 - b) * amount);
        
        // Convert back to hex
        const toHex = (n: number) => n.toString(16).padStart(2, '0');
        return `#${toHex(newR)}${toHex(newG)}${toHex(newB)}`;
    }

    /**
     * Attach event listeners to legend items
     */
    private attachLegendEventListeners(): void {
        if (!this.legendContainer) return;

        const legendItems = this.legendContainer.querySelectorAll('.legend-item');
        
        legendItems.forEach(item => {
            const handleToggle = () => {
                const stateName = item.getAttribute('data-state-name');
                
                if (!stateName) return;
                
                // Check current selection state directly from chart
                const isCurrentlySelected = this.chart.getSelectedStates().includes(stateName);
                
                try {
                    if (isCurrentlySelected) {
                        // State is selected - remove from chart completely
                        this.chart.removeState(stateName);
                    } else {
                        // State is not selected - add to chart
                        this.chart.addState(stateName);
                    }
                    // The chart's removeState/addState methods will call triggerLegendUpdate()
                    // which will call our updateLegend() method automatically
                } catch (error) {
                    console.warn(`Failed to ${isCurrentlySelected ? 'remove' : 'add'} state ${stateName}:`, error);
                }
            };

            // Handle click events
            item.addEventListener('click', handleToggle);
            
            // Handle keyboard events for accessibility
            item.addEventListener('keydown', (event: Event) => {
                const keyboardEvent = event as KeyboardEvent;
                if (keyboardEvent.key === 'Enter' || keyboardEvent.key === ' ') {
                    event.preventDefault();
                    handleToggle();
                }
            });
        });
    }

    /**
     * Get the legend container element
     */
    public getContainer(): HTMLElement {
        return this.container;
    }

    /**
     * Destroy the legend component
     */
    public destroy(): void {
        if (this.legendContainer) {
            this.legendContainer.innerHTML = '';
        }
        this.container.innerHTML = '';
    }
}