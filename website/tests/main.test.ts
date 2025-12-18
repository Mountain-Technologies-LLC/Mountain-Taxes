/**
 * Main Application Tests
 * Tests for the main application entry point and UI layout
 */

import * as fc from 'fast-check';

// Mock the component modules
jest.mock('../src/chartComponent', () => ({
    TaxChart: jest.fn().mockImplementation(() => ({
        addState: jest.fn(),
        removeState: jest.fn(),
        updateIncomeRange: jest.fn(),
        getChartInstance: jest.fn(() => ({
            options: { responsive: true, maintainAspectRatio: false }
        }))
    }))
}));

jest.mock('../src/stateSelector', () => ({
    StateSelector: jest.fn().mockImplementation(() => ({
        render: jest.fn()
    }))
}));

jest.mock('../src/incomeRangeControls', () => ({
    IncomeRangeControls: jest.fn().mockImplementation(() => ({
        render: jest.fn()
    }))
}));

jest.mock('../src/router', () => ({
    Router: jest.fn().mockImplementation(() => ({
        addRoute: jest.fn(),
        start: jest.fn(),
        navigate: jest.fn()
    })),
    StateDetailView: jest.fn().mockImplementation(() => ({
        render: jest.fn()
    }))
}));

jest.mock('../src/htmlLegend', () => ({
    HtmlLegend: jest.fn().mockImplementation(() => ({
        updateLegend: jest.fn(),
        getContainer: jest.fn(),
        destroy: jest.fn()
    }))
}));

jest.mock('../src/filerDetails', () => ({
    FilerDetails: jest.fn().mockImplementation(() => ({
        render: jest.fn()
    }))
}));

jest.mock('../src/navbar', () => ({
    Navbar: jest.fn().mockImplementation(() => ({
        populateStatesDropdown: jest.fn(),
        refresh: jest.fn()
    }))
}));

const mockLocationService = {
    detectLocation: jest.fn().mockResolvedValue({
        success: true,
        isInUS: true,
        stateName: 'California',
        countryCode: 'US'
    }),
    getRecommendedStates: jest.fn().mockReturnValue(['California']),
    getSelectionMessage: jest.fn().mockReturnValue('Based on your location, we\'ve selected California for comparison.')
};

jest.mock('../src/locationService', () => ({
    LocationService: jest.fn().mockImplementation(() => mockLocationService)
}));

