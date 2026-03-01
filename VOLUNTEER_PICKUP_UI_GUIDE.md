# Volunteer Pickup Feature - UI/UX Visual Guide

## Overview of Each Step

---

## STEP 1: BROWSE AVAILABLE FOOD

### Layout Structure
```
┌──────────────────────────────────────────────────┐
│  🔙  Volunteer Pickups                           │
│      Help distribute surplus food to those...    │
└──────────────────────────────────────────────────┘

┌─ PROGRESS INDICATOR ─────────────────────────────┐
│ ① ────── ② ────── ③ ────── ④                    │
│ Browse   Accept  Details  Pickup Code             │
└──────────────────────────────────────────────────┘

┌─ AVAILABLE FOOD PICKUPS ─────────────────────────┐
│                                                   │
│ ┌──────────────────────────────────────────────┐ │
│ │ 🍱  Vegetable Biryani           ✓ Available│ │
│ │     Green Leaf Restaurant                   │ │
│ │                                              │ │
│ │ 👥 Serves 50   🌱 Vegetarian                │ │
│ │ ⏰ 2:00-4:00 PM   📍 123 Main St             │ │
│ │                                              │ │
│ │ "Freshly prepared in containers"            │ │
│ │                                              │ │
│ │         [Cancel]  [Accept Food] ✓           │ │
│ └──────────────────────────────────────────────┘ │
│                                                   │
│ ... more food items ...                           │
│                                                   │
└──────────────────────────────────────────────────┘

┌─ MY PICKUPS (HISTORY) ───────────────────────────┐
│                                                   │
│ Pickup #abc123          Code: AB3X9K             │
│ Status: Assigned                                 │
│                                                   │
└──────────────────────────────────────────────────┘

┌─ HELP SECTION ───────────────────────────────────┐
│ ❓ How It Works                                  │
│ • Browse available food pickups                  │
│ • Accept a pickup                                │
│ • Fill in your contact details                   │
│ • Receive pickup code from NGO                   │
│                                                   │
│ ✓ Pickup Process                                │
│ • Arrive during pickup window                    │
│ • Share your pickup code                         │
│ • Collect the food                               │
│ • Deliver to NGO beneficiaries                   │
│                                                   │
│ 📞 Contact Support                              │
│ support@mealbridge.com                           │
│ 1-800-MEAL-BRIDGE                                │
└──────────────────────────────────────────────────┘
```

---

## STEP 2: CONFIRM PICKUP

### Layout Structure
```
┌──────────────────────────────────────────────────┐
│  Confirm Pickup                                  │
│  Please confirm the details before accepting     │
└──────────────────────────────────────────────────┘

┌─ FOOD DETAILS CARD ──────────────────────────────┐
│                                                   │
│ 🍱  Vegetable Biryani    ✓ Available             │
│     Green Leaf Restaurant                        │
│                                                   │
│ 👥 Serves 50   🌱 Veg   ⏰ 2:00-4:00 PM  📍 123  │
│                                                   │
│ "Freshly prepared in containers"                 │
│                                                   │
└──────────────────────────────────────────────────┘

┌─ PICKUP INFO BOXES ──────────────────────────────┐
│                                                   │
│ 📍 PICKUP LOCATION      │  ⏰ PICKUP WINDOW      │
│ 123 Main Street         │  2:00 PM - 4:00 PM    │
│                                                   │
└──────────────────────────────────────────────────┘

┌─ ALERT BOX (BLUE) ───────────────────────────────┐
│ ⓘ You will need to provide your contact details │
│   in the next step. The NGO will use this to    │
│   assign your pickup code                        │
└──────────────────────────────────────────────────┘

┌─ ACTION BUTTONS ─────────────────────────────────┐
│                                                   │
│         [Cancel]        [Accept & Continue] ✓    │
│                                                   │
└──────────────────────────────────────────────────┘
```

---

## STEP 3: FILL DETAILS

