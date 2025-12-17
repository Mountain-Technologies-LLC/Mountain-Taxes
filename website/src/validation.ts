/**
 * Mountain Taxes - Data Validation and Error Handling
 * 
 * This module provides runtime data validation, error handling utilities,
 * and user feedback mechanisms for the application.
 */

import { FilingTypeName } from './types';

/**
 * Validation result interface
 */
export interface ValidationResult {
    isValid: boolean;
    errors: string[];
    warnings: string[];
}

/**
 * Error severity levels
 */
export enum ErrorSeverity {
    INFO = 'info',
    WARNING = 'warning',
    ERROR = 'error',
    CRITICAL = 'critical'
}

/**
 * Application error interface
 */
export interface AppError {
    code: string;
    message: string;
    severity: ErrorSeverity;
    timestamp: Date;
    context?: any;
}

/**
 * Runtime validation for state data
 */
export class StateDataValidator {
    /**
     * Validate a complete state object
     */
    static validateState(state: any): ValidationResult {
        const result: ValidationResult = {
            isValid: true,
            errors: [],
            warnings: []
        };

        // Check if state exists
        if (!state) {
            result.isValid = false;
            result.errors.push('State object is null or undefined');
            return result;
        }

        // Validate state name
        if (!state.name || typeof state.name !== 'string' || state.name.trim().length === 0) {
            result.isValid = false;
            result.errors.push('State name is required and must be a non-empty string');
        }

        // Validate dependent deduction
        if (typeof state.dependentDeduction !== 'number' || state.dependentDeduction < 0 || !isFinite(state.dependentDeduction)) {
            result.isValid = false;
            result.errors.push('Dependent deduction must be a non-negative finite number');
        }

        // Validate filing types array
        if (!Array.isArray(state.filingType)) {
            result.isValid = false;
            result.errors.push('Filing types must be an array');
        } else {
            if (state.filingType.length === 0) {
                result.isValid = false;
                result.errors.push('At least one filing type is required');
            }

            // Check for required filing types
            const filingTypeNames = state.filingType.map((ft: any) => ft?.type);
            if (!filingTypeNames.includes(FilingTypeName.Single)) {
                result.warnings.push('Single filing type is missing');
            }
            if (!filingTypeNames.includes(FilingTypeName.Married)) {
                result.warnings.push('Married filing type is missing');
            }

            // Validate each filing type
            state.filingType.forEach((filingType: any, index: number) => {
                const filingResult = this.validateFilingType(filingType);
                if (!filingResult.isValid) {
                    result.isValid = false;
                    filingResult.errors.forEach(error => {
                        result.errors.push(`Filing type ${index}: ${error}`);
                    });
                }
                filingResult.warnings.forEach(warning => {
                    result.warnings.push(`Filing type ${index}: ${warning}`);
                });
            });
        }

        return result;
    }

    /**
     * Validate a filing type object
     */
    static validateFilingType(filingType: any): ValidationResult {
        const result: ValidationResult = {
            isValid: true,
            errors: [],
            warnings: []
        };

        if (!filingType) {
            result.isValid = false;
            result.errors.push('Filing type object is null or undefined');
            return result;
        }

        // Validate filing type name
        if (!Object.values(FilingTypeName).includes(filingType.type)) {
            result.isValid = false;
            result.errors.push(`Invalid filing type: ${filingType.type}`);
        }

        // Validate standard deduction
        if (typeof filingType.standardDeduction !== 'number' || filingType.standardDeduction < 0 || !isFinite(filingType.standardDeduction)) {
            result.isValid = false;
            result.errors.push('Standard deduction must be a non-negative finite number');
        }

        // Validate personal exemption
        if (typeof filingType.personalExemption !== 'number' || filingType.personalExemption < 0 || !isFinite(filingType.personalExemption)) {
            result.isValid = false;
            result.errors.push('Personal exemption must be a non-negative finite number');
        }

        // Validate tax brackets
        if (!Array.isArray(filingType.taxBrackets)) {
            result.isValid = false;
            result.errors.push('Tax brackets must be an array');
        } else {
            if (filingType.taxBrackets.length === 0) {
                result.isValid = false;
                result.errors.push('At least one tax bracket is required');
            }

            // Validate each tax bracket
            filingType.taxBrackets.forEach((bracket: any, index: number) => {
                const bracketResult = this.validateTaxBracket(bracket);
                if (!bracketResult.isValid) {
                    result.isValid = false;
                    bracketResult.errors.forEach(error => {
                        result.errors.push(`Tax bracket ${index}: ${error}`);
                    });
                }
                bracketResult.warnings.forEach(warning => {
                    result.warnings.push(`Tax bracket ${index}: ${warning}`);
                });
            });

            // Validate bracket ordering
            if (filingType.taxBrackets.length > 1) {
                for (let i = 1; i < filingType.taxBrackets.length; i++) {
                    const prevBracket = filingType.taxBrackets[i - 1];
                    const currentBracket = filingType.taxBrackets[i];
                    
                    if (currentBracket.bracket < prevBracket.bracket) {
                        result.warnings.push(`Tax brackets are not in ascending order at index ${i}`);
                    }
                }
            }
        }

        return result;
    }

