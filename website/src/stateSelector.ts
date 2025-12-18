/**
 * Mountain Taxes - State Selection Component
 * 
 * This component manages the state selection interface, providing bulk operations
 * (All states, Remove all) for state selection and UI state management for the 
 * tax visualization chart. Individual state buttons have been removed to simplify
 * the interface while maintaining programmatic state selection capabilities.
 */

import { getAllStateNames } from './stateData';
import { TaxChart } from './chartComponent';

/**
 * State selector component for managing state selection UI and interactions.
 * Provides bulk operations for state selection without individual state buttons.
 */
export class StateSelector {
    private container: HTMLElement;
    private chart: TaxChart;
    private selectedStates: Set<string> = new Set();
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
                        <p class="text-muted">Use the bulk operations below to select states for comparison.</p>
                    </div>
                </div>
                
                <div class="row mb-3">
                    <div class="col-12">
                        <div class="bulk-controls">
                            <button id="all-states-btn" class="btn btn-primary btn-sm me-2">All States</button>
                            <button id="remove-all-btn" class="btn btn-secondary btn-sm">Remove All</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        this.attachEventListeners();
    }



    /**
     * Attach event listeners to bulk operation buttons
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
                this.updateStateButtonUI();
            } else {
                // Add state
                this.selectedStates.add(stateName);
                this.chart.addState(stateName);
                this.updateStateButtonUI();
            }
            this.updateBulkButtonsUI();
        } catch (error) {
            console.error(`Error toggling state ${stateName}:`, error);
            // Revert UI state if chart operation failed
            if (this.selectedStates.has(stateName)) {
                this.selectedStates.delete(stateName);
                this.updateStateButtonUI();
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
                    this.updateStateButtonUI();
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
                this.updateStateButtonUI();
            });
            this.updateBulkButtonsUI();
        } catch (error) {
            console.error('Error removing all states:', error);
            // Revert to previous state on error
            this.syncWithChart();
        }
    }

    /**
     * Update the visual state of a state (no longer used since individual buttons are removed)
     * Kept for backward compatibility with existing code
     */
    private updateStateButtonUI(): void {
        // No-op since individual state buttons have been removed
        // This method is kept to maintain compatibility with existing toggle logic
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

        // Update bulk button UI only (individual state buttons no longer exist)
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