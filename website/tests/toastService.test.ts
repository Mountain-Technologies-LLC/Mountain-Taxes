/**
 * Mountain Taxes - Toast Service Tests
 * 
 * Tests for the toast notification service
 */

import { ToastService, ToastOptions } from '../src/toastService';

// Mock Bootstrap Toast
const mockToastInstance = {
    show: jest.fn(),
    hide: jest.fn()
};

const mockBootstrap = {
    Toast: jest.fn().mockImplementation(() => mockToastInstance)
};

// Mock window.bootstrap
Object.defineProperty(window, 'bootstrap', {
    value: mockBootstrap,
    writable: true
});

// Mock Bootstrap Toast getInstance
(mockBootstrap.Toast as any).getInstance = jest.fn().mockReturnValue(mockToastInstance);

describe('ToastService', () => {
    let toastService: ToastService;
    let mockContainer: HTMLElement;

    beforeEach(() => {
        // Clear DOM
        document.body.innerHTML = '';
        
        // Reset mocks
        jest.clearAllMocks();
        
        // Create toast service
        toastService = new ToastService();
        
        // Get the created container
        mockContainer = document.getElementById('toast-container')!;
    });

    afterEach(() => {
        // Clean up DOM
        document.body.innerHTML = '';
    });

    describe('Container Creation', () => {
        it('should create toast container on initialization', () => {
            expect(mockContainer).toBeTruthy();
            expect(mockContainer.id).toBe('toast-container');
            expect(mockContainer.className).toBe('toast-container position-fixed end-0 p-3');
            expect(mockContainer.style.top).toBe('70px');
            expect(mockContainer.style.zIndex).toBe('1055');
        });

        it('should reuse existing container if present', () => {
            // Create another service instance
            new ToastService();
            
            // Should still be the same container
            const container = document.getElementById('toast-container');
            expect(container).toBe(mockContainer);
            expect(document.querySelectorAll('#toast-container')).toHaveLength(1);
        });
    });

    describe('Basic Toast Functionality', () => {
        it('should show a basic toast with default options', () => {
            const toastId = toastService.showToast({ message: 'Test message' });
            
            expect(toastId).toMatch(/^toast-\d+$/);
            expect(mockContainer.children).toHaveLength(1);
            
            const toastElement = mockContainer.firstElementChild as HTMLElement;
            expect(toastElement.id).toBe(toastId);
            expect(toastElement.className).toContain('toast');
            expect(toastElement.className).toContain('text-bg-info');
            expect(toastElement.innerHTML).toContain('Test message');
            expect(toastElement.innerHTML).toContain('fa-info-circle');
            
            expect(mockBootstrap.Toast).toHaveBeenCalledWith(toastElement, {
                autohide: true,
                delay: 5000
            });
            expect(mockToastInstance.show).toHaveBeenCalled();
        });

        it('should show toast with custom options', () => {
            const options: ToastOptions = {
                message: 'Custom message',
                type: 'success',
                duration: 3000,
                showCloseButton: false,
                iconClass: 'fas fa-custom-icon'
            };
            
            const toastId = toastService.showToast(options);
            
            const toastElement = document.getElementById(toastId)!;
            expect(toastElement.className).toContain('text-bg-success');
            expect(toastElement.innerHTML).toContain('Custom message');
            expect(toastElement.innerHTML).toContain('fa-custom-icon');
            expect(toastElement.innerHTML).not.toContain('btn-close');
            
            expect(mockBootstrap.Toast).toHaveBeenCalledWith(toastElement, {
                autohide: true,
                delay: 3000
            });
        });

        it('should create persistent toast when duration is 0', () => {
            const toastId = toastService.showToast({ 
                message: 'Persistent message',
                duration: 0
            });
            
            const toastElement = document.getElementById(toastId)!;
            expect(mockBootstrap.Toast).toHaveBeenCalledWith(toastElement, {
                autohide: false,
                delay: 0
            });
        });
    });

    describe('Toast Types', () => {
        it('should show info toast with correct styling', () => {
            const toastId = toastService.showInfo('Info message');
            
            const toastElement = document.getElementById(toastId)!;
            expect(toastElement.className).toContain('text-bg-info');
            expect(toastElement.innerHTML).toContain('fa-info-circle');
            expect(toastElement.innerHTML).toContain('text-white');
            expect(toastElement.innerHTML).toContain('btn-close-white');
        });

        it('should show success toast with correct styling', () => {
            const toastId = toastService.showSuccess('Success message');
            
            const toastElement = document.getElementById(toastId)!;
            expect(toastElement.className).toContain('text-bg-success');
            expect(toastElement.innerHTML).toContain('fa-check-circle');
            expect(toastElement.innerHTML).toContain('text-white');
            expect(toastElement.innerHTML).toContain('btn-close-white');
        });

        it('should show warning toast with correct styling', () => {
            const toastId = toastService.showWarning('Warning message');
            
            const toastElement = document.getElementById(toastId)!;
            expect(toastElement.className).toContain('text-bg-warning');
            expect(toastElement.innerHTML).toContain('fa-exclamation-triangle');
            expect(toastElement.innerHTML).toContain('text-dark');
            expect(toastElement.innerHTML).not.toContain('btn-close-white');
        });

        it('should show error toast with correct styling', () => {
            const toastId = toastService.showError('Error message');
            
            const toastElement = document.getElementById(toastId)!;
            expect(toastElement.className).toContain('text-bg-danger');
            expect(toastElement.innerHTML).toContain('fa-exclamation-circle');
            expect(toastElement.innerHTML).toContain('text-white');
            expect(toastElement.innerHTML).toContain('btn-close-white');
        });

        it('should show location toast with custom icon', () => {
            const toastId = toastService.showLocationToast('Location message', 'info');
            
            const toastElement = document.getElementById(toastId)!;
            expect(toastElement.innerHTML).toContain('fa-location-arrow');
            
            const successToastId = toastService.showLocationToast('Success location', 'success');
            const successElement = document.getElementById(successToastId)!;
            expect(successElement.innerHTML).toContain('fa-check-circle');
        });
    });

    describe('Toast Management', () => {
        it('should hide specific toast', () => {
            const toastId = toastService.showInfo('Test message');
            
            toastService.hideToast(toastId);
            
            expect((mockBootstrap.Toast as any).getInstance).toHaveBeenCalledWith(
                document.getElementById(toastId)
            );
            expect(mockToastInstance.hide).toHaveBeenCalled();
        });

        it('should handle hiding non-existent toast gracefully', () => {
            toastService.hideToast('non-existent-toast');
            
            expect((mockBootstrap.Toast as any).getInstance).not.toHaveBeenCalled();
            expect(mockToastInstance.hide).not.toHaveBeenCalled();
        });

        it('should hide all toasts', () => {
            toastService.showInfo('Message 1');
            toastService.showSuccess('Message 2');
            
            toastService.hideAllToasts();
            
            expect((mockBootstrap.Toast as any).getInstance).toHaveBeenCalledTimes(2);
            expect(mockToastInstance.hide).toHaveBeenCalledTimes(2);
        });

        it('should clean up toast element after hidden event', () => {
            const toastId = toastService.showInfo('Test message');
            const toastElement = document.getElementById(toastId)!;
            
            // Simulate the hidden.bs.toast event
            const hiddenEvent = new Event('hidden.bs.toast');
            toastElement.dispatchEvent(hiddenEvent);
            
            // Toast should be removed from DOM
            expect(document.getElementById(toastId)).toBeNull();
            expect(mockContainer.children).toHaveLength(0);
        });
    });

    describe('Accessibility', () => {
        it('should include proper ARIA attributes', () => {
            const toastId = toastService.showInfo('Accessible message');
            const toastElement = document.getElementById(toastId)!;
            
            expect(toastElement.getAttribute('role')).toBe('alert');
            expect(toastElement.getAttribute('aria-live')).toBe('assertive');
            expect(toastElement.getAttribute('aria-atomic')).toBe('true');
        });

        it('should include close button with proper label', () => {
            const toastId = toastService.showInfo('Message with close');
            const toastElement = document.getElementById(toastId)!;
            
            expect(toastElement.innerHTML).toContain('aria-label="Close"');
            expect(toastElement.innerHTML).toContain('data-bs-dismiss="toast"');
        });

        it('should include icons with aria-hidden', () => {
            const toastId = toastService.showInfo('Message with icon');
            const toastElement = document.getElementById(toastId)!;
            
            expect(toastElement.innerHTML).toContain('aria-hidden="true"');
        });
    });

    describe('Multiple Toasts', () => {
        it('should handle multiple toasts with unique IDs', () => {
            const toast1Id = toastService.showInfo('Message 1');
            const toast2Id = toastService.showSuccess('Message 2');
            const toast3Id = toastService.showWarning('Message 3');
            
            expect(toast1Id).not.toBe(toast2Id);
            expect(toast2Id).not.toBe(toast3Id);
            expect(toast1Id).not.toBe(toast3Id);
            
            expect(mockContainer.children).toHaveLength(3);
            expect(document.getElementById(toast1Id)).toBeTruthy();
            expect(document.getElementById(toast2Id)).toBeTruthy();
            expect(document.getElementById(toast3Id)).toBeTruthy();
        });

        it('should increment toast counter correctly', () => {
            const toast1Id = toastService.showInfo('Message 1');
            const toast2Id = toastService.showInfo('Message 2');
            
            expect(toast1Id).toBe('toast-1');
            expect(toast2Id).toBe('toast-2');
        });
    });

    describe('Error Handling', () => {
        it('should handle missing Bootstrap gracefully', () => {
            // Remove Bootstrap mock
            delete (window as any).bootstrap;
            
            expect(() => {
                toastService.showInfo('Test message');
            }).not.toThrow();
        });

        it('should recreate container if missing', () => {
            // Remove container
            mockContainer.remove();
            
            // Create a new toast service instance to trigger container recreation
            const newToastService = new ToastService();
            const toastId = newToastService.showInfo('Test message');
            
            // Should create new container
            const newContainer = document.getElementById('toast-container');
            expect(newContainer).toBeTruthy();
            expect(newContainer).not.toBe(mockContainer);
            expect(document.getElementById(toastId)).toBeTruthy();
        });
    });
});