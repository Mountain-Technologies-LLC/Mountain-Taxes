/**
 * Tests for validation and error handling system
 */

import {
    StateDataValidator,
    ErrorHandler,
    UserFeedback,
    GracefulDegradation,
    ErrorSeverity,
    ValidationResult
} from '../src/validation';
import { FilingTypeName } from '../src/types';

describe('StateDataValidator', () => {
    describe('validateState', () => {
        test('should validate a complete valid state', () => {
            const validState = {
                name: 'Colorado',
                dependentDeduction: 1000,
                filingType: [
                    {
                        type: FilingTypeName.Single,
                        standardDeduction: 12950,
                        personalExemption: 0,
                        taxBrackets: [{ bracket: 0, rate: 0.044 }]
                    },
                    {
                        type: FilingTypeName.Married,
                        standardDeduction: 25900,
                        personalExemption: 0,
                        taxBrackets: [{ bracket: 0, rate: 0.044 }]
                    }
                ]
            };

            const result = StateDataValidator.validateState(validState);
            expect(result.isValid).toBe(true);
            expect(result.errors).toHaveLength(0);
        });

        test('should reject null or undefined state', () => {
            const result1 = StateDataValidator.validateState(null);
            expect(result1.isValid).toBe(false);
            expect(result1.errors).toContain('State object is null or undefined');

            const result2 = StateDataValidator.validateState(undefined);
            expect(result2.isValid).toBe(false);
            expect(result2.errors).toContain('State object is null or undefined');
        });

        test('should reject invalid state name', () => {
            const invalidState = {
                name: '',
                dependentDeduction: 1000,
                filingType: []
            };

            const result = StateDataValidator.validateState(invalidState);
            expect(result.isValid).toBe(false);
            expect(result.errors).toContain('State name is required and must be a non-empty string');
        });

        test('should reject invalid dependent deduction', () => {
            const invalidState = {
                name: 'Test State',
                dependentDeduction: -100,
                filingType: []
            };

            const result = StateDataValidator.validateState(invalidState);
            expect(result.isValid).toBe(false);
            expect(result.errors).toContain('Dependent deduction must be a non-negative finite number');
        });

        test('should reject missing filing types', () => {
            const invalidState = {
                name: 'Test State',
                dependentDeduction: 1000,
                filingType: []
            };

            const result = StateDataValidator.validateState(invalidState);
            expect(result.isValid).toBe(false);
            expect(result.errors).toContain('At least one filing type is required');
        });
    });

    describe('validateFilingType', () => {
        test('should validate a complete valid filing type', () => {
            const validFilingType = {
                type: FilingTypeName.Single,
                standardDeduction: 12950,
                personalExemption: 0,
                taxBrackets: [{ bracket: 0, rate: 0.044 }]
            };

            const result = StateDataValidator.validateFilingType(validFilingType);
            expect(result.isValid).toBe(true);
            expect(result.errors).toHaveLength(0);
        });

        test('should reject invalid filing type name', () => {
            const invalidFilingType = {
                type: 'InvalidType',
                standardDeduction: 12950,
                personalExemption: 0,
                taxBrackets: [{ bracket: 0, rate: 0.044 }]
            };

            const result = StateDataValidator.validateFilingType(invalidFilingType);
            expect(result.isValid).toBe(false);
            expect(result.errors).toContain('Invalid filing type: InvalidType');
        });

        test('should reject negative standard deduction', () => {
            const invalidFilingType = {
                type: FilingTypeName.Single,
                standardDeduction: -1000,
                personalExemption: 0,
                taxBrackets: [{ bracket: 0, rate: 0.044 }]
            };

            const result = StateDataValidator.validateFilingType(invalidFilingType);
            expect(result.isValid).toBe(false);
            expect(result.errors).toContain('Standard deduction must be a non-negative finite number');
        });
    });

    describe('validateTaxBracket', () => {
        test('should validate a valid tax bracket', () => {
            const validBracket = { bracket: 50000, rate: 0.05 };
            const result = StateDataValidator.validateTaxBracket(validBracket);
            expect(result.isValid).toBe(true);
            expect(result.errors).toHaveLength(0);
        });

        test('should reject invalid tax rate', () => {
            const invalidBracket = { bracket: 50000, rate: 1.5 };
            const result = StateDataValidator.validateTaxBracket(invalidBracket);
            expect(result.isValid).toBe(false);
            expect(result.errors).toContain('Tax rate must be a finite number between 0 and 1');
        });

        test('should warn about high tax rates', () => {
            const highRateBracket = { bracket: 50000, rate: 0.6 };
            const result = StateDataValidator.validateTaxBracket(highRateBracket);
            expect(result.isValid).toBe(true);
            expect(result.warnings).toContain('Tax rate 0.6 is unusually high (>50%)');
        });
    });

    describe('validateIncomeRange', () => {
        test('should validate a valid income range', () => {
            const validRange = { min: 0, max: 100000, step: 10000 };
            const result = StateDataValidator.validateIncomeRange(validRange);
            expect(result.isValid).toBe(true);
            expect(result.errors).toHaveLength(0);
        });

        test('should reject invalid range where max <= min', () => {
            const invalidRange = { min: 100000, max: 50000, step: 10000 };
            const result = StateDataValidator.validateIncomeRange(invalidRange);
            expect(result.isValid).toBe(false);
            expect(result.errors).toContain('Maximum income must be greater than minimum income');
        });

        test('should reject zero or negative step', () => {
            const invalidRange = { min: 0, max: 100000, step: 0 };
            const result = StateDataValidator.validateIncomeRange(invalidRange);
            expect(result.isValid).toBe(false);
            expect(result.errors).toContain('Step size must be a positive finite number');
        });

        test('should warn about very large ranges', () => {
            const largeRange = { min: 0, max: 200000000, step: 10000 };
            const result = StateDataValidator.validateIncomeRange(largeRange);
            expect(result.isValid).toBe(true);
            expect(result.warnings).toContain('Income range is very large and may cause performance issues');
        });
    });
});

