/**
 * Mountain Taxes - Location Service Tests
 * 
 * Tests for location detection and default state selection functionality
 */

import { LocationService, LocationResult } from '../src/locationService';
import { getAllStateNames } from '../src/stateData';

// Mock the stateData module
jest.mock('../src/stateData', () => ({
    getAllStateNames: jest.fn().mockReturnValue([
        'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 
        'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 
        'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 
        'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 
        'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 
        'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 
        'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
    ])
}));

describe('LocationService', () => {
    let locationService: LocationService;

    beforeEach(() => {
        locationService = new LocationService();
        
        // Clear all mocks
        jest.clearAllMocks();
    });

    describe('Constructor', () => {
        test('should create instance with default config', () => {
            expect(locationService).toBeInstanceOf(LocationService);
        });

        test('should create instance with custom config', () => {
            const customService = new LocationService({
                timeout: 5000,
                enableHighAccuracy: true
            });
            expect(customService).toBeInstanceOf(LocationService);
        });
    });

    describe('getRecommendedStates', () => {
        test('should return single state when user is in specific US state', () => {
            const locationResult: LocationResult = {
                success: true,
                isInUS: true,
                stateName: 'California',
                countryCode: 'US'
            };

            const recommended = locationService.getRecommendedStates(locationResult);
            
            expect(recommended).toEqual(['California']);
            expect(recommended.length).toBe(1);
        });

        test('should return all states when user is outside US', () => {
            const locationResult: LocationResult = {
                success: true,
                isInUS: false,
                countryCode: 'CA'
            };

            const recommended = locationService.getRecommendedStates(locationResult);
            const allStates = getAllStateNames();
            
            expect(recommended).toEqual(allStates);
            expect(recommended.length).toBe(50);
        });

        test('should return all states when user is in US but state unknown', () => {
            const locationResult: LocationResult = {
                success: true,
                isInUS: true,
                countryCode: 'US'
            };

            const recommended = locationService.getRecommendedStates(locationResult);
            const allStates = getAllStateNames();
            
            expect(recommended).toEqual(allStates);
        });

        test('should return all states when location detection fails', () => {
            const locationResult: LocationResult = {
                success: false,
                isInUS: false,
                error: 'Detection failed'
            };

            const recommended = locationService.getRecommendedStates(locationResult);
            const allStates = getAllStateNames();
            
            expect(recommended).toEqual(allStates);
        });

        test('should handle invalid state name gracefully', () => {
            const locationResult: LocationResult = {
                success: true,
                isInUS: true,
                stateName: 'InvalidState',
                countryCode: 'US'
            };

            const recommended = locationService.getRecommendedStates(locationResult);
            const allStates = getAllStateNames();
            
            // Should fall back to all states if state name is invalid
            expect(recommended).toEqual(allStates);
        });
    });

    describe('getSelectionMessage', () => {
        test('should return state-specific message when in US state', () => {
            const locationResult: LocationResult = {
                success: true,
                isInUS: true,
                stateName: 'Texas',
                countryCode: 'US'
            };

            const message = locationService.getSelectionMessage(locationResult);
            
            expect(message).toContain('Texas');
            expect(message).toContain('Based on your location');
        });

        test('should return US message when in US but state unknown', () => {
            const locationResult: LocationResult = {
                success: true,
                isInUS: true,
                countryCode: 'US'
            };

            const message = locationService.getSelectionMessage(locationResult);
            
            expect(message).toContain('United States');
            expect(message).toContain("couldn't determine your specific state");
        });

        test('should return all states message when outside US', () => {
            const locationResult: LocationResult = {
                success: true,
                isInUS: false,
                countryCode: 'UK'
            };

            const message = locationService.getSelectionMessage(locationResult);
            
            expect(message).toContain('all states');
        });

        test('should return all states message when detection fails', () => {
            const locationResult: LocationResult = {
                success: false,
                isInUS: false,
                error: 'Failed'
            };

            const message = locationService.getSelectionMessage(locationResult);
            
            expect(message).toContain('all states');
        });
    });

    describe('detectLocation', () => {
        beforeEach(() => {
            // Mock navigator.geolocation
            delete (global.navigator as any).geolocation;
        });

        test('should handle missing geolocation API', async () => {
            const result = await locationService.detectLocation();
            
            expect(result.success).toBe(false);
            expect(result.isInUS).toBe(false);
        });

        test('should handle geolocation permission denied', async () => {
            const mockGeolocation = {
                getCurrentPosition: jest.fn((_success, error) => {
                    error({
                        code: 1, // PERMISSION_DENIED
                        message: 'Permission denied',
                        PERMISSION_DENIED: 1,
                        POSITION_UNAVAILABLE: 2,
                        TIMEOUT: 3
                    });
                })
            };
            
            (global.navigator as any).geolocation = mockGeolocation;

            const result = await locationService.detectLocation();
            
            expect(result.success).toBe(false);
            expect(result.isInUS).toBe(false);
            expect(result.error).toContain('Geolocation permission denied');
        });

        test('should handle geolocation timeout', async () => {
            const mockGeolocation = {
                getCurrentPosition: jest.fn((_success, error) => {
                    error({
                        code: 3, // TIMEOUT
                        message: 'Timeout',
                        PERMISSION_DENIED: 1,
                        POSITION_UNAVAILABLE: 2,
                        TIMEOUT: 3
                    });
                })
            };
            
            (global.navigator as any).geolocation = mockGeolocation;

            const result = await locationService.detectLocation();
            
            expect(result.success).toBe(false);
            expect(result.error).toContain('Geolocation request timed out');
        });

        test('should detect California from coordinates', async () => {
            const mockGeolocation = {
                getCurrentPosition: jest.fn((success) => {
                    success({
                        coords: {
                            latitude: 37.7749,  // San Francisco
                            longitude: -122.4194
                        }
                    });
                })
            };
            
            (global.navigator as any).geolocation = mockGeolocation;

            const result = await locationService.detectLocation();
            
            expect(result.success).toBe(true);
            expect(result.isInUS).toBe(true);
            expect(result.stateName).toBe('California');
            expect(result.countryCode).toBe('US');
        });

        test('should detect New York from coordinates', async () => {
            const mockGeolocation = {
                getCurrentPosition: jest.fn((success) => {
                    success({
                        coords: {
                            latitude: 42.3601,  // Albany, NY (more central in NY state)
                            longitude: -73.9712
                        }
                    });
                })
            };
            
            (global.navigator as any).geolocation = mockGeolocation;

            const result = await locationService.detectLocation();
            
            expect(result.success).toBe(true);
            expect(result.isInUS).toBe(true);
            expect(result.stateName).toBe('New York');
        });

        test('should detect Texas from coordinates', async () => {
            const mockGeolocation = {
                getCurrentPosition: jest.fn((success) => {
                    success({
                        coords: {
                            latitude: 30.2672,  // Austin
                            longitude: -97.7431
                        }
                    });
                })
            };
            
            (global.navigator as any).geolocation = mockGeolocation;

            const result = await locationService.detectLocation();
            
            expect(result.success).toBe(true);
            expect(result.isInUS).toBe(true);
            expect(result.stateName).toBe('Texas');
        });

        test('should detect Alaska from coordinates', async () => {
            const mockGeolocation = {
                getCurrentPosition: jest.fn((success) => {
                    success({
                        coords: {
                            latitude: 61.2181,  // Anchorage
                            longitude: -149.9003
                        }
                    });
                })
            };
            
            (global.navigator as any).geolocation = mockGeolocation;

            const result = await locationService.detectLocation();
            
            expect(result.success).toBe(true);
            expect(result.isInUS).toBe(true);
            expect(result.stateName).toBe('Alaska');
        });

        test('should detect Hawaii from coordinates', async () => {
            const mockGeolocation = {
                getCurrentPosition: jest.fn((success) => {
                    success({
                        coords: {
                            latitude: 21.3099,  // Honolulu
                            longitude: -157.8581
                        }
                    });
                })
            };
            
            (global.navigator as any).geolocation = mockGeolocation;

            const result = await locationService.detectLocation();
            
            expect(result.success).toBe(true);
            expect(result.isInUS).toBe(true);
            expect(result.stateName).toBe('Hawaii');
        });

        test('should detect non-US location from coordinates', async () => {
            const mockGeolocation = {
                getCurrentPosition: jest.fn((success) => {
                    success({
                        coords: {
                            latitude: 51.5074,  // London
                            longitude: -0.1278
                        }
                    });
                })
            };
            
            (global.navigator as any).geolocation = mockGeolocation;

            const result = await locationService.detectLocation();
            
            expect(result.success).toBe(true);
            expect(result.isInUS).toBe(false);
            expect(result.stateName).toBeUndefined();
        });
    });

    describe('IP-based fallback', () => {
        beforeEach(() => {
            // Mock fetch for IP geolocation
            global.fetch = jest.fn();
        });

        afterEach(() => {
            jest.restoreAllMocks();
        });

        test('should use IP fallback when geolocation fails', async () => {
            // Mock geolocation to fail
            (global.navigator as any).geolocation = {
                getCurrentPosition: jest.fn((_success, error) => {
                    error({
                        code: 1,
                        message: 'Permission denied',
                        PERMISSION_DENIED: 1,
                        POSITION_UNAVAILABLE: 2,
                        TIMEOUT: 3
                    });
                })
            };

            // Mock successful IP geolocation
            (global.fetch as jest.Mock).mockResolvedValue({
                ok: true,
                json: async () => ({
                    country_code: 'US',
                    latitude: 37.7749,
                    longitude: -122.4194
                })
            });

            const result = await locationService.detectLocation();
            
            expect(result.success).toBe(true);
            expect(result.isInUS).toBe(true);
            expect(result.stateName).toBe('California');
        });

        test('should handle IP service errors gracefully', async () => {
            (global.navigator as any).geolocation = {
                getCurrentPosition: jest.fn((_success, error) => {
                    error({
                        code: 1,
                        message: 'Permission denied',
                        PERMISSION_DENIED: 1,
                        POSITION_UNAVAILABLE: 2,
                        TIMEOUT: 3
                    });
                })
            };

            (global.fetch as jest.Mock).mockResolvedValue({
                ok: false,
                status: 429
            });

            const result = await locationService.detectLocation();
            
            expect(result.success).toBe(false);
            expect(result.isInUS).toBe(false);
        });

        test('should detect non-US country from IP', async () => {
            (global.navigator as any).geolocation = {
                getCurrentPosition: jest.fn((_success, error) => {
                    error({
                        code: 1,
                        message: 'Permission denied',
                        PERMISSION_DENIED: 1,
                        POSITION_UNAVAILABLE: 2,
                        TIMEOUT: 3
                    });
                })
            };

            (global.fetch as jest.Mock).mockResolvedValue({
                ok: true,
                json: async () => ({
                    country_code: 'GB',
                    latitude: 51.5074,
                    longitude: -0.1278
                })
            });

            const result = await locationService.detectLocation();
            
            expect(result.success).toBe(true);
            expect(result.isInUS).toBe(false);
            expect(result.countryCode).toBe('GB');
        });
    });

    describe('Edge cases', () => {
        test('should handle coordinates on state boundaries', async () => {
            const mockGeolocation = {
                getCurrentPosition: jest.fn((success) => {
                    success({
                        coords: {
                            latitude: 39.0, // Near Colorado-Kansas border
                            longitude: -102.05
                        }
                    });
                })
            };
            
            (global.navigator as any).geolocation = mockGeolocation;

            const result = await locationService.detectLocation();
            
            expect(result.success).toBe(true);
            expect(result.isInUS).toBe(true);
            // Should match one of the border states
            expect(['Colorado', 'Kansas']).toContain(result.stateName);
        });

        test('should handle coordinates in US territory but outside state bounds', async () => {
            const mockGeolocation = {
                getCurrentPosition: jest.fn((success) => {
                    success({
                        coords: {
                            latitude: 45.0,
                            longitude: -100.0
                        }
                    });
                })
            };
            
            (global.navigator as any).geolocation = mockGeolocation;

            const result = await locationService.detectLocation();
            
            expect(result.success).toBe(true);
            expect(result.isInUS).toBe(true);
        });
    });
});
