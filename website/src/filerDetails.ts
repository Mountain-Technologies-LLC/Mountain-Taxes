/**
 * Mountain Taxes - Filer Details Component
 * 
 * This component provides a card interface for selecting filing type (Single or Married)
 * and manages the filing type state for tax calculations.
 */

import { FilingTypeName } from './types';
import { TaxChart } from './chartComponent';

/**
 * Configuration for the Filer Details component
 */
export interface FilerDetailsConfig {
    /** Container element ID where the component will be rendered */
    containerId: string;
    /** Default filing type */
    defaultFilingType: FilingTypeName;
    /** Callback function when filing type changes */
    onFilingTypeChange?: (filingType: FilingTypeName) => void;
}

/**
 * Filer Details Component
 * Provides UI for selecting filing type and manages filing type state
 */
export class FilerDetails {
    private containerId: string;
    private currentFilingType: FilingTypeName;
    private onFilingTypeChange?: (filingType: FilingTypeName) => void;
    private taxChart?: TaxChart;

    constructor(containerId: string, taxChart?: TaxChart, config?: Partial<FilerDetailsConfig>) {
        this.containerId = containerId;
        this.taxChart = taxChart;
        this.currentFilingType = config?.defaultFilingType || FilingTypeName.Single;
        this.onFilingTypeChange = config?.onFilingTypeChange;
        
        this.render();
        this.attachEventListeners();
    }

    /**
     * Render the filer details component
     */
    private render(): void {
        const container = document.getElementById(this.containerId);
        if (!container) {
            console.error(`Container with ID '${this.containerId}' not found`);
            return;
        }

        container.innerHTML = `
            <div class="card">
                <div class="card-header bg-primary">
                    <h5 class="card-title mb-0">
                        <i class="fas fa-user me-2" aria-hidden="true"></i>
                        Filer Details
                    </h5>
                </div>
                <div class="card-body py-2">
                    <div class="d-flex align-items-center justify-content-center">
                        <label class="form-label me-3 mb-0 fw-bold text-nowrap">Filing Type:</label>
                        <div class="btn-group btn-group-sm" role="group" aria-label="Filing Type Selection">
                            <input type="radio" class="btn-check" name="filingType" id="filing-single" value="${FilingTypeName.Single}" ${this.currentFilingType === FilingTypeName.Single ? 'checked' : ''}>
                            <label class="btn btn-outline-primary" for="filing-single">
                                <i class="fas fa-user me-1" aria-hidden="true"></i>
                                Single
                            </label>
                            
                            <input type="radio" class="btn-check" name="filingType" id="filing-married" value="${FilingTypeName.Married}" ${this.currentFilingType === FilingTypeName.Married ? 'checked' : ''}>
                            <label class="btn btn-outline-primary" for="filing-married">
                                <i class="fas fa-users me-1" aria-hidden="true"></i>
                                Married
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Attach event listeners for filing type selection
     */
    private attachEventListeners(): void {
        const container = document.getElementById(this.containerId);
        if (!container) return;

        // Listen for filing type radio button changes
        const filingTypeInputs = container.querySelectorAll('input[name="filingType"]');
        filingTypeInputs.forEach(input => {
            input.addEventListener('change', (event) => {
                const target = event.target as HTMLInputElement;
                if (target.checked) {
                    const newFilingType = target.value as FilingTypeName;
                    this.setFilingType(newFilingType);
                }
            });
        });
    }

    /**
     * Set the current filing type and update the chart
     */
    public setFilingType(filingType: FilingTypeName): void {
        if (this.currentFilingType === filingType) return;

        this.currentFilingType = filingType;
        
        // Update the UI to reflect the new selection
        this.updateUI();
        
        // Notify the tax chart of the filing type change
        if (this.taxChart) {
            this.taxChart.setFilingType(filingType);
        }
        
        // Call the callback if provided
        if (this.onFilingTypeChange) {
            this.onFilingTypeChange(filingType);
        }
        
        console.log(`Filing type changed to: ${filingType}`);
    }

    /**
     * Update the UI to reflect the current filing type selection
     */
    private updateUI(): void {
        const container = document.getElementById(this.containerId);
        if (!container) return;

        const filingTypeInputs = container.querySelectorAll('input[name="filingType"]');
        filingTypeInputs.forEach(input => {
            const inputElement = input as HTMLInputElement;
            inputElement.checked = inputElement.value === this.currentFilingType;
        });
    }

    /**
     * Get the current filing type
     */
    public getFilingType(): FilingTypeName {
        return this.currentFilingType;
    }

    /**
     * Set the tax chart reference for updates
     */
    public setTaxChart(taxChart: TaxChart): void {
        this.taxChart = taxChart;
    }

    /**
     * Destroy the component and clean up event listeners
     */
    public destroy(): void {
        const container = document.getElementById(this.containerId);
        if (container) {
            container.innerHTML = '';
        }
    }
}