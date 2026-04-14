# Location State Management - Single Source of Truth

## Overview
This document explains how location (city selection) is managed across the application using React Context and localStorage persistence.

## Architecture

### 1. **LocationContext** (`src/context/LocationContext.tsx`)
A centralized context that manages the selected city state globally.

**Features:**
- Stores `selectedCity` state
- Provides `setSelectedCity` function to update the city
- Includes `isLoading` flag for initialization
- **localStorage persistence**: Automatically saves/loads selected city from browser storage
- Default city: "Hyderabad"

**Key Functions:**
```typescript
// Get current values
const { selectedCity, setSelectedCity, isLoading } = useLocation();

// Update city (automatically persists to localStorage)
setSelectedCity("Mumbai");
```

### 2. **LocationProvider** 
Wraps the entire application in `src/App.tsx` to make location context available globally.

```tsx
<LocationProvider>
  <BrowserRouter>
    <Routes>
      {/* All routes have access to useLocation hook */}
    </Routes>
  </BrowserRouter>
</LocationProvider>
```

## Components Using Location Context

### **Header.tsx**
- Displays current selected city in navbar dropdown
- Updates city when user selects from dropdown
- Automatically syncs with Hero and other components

```tsx
const { selectedCity, setSelectedCity } = useLocation();

// Handle city change
const handleCityChange = (city: string) => {
  setSelectedCity(city); // Updates globally
};
```

### **Hero.tsx**
- Shows city selector button with current city
- Updates city when user clicks on a city
- Always stays in sync with Header

```tsx
const { selectedCity, setSelectedCity } = useLocation();

// Handle city select in dropdown
const handleCitySelect = (city: string) => {
  setSelectedCity(city); // Updates globally
  setShowCityDropdown(false);
};
```

### **Index.tsx** (Page Component)
- Uses `useLocation` hook
- Maintains `location` state for search operations
- Syncs search location with selected city

```tsx
const { selectedCity, setSelectedCity } = useLocation();

const handleCityChange = (city: string) => {
  setSelectedCity(city);    // Update location context
  setLocation(city);        // Update search location
};
```

## Data Flow

```
User clicks city in Header
        ↓
setSelectedCity(city)
        ↓
LocationContext updates selectedCity
        ↓
localStorage.setItem('selectedCity', city)
        ↓
Hero component re-renders with new selectedCity
All components using useLocation() re-render
```

## localStorage Persistence

### On App Load:
1. LocationProvider initializes with DEFAULT_CITY ("Hyderabad")
2. Checks localStorage for stored city
3. If found, uses stored city instead of default
4. Sets isLoading to true during initialization

### On City Change:
1. setSelectedCity() is called
2. State updates immediately
3. useEffect watches for changes
4. Automatically saves to localStorage

### Recovery:
If localStorage is unavailable (privacy mode, quota exceeded):
- Error is caught and logged
- App continues with current city (no crashes)
- Changes won't persist across sessions

## Key Benefits

✅ **Single Source of Truth**: City state is managed in one place  
✅ **Automatic Sync**: Header and Hero always show same city  
✅ **Persistence**: Selected city survives page refresh  
✅ **Clean Code**: No prop drilling, reusable `useLocation()` hook  
✅ **Error Handling**: Graceful fallback if localStorage fails  
✅ **Type Safe**: Full TypeScript support

## Usage Example

### Adding Location Support to a New Component:

```tsx
import { useLocation } from "@/context/LocationContext";

function MyComponent() {
  const { selectedCity, setSelectedCity, isLoading } = useLocation();

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <p>Current City: {selectedCity}</p>
      <button onClick={() => setSelectedCity("Bangalore")}>
        Change to Bangalore
      </button>
    </div>
  );
}
```

## Testing the Implementation

### Test 1: Navbar-to-Hero Sync
1. Select city in navbar dropdown
2. Verify Hero section city selector updates
3. ✅ Both show same selected city

### Test 2: Hero-to-Navbar Sync
1. Select city in Hero section dropdown
2. Verify navbar location selector updates
3. ✅ Both show same selected city

### Test 3: LocalStorage Persistence
1. Select a city (e.g., Mumbai)
2. Refresh the page (F5)
3. ✅ City should still be Mumbai

### Test 4: Default City (First Time)
1. Clear browser localStorage
2. Fresh page load
3. ✅ Should default to "Hyderabad"

## Files Modified

- `src/context/LocationContext.tsx` - **NEW**: Location context definition
- `src/App.tsx` - Added LocationProvider wrapper
- `src/components/Header.tsx` - Updated to use useLocation hook
- `src/components/Hero.tsx` - Updated to use useLocation hook
- `src/pages/Index.tsx` - Updated to use useLocation hook

## Future Enhancements

- [ ] Add user preferences to persist other settings
- [ ] Sync location with URL query params (?city=Mumbai)
- [ ] Add geolocation auto-detect (user's preferred city)
- [ ] Implement location-based theater recommendations
- [ ] Add location analytics tracking

---

**Created**: April 14, 2026  
**Pattern**: React Context + Custom Hook + localStorage
