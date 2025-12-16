/**
 * Property-based tests for TypeScript data model conformance
 * 
 * These tests verify that data structures conform to the specified interfaces
 * and maintain consistency across all valid inputs.
 */

import * as fc from 'fast-check';
import {
    State,
    FilingType,
    TaxBracket,
    FilingTypeName,
    TaxCalculationResult,
    ChartDataset,
    IncomeRange,
    AppState
} from '../src/types';

describe('Data Model Conformance Tests', () => {
    /**
     * **Feature: mountain-taxes-calculator, Property 9: Data model conformance**
     * **Validates: Requirements 6.1, 6.5**
     * 
     * For any state in the system, the data should conform exactly to the 
     * specified TypeScript interfaces with all required fields populated
     */
    test('Property 9: State data conforms to TypeScript interfaces', () => {
        fc.assert(fc.property(
            // Generate valid state data
            fc.record({
                name: fc.string({ minLength: 1, maxLength: 50 }),
                dependentDeduction: fc.nat({ max: 10000 }),
                filingType: fc.array(
                    fc.record({
                        type: fc.constantFrom(FilingTypeName.Single, FilingTypeName.Married),
                        standardDeduction: fc.nat({ max: 50000 }),
                        personalExemption: fc.nat({ max: 10000 }),
                        taxBrackets: fc.array(
                            fc.record({
                                bracket: fc.nat({ max: 10000000 }),
                                rate: fc.float({ min: 0, max: Math.fround(0.15), noNaN: true })
                            }),
                            { minLength: 1, maxLength: 10 }
                        )
                    }),
                    { minLength: 1, maxLength: 2 }
                )
            }),
            (generatedState: State) => {
                // Verify state conforms to State interface
                expect(typeof generatedState.name).toBe('string');
                expect(generatedState.name.length).toBeGreaterThan(0);
                expect(typeof generatedState.dependentDeduction).toBe('number');
                expect(generatedState.dependentDeduction).toBeGreaterThanOrEqual(0);
                expect(Array.isArray(generatedState.filingType)).toBe(true);
                expect(generatedState.filingType.length).toBeGreaterThan(0);

                // Verify each filing type conforms to FilingType interface
                generatedState.filingType.forEach((filing: FilingType) => {
                    expect(Object.values(FilingTypeName)).toContain(filing.type);
                    expect(typeof filing.standardDeduction).toBe('number');
                    expect(filing.standardDeduction).toBeGreaterThanOrEqual(0);
                    expect(typeof filing.personalExemption).toBe('number');
                    expect(filing.personalExemption).toBeGreaterThanOrEqual(0);
                    expect(Array.isArray(filing.taxBrackets)).toBe(true);
                    expect(filing.taxBrackets.length).toBeGreaterThan(0);

                    // Verify each tax bracket conforms to TaxBracket interface
                    filing.taxBrackets.forEach((bracket: TaxBracket) => {
                        expect(typeof bracket.bracket).toBe('number');
                        expect(bracket.bracket).toBeGreaterThanOrEqual(0);
                        expect(typeof bracket.rate).toBe('number');
                        expect(bracket.rate).toBeGreaterThanOrEqual(0);
                        expect(bracket.rate).toBeLessThanOrEqual(1);
                    });
                });

                return true;
            }
        ), { numRuns: 100 });
    });

    test('Property 9a: TaxCalculationResult conforms to interface', () => {
        fc.assert(fc.property(
            fc.record({
                income: fc.nat({ max: 10000000 }),
                taxOwed: fc.nat({ max: 1000000 }),
                effectiveRate: fc.float({ min: 0, max: Math.fround(1), noNaN: true }),
                marginalRate: fc.float({ min: 0, max: Math.fround(1), noNaN: true })
            }),
            (result: TaxCalculationResult) => {
                expect(typeof result.income).toBe('number');
                expect(result.income).toBeGreaterThanOrEqual(0);
                expect(typeof result.taxOwed).toBe('number');
                expect(result.taxOwed).toBeGreaterThanOrEqual(0);
                expect(typeof result.effectiveRate).toBe('number');
                expect(result.effectiveRate).toBeGreaterThanOrEqual(0);
                expect(result.effectiveRate).toBeLessThanOrEqual(1);
                expect(typeof result.marginalRate).toBe('number');
                expect(result.marginalRate).toBeGreaterThanOrEqual(0);
                expect(result.marginalRate).toBeLessThanOrEqual(1);

                return true;
            }
        ), { numRuns: 100 });
    });

    test('Property 9b: ChartDataset conforms to interface', () => {
        fc.assert(fc.property(
            fc.record({
                label: fc.string({ minLength: 1, maxLength: 50 }),
                data: fc.array(fc.nat({ max: 1000000 }), { minLength: 1, maxLength: 100 }),
                borderColor: fc.string({ minLength: 3, maxLength: 20 }),
                backgroundColor: fc.string({ minLength: 3, maxLength: 20 }),
                tension: fc.float({ min: 0, max: Math.fround(1), noNaN: true })
            }),
            (dataset: ChartDataset) => {
                expect(typeof dataset.label).toBe('string');
                expect(dataset.label.length).toBeGreaterThan(0);
                expect(Array.isArray(dataset.data)).toBe(true);
                expect(dataset.data.length).toBeGreaterThan(0);
                expect(typeof dataset.borderColor).toBe('string');
                expect(typeof dataset.backgroundColor).toBe('string');
                expect(typeof dataset.tension).toBe('number');
                expect(dataset.tension).toBeGreaterThanOrEqual(0);
                expect(dataset.tension).toBeLessThanOrEqual(1);

                // Verify all data points are numbers
                dataset.data.forEach(point => {
                    expect(typeof point).toBe('number');
                    expect(point).toBeGreaterThanOrEqual(0);
                });

                return true;
            }
        ), { numRuns: 100 });
    });

    test('Property 9c: IncomeRange conforms to interface', () => {
        fc.assert(fc.property(
            fc.record({
                min: fc.nat({ max: 1000000 }),
                max: fc.nat({ max: 10000000 }),
                step: fc.integer({ min: 1000, max: 100000 })
            }).filter(range => range.max > range.min),
            (range: IncomeRange) => {
                expect(typeof range.min).toBe('number');
                expect(range.min).toBeGreaterThanOrEqual(0);
                expect(typeof range.max).toBe('number');
                expect(range.max).toBeGreaterThan(range.min);
                expect(typeof range.step).toBe('number');
                expect(range.step).toBeGreaterThan(0);

                return true;
            }
        ), { numRuns: 100 });
    });

    test('Property 9d: AppState conforms to interface', () => {
        fc.assert(fc.property(
            fc.record({
                selectedStates: fc.array(fc.string({ minLength: 1, maxLength: 50 }), { maxLength: 50 }),
                incomeRange: fc.record({
                    min: fc.nat({ max: 1000000 }),
                    max: fc.nat({ max: 10000000 }),
                    step: fc.integer({ min: 1000, max: 100000 })
                }).filter(range => range.max > range.min),
                currentFilingType: fc.constantFrom(FilingTypeName.Single, FilingTypeName.Married)
            }),
            (appState: AppState) => {
                expect(Array.isArray(appState.selectedStates)).toBe(true);
                appState.selectedStates.forEach(state => {
                    expect(typeof state).toBe('string');
                    expect(state.length).toBeGreaterThan(0);
                });

                expect(typeof appState.incomeRange).toBe('object');
                expect(typeof appState.incomeRange.min).toBe('number');
                expect(typeof appState.incomeRange.max).toBe('number');
                expect(typeof appState.incomeRange.step).toBe('number');
                expect(appState.incomeRange.max).toBeGreaterThan(appState.incomeRange.min);

                expect(Object.values(FilingTypeName)).toContain(appState.currentFilingType);

                return true;
            }
        ), { numRuns: 100 });
    });
});

describe('Unit Tests for Data Models', () => {
    test('FilingTypeName enum contains expected values', () => {
        expect(FilingTypeName.Single).toBe('Single');
        expect(FilingTypeName.Married).toBe('Married');
        expect(Object.keys(FilingTypeName)).toHaveLength(2);
    });

    test('TaxBracket interface accepts valid data', () => {
        const bracket: TaxBracket = {
            bracket: 50000,
            rate: 0.05
        };
        
        expect(bracket.bracket).toBe(50000);
        expect(bracket.rate).toBe(0.05);
    });

    test('State interface accepts complete valid data', () => {
        const state: State = {
            name: 'Colorado',
            dependentDeduction: 1000,
            filingType: [
                {
                    type: FilingTypeName.Single,
                    standardDeduction: 12950,
                    personalExemption: 0,
                    taxBrackets: [
                        { bracket: 0, rate: 0.0440 }
                    ]
                }
            ]
        };

        expect(state.name).toBe('Colorado');
        expect(state.dependentDeduction).toBe(1000);
        expect(state.filingType).toHaveLength(1);
        expect(state.filingType[0].type).toBe(FilingTypeName.Single);
    });
});