/**
 * Mountain Taxes - Navbar Component
 * 
 * Handles the navigation bar functionality including the states dropdown menu
 * and theme switching functionality. Provides easy access to individual state 
 * pages with responsive design and Bootstrap Color Mode support.
 */

import { STATE_TAX_DATA } from './stateData';
import { State, StatesByTaxStatus } from './types';
import { ThemeService, ThemeMode } from './themeService';

interface RouterInterface {
    navigate(path: string): void;
}

export class Navbar {
    private containerId: string;
    private router?: RouterInterface;
    private themeService: ThemeService;

    constructor(containerId: string = 'states-dropdown-content', router?: RouterInterface) {
        this.containerId = containerId;
        this.router = router;
        this.themeService = new ThemeService();
        this.init();
    }

    /**
     * Initialize the navbar component
     */
    private init(): void {
        this.populateStatesDropdown();
        this.initializeTheme();
        this.setupEventListeners();
    }

    /**
     * Populate the states dropdown with all available states
     */
    private populateStatesDropdown(): void {
        const container = document.getElementById(this.containerId);
        if (!container) {
            console.error(`States dropdown container with id '${this.containerId}' not found`);
            return;
        }

        // Sort states alphabetically for better UX
        const sortedStates = [...STATE_TAX_DATA].sort((a, b) => a.name.localeCompare(b.name));

        // Create dropdown items for each state
        const stateItems = sortedStates.map(state => {
            const stateSlug = this.createStateSlug(state.name);
            const hasIncomeTax = this.hasIncomeTax(state);
            
            return `
                <li>
                    <a class="dropdown-item router-link" 
                       href="#/state/${stateSlug}" 
                       data-state-name="${state.name}"
                       title="View ${state.name} tax information">
                        ${state.name}
                        ${!hasIncomeTax ? '<small class="text-muted ms-1">(No Income Tax)</small>' : ''}
                    </a>
                </li>
            `;
        }).join('');

        container.innerHTML = stateItems;
    }

    /**
     * Create a URL-friendly slug from state name
     */
    private createStateSlug(stateName: string): string {
        return stateName.toLowerCase().replace(/\s+/g, '-');
    }

    /**
     * Check if a state has income tax
     */
    private hasIncomeTax(state: State): boolean {
        // Check if any filing type has tax brackets with rates > 0
        return state.filingType.some(filing => 
            filing.taxBrackets.some(bracket => bracket.rate > 0)
        );
    }

    /**
     * Initialize theme functionality
     */
    private initializeTheme(): void {
        this.updateThemeDisplay();
        
        // Listen for theme changes
        this.themeService.addListener(() => {
            this.updateThemeDisplay();
        });
    }

    /**
     * Update the theme dropdown display
     */
    private updateThemeDisplay(): void {
        const themeIcon = document.getElementById('theme-icon');
        const themeLabel = document.getElementById('theme-label');
        
        if (themeIcon && themeLabel) {
            const currentTheme = this.themeService.getCurrentTheme();
            const config = this.themeService.getThemeConfig(currentTheme);
            
            themeIcon.className = `${config.icon} me-1`;
            themeLabel.textContent = config.label;
        }

        // Update active state in dropdown
        const themeOptions = document.querySelectorAll('.theme-option');
        themeOptions.forEach(option => {
            const themeMode = option.getAttribute('data-theme');
            if (themeMode === this.themeService.getCurrentTheme()) {
                option.classList.add('active');
            } else {
                option.classList.remove('active');
            }
        });
    }