### Layout Structure
```
┌──────────────────────────────────────────────────┐
│  Your Contact Information                        │
│  Please provide your details for the NGO        │
└──────────────────────────────────────────────────┘

┌─ FOOD CONTEXT (GREEN) ───────────────────────────┐
│                                                   │
│ Picking up:                                      │
│ 🍱 Vegetable Biryani                             │
│ From: Green Leaf Restaurant                      │
│ Serves: 50 people                                │
│                                                   │
└──────────────────────────────────────────────────┘

┌─ FORM FIELDS ────────────────────────────────────┐
│                                                   │
│ 👤 Full Name *                                   │
│ ┌────────────────────────────────────────────┐  │
│ │ [Enter your full name]                     │  │
│ └────────────────────────────────────────────┘  │
│ Error message (if any) in red                    │
│                                                   │
│ ☎ Phone Number *                                │
│ ┌────────────────────────────────────────────┐  │
│ │ [9876543210]                               │  │
│ └────────────────────────────────────────────┘  │
│ Error message (if any) in red                    │
│                                                   │
│ 📍 Delivery Address *                            │
│ ┌────────────────────────────────────────────┐  │
│ │ [Enter your delivery address]              │  │
│ └────────────────────────────────────────────┘  │
│ Error message (if any) in red                    │
│                                                   │
└──────────────────────────────────────────────────┘

┌─ INFO ALERT (BLUE) ──────────────────────────────┐
│ ⓘ Your information will be shared with the NGO │
│   to verify your pickup and ensure safe food    │
│   delivery.                                      │
└──────────────────────────────────────────────────┘

┌─ ACTION BUTTONS ─────────────────────────────────┐
│                                                   │
│    [Cancel]      [Submit & Get Pickup Code] ✓   │
│                                                   │
└──────────────────────────────────────────────────┘
```

---

## STEP 4: RECEIVE PICKUP CODE

### Layout Structure
```
┌──────────────────────────────────────────────────┐
│  ✓ Pickup Confirmed!                             │
│  Your pickup request has been accepted.          │
│  The NGO has assigned you a pickup code.         │
└──────────────────────────────────────────────────┘

┌─ PICKUP CODE DISPLAY ────────────────────────────┐
│                                                   │
│             PICKUP CODE                           │
│                                                   │
│        ┌──────────────────┐                       │
│        │   AB3X9K         │                       │
│        └──────────────────┘                       │
│                                                   │
│          [Copy Code]                             │
│                                                   │
└──────────────────────────────────────────────────┘

┌─ PICKUP DETAILS ─────────────────────────────────┐
│                                                   │
│ Food Item                                        │
│ Vegetable Biryani                                │
│ From: Green Leaf Restaurant                      │
│                                                   │
│ ┌────────────────────────────────────────────┐  │
│ │ 📍 PICKUP LOCATION   │  ⏰ PICKUP WINDOW   │  │
│ │ 123 Main Street      │  2:00-4:00 PM      │  │
│ │                      │                     │  │
│ │ 👥 QUANTITY          │  📝 NOTES          │  │
│ │ 50 servings          │  Fresh containers  │  │
│ └────────────────────────────────────────────┘  │
│                                                   │
└──────────────────────────────────────────────────┘

┌─ INSTRUCTIONS CARD ──────────────────────────────┐
│                                                   │
│ What to Do Next                                  │
│                                                   │
│ ① Save or Download your pickup code             │
│ ② Arrive On Time within the pickup window       │
│ ③ Show Your Code to the food donor staff        │
│ ④ Collect & Deliver the food to beneficiaries  │
│                                                   │
└──────────────────────────────────────────────────┘

┌─ ALERT BOX (RED) ────────────────────────────────┐
│ ⚠ Important                                      │
│ • Arrive exactly within the pickup window       │
│ • Keep the food properly stored during delivery │
│ • Contact the NGO immediately if you face      │
│   any issues                                     │
└──────────────────────────────────────────────────┘

┌─ ACTION BUTTONS ─────────────────────────────────┐
│                                                   │
│ [Download Details] [Share] [Done]               │
│                                                   │
└──────────────────────────────────────────────────┘
```

