/**
 * Mountain Taxes - HTML Legend Component
 * 
 * This component creates a custom HTML legend for the Chart.js visualization,
 * positioned at the bottom-start as specified. It provides better accessibility
 * and styling control compared to the default Canvas legend.
 */

import { TaxChart } from './chartComponent';
import { LegendItem, HtmlLegendConfig } from './types';

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
     * Update the legend items based on current chart datasets
     */
    public updateLegend(): void {
        if (!this.legendContainer) return;

        let legendItems: LegendItem[] = [];
        
        try {
            legendItems = this.chart.generateLegendItems();
        } catch (error) {
            console.warn('Failed to generate legend items:', error);
            this.legendContainer.innerHTML = `
                <div class="no-states-message text-muted">
                    <small>Legend temporarily unavailable.</small>
                </div>
            `;
            return;
        }
        
        if (legendItems.length === 0) {
            this.legendContainer.innerHTML = `
                <div class="no-states-message text-muted">
                    <small>No states selected. Choose states above to see them in the legend.</small>
                </div>
            `;
            return;
        }

        const legendHtml = legendItems.map(item => `
            <div class="legend-item ${item.hidden ? 'legend-item-hidden' : ''}" 
                 data-dataset-index="${item.datasetIndex}"
                 role="button"
                 tabindex="0"
                 aria-label="Toggle ${item.label} visibility"
                 title="Click to toggle ${item.label} visibility">
                <div class="legend-color-box" 
                     style="background-color: ${item.color}; ${item.hidden ? 'opacity: 0.3;' : ''}">
                </div>
                <span class="legend-label ${item.hidden ? 'text-muted' : ''}">${item.label}</span>
            </div>
        `).join('');

        this.legendContainer.innerHTML = legendHtml;
        this.attachLegendEventListeners();
    }

    /**
     * Attach event listeners to legend items
     */
    private attachLegendEventListeners(): void {
        if (!this.legendContainer) return;

        const legendItems = this.legendContainer.querySelectorAll('.legend-item');
        
        legendItems.forEach(item => {
            const handleToggle = () => {
                const datasetIndex = parseInt(item.getAttribute('data-dataset-index') || '0');
                this.chart.toggleDatasetVisibility(datasetIndex);
                this.updateLegend();
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