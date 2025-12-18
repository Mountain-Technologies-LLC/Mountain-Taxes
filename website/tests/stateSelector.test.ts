/**
 * Mountain Taxes - State Selector Tests
 * 
 * This file contains unit tests and property-based tests for the state selection component.
 */

import { StateSelector } from '../src/stateSelector';
import { TaxChart } from '../src/chartComponent';
import { getAllStateNames } from '../src/stateData';
import * as fc from 'fast-check';

// Mock Chart.js
jest.mock('chart.js', () => ({
    Chart: jest.fn().mockImplementation((_ctx, config) => ({
        destroy: jest.fn(),
        update: jest.fn(),
        data: { 
            datasets: [],
            labels: []
        },
        options: config?.options || {
            responsive: true,
            maintainAspectRatio: false
        }
    })),
    registerables: []
}));

describe('StateSelector Component', () => {
    let mockCanvas: HTMLCanvasElement;
    let mockContext: CanvasRenderingContext2D;
    let mockContainer: HTMLElement;
    let taxChart: TaxChart;
    let stateSelector: StateSelector;

    beforeEach(() => {
        // Create mock canvas and context
        mockCanvas = document.createElement('canvas');
        mockCanvas.id = 'test-chart';
        mockContext = {
            getContext: jest.fn()
        } as any;
        
        // Mock getContext to return our mock context
        jest.spyOn(mockCanvas, 'getContext').mockReturnValue(mockContext);
        
        // Create mock container for state selector
        mockContainer = document.createElement('div');
        mockContainer.id = 'test-state-selector';
        
        // Add elements to document
        document.body.appendChild(mockCanvas);
        document.body.appendChild(mockContainer);
        
        // Initialize components
        taxChart = new TaxChart('test-chart');
        stateSelector = new StateSelector('test-state-selector', taxChart);
    });

    afterEach(() => {
        // Clean up
        taxChart.destroy();
        document.body.innerHTML = '';
        jest.clearAllMocks();
    });

    describe('Component Initialization', () => {
        test('should initialize with correct container and chart', () => {
            expect(stateSelector).toBeDefined();
            expect(stateSelector.getSelectedStatesCount()).toBe(0);
            expect(stateSelector.getTotalStatesCount()).toBe(50);
        });

        test('should throw error if container not found', () => {
            expect(() => new StateSelector('nonexistent-container', taxChart)).toThrow('Container element with id \'nonexistent-container\' not found');
        });

        test('should not render individual state buttons', () => {
            const allStates = getAllStateNames();
            allStates.forEach(stateName => {
                const buttonId = `state-btn-${stateName.replace(/\s+/g, '-').toLowerCase()}`;
                const button = document.getElementById(buttonId);
                expect(button).toBeFalsy();
            });
        });

        test('should render bulk operation buttons', () => {
            const allStatesBtn = document.getElementById('all-states-btn');
            const removeAllBtn = document.getElementById('remove-all-btn');
            
            expect(allStatesBtn).toBeTruthy();
            expect(removeAllBtn).toBeTruthy();
            expect(allStatesBtn?.textContent?.trim()).toBe('All States');
            expect(removeAllBtn?.textContent?.trim()).toBe('Remove All');
        });
    });

    describe('Individual State Selection', () => {
        test('should toggle individual state selection', () => {
            const stateName = 'Colorado';
            
            // Initially not selected
            expect(stateSelector.isStateSelected(stateName)).toBe(false);
            expect(taxChart.isStateSelected(stateName)).toBe(false);
            
            // Toggle to select
            stateSelector.toggleState(stateName);
            expect(stateSelector.isStateSelected(stateName)).toBe(true);
            expect(taxChart.isStateSelected(stateName)).toBe(true);
            
            // Toggle to deselect
            stateSelector.toggleState(stateName);
            expect(stateSelector.isStateSelected(stateName)).toBe(false);
            expect(taxChart.isStateSelected(stateName)).toBe(false);
        });

        test('should toggle state selection without individual button UI', () => {
            const stateName = 'California';
            
            // Individual state buttons no longer exist
            const buttonId = `state-btn-${stateName.replace(/\s+/g, '-').toLowerCase()}`;
            const button = document.getElementById(buttonId) as HTMLButtonElement;
            expect(button).toBeFalsy();
            
            // State selection should still work programmatically
            expect(stateSelector.isStateSelected(stateName)).toBe(false);
            stateSelector.toggleState(stateName);
            expect(stateSelector.isStateSelected(stateName)).toBe(true);
            stateSelector.toggleState(stateName);
            expect(stateSelector.isStateSelected(stateName)).toBe(false);
        });
    });

    describe('Bulk Operations', () => {
        test('should select all states', () => {
            stateSelector.selectAllStates();
            
            const allStates = getAllStateNames();
            expect(stateSelector.getSelectedStatesCount()).toBe(allStates.length);
            
            allStates.forEach(stateName => {
                expect(stateSelector.isStateSelected(stateName)).toBe(true);
                expect(taxChart.isStateSelected(stateName)).toBe(true);
            });
        });

        test('should remove all states', () => {
            // First select some states
            stateSelector.toggleState('Colorado');
            stateSelector.toggleState('California');
            stateSelector.toggleState('Texas');
            
            expect(stateSelector.getSelectedStatesCount()).toBe(3);
            
            // Remove all
            stateSelector.removeAllStates();
            expect(stateSelector.getSelectedStatesCount()).toBe(0);
            expect(taxChart.getSelectedStates()).toHaveLength(0);
        });

        test('should update bulk button UI correctly', () => {
            const allStatesBtn = document.getElementById('all-states-btn') as HTMLButtonElement;
            const removeAllBtn = document.getElementById('remove-all-btn') as HTMLButtonElement;
            
            // Initially remove all should be disabled
            expect(removeAllBtn.disabled).toBe(true);
            expect(allStatesBtn.textContent?.trim()).toBe('All States');
            
            // After selecting all states
            stateSelector.selectAllStates();
            expect(removeAllBtn.disabled).toBe(false);
            expect(allStatesBtn.textContent?.trim()).toBe('All Selected');
            expect(allStatesBtn.classList.contains('btn-success')).toBe(true);
            
            // After removing all states
            stateSelector.removeAllStates();
            expect(removeAllBtn.disabled).toBe(true);
            expect(allStatesBtn.textContent?.trim()).toBe('All States');
            expect(allStatesBtn.classList.contains('btn-primary')).toBe(true);
        });
    });

    describe('Programmatic State Management', () => {
        test('should set specific states programmatically', () => {
            const statesToSet = ['Colorado', 'California', 'New York'];
            stateSelector.setSelectedStates(statesToSet);
            
            expect(stateSelector.getSelectedStatesCount()).toBe(3);
            statesToSet.forEach(stateName => {
                expect(stateSelector.isStateSelected(stateName)).toBe(true);
            });
        });

        test('should ignore invalid state names', () => {
            const statesToSet = ['Colorado', 'InvalidState', 'California'];
            stateSelector.setSelectedStates(statesToSet);
            
            expect(stateSelector.getSelectedStatesCount()).toBe(2);
            expect(stateSelector.isStateSelected('Colorado')).toBe(true);
            expect(stateSelector.isStateSelected('California')).toBe(true);
            expect(stateSelector.isStateSelected('InvalidState')).toBe(false);
        });
    });

    // Property-Based Tests
    describe('Property-Based Tests', () => {
        /**
         * **Feature: mountain-taxes-calculator, Property 5: State selection toggle behavior**
         * **Validates: Requirements 3.1, 3.4**
         */
        test('Property 5: State selection toggle behavior', () => {
            fc.assert(fc.property(
                fc.constantFrom(...getAllStateNames()),
                (stateName) => {
                    // Start with a clean state
                    stateSelector.removeAllStates();
                    
                    // Initial state: should not be selected
                    const initiallySelected = stateSelector.isStateSelected(stateName);
                    const initiallySelectedInChart = taxChart.isStateSelected(stateName);
                    expect(initiallySelected).toBe(false);
                    expect(initiallySelectedInChart).toBe(false);
                    
                    // First toggle: should select the state
                    stateSelector.toggleState(stateName);
                    const afterFirstToggle = stateSelector.isStateSelected(stateName);
                    const afterFirstToggleInChart = taxChart.isStateSelected(stateName);
                    expect(afterFirstToggle).toBe(true);
                    expect(afterFirstToggleInChart).toBe(true);
                    
                    // State selector and chart should be in sync
                    expect(afterFirstToggle).toBe(afterFirstToggleInChart);
                    
                    // Second toggle: should deselect the state
                    stateSelector.toggleState(stateName);
                    const afterSecondToggle = stateSelector.isStateSelected(stateName);
                    const afterSecondToggleInChart = taxChart.isStateSelected(stateName);
                    expect(afterSecondToggle).toBe(false);
                    expect(afterSecondToggleInChart).toBe(false);
                    
                    // State selector and chart should still be in sync
                    expect(afterSecondToggle).toBe(afterSecondToggleInChart);
                    
                    // Should return to initial state
                    expect(afterSecondToggle).toBe(initiallySelected);
                    expect(afterSecondToggleInChart).toBe(initiallySelectedInChart);
                    
                    // Individual state buttons no longer exist, so no UI validation needed
                    const buttonId = `state-btn-${stateName.replace(/\s+/g, '-').toLowerCase()}`;
                    const button = document.getElementById(buttonId) as HTMLButtonElement;
                    expect(button).toBeFalsy();
                }
            ), { numRuns: 100 });
        });
    });

    describe('Unit Tests for Bulk State Operations', () => {
        test('should select all states functionality', () => {
            // Start with no states selected
            expect(stateSelector.getSelectedStatesCount()).toBe(0);
            
            // Select all states
            stateSelector.selectAllStates();
            
            // Verify all states are selected
            const allStates = getAllStateNames();
            expect(stateSelector.getSelectedStatesCount()).toBe(allStates.length);
            expect(taxChart.getSelectedStates()).toHaveLength(allStates.length);
            
            // Verify each state is selected in both components
            allStates.forEach(stateName => {
                expect(stateSelector.isStateSelected(stateName)).toBe(true);
                expect(taxChart.isStateSelected(stateName)).toBe(true);
            });
            
            // Verify UI state
            const allStatesBtn = document.getElementById('all-states-btn') as HTMLButtonElement;
            const removeAllBtn = document.getElementById('remove-all-btn') as HTMLButtonElement;
            
            expect(allStatesBtn.textContent?.trim()).toBe('All Selected');
            expect(allStatesBtn.classList.contains('btn-success')).toBe(true);
            expect(removeAllBtn.disabled).toBe(false);
            expect(removeAllBtn.classList.contains('btn-outline-danger')).toBe(true);
        });

        test('should remove all states functionality', () => {
            // First select some states
            const testStates = ['Colorado', 'California', 'Texas', 'New York', 'Florida'];
            testStates.forEach(stateName => {
                stateSelector.toggleState(stateName);
            });
            
            expect(stateSelector.getSelectedStatesCount()).toBe(testStates.length);
            
            // Remove all states
            stateSelector.removeAllStates();
            
            // Verify no states are selected
            expect(stateSelector.getSelectedStatesCount()).toBe(0);
            expect(taxChart.getSelectedStates()).toHaveLength(0);
            
            // Verify each test state is deselected in both components
            testStates.forEach(stateName => {
                expect(stateSelector.isStateSelected(stateName)).toBe(false);
                expect(taxChart.isStateSelected(stateName)).toBe(false);
            });
            
            // Verify UI state
            const allStatesBtn = document.getElementById('all-states-btn') as HTMLButtonElement;
            const removeAllBtn = document.getElementById('remove-all-btn') as HTMLButtonElement;
            
            expect(allStatesBtn.textContent?.trim()).toBe('All States');
            expect(allStatesBtn.classList.contains('btn-primary')).toBe(true);
            expect(removeAllBtn.disabled).toBe(true);
            expect(removeAllBtn.classList.contains('btn-secondary')).toBe(true);
        });

        test('should verify bulk operation UI state consistency', () => {
            const testStates = ['Colorado', 'California', 'Texas'];
            
            // Test individual selections (programmatically)
            testStates.forEach(stateName => {
                stateSelector.toggleState(stateName);
                
                // Individual state buttons no longer exist
                const buttonId = `state-btn-${stateName.replace(/\s+/g, '-').toLowerCase()}`;
                const button = document.getElementById(buttonId) as HTMLButtonElement;
                expect(button).toBeFalsy();
            });
            
            // Verify bulk button UI reflects partial selection
            const allStatesBtn = document.getElementById('all-states-btn') as HTMLButtonElement;
            const removeAllBtn = document.getElementById('remove-all-btn') as HTMLButtonElement;
            
            expect(allStatesBtn.textContent?.trim()).toBe('All States');
            expect(removeAllBtn.disabled).toBe(false);
            
            // Test bulk deselection
            stateSelector.removeAllStates();
            
            // Verify bulk button UI reflects no selection
            expect(allStatesBtn.textContent?.trim()).toBe('All States');
            expect(removeAllBtn.disabled).toBe(true);
            
            // Test bulk selection
            stateSelector.selectAllStates();
            
            // Verify bulk button UI reflects full selection
            expect(allStatesBtn.textContent?.trim()).toBe('All Selected');
            expect(removeAllBtn.disabled).toBe(false);
        });
    });
});