# Search & Filtering Implementation

## Overview

Implemented a comprehensive search and filtering system for the product catalog with real-time updates, category filtering, and price range controls.

## Features

✅ **Search** - Full-text search across product names and descriptions
✅ **Category Filter** - Filter products by category (dynamic based on data)
✅ **Price Range Filter** - Min/max price range sliders
✅ **Real-time Updates** - Results update instantly as filters change
✅ **Reset Filters** - One-click button to clear all filters
✅ **Result Count** - Shows number of matching products
✅ **Empty State** - User-friendly message when no products match
✅ **Responsive Design** - Works on mobile, tablet, and desktop

## Component Architecture

### CatalogFilters (`src/components/CatalogFilters.tsx`)

**Purpose**: Handles all filter UI and logic

**State Management**:

```typescript
- searchQuery: string            // Search input text
- selectedCategory: string       // Currently selected category
- priceRange: [number, number]  // Min/max price values
```

**Key Features**:

- Dynamic category list (extracted from products)
- Auto-calculated price min/max from product data
- Real-time filtering with `useMemo` for performance
- Three filter types: search, category, price

**Functions**:

- `handleCategoryChange()` - Update selected category
- `handlePriceChange()` - Update price range (min or max)
- `resetFilters()` - Clear all filters to defaults

**Performance Optimization** (Vercel React Best Practices):

- Uses `useMemo` to memoize filter calculations
- Avoids unnecessary re-renders with dependency arrays
- Categories and price stats are memoized

### CatalogResults (`src/components/CatalogResults.tsx`)

**Purpose**: Display filtered products in grid layout

**Props**:

```typescript
interface CatalogResultsProps {
  products: Product[]; // Filtered products to display
  isLoading?: boolean; // Show loading skeleton
}
```

**Features**:

- Product grid with image, name, category, price
- Hover effect with image zoom
- "No results" message when filter returns empty
- Product count display
- Loading skeleton state
- Links to product detail pages

**Styling**:

- Responsive grid (1 col mobile → 4 cols desktop)
- Rounded corners on images
- Hover animations on product cards
- Smooth image transitions

### CatalogWrapper (`src/components/CatalogWrapper.tsx`)

**Purpose**: Orchestrates filters + results with state management

**State**:

```typescript
filteredProducts: Product[]  // Controlled by CatalogFilters
```

**Layout**:

- Sidebar filters (left, sticky on desktop)
- Product grid (right, takes up remaining space)
- 4-column layout on large screens, 1 column on mobile

**Data Flow**:

```
User input (search/category/price)
    ↓
CatalogFilters processes filters
    ↓
Calls onFilter() callback
    ↓
CatalogWrapper updates state
    ↓
CatalogResults re-renders with new products
```

### Updated Catalog Page (`src/app/catalog/page.tsx`)

**Changes**:

- Removed static filter buttons
- Removed product grid rendering (now in components)
- Added `<CatalogWrapper>` with all products
- Kept server-side data fetching with `getProducts()`

**Data Flow**:

```
Server Component (Page)
    ↓ fetches products with getProducts()
    ↓
Client Component (CatalogWrapper)
    ├─ CatalogFilters (manage state)
    └─ CatalogResults (display results)
```

## How It Works

### Search Filter

```typescript
// Searches product name and description (case-insensitive)
const matchesSearch =
  searchQuery === "" ||
  product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
  product.description.toLowerCase().includes(searchQuery.toLowerCase());
```

### Category Filter

```typescript
// Returns all products if "all" selected, or specific category
const matchesCategory =
  selectedCategory === "all" || product.category === selectedCategory;
```

### Price Range Filter

```typescript
// Checks if product price is within range
const matchesPrice =
  product.price >= priceRange[0] && product.price <= priceRange[1];
```

### Combined Filtering

All three filters work together with AND logic:

```typescript
return matchesSearch && matchesCategory && matchesPrice;
```

## UI Components

### Search Bar

- Placeholder text: "Search products..."
- Updates state on each keystroke
- Focus ring for accessibility
- Full width input

### Category Buttons

- "All Categories" button (always available)
- Dynamic category list from products
- Selected category: black background, white text, bold
- Unselected: border, hover effect

### Price Range Sliders

- Two range inputs (min and max)
- Display current min/max values above sliders
- Min slider can't exceed max and vice versa
- Gray styling to match design

### Reset Button

