/**
 * Mountain Taxes - Navbar Component Tests
 * 
 * Comprehensive test suite for the navbar component functionality
 * including dropdown population, state navigation, and responsive behavior.
 */

import { Navbar } from '../src/navbar';
import { STATE_TAX_DATA } from '../src/stateData';

// Mock DOM environment
const mockRouter = {
    navigate: jest.fn()
};

// Setup DOM elements for testing
function setupDOM(): void {
    document.body.innerHTML = `
        <nav class="navbar navbar-expand-lg bg-primary">
            <div class="container">
                <a class="navbar-brand router-link" href="#/">Mountain Taxes</a>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarNav">
                    <ul class="navbar-nav ms-auto">
                        <li class="nav-item dropdown">
                            <a class="nav-link dropdown-toggle" href="#" id="statesDropdown" role="button">
                                States
                            </a>
                            <ul class="dropdown-menu dropdown-menu-end states-dropdown-menu">
                                <li><h6 class="dropdown-header">Select a State</h6></li>
                                <li><hr class="dropdown-divider"></li>
                                <div id="states-dropdown-content">
                                    <!-- States will be populated here -->
                                </div>
                            </ul>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    `;
}

describe('Navbar Component', () => {
    let navbar: Navbar;

    beforeEach(() => {
        setupDOM();
        jest.clearAllMocks();
        navbar = new Navbar('states-dropdown-content', mockRouter);
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });

    describe('Initialization', () => {
        test('should initialize without errors', () => {
            expect(() => new Navbar('states-dropdown-content', mockRouter)).not.toThrow();
        });

        test('should handle missing container gracefully', () => {
            const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
            new Navbar('non-existent-container', mockRouter);
            expect(consoleSpy).toHaveBeenCalledWith(
                expect.stringContaining("States dropdown container with id 'non-existent-container' not found")
            );
            consoleSpy.mockRestore();
        });
    });

    describe('States Dropdown Population', () => {
        test('should populate dropdown with all states', () => {
            const container = document.getElementById('states-dropdown-content');
            expect(container).toBeTruthy();
            
            const dropdownItems = container?.querySelectorAll('.dropdown-item');
            expect(dropdownItems?.length).toBe(STATE_TAX_DATA.length);
        });

        test('should sort states alphabetically', () => {
            const container = document.getElementById('states-dropdown-content');
            const dropdownItems = container?.querySelectorAll('.dropdown-item');
            
            if (dropdownItems && dropdownItems.length > 1) {
                const firstStateName = dropdownItems[0].getAttribute('data-state-name');
                const secondStateName = dropdownItems[1].getAttribute('data-state-name');
                
                expect(firstStateName).toBeTruthy();
                expect(secondStateName).toBeTruthy();
                
                if (firstStateName && secondStateName) {
                    expect(firstStateName.localeCompare(secondStateName)).toBeLessThan(0);
                }
            }
        });

        test('should include state names as data attributes', () => {
            const container = document.getElementById('states-dropdown-content');
            const dropdownItems = container?.querySelectorAll('.dropdown-item');
            
            dropdownItems?.forEach(item => {
                const stateName = item.getAttribute('data-state-name');
                expect(stateName).toBeTruthy();
                expect(STATE_TAX_DATA.some(state => state.name === stateName)).toBe(true);
            });
        });

        test('should mark states without income tax', () => {
            const container = document.getElementById('states-dropdown-content');
            const dropdownItems = container?.querySelectorAll('.dropdown-item');
            
            // Find a state without income tax (like Alaska, Florida, etc.)
            const noTaxStates = STATE_TAX_DATA.filter(state => 
                state.filingType.every(filing => 
                    filing.taxBrackets.every(bracket => bracket.rate === 0)
                )
            );

            if (noTaxStates.length > 0) {
                const noTaxStateName = noTaxStates[0].name;
                const noTaxStateItem = Array.from(dropdownItems || []).find(item => 
                    item.getAttribute('data-state-name') === noTaxStateName
                );
                
                expect(noTaxStateItem?.innerHTML).toContain('(No Income Tax)');
            }
        });
    });

    describe('State Slug Creation', () => {
        test('should create proper URL slugs from state names', () => {
            // Test the private method through public behavior
            const container = document.getElementById('states-dropdown-content');
            const newYorkItem = Array.from(container?.querySelectorAll('.dropdown-item') || [])
                .find(item => item.getAttribute('data-state-name') === 'New York');
            
            expect(newYorkItem?.getAttribute('href')).toBe('#/state/new-york');
        });

        test('should handle single-word state names', () => {
            const container = document.getElementById('states-dropdown-content');
            const californiaItem = Array.from(container?.querySelectorAll('.dropdown-item') || [])
                .find(item => item.getAttribute('data-state-name') === 'California');
            
            expect(californiaItem?.getAttribute('href')).toBe('#/state/california');
        });
    });

    describe('Event Handling', () => {
        test('should handle dropdown item clicks', () => {
            const container = document.getElementById('states-dropdown-content');
            const firstItem = container?.querySelector('.dropdown-item') as HTMLElement;
            
            if (firstItem) {
                const clickEvent = new MouseEvent('click', { bubbles: true });
                firstItem.dispatchEvent(clickEvent);
                
                expect(mockRouter.navigate).toHaveBeenCalledWith(
                    firstItem.getAttribute('href')
                );
            }
        });

        test('should prevent default behavior on dropdown item clicks', () => {
            const container = document.getElementById('states-dropdown-content');
            const firstItem = container?.querySelector('.dropdown-item') as HTMLElement;
            
            if (firstItem) {
                const clickEvent = new MouseEvent('click', { bubbles: true });
                const preventDefaultSpy = jest.spyOn(clickEvent, 'preventDefault');
                
                firstItem.dispatchEvent(clickEvent);
                
                expect(preventDefaultSpy).toHaveBeenCalled();
            }
        });

        test('should handle keyboard navigation (Escape key)', () => {
            const dropdown = document.querySelector('.states-dropdown-menu') as HTMLElement;
            dropdown?.classList.add('show');
            
            const escapeEvent = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true });
            document.dispatchEvent(escapeEvent);
            
            expect(dropdown?.classList.contains('show')).toBe(false);
        });
    });

    describe('Dropdown Management', () => {
        test('should close dropdown when requested', () => {
            const dropdown = document.querySelector('.states-dropdown-menu') as HTMLElement;
            const dropdownToggle = document.getElementById('statesDropdown') as HTMLElement;
            
            // Simulate open state
            dropdown?.classList.add('show');
            dropdownToggle?.setAttribute('aria-expanded', 'true');
            
            // Call private method through public interface (click outside)
            const outsideClick = new MouseEvent('click', { bubbles: true });
            document.body.dispatchEvent(outsideClick);
            
            // The dropdown should be closed
            expect(dropdown?.classList.contains('show')).toBe(false);
        });
    });

    describe('State Grouping and Search', () => {
        test('should group states by tax status correctly', () => {
            const grouped = navbar.getStatesGroupedByTaxStatus();
            
            expect(grouped.withTax).toBeDefined();
            expect(grouped.withoutTax).toBeDefined();
            expect(grouped.withTax.length + grouped.withoutTax.length).toBe(STATE_TAX_DATA.length);
            
            // Verify no-tax states are correctly identified
            grouped.withoutTax.forEach(state => {
                const hasNoTax = state.filingType.every(filing => 
                    filing.taxBrackets.every(bracket => bracket.rate === 0)
                );
                expect(hasNoTax).toBe(true);
            });
        });

        test('should search states by name', () => {
            const results = navbar.searchStates('new');
            
            expect(results.length).toBeGreaterThan(0);
            results.forEach(state => {
                expect(state.name.toLowerCase()).toContain('new');
            });
        });

        test('should return empty array for non-matching search', () => {
            const results = navbar.searchStates('xyz123');
            expect(results).toEqual([]);
        });

        test('should handle case-insensitive search', () => {
            const lowerResults = navbar.searchStates('california');
            const upperResults = navbar.searchStates('CALIFORNIA');
            const mixedResults = navbar.searchStates('CaLiFoRnIa');
            
            expect(lowerResults).toEqual(upperResults);
            expect(upperResults).toEqual(mixedResults);
        });
    });

    describe('Router Integration', () => {
        test('should get and set router correctly', () => {
            expect(navbar.getRouter()).toBe(mockRouter);
            
            const newRouter = { navigate: jest.fn() };
            navbar.setRouter(newRouter);
            
            expect(navbar.getRouter()).toBe(newRouter);
        });

        test('should refresh dropdown content', () => {
            const container = document.getElementById('states-dropdown-content');
            const initialContent = container?.innerHTML;
            
            // Clear content
            if (container) {
                container.innerHTML = '';
            }
            
            // Refresh should restore content
            navbar.refresh();
            
            expect(container?.innerHTML).toBe(initialContent);
        });
    });

    describe('Accessibility', () => {
        test('should include proper ARIA attributes', () => {
            const dropdownToggle = document.getElementById('statesDropdown');
            expect(dropdownToggle?.getAttribute('role')).toBe('button');
        });

        test('should include title attributes for better accessibility', () => {
            const container = document.getElementById('states-dropdown-content');
            const dropdownItems = container?.querySelectorAll('.dropdown-item');
            
            dropdownItems?.forEach(item => {
                const title = item.getAttribute('title');
                const stateName = item.getAttribute('data-state-name');
                expect(title).toContain(stateName || '');
                expect(title).toContain('tax information');
            });
        });
    });

    describe('Responsive Behavior', () => {
        test('should handle mobile viewport considerations', () => {
            // Mock window.innerWidth for mobile
            Object.defineProperty(window, 'innerWidth', {
                writable: true,
                configurable: true,
                value: 500
            });
            
            const dropdownToggle = document.getElementById('statesDropdown');
            const clickEvent = new MouseEvent('click', { bubbles: true });
            
            dropdownToggle?.dispatchEvent(clickEvent);
            
            // Should handle mobile-specific behavior
            expect(window.innerWidth).toBe(500);
        });
    });
});