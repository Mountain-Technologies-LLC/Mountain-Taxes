/**
 * Mountain Taxes - Income Range Adjustment Controls
 * 
 * This component provides UI controls for adjusting the income range displayed
 * on the tax comparison chart. It includes buttons for extending the range by
 * various increments and reducing the range.
 */

import { TaxChart } from './chartComponent';

/**
 * Income range controls component for managing chart income range
 */
export class IncomeRangeControls {
    private taxChart: TaxChart;
    private container: HTMLElement;
    private lastIncrement: number = 0;

    constructor(containerId: string, taxChart: TaxChart) {
        const container = document.getElementById(containerId);
        if (!container) {
            throw new Error(`Container element with id '${containerId}' not found`);
        }
        this.container = container;
        this.taxChart = taxChart;
        this.render();
    }

    /**
     * Render the income range controls UI
     */
    private render(): void {
        this.container.innerHTML = `
            <div class="income-controls">
                <div class="row">
                    <div class="col-12">
                        <h6 class="mb-3">Earned Income Range Adjustment</h6>
                        <div class="btn-group flex-wrap" role="group" aria-label="Earned Income range controls">
                            <button type="button" class="btn btn-primary btn-sm" id="add-10k">
                                Add 10k
                            </button>
                            <button type="button" class="btn btn-primary btn-sm" id="add-100k">
                                Add 100k
                            </button>
                            <button type="button" class="btn btn-primary btn-sm" id="add-1m">
                                Add 1m
                            </button>
                            <button type="button" class="btn btn-primary btn-sm" id="add-10m">
                                Add 10m
                            </button>
                            <button type="button" class="btn btn-danger btn-sm" id="remove-data-set">
                                Remove data set
                            </button>
                        </div>
                        <div class="mt-2">
                            <small class="text-muted" id="range-info">
                                Current range: $0 - ${this.formatCurrency(this.taxChart.getIncomeRange().max)}
                            </small>
                        </div>
                    </div>
                </div>
            </div>
        `;

        this.attachEventListeners();
        this.updateRangeInfo();
    }

    /**
     * Attach event listeners to the control buttons
     */
    private attachEventListeners(): void {
        // Add 10k button
        const add10kBtn = document.getElementById('add-10k');
        if (add10kBtn) {
            add10kBtn.addEventListener('click', () => this.extendRange(10000));
        }

        // Add 100k button
        const add100kBtn = document.getElementById('add-100k');
        if (add100kBtn) {
            add100kBtn.addEventListener('click', () => this.extendRange(100000));
        }

        // Add 1m button
        const add1mBtn = document.getElementById('add-1m');
        if (add1mBtn) {
            add1mBtn.addEventListener('click', () => this.extendRange(1000000));
        }

        // Add 10m button
        const add10mBtn = document.getElementById('add-10m');
        if (add10mBtn) {
            add10mBtn.addEventListener('click', () => this.extendRange(10000000));
        }

        // Remove data set button
        const removeBtn = document.getElementById('remove-data-set');
        if (removeBtn) {
            removeBtn.addEventListener('click', () => this.removeDataSet());
        }
    }

    /**
     * Extend the income range by the specified increment
     */
    private extendRange(increment: number): void {
        try {
            this.taxChart.extendRange(increment);
            this.lastIncrement = increment;
            this.updateRangeInfo();
            this.updateRemoveButtonState();
            
            console.log(`Extended income range by ${this.formatCurrency(increment)}`);
        } catch (error) {
            console.error('Error extending range:', error);
            this.showError('Failed to extend income range');
        }
    }

    /**
     * Remove the last added data set (reduce range by last increment)
     */
    private removeDataSet(): void {
        if (this.lastIncrement <= 0) {
            console.warn('No previous increment to remove');
            return;
        }

        try {
            this.taxChart.reduceRange(this.lastIncrement);
            this.lastIncrement = 0;
            this.updateRangeInfo();
            this.updateRemoveButtonState();
            
            console.log('Removed last data set increment');
        } catch (error) {
            console.error('Error removing data set:', error);
            this.showError('Failed to remove data set');
        }
    }

    /**
     * Update the range information display
     */
    private updateRangeInfo(): void {
        const rangeInfo = document.getElementById('range-info');
        if (rangeInfo) {
            const range = this.taxChart.getIncomeRange();
            rangeInfo.textContent = `Current range: $0 - ${this.formatCurrency(range.max)}`;
        }
    }

    /**
     * Update the state of the remove button based on whether there's a last increment
     */
    private updateRemoveButtonState(): void {
        const removeBtn = document.getElementById('remove-data-set') as HTMLButtonElement;
        if (removeBtn) {
            if (this.lastIncrement == 0) {
                removeBtn.classList.add('disabled');
            } else {
                removeBtn.classList.remove('disabled');
            }

            removeBtn.title = this.lastIncrement <= 0 
                ? 'No increment to remove' 
                : `Remove last increment of ${this.formatCurrency(this.lastIncrement)}`;
        }
    }

    /**
     * Format currency values for display
     */
    private formatCurrency(value: number): string {
        if (value >= 1000000000) {
            return `$${(value / 1000000000).toFixed(1)}B`;
        } else if (value >= 1000000) {
            return `$${(value / 1000000).toFixed(1)}M`;
        } else if (value >= 10000) {
            return `$${(value / 1000).toFixed(0)}K`;
        } else {
            return `$${value.toLocaleString()}`;
        }
    }

    /**
     * Show error message to user
     */
    private showError(message: string): void {
        // Create a temporary alert
        const alert = document.createElement('div');
        alert.className = 'alert alert-danger alert-dismissible fade show mt-2';
        alert.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        `;
        
        this.container.appendChild(alert);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (alert.parentNode) {
                alert.parentNode.removeChild(alert);
            }
        }, 5000);
    }

    /**
     * Get the last increment value
     */
    public getLastIncrement(): number {
        return this.lastIncrement;
    }

    /**
     * Reset the last increment (useful for testing)
     */
    public resetLastIncrement(): void {
        this.lastIncrement = 0;
        this.updateRemoveButtonState();
    }

    /**
     * Refresh the controls (useful after external chart changes)
     */
    public refresh(): void {
        this.updateRangeInfo();
        this.updateRemoveButtonState();
    }
}