/**
 * Property-based and unit tests for tax calculation engine
 * 
 * These tests verify the correctness of tax calculations across all states
 * and income levels, ensuring accuracy and consistency.
 */

import * as fc from 'fast-check';
import {
    calculateTax,
    calculateTaxForIncomes,
    generateIncomeRange,
    validateEarnedIncome,
    calculateTaxComparison
} from '../src/taxCalculator';
import { FilingTypeName } from '../src/types';
import { getAllStateNames } from '../src/stateData';

describe('Tax Calculation Engine Tests', () => {
    /**
     * **Feature: mountain-taxes-calculator, Property 1: State selection adds correct tax calculations**
     * **Validates: Requirements 1.3**
     * 
     * For any valid state, when selected, the tax calculator should compute accurate 
     * tax obligations for all income levels and add them as a dataset to the chart
     */
    test('Property 1: Tax calculations are accurate for all states and income levels', () => {
        fc.assert(fc.property(
            // Generate valid state names from our hardcoded data
            fc.constantFrom(...getAllStateNames()),
            // Generate valid income amounts (0 to $10M)
            fc.integer({ min: 0, max: 10000000 }),
            // Generate valid filing types
            fc.constantFrom(FilingTypeName.Single, FilingTypeName.Married),
            (stateName: string, income: number, filingType: FilingTypeName) => {
                const result = calculateTax(income, stateName, filingType);
                
                // Verify result conforms to TaxCalculationResult interface
                expect(typeof result.income).toBe('number');
                expect(typeof result.taxOwed).toBe('number');
                expect(typeof result.effectiveRate).toBe('number');
                expect(typeof result.marginalRate).toBe('number');
                
                // Verify basic tax calculation properties
                expect(result.income).toBe(income);
                expect(result.taxOwed).toBeGreaterThanOrEqual(0);
                expect(result.effectiveRate).toBeGreaterThanOrEqual(0);
                expect(result.effectiveRate).toBeLessThanOrEqual(1);
                expect(result.marginalRate).toBeGreaterThanOrEqual(0);
                expect(result.marginalRate).toBeLessThanOrEqual(1);
                
                // Tax owed should never exceed income (effective rate <= 100%)
                expect(result.taxOwed).toBeLessThanOrEqual(income);
                
                // For zero income, tax owed should be zero
                if (income === 0) {
                    expect(result.taxOwed).toBe(0);
                    expect(result.effectiveRate).toBe(0);
                }
                
                // Effective rate should equal taxOwed / income (when income > 0)
                if (income > 0) {
                    const calculatedEffectiveRate = result.taxOwed / income;
                    expect(Math.abs(result.effectiveRate - calculatedEffectiveRate)).toBeLessThan(0.0001);
                }
                
                return true;
            }
        ), { numRuns: 100 });
    });

    /**
     * **Feature: mountain-taxes-calculator, Property 3: Tax calculations use only earned income**
     * **Validates: Requirements 1.5**
     * 
     * For any tax calculation, the system should only consider earned income parameters 
     * and exclude all other income types
     */
    test('Property 3: Tax calculations use only earned income', () => {
        fc.assert(fc.property(
            // Generate earned income amounts
            fc.integer({ min: 0, max: 10000000 }),
            fc.constantFrom(...getAllStateNames()),
            fc.constantFrom(FilingTypeName.Single, FilingTypeName.Married),
            (earnedIncome: number, stateName: string, filingType: FilingTypeName) => {
                // Verify that validateEarnedIncome accepts only valid earned income
                expect(validateEarnedIncome(earnedIncome)).toBe(true);
                
                // Verify that non-earned income types are rejected
                expect(validateEarnedIncome(-1)).toBe(false); // Negative income
                expect(validateEarnedIncome(NaN)).toBe(false); // Invalid number
                expect(validateEarnedIncome(Infinity)).toBe(false); // Infinite income
                
                // Calculate tax using only earned income
                const result = calculateTax(earnedIncome, stateName, filingType);
                
                // Verify the calculation used the exact earned income amount
                expect(result.income).toBe(earnedIncome);
                
                // Verify that the tax calculation is deterministic for the same earned income
                const result2 = calculateTax(earnedIncome, stateName, filingType);
                expect(result.taxOwed).toBe(result2.taxOwed);
                expect(result.effectiveRate).toBe(result2.effectiveRate);
                expect(result.marginalRate).toBe(result2.marginalRate);
                
                return true;
            }
        ), { numRuns: 100 });
    });

    test('Property 1a: Tax calculations are monotonic (higher income = higher or equal tax)', () => {
        fc.assert(fc.property(
            fc.constantFrom(...getAllStateNames()),
            fc.constantFrom(FilingTypeName.Single, FilingTypeName.Married),
            fc.integer({ min: 0, max: 5000000 }),
            fc.integer({ min: 1, max: 1000000 }),
            (stateName: string, filingType: FilingTypeName, baseIncome: number, increment: number) => {
                const lowerIncome = baseIncome;
                const higherIncome = baseIncome + increment;
                
                const lowerResult = calculateTax(lowerIncome, stateName, filingType);
                const higherResult = calculateTax(higherIncome, stateName, filingType);
                
                // Tax owed should be monotonic (non-decreasing)
                expect(higherResult.taxOwed).toBeGreaterThanOrEqual(lowerResult.taxOwed);
                
                return true;
            }
        ), { numRuns: 100 });
    });

    test('Property 1b: Tax calculations handle progressive brackets correctly', () => {
        fc.assert(fc.property(
            fc.constantFrom(...getAllStateNames()),
            fc.constantFrom(FilingTypeName.Single, FilingTypeName.Married),
            fc.integer({ min: 1000, max: 1000000 }),
            (stateName: string, filingType: FilingTypeName, income: number) => {
                const result = calculateTax(income, stateName, filingType);
                
                // Marginal rate should be >= effective rate for all tax systems
                // Use a small tolerance for floating-point precision issues
                const tolerance = 1e-10;
                expect(result.marginalRate + tolerance).toBeGreaterThanOrEqual(result.effectiveRate);
                
                // For zero tax states, both rates should be zero
                if (result.marginalRate === 0 && result.effectiveRate === 0) {
                    expect(result.taxOwed).toBe(0);
                    return true;
                }
                
                // For progressive systems, marginal rate should be >= effective rate
                // The difference depends on the bracket structure and income level
                const rateDifference = result.marginalRate - result.effectiveRate;
                expect(rateDifference).toBeGreaterThanOrEqual(0);
                
                // For very high incomes in progressive systems, the rates should converge
                // but marginal should still be >= effective
                if (income > 500000) {
                    // At high incomes, the difference should be relatively small for most states
                    expect(rateDifference).toBeLessThan(0.05); // Less than 5 percentage points difference
                }
                
                return true;
            }
        ), { numRuns: 100 });
    });
});

