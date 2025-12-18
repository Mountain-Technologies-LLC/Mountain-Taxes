/**
 * Mountain Taxes - Income Range Step Controls
 * 
 * This component provides UI controls for adjusting the income range displayed
 * on the tax comparison chart using step-by functionality and base income configuration.
 * Features step size selection, step count adjustment, and base income setting.
 */

import { TaxChart } from './chartComponent';
import { StepControlConfig } from './types';

/**
 * Income range controls component for managing chart income range with step-by functionality
 */
export class IncomeRangeControls {
    private taxChart: TaxChart;
    private container: HTMLElement;
    private config: StepControlConfig = {
        stepSize: 10000, // Default to 10k
        stepCount: 10,   // Default to 10 steps (0 to 100k)
        baseIncome: 0    // Default base income
    };

    constructor(containerId: string, taxChart: TaxChart) {
        const container = document.getElementById(containerId);
        if (!container) {
            throw new Error(`Container element with id '${containerId}' not found`);
        }
        this.container = container;
        this.taxChart = taxChart;
        this.render();
        this.updateChart();
    }

    /**
     * Render the income range controls UI with step-by functionality
     */
    private render(): void {
        this.container.innerHTML = `
            <div class="income-controls">
                <div class="row mb-3">
                    <div class="col-12">
                        <h6 class="mb-3">Income Range Controls</h6>
                        
                        <!-- Step By Controls -->
                        <form class="row g-3 align-items-center mb-3">
                            <div class="col-auto">
                                <label class="col-form-label">Step by</label>
                            </div>
                            <div class="col-auto">
                                <div class="btn-group" role="group" aria-label="Step size selection">
                                    <input type="radio" class="btn-check" name="step-size" id="step-1k" value="1000">
                                    <label class="btn btn-outline-primary btn-sm" for="step-1k">1k</label>
                                    
                                    <input type="radio" class="btn-check" name="step-size" id="step-10k" value="10000" checked>
                                    <label class="btn btn-outline-primary btn-sm" for="step-10k">10k</label>
                                    
                                    <input type="radio" class="btn-check" name="step-size" id="step-100k" value="100000">
                                    <label class="btn btn-outline-primary btn-sm" for="step-100k">100k</label>
                                    
                                    <input type="radio" class="btn-check" name="step-size" id="step-1m" value="1000000">
                                    <label class="btn btn-outline-primary btn-sm" for="step-1m">1m</label>
                                    
                                    <input type="radio" class="btn-check" name="step-size" id="step-10m" value="10000000">
                                    <label class="btn btn-outline-primary btn-sm" for="step-10m">10m</label>
                                    
                                    <input type="radio" class="btn-check" name="step-size" id="step-100m" value="100000000">
                                    <label class="btn btn-outline-primary btn-sm" for="step-100m">100m</label>
                                </div>
                            </div>
                            <div class="col-auto">
                                <div class="input-group input-group-sm">
                                    <span class="input-group-text">Step Count</span>
                                    <button class="btn btn-outline-secondary" type="button" id="step-count-minus">-</button>
                                    <input type="number" class="form-control text-center" id="step-count" value="${this.config.stepCount}" min="1" max="100" style="width: 60px;">
                                    <button class="btn btn-outline-secondary" type="button" id="step-count-plus">+</button>
                                </div>
                            </div>
                        </form>
                        
                        <!-- Base Income Controls -->
                        <form class="row g-3 align-items-center mb-3">
                            <div class="col-auto">
                                <label for="base-income" class="col-form-label">Start Base Income at</label>
                            </div>
                            <div class="col-auto">
                                <input type="number" class="form-control form-control-sm" id="base-income" value="${this.config.baseIncome}" min="0" step="1000" style="width: 120px;">
                            </div>
                        </form>
                        
                        <!-- Range Information -->
                        <div class="mt-2">
                            <small class="text-muted" id="range-info">
                                Current range: ${this.formatCurrency(this.config.baseIncome)} - ${this.formatCurrency(this.calculateMaxIncome())}
                            </small>
                        </div>
                    </div>
                </div>
            </div>
        `;

        this.attachEventListeners();
    }

