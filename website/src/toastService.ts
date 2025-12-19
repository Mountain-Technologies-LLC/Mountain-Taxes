/**
 * Mountain Taxes - Toast Service
 * 
 * This service provides toast notifications for user feedback
 */

// Bootstrap Toast interface
interface BootstrapToast {
    show(): void;
    hide(): void;
}

interface BootstrapToastOptions {
    autohide?: boolean;
    delay?: number;
}

interface BootstrapToastStatic {
    new(element: Element, options?: BootstrapToastOptions): BootstrapToast;
    getInstance(element: Element): BootstrapToast | null;
}

declare global {
    interface Window {
        bootstrap?: {
            Toast: BootstrapToastStatic;
        };
    }
}

export interface ToastOptions {
    /** Toast message */
    message: string;
    /** Toast type - affects styling and icon */
    type?: 'info' | 'success' | 'warning' | 'error';
    /** Duration in milliseconds (0 for persistent) */
    duration?: number;
    /** Whether to show close button */
    showCloseButton?: boolean;
    /** Custom icon class */
    iconClass?: string;
}

/**
 * Toast service for showing notifications
 */
export class ToastService {
    private toastContainer: HTMLElement | null = null;
    private toastCounter = 0;

    constructor() {
        this.createToastContainer();
    }

    /**
     * Create the toast container if it doesn't exist
     */
    private createToastContainer(): void {
        // Check if container already exists
        this.toastContainer = document.getElementById('toast-container');
        
        if (!this.toastContainer) {
            this.toastContainer = document.createElement('div');
            this.toastContainer.id = 'toast-container';
            this.toastContainer.className = 'toast-container position-fixed end-0 p-3';
            this.toastContainer.style.top = '70px'; // Position below navbar
            this.toastContainer.style.zIndex = '1055';
            document.body.appendChild(this.toastContainer);
        }
    }

    /**
     * Show a toast notification
     */
    public showToast(options: ToastOptions): string {
        if (!this.toastContainer) {
            this.createToastContainer();
        }

        const toastId = `toast-${++this.toastCounter}`;
        const {
            message,
            type = 'info',
            duration = 5000,
            showCloseButton = true,
            iconClass
        } = options;

        // Determine styling based on type
        const typeConfig = this.getTypeConfig(type, iconClass);
        
        // Create toast element
        const toastElement = document.createElement('div');
        toastElement.id = toastId;
        toastElement.className = `toast align-items-center ${typeConfig.bgClass} border-0`;
        toastElement.setAttribute('role', 'alert');
        toastElement.setAttribute('aria-live', 'assertive');
        toastElement.setAttribute('aria-atomic', 'true');

        toastElement.innerHTML = `
            <div class="d-flex">
                <div class="toast-body d-flex align-items-center ${typeConfig.textClass}">
                    <i class="${typeConfig.iconClass} me-2" aria-hidden="true"></i>
                    ${message}
                </div>
                ${showCloseButton ? `
                    <button type="button" class="btn-close ${typeConfig.closeButtonClass} me-2 m-auto" 
                            data-bs-dismiss="toast" aria-label="Close"></button>
                ` : ''}
            </div>
        `;

        // Add to container
        this.toastContainer!.appendChild(toastElement);

        // Initialize Bootstrap toast
        const bsToast = new window.bootstrap!.Toast(toastElement, {
            autohide: duration > 0,
            delay: duration
        });

        // Show the toast
        bsToast.show();

        // Clean up after toast is hidden
        toastElement.addEventListener('hidden.bs.toast', () => {
            if (toastElement.parentNode) {
                toastElement.parentNode.removeChild(toastElement);
            }
        });

        return toastId;
    }

    /**
     * Get styling configuration for toast type
     */
    private getTypeConfig(type: string, customIconClass?: string) {
        const configs = {
            info: {
                bgClass: 'text-bg-info',
                textClass: 'text-white',
                closeButtonClass: 'btn-close-white',
                iconClass: customIconClass || 'fas fa-info-circle'
            },
            success: {
                bgClass: 'text-bg-success',
                textClass: 'text-white',
                closeButtonClass: 'btn-close-white',
                iconClass: customIconClass || 'fas fa-check-circle'
            },
            warning: {
                bgClass: 'text-bg-warning',
                textClass: 'text-dark',
                closeButtonClass: '',
                iconClass: customIconClass || 'fas fa-exclamation-triangle'
            },
            error: {
                bgClass: 'text-bg-danger',
                textClass: 'text-white',
                closeButtonClass: 'btn-close-white',
                iconClass: customIconClass || 'fas fa-exclamation-circle'
            }
        };

        return configs[type as keyof typeof configs] || configs.info;
    }

    /**
     * Show info toast
     */
    public showInfo(message: string, duration = 5000): string {
        return this.showToast({ message, type: 'info', duration });
    }

    /**
     * Show success toast
     */
    public showSuccess(message: string, duration = 5000): string {
        return this.showToast({ message, type: 'success', duration });
    }

    /**
     * Show warning toast
     */
    public showWarning(message: string, duration = 7000): string {
        return this.showToast({ message, type: 'warning', duration });
    }

    /**
     * Show error toast
     */
    public showError(message: string, duration = 10000): string {
        return this.showToast({ message, type: 'error', duration });
    }

    /**
     * Show location detection toast with custom icon
     */
    public showLocationToast(message: string, type: 'info' | 'success' = 'info', duration = 5000): string {
        const iconClass = type === 'success' ? 'fas fa-check-circle' : 'fas fa-location-arrow';
        return this.showToast({ 
            message, 
            type, 
            duration,
            iconClass
        });
    }

    /**
     * Hide a specific toast
     */
    public hideToast(toastId: string): void {
        const toastElement = document.getElementById(toastId);
        if (toastElement && window.bootstrap) {
            const bsToast = window.bootstrap.Toast.getInstance(toastElement);
            if (bsToast) {
                bsToast.hide();
            }
        }
    }

    /**
     * Hide all toasts
     */
    public hideAllToasts(): void {
        if (this.toastContainer && window.bootstrap) {
            const toasts = this.toastContainer.querySelectorAll('.toast');
            toasts.forEach(toast => {
                const bsToast = window.bootstrap!.Toast.getInstance(toast);
                if (bsToast) {
                    bsToast.hide();
                }
            });
        }
    }
}