describe('Unit Tests for Error Handling', () => {
    test('Invalid input handling and validation', () => {
        // Test invalid income values
        expect(() => calculateTax(-1000, 'Colorado', FilingTypeName.Single))
            .toThrow('Income must be non-negative');
        
        expect(() => calculateTax(NaN, 'Colorado', FilingTypeName.Single))
            .toThrow('Income must be non-negative');
        
        expect(() => calculateTax(Infinity, 'Colorado', FilingTypeName.Single))
            .toThrow('Income must be non-negative');
        
        expect(() => calculateTax(-Infinity, 'Colorado', FilingTypeName.Single))
            .toThrow('Income must be non-negative');
        
        // Test invalid state names
        expect(() => calculateTax(50000, '', FilingTypeName.Single))
            .toThrow('State not found: ');
        
        expect(() => calculateTax(50000, 'InvalidState', FilingTypeName.Single))
            .toThrow('State not found: InvalidState');
        
        expect(() => calculateTax(50000, 'NonExistentState', FilingTypeName.Single))
            .toThrow('State not found: NonExistentState');
        
        // Test invalid filing types
        expect(() => calculateTax(50000, 'Colorado', 'InvalidFilingType' as FilingTypeName))
            .toThrow('Invalid filing type');
        
        expect(() => calculateTax(50000, 'Colorado', null as any))
            .toThrow('Invalid filing type');
        
        expect(() => calculateTax(50000, 'Colorado', undefined as any))
            .toThrow('Invalid filing type');
    });

    test('Graceful handling of edge case inputs', () => {
        // Test boundary values that should work
        expect(() => calculateTax(0, 'Colorado', FilingTypeName.Single)).not.toThrow();
        expect(() => calculateTax(1, 'Colorado', FilingTypeName.Single)).not.toThrow();
        expect(() => calculateTax(Number.MAX_SAFE_INTEGER, 'Colorado', FilingTypeName.Single)).not.toThrow();
        
        // Test all valid states don't throw errors
        const allStates = getAllStateNames();
        allStates.forEach(stateName => {
            expect(() => calculateTax(50000, stateName, FilingTypeName.Single)).not.toThrow();
            expect(() => calculateTax(50000, stateName, FilingTypeName.Married)).not.toThrow();
        });
        
        // Test both valid filing types
        expect(() => calculateTax(50000, 'Colorado', FilingTypeName.Single)).not.toThrow();
        expect(() => calculateTax(50000, 'Colorado', FilingTypeName.Married)).not.toThrow();
    });

    test('Error recovery and consistent behavior', () => {
        // Test that errors don't affect subsequent valid calculations
        try {
            calculateTax(-1000, 'Colorado', FilingTypeName.Single);
        } catch (error) {
            // Error expected, continue
        }
        
        // Subsequent valid calculation should work normally
        const result = calculateTax(50000, 'Colorado', FilingTypeName.Single);
        expect(result.income).toBe(50000);
        expect(result.taxOwed).toBeGreaterThanOrEqual(0);
        
        // Test that invalid state doesn't affect valid state lookup
        try {
            calculateTax(50000, 'InvalidState', FilingTypeName.Single);
        } catch (error) {
            // Error expected, continue
        }
        
        // Valid state should still work
        const validResult = calculateTax(50000, 'California', FilingTypeName.Single);
        expect(validResult.income).toBe(50000);
        expect(validResult.taxOwed).toBeGreaterThanOrEqual(0);
    });

    test('Validation functions handle invalid inputs gracefully', () => {
        // Test validateEarnedIncome with various invalid inputs
        expect(validateEarnedIncome(-1)).toBe(false);
        expect(validateEarnedIncome(NaN)).toBe(false);
        expect(validateEarnedIncome(Infinity)).toBe(false);
        expect(validateEarnedIncome(-Infinity)).toBe(false);
        expect(validateEarnedIncome(null as any)).toBe(false);
        expect(validateEarnedIncome(undefined as any)).toBe(false);
        expect(validateEarnedIncome('50000' as any)).toBe(false);
        expect(validateEarnedIncome({} as any)).toBe(false);
        expect(validateEarnedIncome([] as any)).toBe(false);
        
        // Test valid inputs still work
        expect(validateEarnedIncome(0)).toBe(true);
        expect(validateEarnedIncome(50000)).toBe(true);
        expect(validateEarnedIncome(1000000)).toBe(true);
    });

    test('Array functions handle invalid inputs', () => {
        // Test calculateTaxForIncomes with invalid inputs
        expect(() => calculateTaxForIncomes([], 'Colorado', FilingTypeName.Single))
            .not.toThrow(); // Empty array should return empty array
        
        const emptyResult = calculateTaxForIncomes([], 'Colorado', FilingTypeName.Single);
        expect(emptyResult).toEqual([]);
        
        // Test with invalid state in array function
        expect(() => calculateTaxForIncomes([50000], 'InvalidState', FilingTypeName.Single))
            .toThrow('State not found: InvalidState');
        
        // Test with invalid income in array
        expect(() => calculateTaxForIncomes([-1000], 'Colorado', FilingTypeName.Single))
            .toThrow('Income must be non-negative');
        
        // Test generateIncomeRange with invalid inputs
        expect(() => generateIncomeRange(-1000, 50000, 10000)).not.toThrow(); // Should handle gracefully
        expect(() => generateIncomeRange(50000, 10000, 10000)).not.toThrow(); // Max < min should handle gracefully
        expect(() => generateIncomeRange(0, 50000, 0)).not.toThrow(); // Zero step should handle gracefully
        expect(() => generateIncomeRange(0, 50000, -10000)).not.toThrow(); // Negative step should handle gracefully
        
        // Verify the results are sensible
        const invalidRange1 = generateIncomeRange(50000, 10000, 10000); // max < min
        expect(invalidRange1).toEqual([]); // Should return empty array
        
        const invalidRange2 = generateIncomeRange(0, 50000, 0); // zero step
        expect(invalidRange2).toEqual([0]); // Should return single point
        
        const invalidRange3 = generateIncomeRange(0, 50000, -10000); // negative step
        expect(invalidRange3).toEqual([0]); // Should return single point
        
        // Test calculateTaxComparison with invalid inputs
        expect(() => calculateTaxComparison(50000, [], FilingTypeName.Single))
            .not.toThrow(); // Empty array should return empty array
        
        const emptyComparison = calculateTaxComparison(50000, [], FilingTypeName.Single);
        expect(emptyComparison).toEqual([]);
        
        expect(() => calculateTaxComparison(50000, ['InvalidState'], FilingTypeName.Single))
            .toThrow('State not found: InvalidState');
    });
});