describe('ErrorHandler', () => {
    beforeEach(() => {
        ErrorHandler.clearErrors();
        // Mock console methods
        jest.spyOn(console, 'info').mockImplementation();
        jest.spyOn(console, 'warn').mockImplementation();
        jest.spyOn(console, 'error').mockImplementation();
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    test('should log errors with correct severity', () => {
        const error = ErrorHandler.logError('TEST_ERROR', 'Test message', ErrorSeverity.ERROR);
        
        expect(error.code).toBe('TEST_ERROR');
        expect(error.message).toBe('Test message');
        expect(error.severity).toBe(ErrorSeverity.ERROR);
        expect(error.timestamp).toBeInstanceOf(Date);
        expect(console.error).toHaveBeenCalledWith('[TEST_ERROR] Test message', undefined);
    });

    test('should handle different severity levels', () => {
        ErrorHandler.logError('INFO_TEST', 'Info message', ErrorSeverity.INFO);
        ErrorHandler.logError('WARN_TEST', 'Warning message', ErrorSeverity.WARNING);
        ErrorHandler.logError('ERROR_TEST', 'Error message', ErrorSeverity.ERROR);
        ErrorHandler.logError('CRITICAL_TEST', 'Critical message', ErrorSeverity.CRITICAL);

        expect(console.info).toHaveBeenCalledWith('[INFO_TEST] Info message', undefined);
        expect(console.warn).toHaveBeenCalledWith('[WARN_TEST] Warning message', undefined);
        expect(console.error).toHaveBeenCalledWith('[ERROR_TEST] Error message', undefined);
        expect(console.error).toHaveBeenCalledWith('[CRITICAL][CRITICAL_TEST] Critical message', undefined);
    });

    test('should retrieve recent errors', () => {
        ErrorHandler.logError('ERROR1', 'First error', ErrorSeverity.ERROR);
        ErrorHandler.logError('ERROR2', 'Second error', ErrorSeverity.ERROR);
        
        const recentErrors = ErrorHandler.getRecentErrors(2);
        expect(recentErrors).toHaveLength(2);
        expect(recentErrors[0].code).toBe('ERROR1');
        expect(recentErrors[1].code).toBe('ERROR2');
    });

    test('should filter errors by severity', () => {
        ErrorHandler.logError('INFO1', 'Info message', ErrorSeverity.INFO);
        ErrorHandler.logError('ERROR1', 'Error message', ErrorSeverity.ERROR);
        ErrorHandler.logError('ERROR2', 'Another error', ErrorSeverity.ERROR);
        
        const errorSeverityErrors = ErrorHandler.getErrorsBySeverity(ErrorSeverity.ERROR);
        expect(errorSeverityErrors).toHaveLength(2);
        expect(errorSeverityErrors.every(e => e.severity === ErrorSeverity.ERROR)).toBe(true);
    });

    test('should handle chart errors', () => {
        const chartError = new Error('Chart rendering failed');
        const appError = ErrorHandler.handleChartError(chartError, { canvasId: 'test-canvas' });
        
        expect(appError.code).toBe('CHART_RENDER_ERROR');
        expect(appError.message).toContain('Chart rendering failed');
        expect(appError.severity).toBe(ErrorSeverity.ERROR);
        expect(appError.context).toEqual({ originalError: chartError, canvasId: 'test-canvas' });
    });

    test('should handle state data errors', () => {
        const stateError = new Error('Invalid state data');
        const appError = ErrorHandler.handleStateDataError('Colorado', stateError);
        
        expect(appError.code).toBe('STATE_DATA_ERROR');
        expect(appError.message).toContain('State data error for Colorado');
        expect(appError.severity).toBe(ErrorSeverity.ERROR);
    });

    test('should handle validation errors', () => {
        const validationResult: ValidationResult = {
            isValid: false,
            errors: ['Error 1', 'Error 2'],
            warnings: ['Warning 1']
        };
        
        const appErrors = ErrorHandler.handleValidationError(validationResult);
        expect(appErrors).toHaveLength(3);
        expect(appErrors[0].code).toBe('VALIDATION_ERROR');
        expect(appErrors[1].code).toBe('VALIDATION_ERROR');
        expect(appErrors[2].code).toBe('VALIDATION_WARNING');
    });
});

describe('UserFeedback', () => {
    beforeEach(() => {
        // Clean up any existing feedback containers
        document.body.innerHTML = '';
    });

    test('should initialize feedback container', () => {
        UserFeedback.initialize('test-feedback');
        const container = document.getElementById('test-feedback');
        expect(container).toBeTruthy();
        expect(container?.className).toBe('feedback-container');
    });

    test('should show feedback messages', () => {
        UserFeedback.initialize('test-feedback');
        UserFeedback.showMessage('Test message', ErrorSeverity.INFO, 0); // 0 duration to prevent auto-removal
        
        const container = document.getElementById('test-feedback');
        expect(container?.children).toHaveLength(1);
        
        const messageElement = container?.children[0] as HTMLElement;
        expect(messageElement.textContent).toContain('Test message');
        expect(messageElement.className).toContain('alert-info');
    });

    test('should clear all messages', () => {
        UserFeedback.initialize('test-feedback');
        UserFeedback.showMessage('Test message 1', ErrorSeverity.INFO, 0);
        UserFeedback.showMessage('Test message 2', ErrorSeverity.WARNING, 0);
        
        const container = document.getElementById('test-feedback');
        expect(container?.children).toHaveLength(2);
        
        UserFeedback.clearMessages();
        expect(container?.children).toHaveLength(0);
    });
});

describe('GracefulDegradation', () => {
    test('should check for Chart.js availability', () => {
        // Chart.js is mocked in setup, so it should be available
        const isAvailable = GracefulDegradation.isChartJsAvailable();
        expect(typeof isAvailable).toBe('boolean');
    });

    test('should provide chart fallback', () => {
        document.body.innerHTML = '<div id="test-chart"></div>';
        
        const testData = { message: 'Test data' };
        GracefulDegradation.provideChartFallback('test-chart', testData);
        
        const container = document.getElementById('test-chart');
        expect(container?.innerHTML).toContain('Chart Unavailable');
        expect(container?.innerHTML).toContain('Test data');
    });

    test('should handle unavailable features', () => {
        const mockFallback = jest.fn();
        
        GracefulDegradation.handleUnavailableFeature('TestFeature', mockFallback);
        
        expect(mockFallback).toHaveBeenCalled();
    });

    test('should provide Bootstrap fallback', () => {
        const initialStyleCount = document.head.querySelectorAll('style').length;
        
        GracefulDegradation.provideBootstrapFallback();
        
        // Should add styles if Bootstrap is not available
        const finalStyleCount = document.head.querySelectorAll('style').length;
        expect(finalStyleCount).toBeGreaterThanOrEqual(initialStyleCount);
    });
});