    /**
     * Validate a tax bracket object
     */
    static validateTaxBracket(bracket: any): ValidationResult {
        const result: ValidationResult = {
            isValid: true,
            errors: [],
            warnings: []
        };

        if (!bracket) {
            result.isValid = false;
            result.errors.push('Tax bracket object is null or undefined');
            return result;
        }

        // Validate bracket amount
        if (typeof bracket.bracket !== 'number' || bracket.bracket < 0 || !isFinite(bracket.bracket)) {
            result.isValid = false;
            result.errors.push('Bracket amount must be a non-negative finite number');
        }

        // Validate tax rate
        if (typeof bracket.rate !== 'number' || bracket.rate < 0 || bracket.rate > 1 || !isFinite(bracket.rate)) {
            result.isValid = false;
            result.errors.push('Tax rate must be a finite number between 0 and 1');
        }

        // Warning for unusual rates
        if (bracket.rate > 0.5) {
            result.warnings.push(`Tax rate ${bracket.rate} is unusually high (>50%)`);
        }

        return result;
    }

    /**
     * Validate income range
     */
    static validateIncomeRange(range: any): ValidationResult {
        const result: ValidationResult = {
            isValid: true,
            errors: [],
            warnings: []
        };

        if (!range) {
            result.isValid = false;
            result.errors.push('Income range object is null or undefined');
            return result;
        }

        // Validate min
        if (typeof range.min !== 'number' || range.min < 0 || !isFinite(range.min)) {
            result.isValid = false;
            result.errors.push('Minimum income must be a non-negative finite number');
        }

        // Validate max
        if (typeof range.max !== 'number' || range.max < 0 || !isFinite(range.max)) {
            result.isValid = false;
            result.errors.push('Maximum income must be a non-negative finite number');
        }

        // Validate step
        if (typeof range.step !== 'number' || range.step <= 0 || !isFinite(range.step)) {
            result.isValid = false;
            result.errors.push('Step size must be a positive finite number');
        }

        // Validate range relationship
        if (range.max <= range.min) {
            result.isValid = false;
            result.errors.push('Maximum income must be greater than minimum income');
        }

        // Warning for very large ranges
        if (range.max - range.min > 100000000) { // 100M
            result.warnings.push('Income range is very large and may cause performance issues');
        }

        return result;
    }
}

/**
 * Error handler class for managing application errors
 */
export class ErrorHandler {
    private static errors: AppError[] = [];
    private static maxErrors = 100; // Prevent memory leaks

    /**
     * Log an error
     */
    static logError(code: string, message: string, severity: ErrorSeverity = ErrorSeverity.ERROR, context?: any): AppError {
        const error: AppError = {
            code,
            message,
            severity,
            timestamp: new Date(),
            context
        };

        this.errors.push(error);

        // Prevent memory leaks by limiting stored errors
        if (this.errors.length > this.maxErrors) {
            this.errors.shift();
        }

        // Log to console based on severity
        switch (severity) {
            case ErrorSeverity.INFO:
                console.info(`[${code}] ${message}`, context);
                break;
            case ErrorSeverity.WARNING:
                console.warn(`[${code}] ${message}`, context);
                break;
            case ErrorSeverity.ERROR:
                console.error(`[${code}] ${message}`, context);
                break;
            case ErrorSeverity.CRITICAL:
                console.error(`[CRITICAL][${code}] ${message}`, context);
                break;
        }

        return error;
    }