---

## COLOR PALETTE

### Primary Colors
- **Green-600** (#16a34a) - Primary actions, accept buttons
- **Green-500** (#22c55e) - Success indicators, progress
- **Green-50** (#f0fdf4) - Light green backgrounds

### Secondary Colors
- **Blue-50** (#eff6ff) - Information sections
- **Blue-200** (#93c5fd) - Border colors
- **Blue-600** (#2563eb) - Secondary text

### Warning Colors
- **Amber-50** (#fffbeb) - Warning backgrounds
- **Amber-600** (#d97706) - Warning text
- **Amber-900** (#78350f) - Warning bold text

### Error Colors
- **Red-50** (#fef2f2) - Error backgrounds
- **Red-200** (#fecaca) - Error borders
- **Red-600** (#dc2626) - Error text

### Neutral Colors
- **Gray-900** (#111827) - Headlines
- **Gray-600** (#4b5563) - Body text
- **Gray-300** (#d1d5db) - Borders
- **Gray-200** (#e5e7eb) - Dividers

---

## Typography

### Font Sizes
- **Hero (h1)** - 2.25rem (36px) bold - Page title
- **Section (h2)** - 1.875rem (30px) bold - Step headers  
- **Subsection (h3)** - 1.125rem (18px) semibold - Card titles
- **Body** - 0.875-1rem (14-16px) - Regular text
- **Small** - 0.75-0.875rem (12-14px) - Captions, hints
- **Code** - 0.875rem (14px) monospace - Pickup code

### Font Weights
- **Bold** (700) - Headlines
- **Semibold** (600) - Card titles, form labels
- **Medium** (500) - Section headers  
- **Regular** (400) - Body text

---

## Spacing & Layout

### Gaps & Padding
- **Container** - Max width 1280px (markdown)
- **Gap between items** - 16px (md), 6px (sm)
- **Card padding** - 24px
- **Button padding** - 8px horizontal, 2px vertical

### Responsive Breakpoints
- **Mobile** - < 768px (full width)
- **Tablet** - 768px-1024px (50% width each)
- **Desktop** - > 1024px (optimal width)

---

## Interactive Elements

### Buttons
- **Default** - Green background, white text, hover darkens
- **Outline** - Bordered, gray background, hover highlights
- **Disabled** - Faded, no pointer events

### Form Fields
- **Normal** - Gray border, focus blue ring
- **Error** - Red border, error message below
- **Disabled** - Gray background, no interaction

### Cards
- **Hover Effect** - Shadow increases on desktop
- **Border** - 1px subtle gray border
- **Background** - White or light tinted

---

## Accessibility Features

✅ Semantic HTML elements
✅ ARIA labels on alerts (role="alert")
✅ Color + icon/text combinations (not color-only)
✅ Min touch target: 40x40px on mobile
✅ Contrast ratios meet WCAG AA
✅ Keyboard navigation throughout
✅ Clear focus indicators
✅ Form labels associated with inputs

---

## Mobile Optimization

- **Single column** layout
- **Full-width** inputs and buttons
- **Larger touch targets** (min 44x44px)
- **Stacked buttons** instead of side-by-side
- **Readable font sizes** (min 16px)
- **Adequate spacing** between interactive elements
- **Progress steps** adapt to screen width

---

## Animation & Transitions

- **Button hover** - 200ms ease transition
- **Form errors** - Fade in 150ms
- **Progress highlight** - Smooth color transition
- **Modal appear** - Fade in from top

---

## Dark Mode Support (Optional)

The current design uses light mode. For dark mode:
- Invert color scheme
- Use dark backgrounds with light text
- Keep contrast ratios
- Adjust green/blue to be readable

---

This visual guide provides a clear representation of how each step of the volunteer pickup workflow should appear to users.
