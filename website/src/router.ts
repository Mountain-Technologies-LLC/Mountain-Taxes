/**
 * Mountain Taxes - Client-Side Router
 * 
 * Handles SPA navigation between main chart view and state detail pages.
 * Manages browser history, deep linking, and URL updates.
 */

import { STATE_TAX_DATA } from './stateData';
import { State } from './types';

export interface Route {
    path: string;
    handler: (params?: any) => void;
}

export class Router {
    private routes: Route[] = [];
    private currentPath: string = '';

    constructor() {
        this.init();
    }

    /**
     * Initialize the router with event listeners
     */
    private init(): void {
        // Handle browser back/forward navigation
        window.addEventListener('popstate', () => {
            this.handleRoute(window.location.pathname + window.location.hash);
        });

        // Don't handle initial route until routes are registered
        // This will be handled by the first navigate() call or by calling start()
    }

    /**
     * Start the router and handle the initial route
     */
    public start(): void {
        this.handleRoute(window.location.pathname + window.location.hash);
    }

    /**
     * Register a route with its handler
     */
    public addRoute(path: string, handler: (params?: any) => void): void {
        this.routes.push({ path, handler });
    }

    /**
     * Navigate to a specific path
     */
    public navigate(path: string): void {
        if (path !== this.currentPath) {
            this.currentPath = path;
            window.history.pushState({}, '', path);
        }
        this.handleRoute(path);
    }

