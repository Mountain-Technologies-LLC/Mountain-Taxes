/**
 * Mountain Taxes - Location Detection Service
 * 
 * This service detects the user's location to provide intelligent default state selection.
 * If the user is in the US, it selects their state. If outside the US, it selects all states.
 */

import { getAllStateNames } from './stateData';

/**
 * Represents the result of location detection
 */
export interface LocationResult {
    /** Whether location detection was successful */
    success: boolean;
    /** The detected state name (if in US) */
    stateName?: string;
    /** The detected country code */
    countryCode?: string;
    /** Whether the user is in the United States */
    isInUS: boolean;
    /** Error message if detection failed */
    error?: string;
}

/**
 * Configuration for location detection
 */
export interface LocationConfig {
    /** Timeout for geolocation API in milliseconds */
    timeout: number;
    /** Maximum age of cached position in milliseconds */
    maximumAge: number;
    /** Whether to enable high accuracy (may be slower) */
    enableHighAccuracy: boolean;
    /** Fallback to IP-based detection if geolocation fails */
    enableIPFallback: boolean;
}

/**
 * US state boundaries for location detection
 * Simplified bounding boxes for each state
 */
const US_STATE_BOUNDARIES: Record<string, { north: number; south: number; east: number; west: number }> = {
    'Alabama': { north: 35.008, south: 30.144, east: -84.889, west: -88.473 },
    'Alaska': { north: 71.538, south: 51.209, east: -129.979, west: -179.148 },
    'Arizona': { north: 37.004, south: 31.332, east: -109.045, west: -114.818 },
    'Arkansas': { north: 36.500, south: 33.004, east: -89.644, west: -94.617 },
    'California': { north: 42.009, south: 32.534, east: -114.131, west: -124.409 },
    'Colorado': { north: 41.003, south: 36.993, east: -102.042, west: -109.060 },
    'Connecticut': { north: 42.050, south: 40.980, east: -71.787, west: -73.727 },
    'Delaware': { north: 39.839, south: 38.451, east: -75.049, west: -75.789 },
    'Florida': { north: 31.001, south: 24.396, east: -79.974, west: -87.635 },
    'Georgia': { north: 35.000, south: 30.356, east: -80.751, west: -85.605 },
    'Hawaii': { north: 28.402, south: 18.910, east: -154.806, west: -178.334 },
    'Idaho': { north: 49.001, south: 41.988, east: -111.043, west: -117.243 },
    'Illinois': { north: 42.508, south: 36.970, east: -87.494, west: -91.513 },
    'Indiana': { north: 41.761, south: 37.772, east: -84.784, west: -88.097 },
    'Iowa': { north: 43.501, south: 40.375, east: -90.140, west: -96.639 },
    'Kansas': { north: 40.003, south: 36.993, east: -94.588, west: -102.051 },
    'Kentucky': { north: 39.147, south: 36.497, east: -81.965, west: -89.571 },
    'Louisiana': { north: 33.019, south: 28.928, east: -88.817, west: -94.043 },
    'Maine': { north: 47.460, south: 43.063, east: -66.949, west: -71.084 },
    'Maryland': { north: 39.723, south: 37.886, east: -75.049, west: -79.487 },
    'Massachusetts': { north: 42.887, south: 41.187, east: -69.858, west: -73.508 },
    'Michigan': { north: 48.306, south: 41.696, east: -82.413, west: -90.418 },
    'Minnesota': { north: 49.384, south: 43.499, east: -89.491, west: -97.239 },
    'Mississippi': { north: 35.008, south: 30.146, east: -88.097, west: -91.655 },
    'Missouri': { north: 40.613, south: 35.995, east: -89.098, west: -95.774 },
    'Montana': { north: 49.001, south: 44.358, east: -104.039, west: -116.050 },
    'Nebraska': { north: 43.001, south: 39.999, east: -95.308, west: -104.053 },
    'Nevada': { north: 42.002, south: 35.002, east: -114.040, west: -120.006 },
    'New Hampshire': { north: 45.305, south: 42.697, east: -70.610, west: -72.557 },
    'New Jersey': { north: 41.357, south: 38.788, east: -73.894, west: -75.563 },
    'New Mexico': { north: 37.000, south: 31.332, east: -103.002, west: -109.050 },
    'New York': { north: 45.016, south: 40.477, east: -71.777, west: -79.762 },
    'North Carolina': { north: 36.588, south: 33.752, east: -75.400, west: -84.322 },
    'North Dakota': { north: 49.000, south: 45.935, east: -96.554, west: -104.049 },
    'Ohio': { north: 41.977, south: 38.403, east: -80.519, west: -84.820 },
    'Oklahoma': { north: 37.002, south: 33.615, east: -94.431, west: -103.002 },
    'Oregon': { north: 46.292, south: 41.992, east: -116.463, west: -124.703 },
    'Pennsylvania': { north: 42.516, south: 39.720, east: -74.690, west: -80.519 },
    'Rhode Island': { north: 42.019, south: 41.146, east: -71.120, west: -71.862 },
    'South Carolina': { north: 35.215, south: 32.034, east: -78.499, west: -83.353 },
    'South Dakota': { north: 45.945, south: 42.479, east: -96.436, west: -104.058 },
    'Tennessee': { north: 36.678, south: 34.983, east: -81.647, west: -90.310 },
    'Texas': { north: 36.501, south: 25.837, east: -93.508, west: -106.646 },
    'Utah': { north: 42.001, south: 36.998, east: -109.041, west: -114.053 },
    'Vermont': { north: 45.017, south: 42.727, east: -71.465, west: -73.354 },
    'Virginia': { north: 39.466, south: 36.541, east: -75.166, west: -83.675 },
    'Washington': { north: 49.002, south: 45.544, east: -116.916, west: -124.848 },
    'West Virginia': { north: 40.638, south: 37.202, east: -77.719, west: -82.644 },
    'Wisconsin': { north: 47.080, south: 42.492, east: -86.249, west: -92.889 },
    'Wyoming': { north: 45.006, south: 40.994, east: -104.052, west: -111.056 }
};

