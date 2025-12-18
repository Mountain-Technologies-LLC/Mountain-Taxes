# Location Detection Feature

## Overview

The Mountain Taxes application includes intelligent location detection to provide users with smart default state selection based on their geographic location.

## How It Works

### Detection Methods

1. **Browser Geolocation API** (Primary)
   - Uses GPS, WiFi, and cellular data for precise location
   - Requires user permission
   - Most accurate method

2. **IP-based Geolocation** (Fallback)
   - Uses IP address to estimate location
   - No user permission required
   - Less accurate but works when geolocation is denied

### Selection Logic

- **US Users**: If detected within a specific US state, that state is pre-selected
- **Non-US Users**: All states are selected for comprehensive comparison
- **Detection Failure**: Falls back to selecting all states

## User Experience

### Status Messages
- Users see friendly notifications about location detection
- Messages automatically disappear after 5 seconds
- Clear explanation of why certain states were selected

### Privacy & Control
- Location detection requires user permission (for geolocation)
- No location data is stored or transmitted
- Users can always manually customize state selection
- Full functionality available even if location is denied

## Technical Implementation

### State Boundary Detection
- Uses precise coordinate mapping for all 50 US states
- Includes Alaska and Hawaii with accurate boundaries
- Handles edge cases like state borders and territories

### Error Handling
- Comprehensive error handling for all failure scenarios
- Graceful degradation when services are unavailable
- User-friendly error messages

### Performance
- Fast detection with configurable timeouts (10 seconds default)
- Efficient coordinate calculations
- Minimal impact on application startup

## Configuration

The location service can be configured with:

```typescript
const locationService = new LocationService({
    timeout: 10000,           // Geolocation timeout (ms)
    maximumAge: 300000,       // Cache age (ms)
    enableHighAccuracy: false, // GPS accuracy vs speed
    enableIPFallback: true    // Use IP fallback
});
```

## Privacy Considerations

- **No Tracking**: Location is used only for initial state selection
- **No Storage**: Location data is not saved locally or remotely
- **User Control**: Users can deny location access without losing functionality
- **Transparency**: Clear messaging about what location data is used for

## Browser Compatibility

- **Modern Browsers**: Full geolocation support
- **Older Browsers**: Falls back to IP-based detection
- **No JavaScript**: Application works without location detection
- **HTTPS Required**: Geolocation API requires secure connections

## Testing

The location detection feature includes comprehensive tests:

- Unit tests for all detection methods
- Mock geolocation API testing
- IP service fallback testing
- Error scenario handling
- State boundary accuracy tests
- Integration with main application

## Future Enhancements

Potential improvements for future versions:

- **Saved Preferences**: Remember user's preferred states
- **Multiple Locations**: Support for users with multiple residences
- **Timezone Detection**: Use timezone as additional location hint
- **City-Level Detection**: More granular location awareness