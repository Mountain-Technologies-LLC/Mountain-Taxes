/**
 * Mountain Taxes - Theme Service Tests
 * 
 * Comprehensive tests for the ThemeService class including theme switching,
 * persistence, system preference detection, and event handling.
 */

import { ThemeService } from '../src/themeService';

// Mock localStorage
const localStorageMock = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
};

// Mock matchMedia
const matchMediaMock = jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
}));

// Setup global mocks
Object.defineProperty(window, 'localStorage', {
    value: localStorageMock
});

Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: matchMediaMock,
});

describe('ThemeService', () => {
    let themeService: ThemeService;
    let mockMediaQuery: any;

    beforeEach(() => {
        // Reset mocks
        jest.clearAllMocks();
        localStorageMock.getItem.mockReturnValue(null);
        
        // Setup matchMedia mock
        mockMediaQuery = {
            matches: false,
            media: '(prefers-color-scheme: dark)',
            addEventListener: jest.fn(),
            removeEventListener: jest.fn(),
        };
        matchMediaMock.mockReturnValue(mockMediaQuery);

        // Mock document.documentElement and document.body
        Object.defineProperty(document, 'documentElement', {
            value: {
                setAttribute: jest.fn(),
                removeAttribute: jest.fn(),
            },
            writable: true,
        });

        Object.defineProperty(document, 'body', {
            value: {
                setAttribute: jest.fn(),
                removeAttribute: jest.fn(),
            },
            writable: true,
        });
    });

    afterEach(() => {
        if (themeService) {
            // Clean up any listeners
            themeService = null as any;
        }
    });

    describe('Initialization', () => {
        test('should initialize with auto theme by default', () => {
            themeService = new ThemeService();
            expect(themeService.getCurrentTheme()).toBe('auto');
        });

        test('should load saved theme from localStorage', () => {
            localStorageMock.getItem.mockReturnValue('dark');
            themeService = new ThemeService();
            expect(themeService.getCurrentTheme()).toBe('dark');
        });

        test('should fallback to auto if invalid theme in localStorage', () => {
            localStorageMock.getItem.mockReturnValue('invalid-theme');
            themeService = new ThemeService();
            expect(themeService.getCurrentTheme()).toBe('auto');
        });

        test('should setup media query listener', () => {
            themeService = new ThemeService();
            expect(matchMediaMock).toHaveBeenCalledWith('(prefers-color-scheme: dark)');
            expect(mockMediaQuery.addEventListener).toHaveBeenCalledWith('change', expect.any(Function));
        });
    });

    describe('Theme Management', () => {
        beforeEach(() => {
            themeService = new ThemeService();
        });

        test('should set theme correctly', () => {
            themeService.setTheme('dark');
            expect(themeService.getCurrentTheme()).toBe('dark');
        });

        test('should not change theme if setting same theme', () => {
            const initialTheme = themeService.getCurrentTheme();
            themeService.setTheme(initialTheme);
            expect(localStorageMock.setItem).not.toHaveBeenCalled();
        });

        test('should save theme to localStorage when changed', () => {
            themeService.setTheme('light');
            expect(localStorageMock.setItem).toHaveBeenCalledWith('mountain-taxes-theme', 'light');
        });

        test('should toggle between light and dark themes', () => {
            themeService.setTheme('light');
            themeService.toggleTheme();
            expect(themeService.getCurrentTheme()).toBe('dark');

            themeService.toggleTheme();
            expect(themeService.getCurrentTheme()).toBe('light');
        });

        test('should toggle from auto to light', () => {
            themeService.setTheme('auto');
            themeService.toggleTheme();
            expect(themeService.getCurrentTheme()).toBe('light');
        });
    });

    describe('Effective Theme Resolution', () => {
        beforeEach(() => {
            themeService = new ThemeService();
        });

        test('should return light for light theme', () => {
            themeService.setTheme('light');
            expect(themeService.getEffectiveTheme()).toBe('light');
        });

        test('should return dark for dark theme', () => {
            themeService.setTheme('dark');
            expect(themeService.getEffectiveTheme()).toBe('dark');
        });

        test('should resolve auto to light when system prefers light', () => {
            mockMediaQuery.matches = false;
            themeService.setTheme('auto');
            expect(themeService.getEffectiveTheme()).toBe('light');
        });

        test('should resolve auto to dark when system prefers dark', () => {
            mockMediaQuery.matches = true;
            themeService.setTheme('auto');
            expect(themeService.getEffectiveTheme()).toBe('dark');
        });
    });

    describe('Theme Configuration', () => {
        beforeEach(() => {
            themeService = new ThemeService();
        });

        test('should return correct theme configurations', () => {
            const availableThemes = themeService.getAvailableThemes();
            expect(availableThemes).toHaveLength(3);
            
            const lightTheme = availableThemes.find(t => t.mode === 'light');
            expect(lightTheme).toEqual({
                mode: 'light',
                icon: 'fas fa-sun',
                label: 'Light'
            });

            const darkTheme = availableThemes.find(t => t.mode === 'dark');
            expect(darkTheme).toEqual({
                mode: 'dark',
                icon: 'fas fa-moon',
                label: 'Dark'
            });

            const autoTheme = availableThemes.find(t => t.mode === 'auto');
            expect(autoTheme).toEqual({
                mode: 'auto',
                icon: 'fas fa-circle-half-stroke',
                label: 'Auto'
            });
        });

        test('should return correct theme config by mode', () => {
            const lightConfig = themeService.getThemeConfig('light');
            expect(lightConfig.icon).toBe('fas fa-sun');
            expect(lightConfig.label).toBe('Light');
        });

        test('should return current theme icon and label', () => {
            themeService.setTheme('dark');
            expect(themeService.getCurrentThemeIcon()).toBe('fas fa-moon');
            expect(themeService.getCurrentThemeLabel()).toBe('Dark');
        });
    });

    describe('Event Listeners', () => {
        beforeEach(() => {
            themeService = new ThemeService();
        });

        test('should add and notify listeners on theme change', () => {
            const listener = jest.fn();
            themeService.addListener(listener);
            
            themeService.setTheme('dark');
            expect(listener).toHaveBeenCalledWith('dark');
        });

        test('should remove listeners correctly', () => {
            const listener = jest.fn();
            themeService.addListener(listener);
            themeService.removeListener(listener);
            
            themeService.setTheme('light');
            expect(listener).not.toHaveBeenCalled();
        });

        test('should handle listener errors gracefully', () => {
            const errorListener = jest.fn().mockImplementation(() => {
                throw new Error('Listener error');
            });
            const goodListener = jest.fn();
            
            themeService.addListener(errorListener);
            themeService.addListener(goodListener);
            
            // Should not throw and should still call good listener
            expect(() => themeService.setTheme('dark')).not.toThrow();
            expect(goodListener).toHaveBeenCalledWith('dark');
        });
    });

    describe('DOM Manipulation', () => {
        beforeEach(() => {
            themeService = new ThemeService();
        });

        test('should apply light theme to DOM elements', () => {
            themeService.setTheme('light');
            
            expect(document.documentElement.setAttribute).toHaveBeenCalledWith('data-bs-theme', 'light');
        });

        test('should apply dark theme to DOM elements', () => {
            themeService.setTheme('dark');
            
            expect(document.documentElement.setAttribute).toHaveBeenCalledWith('data-bs-theme', 'dark');
        });

        test('should apply auto theme to DOM elements', () => {
            themeService.setTheme('auto');
            
            // Auto theme should resolve to actual system preference (light in test environment)
            expect(document.documentElement.setAttribute).toHaveBeenCalledWith('data-bs-theme', 'light');
            expect(document.documentElement.removeAttribute).toHaveBeenCalledWith('data-bs-theme');
        });
    });

    describe('System Preference Changes', () => {
        beforeEach(() => {
            themeService = new ThemeService();
        });

        test('should respond to system preference changes when in auto mode', () => {
            const listener = jest.fn();
            themeService.addListener(listener);
            themeService.setTheme('auto');
            
            // Clear the listener call from setTheme
            listener.mockClear();
            
            // Simulate system preference change
            const changeHandler = mockMediaQuery.addEventListener.mock.calls[0][1];
            changeHandler();
            
            expect(listener).toHaveBeenCalled();
        });

        test('should not respond to system preference changes when not in auto mode', () => {
            const listener = jest.fn();
            themeService.addListener(listener);
            themeService.setTheme('light');
            
            // Clear the listener call from setTheme
            listener.mockClear();
            
            // Simulate system preference change
            const changeHandler = mockMediaQuery.addEventListener.mock.calls[0][1];
            changeHandler();
            
            expect(listener).not.toHaveBeenCalled();
        });
    });

    describe('Static Methods', () => {
        test('should detect color scheme support', () => {
            // Mock successful matchMedia
            matchMediaMock.mockReturnValue({
                media: '(prefers-color-scheme)'
            });
            
            expect(ThemeService.supportsColorScheme()).toBe(true);
        });

        test('should detect lack of color scheme support', () => {
            // Mock failed matchMedia
            matchMediaMock.mockReturnValue({
                media: 'not all'
            });
            
            expect(ThemeService.supportsColorScheme()).toBe(false);
        });

        test('should handle missing matchMedia', () => {
            // Mock missing matchMedia
            const originalMatchMedia = window.matchMedia;
            (window as any).matchMedia = undefined;
            
            expect(ThemeService.supportsColorScheme()).toBe(false);
            
            // Restore matchMedia
            window.matchMedia = originalMatchMedia;
        });

        test('should apply initial theme from localStorage', () => {
            localStorageMock.getItem.mockReturnValue('dark');
            
            ThemeService.applyInitialTheme();
            
            expect(document.documentElement.setAttribute).toHaveBeenCalledWith('data-bs-theme', 'dark');
        });

        test('should apply auto theme when no saved theme', () => {
            localStorageMock.getItem.mockReturnValue(null);
            
            ThemeService.applyInitialTheme();
            
            expect(document.documentElement.setAttribute).toHaveBeenCalledWith('data-bs-theme', 'auto');
        });

        test('should apply auto theme when invalid saved theme', () => {
            localStorageMock.getItem.mockReturnValue('invalid-theme');
            
            ThemeService.applyInitialTheme();
            
            expect(document.documentElement.setAttribute).toHaveBeenCalledWith('data-bs-theme', 'auto');
        });

        test('should handle localStorage errors in applyInitialTheme', () => {
            localStorageMock.getItem.mockImplementation(() => {
                throw new Error('localStorage error');
            });
            
            ThemeService.applyInitialTheme();
            
            expect(document.documentElement.setAttribute).toHaveBeenCalledWith('data-bs-theme', 'auto');
        });
    });

    describe('Error Handling', () => {
        test('should handle localStorage errors gracefully', () => {
            localStorageMock.getItem.mockImplementation(() => {
                throw new Error('localStorage error');
            });
            
            // Ensure matchMedia is properly mocked
            matchMediaMock.mockReturnValue(mockMediaQuery);
            
            expect(() => new ThemeService()).not.toThrow();
        });

        test('should handle localStorage save errors gracefully', () => {
            localStorageMock.setItem.mockImplementation(() => {
                throw new Error('localStorage save error');
            });
            
            // Ensure matchMedia is properly mocked
            matchMediaMock.mockReturnValue(mockMediaQuery);
            
            themeService = new ThemeService();
            expect(() => themeService.setTheme('dark')).not.toThrow();
        });
    });
});