# Search & Filtering - User Flow Diagrams

## Feature Overview

```
SEARCH & FILTERING SYSTEM
│
├─ SEARCH (Text Input)
│  └─ Matches: product.name, product.description (case-insensitive)
│
├─ CATEGORY FILTER (Dropdown/Buttons)
│  ├─ All Categories
│  ├─ Shoes
│  ├─ T-Shirts
│  └─ Accessories
│
├─ PRICE RANGE (Dual Sliders)
│  ├─ Min: $0 → $100+
│  └─ Max: $0 → $100+
│
└─ RESULTS
   ├─ Product count
   ├─ Product grid (1-4 columns)
   └─ Empty state message
```

---

## User Journey: Find Affordable T-Shirts

```
START: Browse Catalog
   │
   ├─ See: Search bar + Category buttons + Price sliders
   │
   ├─ ACTION 1: Type "t-shirt" in search
   │  └─ RESULT: All products matching "t-shirt" shown
   │
   ├─ ACTION 2: Select "T-Shirts" category
   │  └─ RESULT: Filtered to t-shirt category (search + category)
   │
   ├─ ACTION 3: Adjust price max slider to $30
   │  └─ RESULT: Only t-shirts under $30 shown (all filters applied)
   │
   ├─ DISPLAY:
   │  • "Showing 3 products"
   │  • Product card 1: T-Shirt Red, $25
   │  • Product card 2: T-Shirt Blue, $28
   │  • Product card 3: T-Shirt White, $22
   │
   ├─ ACTION 4: Click product card
   │  └─ NAVIGATE: To /catalog/{productId} (product detail page)
   │
   └─ END: Viewing product details

ALTERNATIVE: Reset & Browse
   │
   ├─ ACTION: Click "Reset Filters" button
   │  └─ RESULT: All filters cleared, all products shown
   │
   └─ START OVER: Browse full catalog
```

---

## Component Interaction Flow

```
                    CatalogPage (Server Component)
                         │
                         ├─ Fetches all products
                         │ (getProducts() API call)
                         │
                         ▼
                 CatalogWrapper (Client)
                    State: filteredProducts
                         │
          ┌──────────────┴──────────────┐
          │                             │
          ▼                             ▼
    CatalogFilters             CatalogResults
    (Render Filters)            (Display Products)
          │                             ▲
          │                             │
          │ User interacts              │
          │ (types/clicks/slides)       │
          │                             │
          ├─ searchQuery changed        │
          ├─ selectedCategory changed   │
          └─ priceRange changed         │
                │                       │
                ▼                       │
          Filters applied               │
          (useMemo)                      │
                │                       │
                ├─ matchesSearch?       │
                ├─ matchesCategory?     │
                ├─ matchesPrice?        │
                │                       │
                └─ Call onFilter()      │
                   (setFilteredProducts)│
                   │                    │
                   └────────────────────┘
                         (Re-render)
```

---

## State Management

```
CatalogWrapper
├─ filteredProducts: Product[]
│  └─ Updated by CatalogFilters on filter change
│  └─ Displayed by CatalogResults
│
CatalogFilters (Local State)
├─ searchQuery: string
│  ├─ Updated by: <input onChange>
│  └─ Used in: Filter logic
│
├─ selectedCategory: string
│  ├─ Updated by: onClick handlers
│  └─ Used in: Filter logic
│
└─ priceRange: [number, number]
   ├─ Updated by: <input range onChange>
   └─ Used in: Filter logic
```

---

## Filter Logic Flowchart

```
                START: New filter input
                       │
                       ▼
        ┌──────────────────────────────┐
        │ Combine all filter criteria  │
        └───────────┬──────────────────┘
                    │
        ┌───────────┴───────────┐
        │                       │
        ▼                       ▼
   Search Match?         Category Match?
   (name or desc)        (selected cat)
   │          │          │            │
   Y          N          Y            N
   │                     │
   ├─────────┬───────────┤
   │         │           │
   ▼         ▼           ▼
Result    Filter    Continue
Not In    Out       Check

                    ▼
            Price Range Match?
            │              │
            Y              N
            │              │
            ▼              ▼
         INCLUDE         EXCLUDE
        in results     from results
            │              │
            └──────┬───────┘
                   │
                   ▼
        Updated filtered array
        │
        └─ setFilteredProducts()
           └─ CatalogResults re-renders
```

---

## Responsive Layout