- Clears all filters
- Returns to initial state with all products
- Resets search to empty, category to "all", price to min/max

## Performance Considerations

**Vercel React Best Practices Applied**:

1. **Memoization** - Filter calculations cached with `useMemo`
2. **Dependency Arrays** - Precise dependencies to avoid recalculation
3. **Server-Side Data Fetching** - Products loaded once on server
4. **Client-Side Filtering** - No API calls for filter updates
5. **No Waterfalls** - All products fetched once, then filtered client-side

**Scale Considerations**:

- Current implementation: Filter ~12 products client-side ✅
- For 1000+ products: Consider server-side filtering or pagination
- For real-time search: Consider debouncing search input
- For large datasets: Consider virtualization for product grid

## File Structure

```
frontend/web/src/
├── components/
│   ├── CatalogFilters.tsx      (NEW)
│   ├── CatalogResults.tsx      (NEW)
│   └── CatalogWrapper.tsx      (NEW)
├── app/
│   └── catalog/
│       └── page.tsx            (UPDATED)
└── lib/
    └── api.ts                  (unchanged)
```

## CSS Classes Used

**Tailwind CSS Classes**:

- Grid layouts: `grid`, `grid-cols-*`, `gap-*`
- Spacing: `px-*`, `py-*`, `mb-*`, `mt-*`
- Borders: `border`, `border-gray-*`, `rounded-*`
- Text: `text-*`, `font-*`, `text-gray-*`
- Interactive: `hover:*`, `focus:*`, `transition`
- Layout: `flex`, `sticky`, `relative`, `absolute`
- Responsive: `sm:`, `lg:`, `xl:` prefixes

## Testing Checklist

- [ ] Search returns correct products by name
- [ ] Search returns correct products by description
- [ ] Category filter shows/hides products correctly
- [ ] Price range filters work (min and max)
- [ ] Filters work together (all three at once)
- [ ] Reset button clears all filters
- [ ] "No results" message shows when appropriate
- [ ] Product count updates correctly
- [ ] Layout works on mobile (single column)
- [ ] Layout works on tablet (2 columns)
- [ ] Layout works on desktop (4 columns with sidebar)
- [ ] Sidebar stays sticky while scrolling
- [ ] Images load correctly in results
- [ ] Links to product details work
- [ ] Hover effects animate smoothly

## Example Usage Scenarios

**Scenario 1: Find Cheap T-shirts**

1. User types "t-shirt" in search
2. User sets price max to $30
3. Results show only T-shirts under $30

**Scenario 2: Browse Shoes**

1. User clicks "Shoes" category
2. Results show all shoes
3. User adjusts price range to find shoes in budget
4. User can search within shoes category

**Scenario 3: Reset and Browse**

1. User applies multiple filters
2. User clicks "Reset Filters"
3. All filters cleared, full product list shown

## Browser Compatibility

- ✅ Modern browsers (Chrome, Firefox, Safari, Edge)
- ✅ Range input sliders (HTML5)
- ✅ CSS Grid layout
- ✅ JavaScript ES6+ features (useMemo, Array methods)

## Future Enhancements

- [ ] Debounce search for large datasets
- [ ] Save filter preferences to localStorage
- [ ] Multi-select categories (OR logic)
- [ ] Sort by price, newest, popularity
- [ ] Filter by size, color (variant-based)
- [ ] Applied filters display as chips/tags
- [ ] URL query parameters for sharable searches
- [ ] Filter presets (e.g., "Under $50", "On Sale")
- [ ] Mobile-friendly filter modal/drawer
- [ ] Search autocomplete suggestions
- [ ] Search analytics (popular searches)

## Files Modified

**New Files** (3):

- `frontend/web/src/components/CatalogFilters.tsx`
- `frontend/web/src/components/CatalogResults.tsx`
- `frontend/web/src/components/CatalogWrapper.tsx`

**Updated Files** (1):

- `frontend/web/src/app/catalog/page.tsx` - Refactored to use new components

**Unchanged Files**:

- API client remains the same
- Database remains the same
- No backend changes needed
- No environment variable changes needed

## Code Quality

- ✅ TypeScript for type safety
- ✅ React best practices (memoization, dependency arrays)
- ✅ Tailwind CSS for styling
- ✅ Accessible form inputs
- ✅ Responsive design
- ✅ Comments for clarity
- ✅ Follows Vercel React guidelines
