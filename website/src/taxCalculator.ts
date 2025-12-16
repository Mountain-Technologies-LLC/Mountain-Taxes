/**
 * Mountain Taxes Calculator - Tax Calculation Engine
 * 
 * This module implements the core tax calculation logic for progressive tax brackets,
 * handling standard deductions, personal exemptions, and both Single and Married filing types.
 */

import { FilingTypeName, TaxCalculationResult, TaxBracket } from './types';
import { getStateByName } from './stateData';
import { ErrorHandler, ErrorSeverity } from './validation';

/**
 * Calculate tax owed for a given income and state
 * @param income - The earned income amount (must be >= 0)
 * @param stateName - Name of the state for tax calculation
 * @param filingType - Filing type (Single or Married)
 * @returns TaxCalculationResult with tax owed, effective rate, and marginal rate
 */
export function calculateTax(
    income: number, 
    stateName: string, 
    filingType: FilingTypeName
): TaxCalculationResult {
    // Validate input parameters
    if (typeof income !== 'number' || income < 0 || !isFinite(income) || isNaN(income)) {
        const error = new Error('Income must be non-negative');
        ErrorHandler.logError('INVALID_INCOME', error.message, ErrorSeverity.ERROR, { income, stateName, filingType });
        throw error;
    }
    
    if (!Object.values(FilingTypeName).includes(filingType)) {
        const error = new Error('Invalid filing type');
        ErrorHandler.logError('INVALID_FILING_TYPE', error.message, ErrorSeverity.ERROR, { income, stateName, filingType });
        throw error;
    }

    // Get state data
    const state = getStateByName(stateName);
    if (!state) {
        const error = new Error(`State not found: ${stateName}`);
        ErrorHandler.handleStateDataError(stateName, error);
        throw error;
    }

    // Get filing type data
    const filingTypeData = state.filingType.find(ft => ft.type === filingType);
    if (!filingTypeData) {
        throw new Error(`Filing type ${filingType} not found for state ${stateName}`);
    }

    // Calculate taxable income after deductions and exemptions
    const taxableIncome = Math.max(0, income - filingTypeData.standardDeduction - filingTypeData.personalExemption);

    // Calculate tax owed using progressive brackets
    const taxOwed = calculateProgressiveTax(taxableIncome, filingTypeData.taxBrackets);

    // Calculate effective tax rate (total tax / total income)
    const effectiveRate = income > 0 ? taxOwed / income : 0;

    // Calculate marginal tax rate (rate on next dollar earned)
    const marginalRate = getMarginalTaxRate(taxableIncome, filingTypeData.taxBrackets);

    return {
        income,
        taxOwed,
        effectiveRate,
        marginalRate
    };
}

/**
 * Calculate tax using progressive tax brackets
 * @param taxableIncome - Income after deductions and exemptions
 * @param taxBrackets - Array of tax brackets sorted by bracket amount
 * @returns Total tax owed
 */
function calculateProgressiveTax(taxableIncome: number, taxBrackets: TaxBracket[]): number {
    if (taxableIncome <= 0) {
        return 0;
    }

    let totalTax = 0;
    let previousBracket = 0;

    for (let i = 0; i < taxBrackets.length; i++) {
        const currentBracket = taxBrackets[i];
        const currentRate = currentBracket.rate;
        
        // Determine the upper limit for this bracket
        const nextBracket = i < taxBrackets.length - 1 ? taxBrackets[i + 1].bracket : Infinity;
        const upperLimit = Math.min(taxableIncome, nextBracket);
        
        // Calculate income in this bracket
        const incomeInBracket = Math.max(0, upperLimit - Math.max(previousBracket, currentBracket.bracket));
        
        // Add tax for this bracket
        totalTax += incomeInBracket * currentRate;
        
        // If we've processed all income, break
        if (taxableIncome <= nextBracket) {
            break;
        }
        
        previousBracket = nextBracket;
    }

    return totalTax;
}

/**
 * Get the tax rate for a specific income level within the brackets
 * @param income - Income level to find rate for
 * @param taxBrackets - Array of tax brackets
 * @returns Tax rate that applies to the given income level
 */
function getTaxRateForIncome(income: number, taxBrackets: TaxBracket[]): number {
    if (income <= 0) {
        return taxBrackets[0]?.rate || 0;
    }

    // Find the highest bracket that the income falls into
    let applicableRate = taxBrackets[0]?.rate || 0;
    
    for (const bracket of taxBrackets) {
        if (income >= bracket.bracket) {
            applicableRate = bracket.rate;
        } else {
            break;
        }
    }
    
    return applicableRate;
}

/**
 * Get the marginal tax rate (rate on the next dollar earned)
 * @param taxableIncome - Current taxable income
 * @param taxBrackets - Array of tax brackets
 * @returns Marginal tax rate
 */
function getMarginalTaxRate(taxableIncome: number, taxBrackets: TaxBracket[]): number {
    return getTaxRateForIncome(taxableIncome, taxBrackets);
}

/**
 * Calculate tax for multiple income levels (used for chart generation)
 * @param incomes - Array of income levels
 * @param stateName - Name of the state
 * @param filingType - Filing type
 * @returns Array of tax amounts corresponding to income levels
 */
export function calculateTaxForIncomes(
    incomes: number[], 
    stateName: string, 
    filingType: FilingTypeName
): number[] {
    return incomes.map(income => {
        const result = calculateTax(income, stateName, filingType);
        return result.taxOwed;
    });
}

/**
 * Generate income range for chart display
 * @param min - Minimum income
 * @param max - Maximum income  
 * @param step - Step size between income points
 * @returns Array of income values
 */
export function generateIncomeRange(min: number, max: number, step: number): number[] {
    // Handle edge cases
    if (step <= 0 || !isFinite(step) || isNaN(step)) {
        return [min]; // Return single point for invalid step
    }
    
    if (max < min || !isFinite(min) || !isFinite(max) || isNaN(min) || isNaN(max)) {
        return []; // Return empty array for invalid range
    }
    
    // Prevent extremely large arrays that could cause memory issues
    const maxPoints = 10000; // Reasonable limit for chart points
    const estimatedPoints = Math.ceil((max - min) / step) + 1;
    if (estimatedPoints > maxPoints) {
        // Adjust step to keep within reasonable limits
        step = (max - min) / (maxPoints - 1);
    }
    
    const incomes: number[] = [];
    for (let income = min; income <= max && incomes.length < maxPoints; income += step) {
        incomes.push(income);
    }
    return incomes;
}

/**
 * Validate that income is earned income only (no investment income, etc.)
 * This is a placeholder function that ensures we only process earned income
 * @param income - Income amount to validate
 * @returns boolean indicating if income is valid earned income
 */
export function validateEarnedIncome(income: number): boolean {
    // For this implementation, we assume all positive numeric income is earned income
    // In a real application, this would validate against income types
    return typeof income === 'number' && income >= 0 && !isNaN(income) && isFinite(income);
}

/**
 * Calculate tax comparison for multiple states
 * @param income - Income amount
 * @param stateNames - Array of state names to compare
 * @param filingType - Filing type
 * @returns Array of tax calculation results
 */
export function calculateTaxComparison(
    income: number,
    stateNames: string[],
    filingType: FilingTypeName
): { stateName: string; result: TaxCalculationResult }[] {
    return stateNames.map(stateName => ({
        stateName,
        result: calculateTax(income, stateName, filingType)
    }));
}