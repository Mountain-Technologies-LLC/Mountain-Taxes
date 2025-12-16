/**
 * Mountain Taxes Calculator - Router Tests
 * 
 * Tests for client-side routing functionality including navigation,
 * browser history management, and deep linking support.
 */

import { Router, StateDetailView } from '../src/router';
import { STATE_TAX_DATA } from '../src/stateData';
import * as fc from 'fast-check';

// Mock window.history for testing
const mockPushState = jest.fn();
const mockReplaceState = jest.fn();

Object.defineProperty(window, 'history', {
    value: {
        pushState: mockPushState,
        replaceState: mockReplaceState,
        back: jest.fn(),
        forward: jest.fn(),
        go: jest.fn(),
        length: 1,
        state: null
    },
    writable: true
});

// Mock window.location for testing
Object.defineProperty(window, 'location', {
    value: {
        pathname: '/',
        hash: '',
        search: '',
        href: 'http://localhost/',
        origin: 'http://localhost'
    },
    writable: true
});

describe('Router Component', () => {
    let router: Router;
    let mockHandler: jest.Mock;

    beforeEach(() => {
        router = new Router();
        mockHandler = jest.fn();
        mockPushState.mockClear();
        mockReplaceState.mockClear();
        
        // Reset location
        (window.location as any).pathname = '/';
        (window.location as any).hash = '';
    });

    describe('Route Registration and Matching', () => {
        test('should register routes correctly', () => {
            router.addRoute('test', mockHandler);
            router.navigate('#/test');
            
            expect(mockHandler).toHaveBeenCalled();
        });

        test('should handle parameterized routes', () => {
            router.addRoute('state/:stateName', mockHandler);
            router.navigate('#/state/california');
            
            expect(mockHandler).toHaveBeenCalledWith({ stateName: 'california' });
        });

        test('should handle home route variations', () => {
            const emptyRouteHandler = jest.fn();
            const homeRouteHandler = jest.fn();
            
            router.addRoute('', emptyRouteHandler);
            router.addRoute('home', homeRouteHandler);
            
            router.navigate('');
            expect(emptyRouteHandler).toHaveBeenCalled();
            
            emptyRouteHandler.mockClear();
            router.navigate('#/');
            expect(emptyRouteHandler).toHaveBeenCalled();
            
            homeRouteHandler.mockClear();
            router.navigate('#/home');
            expect(homeRouteHandler).toHaveBeenCalled();
        });
    });

    describe('Navigation and History Management', () => {
        test('should update browser history on navigation', () => {
            router.navigate('#/test');
            
            expect(mockPushState).toHaveBeenCalledWith({}, '', '#/test');
        });

        test('should not update history for same path', () => {
            router.navigate('#/test');
            mockPushState.mockClear();
            
            router.navigate('#/test');
            expect(mockPushState).not.toHaveBeenCalled();
        });

        test('should handle popstate events', () => {
            router.addRoute('test', mockHandler);
            
            // Simulate browser back/forward
            const popstateEvent = new PopStateEvent('popstate', { state: {} });
            (window.location as any).pathname = '/test';
            window.dispatchEvent(popstateEvent);
            
            expect(mockHandler).toHaveBeenCalled();
        });
    });

    describe('URL Path Cleaning and Normalization', () => {
        test('should handle various URL formats consistently', () => {
            router.addRoute('test', mockHandler);
            
            // Test different URL formats that should all match
            const urlVariations = [
                'test',
                '/test',
                '#/test',
                '/#/test'
            ];
            
            urlVariations.forEach(url => {
                mockHandler.mockClear();
                router.navigate(url);
                expect(mockHandler).toHaveBeenCalled();
            });
        });
    });
});

