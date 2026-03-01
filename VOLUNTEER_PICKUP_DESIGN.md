# Volunteer Pickup Page Design Documentation

## Overview
The Volunteer Pickup page (`/auth/register/volunteers/pickups`) is a multi-step flow that allows volunteers to:
1. Browse available food listings from donors via NGOs
2. Accept a food pickup
3. Fill in personal details
4. Receive a unique pickup code from the NGO

## Page Architecture

### Main Components

#### 1. **VolunteerPickupsPage** (Main Page)
**Location:** `app/auth/register/volunteers/pickups/page.tsx`

**Features:**
- Multi-step progress indicator
- Displays available food listings for pickup
- Manages the entire pickup acceptance workflow
- Shows volunteer's previous pickups with status

**State Management:**
```typescript
- activeStep: 'browse' | 'accept' | 'details' | 'pickupCode'
- selectedFoodListing: Food listing being accepted
- activePickup: Current pickup record
- showDetailsForm: Toggle for details form modal
- showPickupCode: Toggle for pickup code modal
```

**User Flow:**
1. **Browse Step** - Display available food listings
   - Shows food items accepted by NGOs
   - Displays donor info, quantity, pickup window, location
   - Shows user's previous pickups

2. **Accept Step** - Confirm pickup details
   - Review food details one more time
   - See pickup location and window
   - Option to cancel or proceed

3. **Details Step** - Fill volunteer information
   - Name (minimum 3 characters)
   - Phone number (10 digits)
   - Delivery address (minimum 5 characters)
   - Validation on submit

4. **Pickup Code Step** - Display assigned code
   - Shows unique 6-character alphanumeric code
   - Displays all pickup details
   - Options to download or share
   - Clear next steps instructions

---

#### 2. **PickupAcceptanceModal** 
**Location:** `components/web/PickupAcceptanceModal.tsx`

**Purpose:** Modal form for volunteers to fill in their personal details

**Features:**
- Full name input with validation (min 3 chars)
- Phone number input with formatting (auto-extracts digits, max 10)
- Delivery address input with validation (min 5 chars)
- Real-time error handling
- Shows food item being picked up as context
- Submit/Cancel actions

**Validation:**
- All fields are required
- Phone: exactly 10 digits
- Name: minimum 3 characters
- Address: minimum 5 characters

---

#### 3. **PickupCodeModal**
**Location:** `components/web/PickupCodeModal.tsx`

**Purpose:** Displays the assigned pickup code and instructions

**Features:**
- Large, prominent display of 6-character pickup code
- Copy to clipboard functionality
- Download details as text file
- Share via device share API or clipboard
- Step-by-step pickup instructions
- Important notices about timing and food safety
- Displays complete pickup details (location, window, food info)

**Actions Available:**
- Copy Code
- Download Details
- Share
- Mark as Done (returns to browse)

---

### Supporting Components

#### UI Components Used:
- `Button` - Action buttons with variants (default, outline)
- `Card` - Container for content sections
- `Input` - Form input fields
- `Label` - Form labels with icons
- `Alert` - Information and warning alerts
- `Spinner` - Loading indicator (if needed)

#### Icons (from lucide-react):
- `Package` - Empty state
- `MapPin` - Location information
- `Clock` - Time information
- `User` - Volunteer name field
- `Phone` - Phone number field
- `CheckCircle` - Success indicator
- `AlertCircle` - Alert/warning indicator
- `Copy` - Copy code action
- `Download` - Download action
- `Share2` - Share action
- Plus others for progress steps

---

## Backend Integration (Convex)

### API Functions

#### 1. **getAvailableFoodListings** (Query)
```typescript
// File: convex/foodList.ts
Query to fetch all available food listings
Returns: FoodListing[] where status === 'available'
```

#### 2. **acceptPickup** (Mutation)
```typescript
// File: convex/pickups.ts
Creates a new pickup record when volunteer accepts
Args: { foodListingId, donorId }
Returns: Pickup { id, foodListingId, volunteerId, status: 'pending', ... }
```

#### 3. **updateVolunteerProfile** (Mutation)
```typescript
// File: convex/volunteerProfile.ts
Updates or creates volunteer profile with details
Args: { userName, phone, address }
Creates/updates volunteerProfile table
```

#### 4. **assignPickupCode** (Mutation)
```typescript
// File: convex/pickups.ts
Generates and assigns pickup code to volunteer
Args: { pickupId }
Returns: { pickupCode, status: 'assigned', assignedAt }
Generates random 6-character alphanumeric code
```