    /**
     * Get recent errors
     */
    static getRecentErrors(count: number = 10): AppError[] {
        return this.errors.slice(-count);
    }

    /**
     * Get errors by severity
     */
    static getErrorsBySeverity(severity: ErrorSeverity): AppError[] {
        return this.errors.filter(error => error.severity === severity);
    }

    /**
     * Clear all errors
     */
    static clearErrors(): void {
        this.errors = [];
    }

    /**
     * Handle chart rendering errors
     */
    static handleChartError(error: Error, context?: any): AppError {
        return this.logError(
            'CHART_RENDER_ERROR',
            `Chart rendering failed: ${error.message}`,
            ErrorSeverity.ERROR,
            { originalError: error, ...context }
        );
    }

    /**
     * Handle state data errors
     */
    static handleStateDataError(stateName: string, error: Error): AppError {
        return this.logError(
            'STATE_DATA_ERROR',
            `State data error for ${stateName}: ${error.message}`,
            ErrorSeverity.ERROR,
            { stateName, originalError: error }
        );
    }

    /**
     * Handle validation errors
     */
    static handleValidationError(validationResult: ValidationResult, context?: any): AppError[] {
        const errors: AppError[] = [];

        validationResult.errors.forEach(errorMessage => {
            errors.push(this.logError(
                'VALIDATION_ERROR',
                errorMessage,
                ErrorSeverity.ERROR,
                context
            ));
        });

        validationResult.warnings.forEach(warningMessage => {
            errors.push(this.logError(
                'VALIDATION_WARNING',
                warningMessage,
                ErrorSeverity.WARNING,
                context
            ));
        });

        return errors;
    }
}

/**
 * User feedback manager for displaying error messages to users
 */
export class UserFeedback {
    private static feedbackContainer: HTMLElement | null = null;