```
MOBILE (< 768px)
┌─────────────────┐
│    Header       │
├─────────────────┤
│   Filters       │
│   (Full width)  │
├─────────────────┤
│   Product 1     │
│   Product 2     │
│   Product 3     │
│   Product 4     │
└─────────────────┘

TABLET (768px - 1024px)
┌──────────────────────┐
│      Header          │
├──────────────────────┤
│ Filter │ Product 1   │
│        │ Product 2   │
│        │ Product 3   │
│        │ Product 4   │
└──────────────────────┘

DESKTOP (> 1024px)
┌──────────────────────────────────┐
│           Header                 │
├──────────────────────────────────┤
│ Filters  │ Product 1 │ Product 2 │
│ (sticky) │ Product 3 │ Product 4 │
│          │ Product 5 │ Product 6 │
│          │ Product 7 │ Product 8 │
└──────────────────────────────────┘
```

---

## Data Flow: Search Behavior

```
User types "shirt"
    │
    ▼
handleChange event fires
    │
    ▼
setSearchQuery("shirt")
    │
    ▼
CatalogFilters component re-renders
    │
    ▼
useMemo hook triggers (searchQuery in deps)
    │
    ▼
Filter function runs:
├─ Check each product
├─ product.name.includes("shirt") ?
├─ product.description.includes("shirt") ?
└─ Also check category & price filters
    │
    ▼
Filtered array created
    │
    ▼
onFilter(filtered) called
    │
    ▼
CatalogWrapper's setFilteredProducts() runs
    │
    ▼
State updated
    │
    ▼
CatalogResults re-renders with new products
    │
    ▼
User sees updated results instantly
```

---

## Data Flow: Price Range Filter

```
User moves max price slider to $30
    │
    ▼
onChange event fires on <input range>
    │
    ▼
handlePriceChange("max", 30)
    │
    ├─ Validates: 30 >= minPrice
    ├─ setPriceRange([minPrice, 30])
    │
    ▼
Component re-renders
    │
    ▼
useMemo triggers (priceRange in deps)
    │
    ▼
Filter function checks:
├─ product.price >= priceRange[0] ?
└─ product.price <= priceRange[1] ?
    │
    ▼
Only products with price 0-30 returned
    │
    ▼
Results update instantly
```

---

## Category Filter Logic

```
DEFAULT STATE: selectedCategory = "all"

USER CLICKS CATEGORY:
├─ Shoes       → selectedCategory = "Shoes"
├─ T-Shirts    → selectedCategory = "T-Shirts"
├─ Accessories → selectedCategory = "Accessories"
└─ All         → selectedCategory = "all"

IN FILTER LOGIC:
├─ If "all"    → matchesCategory = true (all pass)
└─ If specific → matchesCategory = (product.category === selected)

VISUAL STATE:
├─ All button       → Black bg + white text
└─ Other buttons    → Border + gray text
```

---

## Performance Optimization

```
RENDER CYCLE OPTIMIZATION:

1. CatalogFilters renders
   └─ User types/clicks/slides
      └─ State updates (searchQuery/category/price)

2. useMemo hook checks dependencies
   ├─ Dependencies: [searchQuery, selectedCategory, priceRange, products, onFilter]
   ├─ If changed → Run filter logic
   └─ If same → Reuse cached result

3. onFilter() callback called
   └─ CatalogWrapper's setFilteredProducts()

4. CatalogResults receives new products prop
   └─ Re-renders with new grid

5. User sees updated results
```

**Key Optimization**:

- Filter logic runs only when dependencies change
- Previous results cached if nothing changed
- No unnecessary re-renders of CatalogResults

---

## Error Scenarios

```
NO RESULTS FOUND:
├─ User searches "xyz"
├─ No product matches
├─ CatalogResults renders:
│  └─ "No products found."
│  └─ "Try adjusting your filters or search query."
└─ User sees empty state message

PRICE SLIDERS VALIDATION:
├─ Min cannot exceed Max
├─ Max cannot go below Min
├─ Code: Math.min/Math.max enforce limits
└─ User sees valid slider behavior

ALL FILTERS APPLIED:
├─ Search: "shirt"
├─ Category: "T-Shirts"
├─ Price: $20-$40
├─ Results: Only T-Shirts named "shirt" in $20-$40 range
└─ Products matching ALL criteria shown
```

---

## Features Checklist

```
✅ Search products by name/description
✅ Filter by category (dynamic from data)
✅ Filter by price range (min/max sliders)
✅ Real-time filtering (instant updates)
✅ Multiple filters together (AND logic)
✅ Reset filters button (one-click clear)
✅ Product count display
✅ Empty state messaging
✅ Responsive design (mobile/tablet/desktop)
✅ Sticky sidebar (desktop)
✅ Loading skeleton (if needed)
✅ Accessibility (form labels, inputs)
✅ Smooth animations
✅ Follows Vercel React best practices
```
