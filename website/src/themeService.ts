/**
 * Mountain Taxes - Theme Service
 * 
 * Handles Bootstrap Color Mode theme switching functionality.
 * Supports Light, Dark, and Auto (system preference) themes with persistence.
 */

export type ThemeMode = 'light' | 'dark' | 'auto';

export interface ThemeConfig {
    mode: ThemeMode;
    icon: string;
    label: string;
}

export class ThemeService {
    private static readonly STORAGE_KEY = 'mountain-taxes-theme';
    private static readonly THEMES: Record<ThemeMode, ThemeConfig> = {
        light: { mode: 'light', icon: 'fas fa-sun', label: 'Light' },
        dark: { mode: 'dark', icon: 'fas fa-moon', label: 'Dark' },
        auto: { mode: 'auto', icon: 'fas fa-circle-half-stroke', label: 'Auto' }
    };

    private currentTheme: ThemeMode = 'auto';
    private mediaQuery: MediaQueryList;
    private listeners: Set<(theme: ThemeMode) => void> = new Set();

    constructor() {
        this.mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        this.init();
    }

    /**
     * Initialize the theme service
     */
    private init(): void {
        // Load saved theme or default to auto
        this.currentTheme = this.loadTheme();
        
        // Apply the theme
        this.applyTheme(this.currentTheme);
        
        // Listen for system theme changes
        this.mediaQuery.addEventListener('change', () => {
            if (this.currentTheme === 'auto') {
                this.applyTheme('auto');
                this.notifyListeners();
            }
        });
    }

    /**
     * Get the current theme mode
     */
    public getCurrentTheme(): ThemeMode {
        return this.currentTheme;
    }

    /**
     * Get all available themes
     */
    public getAvailableThemes(): ThemeConfig[] {
        return Object.values(ThemeService.THEMES);
    }

    /**
     * Get theme configuration by mode
     */
    public getThemeConfig(mode: ThemeMode): ThemeConfig {
        return ThemeService.THEMES[mode];
    }

    /**
     * Set the theme mode
     */
    public setTheme(mode: ThemeMode): void {
        if (mode === this.currentTheme) {
            return;
        }

        this.currentTheme = mode;
        this.applyTheme(mode);
        this.saveTheme(mode);
        this.notifyListeners();
    }

    /**
     * Toggle between light and dark themes (skips auto)
     */
    public toggleTheme(): void {
        const nextTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(nextTheme);
    }

    /**
     * Get the effective theme (resolves 'auto' to actual theme)
     */
    public getEffectiveTheme(): 'light' | 'dark' {
        if (this.currentTheme === 'auto') {
            return this.mediaQuery.matches ? 'dark' : 'light';
        }
        return this.currentTheme;
    }

    /**
     * Apply the theme to the document
     */
    private applyTheme(mode: ThemeMode): void {
        const htmlElement = document.documentElement;
        const bodyElement = document.body;

        // Remove existing theme attributes
        htmlElement.removeAttribute('data-bs-theme');
        bodyElement.removeAttribute('data-bs-theme');

        // Apply effective theme (resolve auto to actual preference)
        const effectiveTheme = this.getEffectiveTheme();
        htmlElement.setAttribute('data-bs-theme', effectiveTheme);
        bodyElement.setAttribute('data-bs-theme', effectiveTheme);

        console.log(`Theme applied: ${mode} (effective: ${effectiveTheme})`);
    }

    /**
     * Load theme from localStorage
     */
    private loadTheme(): ThemeMode {
        try {
            const saved = localStorage.getItem(ThemeService.STORAGE_KEY);
            if (saved && this.isValidTheme(saved)) {
                return saved as ThemeMode;
            }
        } catch (error) {
            console.warn('Failed to load theme from localStorage:', error);
        }
        return 'auto';
    }

    /**
     * Save theme to localStorage
     */
    private saveTheme(mode: ThemeMode): void {
        try {
            localStorage.setItem(ThemeService.STORAGE_KEY, mode);
        } catch (error) {
            console.warn('Failed to save theme to localStorage:', error);
        }
    }

    /**
     * Check if a string is a valid theme mode
     */
    private isValidTheme(theme: string): boolean {
        return ['light', 'dark', 'auto'].includes(theme);
    }

    /**
     * Add a theme change listener
     */
    public addListener(callback: (theme: ThemeMode) => void): void {
        this.listeners.add(callback);
    }

    /**
     * Remove a theme change listener
     */
    public removeListener(callback: (theme: ThemeMode) => void): void {
        this.listeners.delete(callback);
    }

    /**
     * Notify all listeners of theme change
     */
    private notifyListeners(): void {
        this.listeners.forEach(callback => {
            try {
                callback(this.currentTheme);
            } catch (error) {
                console.error('Error in theme change listener:', error);
            }
        });
    }

    /**
     * Get the current theme icon class
     */
    public getCurrentThemeIcon(): string {
        return ThemeService.THEMES[this.currentTheme].icon;
    }

    /**
     * Get the current theme label
     */
    public getCurrentThemeLabel(): string {
        return ThemeService.THEMES[this.currentTheme].label;
    }

    /**
     * Check if system supports color scheme preference
     */
    public static supportsColorScheme(): boolean {
        return !!(window.matchMedia && window.matchMedia('(prefers-color-scheme)').media !== 'not all');
    }

    /**
     * Apply saved theme immediately on page load (before full initialization)
     * This prevents flash of wrong theme on page reload
     */
    public static applyInitialTheme(): void {
        try {
            const saved = localStorage.getItem(ThemeService.STORAGE_KEY);
            const theme = (saved && ['light', 'dark', 'auto'].includes(saved)) ? saved : 'auto';
            
            const htmlElement = document.documentElement;
            const bodyElement = document.body;
            
            htmlElement.setAttribute('data-bs-theme', theme);
            bodyElement.setAttribute('data-bs-theme', theme);
        } catch (error) {
            // Fallback to auto if localStorage fails
            document.documentElement.setAttribute('data-bs-theme', 'auto');
            document.body.setAttribute('data-bs-theme', 'auto');
        }
    }
}