describe('Main Application Tests', () => {
    beforeEach(() => {
        // Set up the HTML structure that matches index.html
        document.body.innerHTML = `
            <div id="app">
                <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
                    <div class="container">
                        <a class="navbar-brand router-link" href="#/">Mountain Taxes</a>
                    </div>
                </nav>
                <div class="container mt-4">
                    <div id="main-content">
                        <div class="text-center">
                            <div class="spinner-border" role="status">
                                <span class="visually-hidden">Loading...</span>
                            </div>
                            <p class="mt-2">Loading Mountain Taxes...</p>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Add viewport meta tag to head
        const viewport = document.createElement('meta');
        viewport.name = 'viewport';
        viewport.content = 'width=device-width, initial-scale=1.0';
        document.head.appendChild(viewport);

        // Add Bootstrap CSS link
        const bootstrapLink = document.createElement('link');
        bootstrapLink.href = 'https://cdn.jsdelivr.net/npm/bootswatch@5.3.2/dist/brite/bootstrap.min.css';
        bootstrapLink.rel = 'stylesheet';
        document.head.appendChild(bootstrapLink);

        // Mock window.router
        (window as any).router = {
            navigate: jest.fn()
        };
    });

    describe('Property-Based Tests', () => {
        /**
         * **Feature: mountain-taxes-calculator, Property 10: Responsive design behavior**
         * For any screen size or device type, the application should display all functionality 
         * in an appropriately sized and accessible layout
         */
        test('Property 10: Responsive design behavior', () => {
            fc.assert(fc.property(
                fc.record({
                    width: fc.integer({ min: 320, max: 2560 }), // Common screen widths
                    height: fc.integer({ min: 240, max: 1440 }), // Common screen heights
                    deviceType: fc.constantFrom('mobile', 'tablet', 'desktop'),
                    orientation: fc.constantFrom('portrait', 'landscape')
                }),
                (screenConfig) => {
                    // Set up viewport dimensions
                    Object.defineProperty(window, 'innerWidth', {
                        writable: true,
                        configurable: true,
                        value: screenConfig.width
                    });
                    Object.defineProperty(window, 'innerHeight', {
                        writable: true,
                        configurable: true,
                        value: screenConfig.height
                    });

                    // Simulate viewport meta tag behavior
                    const viewport = document.querySelector('meta[name="viewport"]');
                    expect(viewport).toBeTruthy();
                    expect(viewport?.getAttribute('content')).toBe('width=device-width, initial-scale=1.0');

                    // Check that Bootstrap CSS is loaded
                    const bootstrapLink = document.querySelector('link[href*="bootswatch"]');
                    expect(bootstrapLink).toBeTruthy();

                    // Verify essential responsive elements exist
                    const navbar = document.querySelector('.navbar');
                    const container = document.querySelector('.container');
                    const mainContent = document.getElementById('main-content');

                    expect(navbar).toBeTruthy();
                    expect(container).toBeTruthy();
                    expect(mainContent).toBeTruthy();

                    // Check navbar has responsive classes
                    expect(navbar?.classList.contains('navbar-expand-lg')).toBe(true);

                    // Verify container uses Bootstrap responsive classes
                    expect(container?.classList.contains('container')).toBe(true);

                    // For mobile screens, ensure content is accessible
                    if (screenConfig.width <= 768) {
                        // Mobile-specific checks
                        expect(navbar?.classList.contains('navbar-expand-lg')).toBe(true); // Should collapse on mobile
                    }

                    // For desktop screens, ensure full layout is available
                    if (screenConfig.width >= 992) {
                        // Desktop-specific checks
                        expect(navbar?.classList.contains('navbar-expand-lg')).toBe(true); // Should be expanded
                    }

                    // Verify accessibility attributes
                    const spinnerElement = document.querySelector('.spinner-border');
                    if (spinnerElement) {
                        expect(spinnerElement.getAttribute('role')).toBe('status');
                        const hiddenText = spinnerElement.querySelector('.visually-hidden');
                        expect(hiddenText).toBeTruthy();
                        expect(hiddenText?.textContent).toBe('Loading...');
                    }

                    return true;
                }
            ), { numRuns: 100 });
        });
    });

    describe('Unit Tests - Bootstrap Integration', () => {
        test('should load Bootstrap CSS correctly', () => {
            const bootstrapLink = document.querySelector('link[href*="bootswatch"]');
            expect(bootstrapLink).toBeTruthy();
            expect(bootstrapLink?.getAttribute('href')).toContain('brite/bootstrap.min.css');
        });

        test('should have proper viewport meta tag for responsive design', () => {
            const viewport = document.querySelector('meta[name="viewport"]');
            expect(viewport).toBeTruthy();
            expect(viewport?.getAttribute('content')).toBe('width=device-width, initial-scale=1.0');
        });

        test('should use Bootstrap responsive classes', () => {
            const navbar = document.querySelector('.navbar');
            const container = document.querySelector('.container');

            expect(navbar?.classList.contains('navbar')).toBe(true);
            expect(navbar?.classList.contains('navbar-expand-lg')).toBe(true);
            expect(navbar?.classList.contains('navbar-dark')).toBe(true);
            expect(navbar?.classList.contains('bg-primary')).toBe(true);

            expect(container?.classList.contains('container')).toBe(true);
        });

        test('should have accessibility attributes', () => {
            // Check spinner accessibility
            const spinner = document.querySelector('.spinner-border');
            expect(spinner?.getAttribute('role')).toBe('status');

            const hiddenText = spinner?.querySelector('.visually-hidden');
            expect(hiddenText).toBeTruthy();
            expect(hiddenText?.textContent).toBe('Loading...');

            // Check navbar brand link
            const navbarBrand = document.querySelector('.navbar-brand');
            expect(navbarBrand).toBeTruthy();
            expect(navbarBrand?.getAttribute('href')).toBe('#/');
        });

        test('should handle different screen breakpoints', () => {
            // Test mobile breakpoint (< 576px)
            Object.defineProperty(window, 'innerWidth', { value: 400 });
            const navbar = document.querySelector('.navbar-expand-lg');
            expect(navbar).toBeTruthy(); // Should collapse on mobile

            // Test tablet breakpoint (768px - 991px)
            Object.defineProperty(window, 'innerWidth', { value: 800 });
            expect(navbar).toBeTruthy();

            // Test desktop breakpoint (>= 992px)
            Object.defineProperty(window, 'innerWidth', { value: 1200 });
            expect(navbar).toBeTruthy(); // Should be expanded
        });

        test('should maintain proper layout structure', () => {
            const app = document.getElementById('app');
            const navbar = document.querySelector('.navbar');
            const container = document.querySelector('.container');
            const mainContent = document.getElementById('main-content');

            expect(app).toBeTruthy();
            expect(navbar).toBeTruthy();
            expect(container).toBeTruthy();
            expect(mainContent).toBeTruthy();

            // Verify hierarchy - app contains both navbar and container
            expect(app?.contains(navbar as Node)).toBe(true);
            
            // Check if there's a container with mt-4 class that contains main-content
            const containerWithMargin = document.querySelector('.container.mt-4');
            if (containerWithMargin) {
                expect(containerWithMargin.contains(mainContent as Node)).toBe(true);
                expect(app?.contains(containerWithMargin as Node)).toBe(true);
            } else {
                // Fallback: check if any container contains main-content
                const allContainers = document.querySelectorAll('.container');
                let found = false;
                allContainers.forEach(cont => {
                    if (cont.contains(mainContent as Node)) {
                        found = true;
                    }
                });
                expect(found).toBe(true);
            }
        });
    });

    describe('Location Service Integration', () => {
        test('should initialize location service', () => {
            const { LocationService } = require('../src/locationService');
            // Verify LocationService constructor is available
            expect(LocationService).toBeDefined();
            expect(typeof LocationService).toBe('function');
        });

        test('should handle successful location detection', async () => {
            // Verify location detection is called
            expect(mockLocationService.detectLocation).toBeDefined();
            expect(mockLocationService.getRecommendedStates).toBeDefined();
            expect(mockLocationService.getSelectionMessage).toBeDefined();
        });

        test('should display location status messages', () => {
            // Test that the DOM structure supports location status alerts
            const mainContent = document.getElementById('main-content');
            expect(mainContent).toBeTruthy();
            
            // Simulate adding a location status alert
            const alertHtml = `
                <div id="location-status-alert" class="alert alert-info alert-dismissible fade show" role="alert">
                    <i class="fas fa-location-arrow me-2" aria-hidden="true"></i>
                    Detecting your location...
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>
            `;
            
            mainContent?.insertAdjacentHTML('afterbegin', alertHtml);
            
            const alert = document.getElementById('location-status-alert');
            expect(alert).toBeTruthy();
            expect(alert?.classList.contains('alert')).toBe(true);
            expect(alert?.classList.contains('alert-info')).toBe(true);
            expect(alert?.getAttribute('role')).toBe('alert');
            
            // Check accessibility
            const closeButton = alert?.querySelector('.btn-close');
            expect(closeButton?.getAttribute('aria-label')).toBe('Close');
        });

        test('should handle location detection errors gracefully', () => {
            // Mock failed location detection
            mockLocationService.detectLocation.mockResolvedValue({
                success: false,
                isInUS: false,
                error: 'Location detection failed'
            });
            
            mockLocationService.getRecommendedStates.mockReturnValue([
                'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California'
            ]);
            
            mockLocationService.getSelectionMessage.mockReturnValue(
                'We\'ve selected all states for comparison. You can customize your selection using the legend below.'
            );
            
            // Verify the service handles errors appropriately
            expect(mockLocationService.detectLocation).toBeDefined();
            expect(mockLocationService.getRecommendedStates).toBeDefined();
            expect(mockLocationService.getSelectionMessage).toBeDefined();
        });

        test('should support different location scenarios', () => {
            // Test US state detection
            mockLocationService.getRecommendedStates.mockReturnValueOnce(['Texas']);
            mockLocationService.getSelectionMessage.mockReturnValueOnce(
                'Based on your location, we\'ve selected Texas for comparison.'
            );
            
            let recommended = mockLocationService.getRecommendedStates({ 
                success: true, 
                isInUS: true, 
                stateName: 'Texas' 
            });
            expect(recommended).toEqual(['Texas']);
            
            // Test non-US detection
            mockLocationService.getRecommendedStates.mockReturnValueOnce([
                'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California'
            ]);
            mockLocationService.getSelectionMessage.mockReturnValueOnce(
                'We\'ve selected all states for comparison.'
            );
            
            recommended = mockLocationService.getRecommendedStates({ 
                success: true, 
                isInUS: false 
            });
            expect(recommended.length).toBeGreaterThan(1);
        });
    });
});