    /**
     * Attach event listeners to the control elements
     */
    private attachEventListeners(): void {
        // Step size radio buttons
        const stepSizeInputs = document.querySelectorAll('input[name="step-size"]');
        stepSizeInputs.forEach(input => {
            input.addEventListener('change', (event) => {
                const target = event.target as HTMLInputElement;
                if (target.checked) {
                    this.config.stepSize = parseInt(target.value);
                    this.updateChart();
                    this.updateRangeInfo();
                }
            });
        });

        // Step count controls
        const stepCountInput = document.getElementById('step-count') as HTMLInputElement;
        const stepCountMinus = document.getElementById('step-count-minus');
        const stepCountPlus = document.getElementById('step-count-plus');

        if (stepCountInput) {
            stepCountInput.addEventListener('input', (event) => {
                const target = event.target as HTMLInputElement;
                const value = parseInt(target.value);
                if (value >= 1 && value <= 100) {
                    this.config.stepCount = value;
                    this.updateChart();
                    this.updateRangeInfo();
                }
            });
        }

        if (stepCountMinus) {
            stepCountMinus.addEventListener('click', () => {
                if (this.config.stepCount > 1) {
                    this.config.stepCount--;
                    if (stepCountInput) {
                        stepCountInput.value = this.config.stepCount.toString();
                    }
                    this.updateChart();
                    this.updateRangeInfo();
                }
            });
        }

        if (stepCountPlus) {
            stepCountPlus.addEventListener('click', () => {
                if (this.config.stepCount < 100) {
                    this.config.stepCount++;
                    if (stepCountInput) {
                        stepCountInput.value = this.config.stepCount.toString();
                    }
                    this.updateChart();
                    this.updateRangeInfo();
                }
            });
        }

        // Base income input
        const baseIncomeInput = document.getElementById('base-income') as HTMLInputElement;
        if (baseIncomeInput) {
            baseIncomeInput.addEventListener('input', (event) => {
                const target = event.target as HTMLInputElement;
                const value = parseInt(target.value) || 0;
                if (value >= 0) {
                    this.config.baseIncome = value;
                    this.updateChart();
                    this.updateRangeInfo();
                }
            });
        }
    }

    /**
     * Calculate the maximum income based on current configuration
     */
    private calculateMaxIncome(): number {
        return this.config.baseIncome + (this.config.stepSize * this.config.stepCount);
    }

    /**
     * Update the chart with current step configuration
     */
    private updateChart(): void {
        try {
            const maxIncome = this.calculateMaxIncome();
            this.taxChart.setIncomeRange(this.config.baseIncome, maxIncome, this.config.stepSize);
            console.log(`Updated chart range: ${this.formatCurrency(this.config.baseIncome)} - ${this.formatCurrency(maxIncome)} (step: ${this.formatCurrency(this.config.stepSize)})`);
        } catch (error) {
            console.error('Error updating chart:', error);
            this.showError('Failed to update income range');
        }
    }

    /**
     * Update the range information display
     */
    private updateRangeInfo(): void {
        const rangeInfo = document.getElementById('range-info');
        if (rangeInfo) {
            const maxIncome = this.calculateMaxIncome();
            rangeInfo.textContent = `Current range: ${this.formatCurrency(this.config.baseIncome)} - ${this.formatCurrency(maxIncome)}`;
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
     * Get the current step control configuration
     */
    public getConfig(): StepControlConfig {
        return { ...this.config };
    }

    /**
     * Set the step control configuration
     */
    public setConfig(config: Partial<StepControlConfig>): void {
        this.config = { ...this.config, ...config };
        this.updateChart();
        this.updateRangeInfo();
        this.updateUIFromConfig();
    }

    /**
     * Update UI elements to reflect current configuration
     */
    private updateUIFromConfig(): void {
        // Update step size radio buttons
        const stepSizeInput = document.querySelector(`input[name="step-size"][value="${this.config.stepSize}"]`) as HTMLInputElement;
        if (stepSizeInput) {
            stepSizeInput.checked = true;
        }

        // Update step count input
        const stepCountInput = document.getElementById('step-count') as HTMLInputElement;
        if (stepCountInput) {
            stepCountInput.value = this.config.stepCount.toString();
        }

        // Update base income input
        const baseIncomeInput = document.getElementById('base-income') as HTMLInputElement;
        if (baseIncomeInput) {
            baseIncomeInput.value = this.config.baseIncome.toString();
        }
    }

    /**
     * Refresh the controls (useful after external chart changes)
     */
    public refresh(): void {
        this.updateRangeInfo();
        this.updateUIFromConfig();
    }
}