/**
 * Mountain Taxes Calculator - Main Application Entry Point
 * 
 * This TypeScript application provides interactive visualization of state income tax obligations
 * using Chart.js and Bootstrap v5.3 with Bootswatch Brite theme.
 */

// Import Chart.js and register components
import { Chart, registerables } from 'chart.js';

// Register Chart.js components
Chart.register(...registerables);

/**
 * Application initialization
 */
class MountainTaxesApp {
    constructor() {
        this.init();
    }

    private init(): void {
        console.log('Mountain Taxes Calculator initializing...');
        
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.render());
        } else {
            this.render();
        }
    }

    private render(): void {
        const mainContent = document.getElementById('main-content');
        if (!mainContent) {
            console.error('Main content container not found');
            return;
        }

        // Basic placeholder content - will be replaced in subsequent tasks
        mainContent.innerHTML = `
            <div class="row">
                <div class="col-12">
                    <h1 class="mb-4">Mountain Taxes Calculator</h1>
                    <div class="alert alert-info">
                        <h4 class="alert-heading">Setup Complete!</h4>
                        <p>The TypeScript project structure has been initialized with:</p>
                        <ul class="mb-0">
                            <li>Bootstrap 5.3 with Bootswatch Brite theme</li>
                            <li>Chart.js for interactive visualizations</li>
                            <li>Jest and fast-check for testing</li>
                            <li>TypeScript configuration and build tools</li>
                        </ul>
                    </div>
                </div>
            </div>
        `;

        console.log('Mountain Taxes Calculator initialized successfully');
    }
}

// Initialize the application
new MountainTaxesApp();