/**
 * Location detection service
 */
export class LocationService {
    private config: LocationConfig;

    constructor(config?: Partial<LocationConfig>) {
        this.config = {
            timeout: 10000, // 10 seconds
            maximumAge: 300000, // 5 minutes
            enableHighAccuracy: false, // Start with low accuracy for speed
            enableIPFallback: true,
            ...config
        };
    }

    /**
     * Detect user's location and determine appropriate default state selection
     */
    public async detectLocation(): Promise<LocationResult> {
        try {
            // First try geolocation API
            const geoResult = await this.tryGeolocation();
            if (geoResult.success) {
                return geoResult;
            }

            // Fallback to IP-based detection if enabled
            if (this.config.enableIPFallback) {
                const ipResult = await this.tryIPLocation();
                if (ipResult.success) {
                    return ipResult;
                }
                // If IP fallback also fails, return the original geolocation error
                return geoResult;
            }

            // If IP fallback is disabled, return the geolocation result (with error)
            return geoResult;
        } catch (error) {
            return {
                success: false,
                isInUS: false,
                error: `Location detection error: ${(error as Error).message}`
            };
        }
    }

    /**
     * Try to get location using browser geolocation API
     */
    private async tryGeolocation(): Promise<LocationResult> {
        return new Promise((resolve) => {
            if (!navigator.geolocation) {
                resolve({
                    success: false,
                    isInUS: false,
                    error: 'Geolocation not supported by browser'
                });
                return;
            }

            const options = {
                enableHighAccuracy: this.config.enableHighAccuracy,
                timeout: this.config.timeout,
                maximumAge: this.config.maximumAge
            };

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    const result = this.determineStateFromCoordinates(latitude, longitude);
                    resolve(result);
                },
                (error) => {
                    let errorMessage = 'Geolocation failed';
                    switch (error.code) {
                        case error.PERMISSION_DENIED:
                            errorMessage = 'Geolocation permission denied';
                            break;
                        case error.POSITION_UNAVAILABLE:
                            errorMessage = 'Location information unavailable';
                            break;
                        case error.TIMEOUT:
                            errorMessage = 'Geolocation request timed out';
                            break;
                    }
                    resolve({
                        success: false,
                        isInUS: false,
                        error: errorMessage
                    });
                },
                options
            );
        });
    }

    /**
     * Try to get location using IP-based geolocation
     */
    private async tryIPLocation(): Promise<LocationResult> {
        try {
            // Use a free IP geolocation service
            const response = await fetch('https://ipapi.co/json/', {
                method: 'GET',
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`IP location service returned ${response.status}`);
            }

            const data = await response.json();
            
            if (data.error) {
                throw new Error(data.reason || 'IP location service error');
            }

            const countryCode = data.country_code;
            const isInUS = countryCode === 'US';

            if (isInUS && data.latitude && data.longitude) {
                // Try to determine state from coordinates
                const stateResult = this.determineStateFromCoordinates(data.latitude, data.longitude);
                return {
                    ...stateResult,
                    countryCode
                };
            }

            return {
                success: true,
                isInUS,
                countryCode,
                stateName: undefined
            };
        } catch (error) {
            return {
                success: false,
                isInUS: false,
                error: `IP location failed: ${(error as Error).message}`
            };
        }
    }

    /**
     * Determine the US state from latitude/longitude coordinates
     */
    private determineStateFromCoordinates(latitude: number, longitude: number): LocationResult {
        // Check if coordinates are within the continental US bounds
        const isInContinentalUS = 
            latitude >= 24.396 && latitude <= 49.384 && 
            longitude >= -124.848 && longitude <= -66.949;

        // Check Alaska bounds
        const isInAlaska = 
            latitude >= 51.209 && latitude <= 71.538 && 
            longitude >= -179.148 && longitude <= -129.979;

        // Check Hawaii bounds  
        const isInHawaii = 
            latitude >= 18.910 && latitude <= 28.402 && 
            longitude >= -178.334 && longitude <= -154.806;

        if (!isInContinentalUS && !isInAlaska && !isInHawaii) {
            return {
                success: true,
                isInUS: false,
                countryCode: undefined
            };
        }

        // Find the state that contains these coordinates
        for (const [stateName, bounds] of Object.entries(US_STATE_BOUNDARIES)) {
            if (
                latitude >= bounds.south &&
                latitude <= bounds.north &&
                longitude >= bounds.west &&
                longitude <= bounds.east
            ) {
                return {
                    success: true,
                    isInUS: true,
                    stateName,
                    countryCode: 'US'
                };
            }
        }

        // If we're in US bounds but can't determine the specific state
        return {
            success: true,
            isInUS: true,
            countryCode: 'US',
            stateName: undefined
        };
    }

    /**
     * Get recommended state selection based on location result
     */
    public getRecommendedStates(locationResult: LocationResult): string[] {
        if (locationResult.isInUS && locationResult.stateName) {
            // User is in a specific US state - select that state
            const allStates = getAllStateNames();
            if (allStates.includes(locationResult.stateName)) {
                return [locationResult.stateName];
            }
        }

        // User is outside US or state couldn't be determined - select all states
        return getAllStateNames();
    }

    /**
     * Get a user-friendly message explaining the default selection
     */
    public getSelectionMessage(locationResult: LocationResult): string {
        if (locationResult.isInUS && locationResult.stateName) {
            return `Based on your location, we've selected ${locationResult.stateName} for comparison. You can add or remove states using the legend below.`;
        } else if (locationResult.isInUS) {
            return `We detected you're in the United States but couldn't determine your specific state. All states have been selected for comparison.`;
        } else {
            return `We've selected all states for comparison. You can customize your selection using the legend below.`;
        }
    }
}