    /**
     * Setup event listeners for dropdown interactions
     */
    private setupEventListeners(): void {
        // Handle dropdown item clicks
        document.addEventListener('click', (event) => {
            const target = event.target as HTMLElement;
            
            // Check if clicked element is a theme option
            if (target.classList.contains('theme-option')) {
                event.preventDefault();
                
                const themeMode = target.getAttribute('data-theme') as ThemeMode;
                if (themeMode) {
                    this.themeService.setTheme(themeMode);
                    this.closeDropdown();
                }
                return;
            }
            
            // Check if clicked element is a state dropdown item
            if (target.classList.contains('dropdown-item') && target.hasAttribute('data-state-name')) {
                event.preventDefault();
                
                const stateName = target.getAttribute('data-state-name');
                const href = target.getAttribute('href');
                
                if (stateName && href && this.router) {
                    // Close the dropdown
                    this.closeDropdown();
                    
                    // Navigate to state page
                    this.router.navigate(href);
                } else if (href) {
                    // Fallback to standard navigation
                    window.location.hash = href;
                }
            }
        });

        // Handle dropdown toggle for better mobile experience
        const dropdownToggle = document.getElementById('statesDropdown');
        if (dropdownToggle) {
            dropdownToggle.addEventListener('click', (event) => {
                // Let Bootstrap handle the dropdown, but ensure proper mobile behavior
                if (window.innerWidth <= 768) {
                    event.stopPropagation();
                }
            });
        }

        // Close dropdown when clicking outside (mobile enhancement)
        document.addEventListener('click', (event) => {
            const target = event.target as HTMLElement;
            const dropdown = document.querySelector('.states-dropdown-menu');
            const dropdownToggle = document.getElementById('statesDropdown');
            
            if (dropdown && dropdownToggle && 
                !dropdown.contains(target) && 
                !dropdownToggle.contains(target) &&
                dropdown.classList.contains('show')) {
                this.closeDropdown();
            }
        });

        // Handle keyboard navigation for accessibility
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                this.closeDropdown();
            }
        });
    }

    /**
     * Close all dropdown menus
     */
    private closeDropdown(): void {
        // Close states dropdown
        const statesDropdown = document.querySelector('.states-dropdown-menu');
        const statesDropdownToggle = document.getElementById('statesDropdown');
        
        if (statesDropdown && statesDropdown.classList.contains('show')) {
            statesDropdown.classList.remove('show');
        }
        
        if (statesDropdownToggle) {
            statesDropdownToggle.setAttribute('aria-expanded', 'false');
        }

        // Close theme dropdown
        const themeDropdown = document.querySelector('#themeDropdown + .dropdown-menu');
        const themeDropdownToggle = document.getElementById('themeDropdown');
        
        if (themeDropdown && themeDropdown.classList.contains('show')) {
            themeDropdown.classList.remove('show');
        }
        
        if (themeDropdownToggle) {
            themeDropdownToggle.setAttribute('aria-expanded', 'false');
        }

        // Also close the navbar collapse on mobile
        const navbarCollapse = document.getElementById('navbarNav');
        if (navbarCollapse && navbarCollapse.classList.contains('show')) {
            navbarCollapse.classList.remove('show');
        }
    }

    /**
     * Get all states grouped by tax status for potential future use
     */
    public getStatesGroupedByTaxStatus(): StatesByTaxStatus {
        const withTax: State[] = [];
        const withoutTax: State[] = [];

        STATE_TAX_DATA.forEach(state => {
            if (this.hasIncomeTax(state)) {
                withTax.push(state);
            } else {
                withoutTax.push(state);
            }
        });

        return { withTax, withoutTax };
    }

    /**
     * Search states by name (for potential future search functionality)
     */
    public searchStates(query: string): State[] {
        const lowercaseQuery = query.toLowerCase();
        return STATE_TAX_DATA.filter(state => 
            state.name.toLowerCase().includes(lowercaseQuery)
        );
    }

    /**
     * Refresh the dropdown content (useful if state data changes)
     */
    public refresh(): void {
        this.populateStatesDropdown();
    }

    /**
     * Get the current router instance
     */
    public getRouter(): RouterInterface | undefined {
        return this.router;
    }

    /**
     * Set the router instance
     */
    public setRouter(router: RouterInterface): void {
        this.router = router;
    }

    /**
     * Get the theme service instance
     */
    public getThemeService(): ThemeService {
        return this.themeService;
    }
}