describe('Unit Tests for Tax Calculation Edge Cases', () => {
    test('Zero income results in zero tax for all states', () => {
        const allStates = getAllStateNames();
        
        allStates.forEach(stateName => {
            [FilingTypeName.Single, FilingTypeName.Married].forEach(filingType => {
                const result = calculateTax(0, stateName, filingType);
                expect(result.taxOwed).toBe(0);
                expect(result.effectiveRate).toBe(0);
                expect(result.income).toBe(0);
            });
        });
    });

    test('Negative income throws error', () => {
        expect(() => {
            calculateTax(-1000, 'Colorado', FilingTypeName.Single);
        }).toThrow('Income must be non-negative');
    });

    test('Invalid state name throws error', () => {
        expect(() => {
            calculateTax(50000, 'NonExistentState', FilingTypeName.Single);
        }).toThrow('State not found: NonExistentState');
    });

    test('Invalid filing type throws error', () => {
        expect(() => {
            calculateTax(50000, 'Colorado', 'InvalidType' as FilingTypeName);
        }).toThrow('Invalid filing type');
    });

    test('States with no income tax return zero tax', () => {
        const noTaxStates = ['Alaska', 'Florida', 'Nevada', 'New Hampshire', 'South Dakota', 'Tennessee', 'Texas', 'Washington', 'Wyoming'];
        
        noTaxStates.forEach(stateName => {
            const result = calculateTax(100000, stateName, FilingTypeName.Single);
            expect(result.taxOwed).toBe(0);
            expect(result.effectiveRate).toBe(0);
            expect(result.marginalRate).toBe(0);
        });
    });

    test('Flat tax states have equal marginal and effective rates', () => {
        // Test Colorado (flat 4.4% tax)
        const result = calculateTax(100000, 'Colorado', FilingTypeName.Single);
        
        // After standard deduction, should have flat rate
        expect(result.marginalRate).toBeCloseTo(0.044, 3);
        
        // For high enough income, effective rate should approach marginal rate
        const highIncomeResult = calculateTax(1000000, 'Colorado', FilingTypeName.Single);
        expect(Math.abs(highIncomeResult.effectiveRate - highIncomeResult.marginalRate)).toBeLessThan(0.01);
    });

    test('Progressive tax states have higher marginal than effective rates', () => {
        // Test California (progressive tax system)
        const result = calculateTax(100000, 'California', FilingTypeName.Single);
        
        expect(result.marginalRate).toBeGreaterThan(result.effectiveRate);
        expect(result.taxOwed).toBeGreaterThan(0);
    });

    test('Extreme income values are handled correctly', () => {
        // Test very high income
        const highIncomeResult = calculateTax(10000000, 'California', FilingTypeName.Single);
        expect(highIncomeResult.taxOwed).toBeGreaterThan(0);
        expect(highIncomeResult.effectiveRate).toBeLessThanOrEqual(1);
        expect(highIncomeResult.marginalRate).toBeLessThanOrEqual(1);
        
        // Test boundary income values
        const boundaryResult = calculateTax(1, 'Colorado', FilingTypeName.Single);
        expect(boundaryResult.taxOwed).toBeGreaterThanOrEqual(0);
    });

    test('calculateTaxForIncomes returns correct array', () => {
        const incomes = [0, 25000, 50000, 100000];
        const taxes = calculateTaxForIncomes(incomes, 'Colorado', FilingTypeName.Single);
        
        expect(taxes).toHaveLength(4);
        expect(taxes[0]).toBe(0); // Zero income = zero tax
        
        // Taxes should be monotonic
        for (let i = 1; i < taxes.length; i++) {
            expect(taxes[i]).toBeGreaterThanOrEqual(taxes[i - 1]);
        }
    });

    test('generateIncomeRange creates correct range', () => {
        const range = generateIncomeRange(0, 100000, 10000);
        expect(range).toEqual([0, 10000, 20000, 30000, 40000, 50000, 60000, 70000, 80000, 90000, 100000]);
        
        const smallRange = generateIncomeRange(50000, 60000, 5000);
        expect(smallRange).toEqual([50000, 55000, 60000]);
    });

    test('validateEarnedIncome correctly validates income types', () => {
        // Valid earned income
        expect(validateEarnedIncome(0)).toBe(true);
        expect(validateEarnedIncome(50000)).toBe(true);
        expect(validateEarnedIncome(1000000)).toBe(true);
        
        // Invalid income
        expect(validateEarnedIncome(-1)).toBe(false);
        expect(validateEarnedIncome(NaN)).toBe(false);
        expect(validateEarnedIncome(Infinity)).toBe(false);
        expect(validateEarnedIncome(-Infinity)).toBe(false);
    });

    test('calculateTaxComparison returns correct comparison data', () => {
        const states = ['Colorado', 'California', 'Texas'];
        const comparison = calculateTaxComparison(100000, states, FilingTypeName.Single);
        
        expect(comparison).toHaveLength(3);
        
        comparison.forEach((item, index) => {
            expect(item.stateName).toBe(states[index]);
            expect(item.result.income).toBe(100000);
            expect(typeof item.result.taxOwed).toBe('number');
            expect(item.result.taxOwed).toBeGreaterThanOrEqual(0);
        });
        
        // Texas should have zero tax
        const texasResult = comparison.find(item => item.stateName === 'Texas');
        expect(texasResult?.result.taxOwed).toBe(0);
    });
});