    /**
     * Initialize feedback system
     */
    static initialize(containerId: string = 'feedback-container'): void {
        let container = document.getElementById(containerId);
        if (!container) {
            container = document.createElement('div');
            container.id = containerId;
            container.className = 'feedback-container';
            container.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 1000;
                max-width: 400px;
            `;
            document.body.appendChild(container);
        }
        this.feedbackContainer = container;
    }

    /**
     * Show user feedback message
     */
    static showMessage(message: string, severity: ErrorSeverity = ErrorSeverity.INFO, duration: number = 5000): void {
        if (!this.feedbackContainer) {
            this.initialize();
        }

        const messageElement = document.createElement('div');
        messageElement.className = `alert alert-${this.getSeverityClass(severity)} alert-dismissible fade show`;
        messageElement.style.cssText = `
            margin-bottom: 10px;
            animation: slideIn 0.3s ease-out;
        `;

        messageElement.innerHTML = `
            <strong>${this.getSeverityLabel(severity)}:</strong> ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        `;

        this.feedbackContainer!.appendChild(messageElement);

        // Auto-remove after duration
        if (duration > 0) {
            setTimeout(() => {
                if (messageElement.parentNode) {
                    messageElement.style.animation = 'slideOut 0.3s ease-in';
                    setTimeout(() => {
                        if (messageElement.parentNode) {
                            messageElement.parentNode.removeChild(messageElement);
                        }
                    }, 300);
                }
            }, duration);
        }

        // Add close button functionality
        const closeButton = messageElement.querySelector('.btn-close');
        if (closeButton) {
            closeButton.addEventListener('click', () => {
                if (messageElement.parentNode) {
                    messageElement.parentNode.removeChild(messageElement);
                }
            });
        }
    }

    /**
     * Show error from AppError object
     */
    static showError(error: AppError, duration: number = 5000): void {
        this.showMessage(error.message, error.severity, duration);
    }

    /**
     * Show validation errors
     */
    static showValidationErrors(validationResult: ValidationResult, duration: number = 7000): void {
        validationResult.errors.forEach(error => {
            this.showMessage(error, ErrorSeverity.ERROR, duration);
        });

        validationResult.warnings.forEach(warning => {
            this.showMessage(warning, ErrorSeverity.WARNING, duration);
        });
    }

    /**
     * Clear all feedback messages
     */
    static clearMessages(): void {
        if (this.feedbackContainer) {
            this.feedbackContainer.innerHTML = '';
        }
    }

    /**
     * Get Bootstrap CSS class for severity
     */
    private static getSeverityClass(severity: ErrorSeverity): string {
        switch (severity) {
            case ErrorSeverity.INFO:
                return 'info';
            case ErrorSeverity.WARNING:
                return 'warning';
            case ErrorSeverity.ERROR:
                return 'danger';
            case ErrorSeverity.CRITICAL:
                return 'danger';
            default:
                return 'secondary';
        }
    }

    /**
     * Get human-readable severity label
     */
    private static getSeverityLabel(severity: ErrorSeverity): string {
        switch (severity) {
            case ErrorSeverity.INFO:
                return 'Info';
            case ErrorSeverity.WARNING:
                return 'Warning';
            case ErrorSeverity.ERROR:
                return 'Error';
            case ErrorSeverity.CRITICAL:
                return 'Critical Error';
            default:
                return 'Notice';
        }
    }
}

/**
 * Graceful degradation utilities
 */
export class GracefulDegradation {
    /**
     * Check if Chart.js is available
     */
    static isChartJsAvailable(): boolean {
        try {
            return typeof (window as any).Chart !== 'undefined';
        } catch {
            return false;
        }
    }

    /**
     * Check if Bootstrap is available
     */
    static isBootstrapAvailable(): boolean {
        try {
            return typeof (window as any).bootstrap !== 'undefined' || document.querySelector('.bootstrap') !== null;
        } catch {
            return false;
        }
    }

    /**
     * Provide fallback for missing Chart.js
     */
    static provideChartFallback(containerId: string, data: any): void {
        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = `
            <div class="alert alert-warning">
                <h5>Chart Unavailable</h5>
                <p>Chart visualization is not available. Here's a summary of the data:</p>
                <pre>${JSON.stringify(data, null, 2)}</pre>
            </div>
        `;
    }

    /**
     * Provide fallback for missing Bootstrap
     */
    static provideBootstrapFallback(): void {
        // Add basic CSS if Bootstrap is not available
        if (!this.isBootstrapAvailable()) {
            const style = document.createElement('style');
            style.textContent = `
                .alert { padding: 15px; margin-bottom: 20px; border: 1px solid transparent; border-radius: 4px; }
                .alert-info { color: #31708f; background-color: #d9edf7; border-color: #bce8f1; }
                .alert-warning { color: #8a6d3b; background-color: #fcf8e3; border-color: #faebcc; }
                .alert-danger { color: #a94442; background-color: #f2dede; border-color: #ebccd1; }
                .btn { display: inline-block; padding: 6px 12px; margin-bottom: 0; font-size: 14px; }
                .btn-close { float: right; font-size: 21px; font-weight: bold; line-height: 1; color: #000; opacity: 0.2; }
            `;
            document.head.appendChild(style);
        }
    }

    /**
     * Handle feature unavailability gracefully
     */
    static handleUnavailableFeature(featureName: string, fallbackAction?: () => void): void {
        const message = `${featureName} is not available. The application will continue with limited functionality.`;
        
        ErrorHandler.logError(
            'FEATURE_UNAVAILABLE',
            message,
            ErrorSeverity.WARNING,
            { featureName }
        );

        UserFeedback.showMessage(message, ErrorSeverity.WARNING);

        if (fallbackAction) {
            try {
                fallbackAction();
            } catch (error) {
                ErrorHandler.logError(
                    'FALLBACK_ERROR',
                    `Fallback action failed for ${featureName}: ${error}`,
                    ErrorSeverity.ERROR,
                    { featureName, error }
                );
            }
        }
    }
}