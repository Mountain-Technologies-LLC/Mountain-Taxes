/**
 * Mountain Taxes Calculator - State Selection Component
 * 
 * This component manages the state selection interface, providing buttons for
 * individual state selection, bulk operations (All states, Remove all), and
 * UI state management for the tax visualization chart.
 */

import { getAllStateNames } from './stateData';
import { TaxChart } from './chartComponent';

/**
 * State selector component for managing state selection UI and interactions
 */
export class StateSelector {
    private container: HTMLElement;
    private chart: TaxChart;
    private selectedStates: Set<string> = new Set();
    private stateButtons: Map<string, HTMLButtonElement> = new Map();
    private allStatesButton: HTMLButtonElement | null = null;
    private removeAllButton: HTMLButtonElement | null = null;

    constructor(containerId: string, chart: TaxChart) {
        const container = document.getElementById(containerId);
        if (!container) {
            throw new Error(`Container element with id '${containerId}' not found`);
        }
        this.container = container;
        this.chart = chart;
        this.render();
    }

    /**
     * Render the complete state selection interface
     */
    private render(): void {
        this.container.innerHTML = `
            <div class="state-selector">
                <div class="row mb-3">
                    <div class="col-12">
                        <h5>Select States to Compare</h5>
                        <p class="text-muted">Click individual states to add/remove them from the chart, or use the bulk operations below.</p>
                    </div>
                </div>
                
                <div class="row mb-3">
                    <div class="col-12">
                        <div class="bulk-controls">
                            <button id="all-states-btn" class="btn btn-primary btn-sm me-2">All States</button>
                            <button id="remove-all-btn" class="btn btn-outline-secondary btn-sm">Remove All</button>
                        </div>
                    </div>
                </div>
                
                <div class="row">
                    <div class="col-12">
                        <div id="state-buttons-container" class="state-buttons-grid">
                            <!-- State buttons will be rendered here -->
                        </div>
                    </div>
                </div>
            </div>
        `;

        this.renderStateButtons();
        this.attachEventListeners();
    }

    /**
     * Render individual state buttons
     */
    private renderStateButtons(): void {
        const stateButtonsContainer = document.getElementById('state-buttons-container');
        if (!stateButtonsContainer) return;

        const allStates = getAllStateNames();
        const buttonsHtml = allStates.map(stateName => {
            const buttonId = `state-btn-${stateName.replace(/\s+/g, '-').toLowerCase()}`;
            return `
                <button 
                    id="${buttonId}" 
                    class="btn btn-outline-primary btn-sm state-button" 
                    data-state="${stateName}"
                    type="button"
                >
                    ${stateName}
                </button>
            `;
        }).join('');

        stateButtonsContainer.innerHTML = buttonsHtml;

        // Store references to state buttons
        this.stateButtons.clear();
        allStates.forEach(stateName => {
            const buttonId = `state-btn-${stateName.replace(/\s+/g, '-').toLowerCase()}`;
            const button = document.getElementById(buttonId) as HTMLButtonElement;
            if (button) {
                this.stateButtons.set(stateName, button);
            }
        });
    }

    /**
     * Attach event listeners to all buttons
     */
    private attachEventListeners(): void {
        // Bulk operation buttons
        this.allStatesButton = document.getElementById('all-states-btn') as HTMLButtonElement;
        this.removeAllButton = document.getElementById('remove-all-btn') as HTMLButtonElement;

        if (this.allStatesButton) {
            this.allStatesButton.addEventListener('click', () => this.selectAllStates());
        }

        if (this.removeAllButton) {
            this.removeAllButton.addEventListener('click', () => this.removeAllStates());
        }

        // Individual state buttons
        this.stateButtons.forEach((button, stateName) => {
            button.addEventListener('click', () => this.toggleState(stateName));
        });

        // Initialize bulk button UI state
        this.updateBulkButtonsUI();
    }

    /**
     * Toggle selection of an individual state
     */
    public toggleState(stateName: string): void {
        try {
            if (this.selectedStates.has(stateName)) {
                // Remove state
                this.selectedStates.delete(stateName);
                this.chart.removeState(stateName);
                this.updateStateButtonUI(stateName, false);
            } else {
                // Add state
                this.selectedStates.add(stateName);
                this.chart.addState(stateName);
                this.updateStateButtonUI(stateName, true);
            }
            this.updateBulkButtonsUI();
        } catch (error) {
            console.error(`Error toggling state ${stateName}:`, error);
            // Revert UI state if chart operation failed
            if (this.selectedStates.has(stateName)) {
                this.selectedStates.delete(stateName);
                this.updateStateButtonUI(stateName, false);
            }
        }
    }