    /**
     * Handle route matching and execution
     */
    private handleRoute(path: string): void {
        // Remove leading slash and hash for consistent matching
        const cleanPath = path.replace(/^\/?(#\/)?/, '');
        
        // Try to match exact routes first
        const exactRoute = this.routes.find(route => {
            const cleanRoutePath = route.path.replace(/^\/?(#\/)?/, '');
            return cleanRoutePath === cleanPath;
        });

        if (exactRoute) {
            exactRoute.handler();
            return;
        }

        // Try to match parameterized routes (e.g., state/:stateName)
        for (const route of this.routes) {
            const cleanRoutePath = route.path.replace(/^\/?(#\/)?/, '');
            const routeParams = this.matchRoute(cleanRoutePath, cleanPath);
            if (routeParams !== null) {
                route.handler(routeParams);
                return;
            }
        }

        // Default to home route if no match found and path is empty or root
        if (cleanPath === '' || cleanPath === '/') {
            const homeRoute = this.routes.find(route => {
                const cleanRoutePath = route.path.replace(/^\/?(#\/)?/, '');
                return cleanRoutePath === '' || cleanRoutePath === 'home';
            });
            
            if (homeRoute) {
                homeRoute.handler();
                return;
            }
        }
        
        console.warn(`No route found for path: ${path}`);
    }

    /**
     * Match a route pattern against a path and extract parameters
     */
    private matchRoute(routePattern: string, path: string): any | null {
        const routeParts = routePattern.split('/');
        const pathParts = path.split('/');

        if (routeParts.length !== pathParts.length) {
            return null;
        }

        const params: any = {};
        
        for (let i = 0; i < routeParts.length; i++) {
            const routePart = routeParts[i];
            const pathPart = pathParts[i];

            if (routePart.startsWith(':')) {
                // This is a parameter
                const paramName = routePart.substring(1);
                params[paramName] = decodeURIComponent(pathPart);
            } else if (routePart !== pathPart) {
                // Static part doesn't match
                return null;
            }
        }

        return params;
    }

    /**
     * Get current path
     */
    public getCurrentPath(): string {
        return this.currentPath;
    }
}

/**
 * State Detail View Component
 * Displays comprehensive tax information for a specific state
 */
export class StateDetailView {
    private containerId: string;

    constructor(containerId: string) {
        this.containerId = containerId;
    }

    /**
     * Render state detail page
     */
    public render(stateName: string): void {
        const container = document.getElementById(this.containerId);
        if (!container) {
            console.error(`Container with id '${this.containerId}' not found`);
            return;
        }

        // Find the state data
        const state = STATE_TAX_DATA.find(s => 
            s.name.toLowerCase().replace(/\s+/g, '-') === stateName.toLowerCase()
        );

        if (!state) {
            this.renderNotFound(container, stateName);
            return;
        }

        this.renderStateDetail(container, state);
    }

    /**
     * Render state detail information
     */
    private renderStateDetail(container: HTMLElement, state: State): void {
        container.innerHTML = `
            <div class="row">
                <div class="col-12">
                    <nav aria-label="breadcrumb">
                        <ol class="breadcrumb">
                            <li class="breadcrumb-item">
                                <a href="#/" class="router-link">Home</a>
                            </li>
                            <li class="breadcrumb-item active" aria-current="page">${state.name}</li>
                        </ol>
                    </nav>
                </div>
            </div>

            <div class="row">
                <div class="col-12">
                    <h1 class="mb-4">${state.name} Tax Information</h1>
                    <p class="lead">Complete tax bracket and deduction information for ${state.name}</p>
                </div>
            </div>

            <div class="row mb-4">
                <div class="col-12">
                    <div class="card">
                        <div class="card-header">
                            <h5 class="card-title mb-0">General Information</h5>
                        </div>
                        <div class="card-body">
                            <div class="row">
                                <div class="col-md-6">
                                    <strong>State:</strong> ${state.name}
                                </div>
                                <div class="col-md-6">
                                    <strong>Dependent Deduction:</strong> $${state.dependentDeduction.toLocaleString()}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            ${this.renderFilingTypes(state)}

            <div class="row mt-4">
                <div class="col-12">
                    <a href="#/" class="btn btn-primary router-link">
                        <i class="bi bi-arrow-left"></i> Back to Chart
                    </a>
                </div>
            </div>
        `;

        // Add click handlers for router links
        this.addRouterLinkHandlers(container);
    }

    /**
     * Render filing types and tax brackets
     */
    private renderFilingTypes(state: State): string {
        return state.filingType.map(filing => `
            <div class="row mb-4">
                <div class="col-12">
                    <div class="card">
                        <div class="card-header">
                            <h5 class="card-title mb-0">${filing.type} Filing</h5>
                        </div>
                        <div class="card-body">
                            <div class="row mb-3">
                                <div class="col-md-6">
                                    <strong>Standard Deduction:</strong> $${filing.standardDeduction.toLocaleString()}
                                </div>
                                <div class="col-md-6">
                                    <strong>Personal Exemption:</strong> $${filing.personalExemption.toLocaleString()}
                                </div>
                            </div>
                            
                            <h6>Tax Brackets</h6>
                            ${this.renderTaxBrackets(filing.taxBrackets)}
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    }

    /**
     * Render tax brackets table
     */
    private renderTaxBrackets(brackets: Array<{bracket: number, rate: number}>): string {
        if (brackets.length === 0) {
            return '<p class="text-muted">No state income tax</p>';
        }

        const tableRows = brackets.map((bracket, index) => {
            const nextBracket = brackets[index + 1];
            const rangeEnd = nextBracket ? `$${nextBracket.bracket.toLocaleString()}` : 'and above';
            const rangeStart = `$${bracket.bracket.toLocaleString()}`;
            
            return `
                <tr>
                    <td>${rangeStart} - ${rangeEnd}</td>
                    <td>${(bracket.rate * 100).toFixed(2)}%</td>
                </tr>
            `;
        }).join('');

        return `
            <div class="table-responsive">
                <table class="table table-striped">
                    <thead>
                        <tr>
                            <th>Income Range</th>
                            <th>Tax Rate</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${tableRows}
                    </tbody>
                </table>
            </div>
        `;
    }

    /**
     * Render not found page
     */
    private renderNotFound(container: HTMLElement, stateName: string): void {
        container.innerHTML = `
            <div class="row">
                <div class="col-12">
                    <nav aria-label="breadcrumb">
                        <ol class="breadcrumb">
                            <li class="breadcrumb-item">
                                <a href="#/" class="router-link">Home</a>
                            </li>
                            <li class="breadcrumb-item active" aria-current="page">State Not Found</li>
                        </ol>
                    </nav>
                </div>
            </div>

            <div class="row">
                <div class="col-12">
                    <div class="alert alert-warning" role="alert">
                        <h4 class="alert-heading">State Not Found</h4>
                        <p>The state "${stateName}" was not found in our database.</p>
                        <hr>
                        <p class="mb-0">
                            <a href="#/" class="btn btn-primary router-link">Return to Home</a>
                        </p>
                    </div>
                </div>
            </div>
        `;

        this.addRouterLinkHandlers(container);
    }

    /**
     * Add click handlers for router links
     */
    private addRouterLinkHandlers(container: HTMLElement): void {
        const routerLinks = container.querySelectorAll('.router-link');
        routerLinks.forEach(link => {
            link.addEventListener('click', (event) => {
                event.preventDefault();
                const href = (event.target as HTMLAnchorElement).getAttribute('href');
                if (href && window.router) {
                    window.router.navigate(href);
                }
            });
        });
    }
}

// Extend the Window interface to include router
declare global {
    interface Window {
        router: Router;
    }
}