#### 5. **getVolunteerPickups** (Query)
```typescript
// File: convex/pickups.ts
Fetches all pickups for current volunteer
Returns: Pickup[] filtered by volunteerId
```

---

## Database Schema

### Pickups Table
```typescript
pickups: {
    foodListingId: string,        // Reference to food listing
    donorId: string,              // Reference to donor
    volunteerId: string,          // Current user ID
    volunteerName: string,        // User's name
    pickupCode: optional<string>, // Assigned code
    status: string,               // pending | assigned | picked | delivered
    createdAt: string,            // When pickup was accepted
    assignedAt: optional<string>, // When code was assigned
    pickedAt: optional<string>,   // When food was picked up
    deliveredAt: optional<string> // When delivered to NGO
}
```

---

## User Interface Design

### Visual Hierarchy
1. **Header** - Page title and description
2. **Progress Steps** - 4-step indicator showing progress
3. **Main Content** - Changes based on active step
4. **Help Section** - FAQ and contact information

### Color Scheme
- **Primary (Green)** - Action buttons, success indicators, progress
- **Secondary (Blue)** - Information alerts, secondary actions
- **Warning (Amber)** - Important notices
- **Error (Red)** - Error messages

### Responsive Design
- Mobile-first approach
- Progress steps adapt on smaller screens
- Cards stack vertically on mobile
- Full-width content areas

### Accessibility
- Semantic HTML (button, form, label)
- ARIA attributes for alerts (role="alert")
- Icon + text combinations
- Clear form labels and error messages
- Keyboard navigation support

---

## Workflow Sequence

```
1. Volunteer visits page
   ↓
2. Browse available food listings (Step 1)
   ├─ See food items, donors, times, locations
   ├─ View their previous pickups
   └─ Click "Accept Food" button
   ↓
3. Confirm pickup details (Step 2)
   ├─ Review the food and pickup details
   ├─ See location and time window
   └─ Click "Accept & Continue" or Cancel
   ↓
4. Fill personal information (Step 3)
   ├─ Enter name, phone, address
   ├─ Validation performed
   └─ Click "Submit & Get Pickup Code"
   ↓
5. Receive pickup code (Step 4)
   ├─ See 6-character code
   ├─ Download/share details
   ├─ Read instructions
   └─ Click "Done" to return to browse
```

---

## Error Handling

### Validation Errors
- Form validation on submit
- Real-time error clearing when user corrects
- Clear error messages for user guidance

### API Errors
- Try-catch blocks in all async operations
- User-friendly error messages via toast/alerts
- Fallback UI states for network issues

### Edge Cases
- Listing no longer available (already picked)
- Unauthorized user access
- Network timeouts
- Duplicate pickup attempts

---

## Feature Enhancement Ideas

1. **Map Integration**
   - Show pickup location on map
   - Directions to pickup location
   - Estimated travel time

2. **Rating System**
   - Rate donors, NGOs, volunteer experience
   - Display ratings on listings

3. **Notification System**
   - SMS/Email pickup reminders
   - Status updates to volunteer and NGO

4. **History & Analytics**
   - Track volunteer pickups over time
   - Impact metrics (food served, families helped)
   - Badge/reward system for active volunteers

5. **Communication**
   - In-app messaging between volunteer and donor
   - Chat room for quick questions/clarifications

6. **Advanced Filtering**
   - Filter by food type, distance, time
   - Saved preferences

7. **Scheduling**
   - Calendar view of pickups
   - Schedule multiple pickups

---

## Testing Checklist

- [ ] Form validation works correctly
- [ ] Pickup code generation is unique
- [ ] Phone number input formatting works
- [ ] Download functionality works
- [ ] Share functionality works
- [ ] Copy to clipboard works
- [ ] Previous pickups display correctly
- [ ] Empty state displays when no listings
- [ ] Navigation between steps works
- [ ] API calls are successful
- [ ] Error handling displays proper messages
- [ ] Responsive design on mobile/tablet/desktop

---

## Future Considerations

1. **Volunteer Dashboard** - Comprehensive view of all pickups
2. **NGO Dashboard** - Partner views to manage pickups and assign codes
3. **Notifications** - Real-time updates on pickup status
4. **Ratings** - Community trust through ratings
5. **Verification** - Verify volunteer identity for safety
6. **Insurance** - Track food handling compliance