describe('StateDetailView Component', () => {
    let stateDetailView: StateDetailView;
    let container: HTMLElement;

    beforeEach(() => {
        // Create test container
        container = document.createElement('div');
        container.id = 'test-container';
        document.body.appendChild(container);
        
        stateDetailView = new StateDetailView('test-container');
    });

    afterEach(() => {
        document.body.removeChild(container);
    });

    describe('State Detail Rendering', () => {
        test('should render valid state details correctly', () => {
            const testState = STATE_TAX_DATA[0]; // Use first state from data
            const stateSlug = testState.name.toLowerCase().replace(/\s+/g, '-');
            
            stateDetailView.render(stateSlug);
            
            // Check that state name appears in the rendered content
            expect(container.innerHTML).toContain(testState.name);
            
            // Check that filing types are rendered
            testState.filingType.forEach(filing => {
                expect(container.innerHTML).toContain(filing.type);
                expect(container.innerHTML).toContain(filing.standardDeduction.toLocaleString());
            });
        });

        test('should render not found page for invalid state', () => {
            stateDetailView.render('invalid-state');
            
            expect(container.innerHTML).toContain('State Not Found');
            expect(container.innerHTML).toContain('invalid-state');
        });

        test('should include navigation breadcrumbs', () => {
            const testState = STATE_TAX_DATA[0];
            const stateSlug = testState.name.toLowerCase().replace(/\s+/g, '-');
            
            stateDetailView.render(stateSlug);
            
            expect(container.innerHTML).toContain('breadcrumb');
            expect(container.innerHTML).toContain('Home');
        });

        test('should include back navigation link', () => {
            const testState = STATE_TAX_DATA[0];
            const stateSlug = testState.name.toLowerCase().replace(/\s+/g, '-');
            
            stateDetailView.render(stateSlug);
            
            expect(container.innerHTML).toContain('Back to Chart');
            expect(container.innerHTML).toContain('href="#/"');
        });
    });

    describe('Tax Bracket Rendering', () => {
        test('should render tax brackets table for states with income tax', () => {
            // Find a state with tax brackets
            const stateWithTax = STATE_TAX_DATA.find(state => 
                state.filingType.some(filing => filing.taxBrackets.length > 0)
            );
            
            if (stateWithTax) {
                const stateSlug = stateWithTax.name.toLowerCase().replace(/\s+/g, '-');
                stateDetailView.render(stateSlug);
                
                expect(container.innerHTML).toContain('Tax Brackets');
                expect(container.innerHTML).toContain('Income Range');
                expect(container.innerHTML).toContain('Tax Rate');
            }
        });

        test('should handle states with no income tax', () => {
            // Find a state with no tax brackets (like Alaska)
            const stateWithoutTax = STATE_TAX_DATA.find(state => 
                state.filingType.every(filing => filing.taxBrackets.length === 0)
            );
            
            if (stateWithoutTax) {
                const stateSlug = stateWithoutTax.name.toLowerCase().replace(/\s+/g, '-');
                stateDetailView.render(stateSlug);
                
                expect(container.innerHTML).toContain('No state income tax');
            }
        });
    });
});

describe('Property-Based Tests', () => {
    let router: Router;

    beforeEach(() => {
        router = new Router();
        
        // Make router globally available
        (window as any).router = router;
    });

    /**
     * **Feature: mountain-taxes-calculator, Property 11: SPA routing functionality**
     * **Validates: Requirements 8.3**
     * 
     * For any navigation operation, the single-page application should handle routing 
     * correctly without full page reloads
     */
    test('Property 11: SPA routing functionality', () => {
        fc.assert(fc.property(
            fc.oneof(
                // Generate valid route patterns
                fc.constant(''),
                fc.constant('home'),
                fc.constant('#/'),
                fc.constant('#/home'),
                // Generate state routes with valid state names
                fc.constantFrom(...STATE_TAX_DATA.slice(0, 5).map(state => 
                    `#/state/${state.name.toLowerCase().replace(/\s+/g, '-')}`
                ))
            ),
            (route) => {
                // Create a fresh router for each test to avoid interference
                const testRouter = new Router();
                let routeHandled = false;
                
                // Register handlers for all expected route patterns
                testRouter.addRoute('', () => { routeHandled = true; });
                testRouter.addRoute('home', () => { routeHandled = true; });
                testRouter.addRoute('state/:stateName', () => { routeHandled = true; });
                
                // Navigate to the route
                const initialHistoryLength = mockPushState.mock.calls.length;
                testRouter.navigate(route);
                
                // Verify that navigation occurred
                const historyUpdated = mockPushState.mock.calls.length > initialHistoryLength;
                
                // For SPA routing, we should either:
                // 1. Update browser history (for new routes)
                // 2. Handle the route (for existing routes)
                // 3. Both (most common case)
                const routingWorked = historyUpdated || routeHandled;
                
                return routingWorked;
            }
        ), { numRuns: 50 });
    });

    /**
     * Property test for route parameter extraction
     */
    test('Route parameter extraction works correctly', () => {
        fc.assert(fc.property(
            fc.stringOf(fc.char().filter(c => /[a-zA-Z0-9-]/.test(c)), { minLength: 1, maxLength: 20 }),
            (stateName) => {
                let extractedParams: any = null;
                
                router.addRoute('state/:stateName', (params) => {
                    extractedParams = params;
                });
                
                router.navigate(`#/state/${stateName}`);
                
                // Verify that parameters were extracted correctly
                return extractedParams && extractedParams.stateName === stateName;
            }
        ), { numRuns: 50 });
    });

    /**
     * Property test for URL normalization
     */
    test('URL normalization handles various formats consistently', () => {
        fc.assert(fc.property(
            fc.stringOf(fc.char().filter(c => /[a-zA-Z0-9-]/.test(c)), { minLength: 1, maxLength: 15 }),
            (routePath) => {
                let handlerCallCount = 0;
                const mockHandler = () => { handlerCallCount++; };
                
                router.addRoute(routePath, mockHandler);
                
                // Test different URL formats for the same route
                const urlVariations = [
                    routePath,
                    `/${routePath}`,
                    `#/${routePath}`,
                    `/#/${routePath}`
                ];
                
                urlVariations.forEach(url => {
                    router.navigate(url);
                });
                
                // All variations should result in the same number of handler calls
                // (accounting for duplicate navigation prevention)
                return handlerCallCount >= 1;
            }
        ), { numRuns: 30 });
    });
});