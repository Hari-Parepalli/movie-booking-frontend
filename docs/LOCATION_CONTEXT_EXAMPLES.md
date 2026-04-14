# Location Context - Implementation Quick Reference

## Setup (Already Done ✅)

### 1. Create Context
```typescript
// src/context/LocationContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface LocationContextType {
  selectedCity: string;
  setSelectedCity: (city: string) => void;
  isLoading: boolean;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

const STORAGE_KEY = 'selectedCity';
const DEFAULT_CITY = 'Hyderabad';

export const LocationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedCity, setSelectedCityState] = useState<string>(DEFAULT_CITY);
  const [isLoading, setIsLoading] = useState(true);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const storedCity = localStorage.getItem(STORAGE_KEY);
      if (storedCity) {
        setSelectedCityState(storedCity);
      }
    } catch (error) {
      console.error('Failed to read city from localStorage:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save to localStorage when city changes
  useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem(STORAGE_KEY, selectedCity);
      } catch (error) {
        console.error('Failed to save city to localStorage:', error);
      }
    }
  }, [selectedCity, isLoading]);

  const setSelectedCity = (city: string) => {
    setSelectedCityState(city);
  };

  return (
    <LocationContext.Provider value={{ selectedCity, setSelectedCity, isLoading }}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};
```

### 2. Wrap App with Provider
```typescript
// src/App.tsx
import { LocationProvider } from "./context/LocationContext";

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <LocationProvider>  {/* Add this */}
          <Toaster />
          <Sonner />
          <BrowserRouter>
            {/* Routes */}
          </BrowserRouter>
        </LocationProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);
```

## Usage in Components

### Example 1: Navbar Location Selector
```typescript
// src/components/Header.tsx
import { useLocation } from "@/context/LocationContext";

const Header = ({ onSearch, onOffersClick, onEventsClick }: HeaderProps) => {
  const { selectedCity, setSelectedCity } = useLocation();
  
  const handleCityChange = (city: string) => {
    setSelectedCity(city);  // Automatically updates everywhere
  };

  return (
    <header>
      {/* City Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger>
          <span>{selectedCity}</span>  {/* Shows current city */}
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {cities.map((city) => (
            <DropdownMenuItem
              key={city}
              onClick={() => handleCityChange(city)}
              className={selectedCity === city ? "bg-red-600" : ""}
            >
              {city}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
};
```

### Example 2: Hero Section Location Selector
```typescript
// src/components/Hero.tsx
import { useLocation } from "@/context/LocationContext";

const Hero = () => {
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const { selectedCity, setSelectedCity } = useLocation();

  const handleCitySelect = (city: string) => {
    setSelectedCity(city);  // Updates globally
    setShowCityDropdown(false);
  };

  return (
    <section>
      {/* City Selector Button */}
      <button onClick={() => setShowCityDropdown(!showCityDropdown)}>
        <span>{selectedCity}</span>
      </button>

      {/* City Dropdown */}
      {showCityDropdown && (
        <div>
          {popularCities.map((city) => (
            <button
              key={city}
              onClick={() => handleCitySelect(city)}
              className={selectedCity === city ? "bg-red-500" : ""}
            >
              {city}
            </button>
          ))}
        </div>
      )}
    </section>
  );
};
```

### Example 3: Using in Page Component
```typescript
// src/pages/Index.tsx
import { useLocation } from "@/context/LocationContext";

const Index = () => {
  const { selectedCity, setSelectedCity } = useLocation();
  const [location, setLocation] = useState("");

  const handleCityChange = (city: string) => {
    setSelectedCity(city);      // Update context
    setLocation(city);          // Update local search
  };

  return (
    <div>
      <Header onSearch={setSearchQuery} />
      <Hero />
      {/* Both Header and Hero will show selectedCity automatically */}
    </div>
  );
};
```

## Adding to a New Component

```typescript
import { useLocation } from "@/context/LocationContext";

function NewComponent() {
  const { selectedCity, setSelectedCity, isLoading } = useLocation();

  if (isLoading) return <div>Loading preferences...</div>;

  return (
    <div>
      <h2>Current City: {selectedCity}</h2>
      <p>All bookings will be for {selectedCity}</p>
      
      <button onClick={() => setSelectedCity("Mumbai")}>
        Switch to Mumbai
      </button>
    </div>
  );
}
```

## Common Patterns

### Pattern 1: Display Current City
```tsx
const { selectedCity } = useLocation();
return <span>Showing movies in {selectedCity}</span>;
```

### Pattern 2: Change City on Event
```tsx
const { setSelectedCity } = useLocation();

const handleCitySelect = (city: string) => {
  setSelectedCity(city);
  // Component using useLocation will automatically update
};
```

### Pattern 3: Conditional Rendering Based on City
```tsx
const { selectedCity } = useLocation();

return (
  <>
    {selectedCity === "Hyderabad" && <HydMSpecialOffers />}
    {selectedCity === "Mumbai" && <MumbaiSpecialOffers />}
  </>
);
```

### Pattern 4: Initialize with City Change
```tsx
const { selectedCity, setSelectedCity } = useLocation();

useEffect(() => {
  // Fetch data when city changes
  fetchMoviesForCity(selectedCity);
}, [selectedCity]);
```

## localStorage Keys

| Key | Value | Example |
|-----|-------|---------|
| `selectedCity` | User's selected city | "Mumbai", "Hyderabad", etc. |

## Troubleshooting

### Issue: "useLocation must be used within a LocationProvider"
**Solution**: Make sure `LocationProvider` wraps your component in App.tsx

### Issue: City doesn't persist after refresh
**Solution**: Check if localStorage is enabled in browser settings

### Issue: Changes not syncing between components
**Solution**: Verify both components are using `useLocation()` hook

## Performance Notes

- **Re-renders**: Only components using `useLocation()` re-render on city change
- **localStorage**: Async writes, won't block UI
- **Initial Load**: `isLoading` flag helps prevent UI flash

---

**Last Updated**: April 14, 2026