    /**
     * Select all states
     */
    public selectAllStates(): void {
        const allStates = getAllStateNames();
        
        try {
            // Add all states that aren't already selected
            allStates.forEach(stateName => {
                if (!this.selectedStates.has(stateName)) {
                    this.selectedStates.add(stateName);
                    this.chart.addState(stateName);
                    this.updateStateButtonUI(stateName, true);
                }
            });
            this.updateBulkButtonsUI();
        } catch (error) {
            console.error('Error selecting all states:', error);
            // Revert to previous state on error
            this.syncWithChart();
        }
    }

    /**
     * Remove all selected states
     */
    public removeAllStates(): void {
        try {
            // Remove all selected states
            const statesToRemove = Array.from(this.selectedStates);
            statesToRemove.forEach(stateName => {
                this.selectedStates.delete(stateName);
                this.chart.removeState(stateName);
                this.updateStateButtonUI(stateName, false);
            });
            this.updateBulkButtonsUI();
        } catch (error) {
            console.error('Error removing all states:', error);
            // Revert to previous state on error
            this.syncWithChart();
        }
    }

    /**
     * Update the visual state of a state button
     */
    private updateStateButtonUI(stateName: string, isSelected: boolean): void {
        const button = this.stateButtons.get(stateName);
        if (!button) return;

        if (isSelected) {
            button.classList.remove('btn-outline-primary');
            button.classList.add('btn-primary');
        } else {
            button.classList.remove('btn-primary');
            button.classList.add('btn-outline-primary');
        }
    }

    /**
     * Update the visual state of bulk operation buttons
     */
    private updateBulkButtonsUI(): void {
        const allStates = getAllStateNames();
        const allSelected = allStates.length > 0 && allStates.every(state => this.selectedStates.has(state));
        const noneSelected = this.selectedStates.size === 0;

        // Update "All States" button
        if (this.allStatesButton) {
            if (allSelected) {
                this.allStatesButton.classList.remove('btn-primary');
                this.allStatesButton.classList.add('btn-success');
                this.allStatesButton.textContent = 'All Selected';
            } else {
                this.allStatesButton.classList.remove('btn-success');
                this.allStatesButton.classList.add('btn-primary');
                this.allStatesButton.textContent = 'All States';
            }
        }

        // Update "Remove All" button
        if (this.removeAllButton) {
            this.removeAllButton.disabled = noneSelected;
            if (noneSelected) {
                this.removeAllButton.classList.add('btn-outline-secondary');
                this.removeAllButton.classList.remove('btn-outline-danger');
            } else {
                this.removeAllButton.classList.remove('btn-outline-secondary');
                this.removeAllButton.classList.add('btn-outline-danger');
            }
        }
    }

    /**
     * Synchronize the UI state with the chart's actual state
     * (useful for error recovery)
     */
    private syncWithChart(): void {
        const chartSelectedStates = this.chart.getSelectedStates();
        
        // Update internal state
        this.selectedStates.clear();
        chartSelectedStates.forEach(state => this.selectedStates.add(state));

        // Update UI for all buttons
        this.stateButtons.forEach((_, stateName) => {
            const isSelected = this.selectedStates.has(stateName);
            this.updateStateButtonUI(stateName, isSelected);
        });

        this.updateBulkButtonsUI();
    }

    /**
     * Get currently selected states
     */
    public getSelectedStates(): string[] {
        return Array.from(this.selectedStates);
    }

    /**
     * Check if a state is currently selected
     */
    public isStateSelected(stateName: string): boolean {
        return this.selectedStates.has(stateName);
    }

    /**
     * Programmatically select specific states (useful for initialization)
     */
    public setSelectedStates(stateNames: string[]): void {
        // Clear current selection
        this.removeAllStates();

        // Add specified states
        stateNames.forEach(stateName => {
            if (getAllStateNames().includes(stateName)) {
                this.toggleState(stateName);
            }
        });
    }

    /**
     * Get the total number of available states
     */
    public getTotalStatesCount(): number {
        return getAllStateNames().length;
    }

    /**
     * Get the number of currently selected states
     */
    public getSelectedStatesCount(): number {
        return this.selectedStates.size;
    }
}