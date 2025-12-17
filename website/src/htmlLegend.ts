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

            const legendHtml = legendItems.map(item => `
                <div class="legend-item ${!item.isSelected ? 'legend-item-unselected' : ''} ${item.hidden ? 'legend-item-hidden' : ''}" 
                     data-state-name="${item.label}"
                     data-dataset-index="${item.datasetIndex}"
                     role="button"
                     tabindex="0"
                     aria-label="${item.isSelected ? 'Hide' : 'Show'} ${item.label} ${item.isSelected && item.hidden ? '(currently hidden)' : ''}"
                     title="Click to ${item.isSelected ? (item.hidden ? 'show' : 'hide') : 'add'} ${item.label}">
                    <div class="legend-color-box" 
                         style="background-color: ${item.color}; ${!item.isSelected ? 'opacity: 0.3;' : (item.hidden ? 'opacity: 0.5;' : '')}">
                    </div>
                    <span class="legend-label ${!item.isSelected ? 'text-muted' : (item.hidden ? 'text-muted' : '')}">${item.label}</span>
                </div>
            `).join('');

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
     * Attach event listeners to legend items
     */
    private attachLegendEventListeners(): void {
        if (!this.legendContainer) return;

        const legendItems = this.legendContainer.querySelectorAll('.legend-item');
        
        legendItems.forEach(item => {
            const handleToggle = () => {
                const stateName = item.getAttribute('data-state-name');
                const datasetIndex = parseInt(item.getAttribute('data-dataset-index') || '-1');
                
                if (!stateName) return;
                
                if (datasetIndex >= 0) {
                    // State is selected - toggle visibility or remove from chart
                    this.chart.toggleDatasetVisibility(datasetIndex);
                } else {
                    // State is not selected - add to chart
                    try {
                        this.chart.addState(stateName);
                    } catch (error) {
                        console.warn(`Failed to add state ${stateName}:`, error);
                    }
                }
                
                // Update legend after change
                setTimeout(() => this.updateLegend(), 0);
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