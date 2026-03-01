# Volunteer Pickup Feature - Implementation Guide

## Quick Start

### 1. Files Created/Modified

**New Files Created:**
- `app/auth/register/volunteers/pickups/page.tsx` - Main volunteer pickup page
- `components/web/PickupAcceptanceModal.tsx` - Form modal for volunteer details
- `components/web/PickupCodeModal.tsx` - Pickup code display modal
- `components/ui/spinner.tsx` - Loading spinner component
- `components/ui/alert.tsx` - Alert component for messages
- `convex/pickups.ts` - Backend functions for pickup management
- `VOLUNTEER_PICKUP_DESIGN.md` - Complete design documentation

**Modified Files:**
- `convex/schema.ts` - Added pickups table definition
- `convex/volunteerProfile.ts` - Added updateVolunteerProfile mutation
- `convex/foodList.ts` - Added getAvailableFoodListings query

### 2. Before Running

Make sure your project has:
- ✅ Convex account and project set up
- ✅ Authentication configured
- ✅ React and Next.js 14+ installed
- ✅ Tailwind CSS configured
- ✅ lucide-react for icons
- ✅ sonner for toast notifications
- ✅ Zod for validation

### 3. Required Dependencies

Install if not already present:
```bash
npm install convex next react zod lucide-react sonner
# or
pnpm add convex next react zod lucide-react sonner
```

### 4. Database Setup

Push the schema changes to Convex:
```bash
npx convex dev
```

This should:
- Create the new `pickups` table
- Update the `volunteerProfile` table structure (if needed)

### 5. Environment Variables

Make sure your `.env.local` has:
```
NEXT_PUBLIC_CONVEX_URL=your_convex_url
```

### 6. Navigation

Add the route to your navigation:
```tsx
// In your nav component
<Link href="/auth/register/volunteers/pickups">
  Volunteer Pickups
</Link>
```

Or update your layout to include this route in the volunteer sidebar.

---

## Feature Flow Overview

### Step-by-Step User Journey

1. **Browse Available Pickups**
   - Volunteer accesses `/auth/register/volunteers/pickups`
   - Page shows all available food from donors
   - Each listing shows donor info, food type, quantity, pickup window

2. **Select & Accept Pickup**
   - Volunteer clicks "Accept Food"
   - Confirmation modal shows all details
   - Volunteer clicks "Accept & Continue"

3. **Fill Details**
   - Form modal appears
   - Volunteer enters name, phone, and address
   - Form validates input
   - Volunteer clicks "Submit & Get Pickup Code"

4. **Receive Pickup Code**
   - Backend generates unique 6-character code
   - Code displayed prominently
   - Volunteer can copy, download, or share
   - Instructions provided for pickup process

5. **Return to Browse**
   - Volunteer clicks "Done"
   - Returns to browse step
   - Previous pickup now appears in "My Pickups" section

---

## API Endpoints Used

### Queries (Read)
- `api.foodList.getAvailableFoodListings` - Get all available food
- `api.pickups.getVolunteerPickups` - Get my pickups

### Mutations (Write)
- `api.pickups.acceptPickup` - Accept a food pickup
- `api.volunteerProfile.updateVolunteerProfile` - Save volunteer details
- `api.pickups.assignPickupCode` - Generate and assign pickup code

---

## Component Props Reference

### FoodCard
```tsx
<FoodCard
  listing={foodListing}
  showActions={true}
  onAccept={() => handleAcceptFood(listing)}
  onViewMap={() => viewMap(listing)}
/>
```

### PickupAcceptanceModal
```tsx
<PickupAcceptanceModal
  foodListing={selectedFoodListing}
  onSubmit={async (details) => submitForm(details)}
  onCancel={() => cancelFlow()}
/>
```

### PickupCodeModal
```tsx
<PickupCodeModal
  pickup={activePickup}
  foodListing={selectedFoodListing}
  onComplete={() => resetFlow()}
/>
```

---

## Validation Rules

### Phone Number
- Length: Exactly 10 digits
- Format: Numeric only (auto-strips non-numeric)
- Example: `9876543210`

### Volunteer Name
- Length: Minimum 3, maximum 50 characters
- Trimmed of whitespace
- Required field

### Address
- Length: Minimum 5, maximum 200 characters
- Required field

### Pickup Code
- Format: 6 characters (A-Z, 0-9)
- Generated randomly by backend
- Unique per pickup

---

## Styling & Customization

### Colors
Customize in your Tailwind config:
```
- Primary/Green: `bg-green-600` - Main actions
- Secondary/Blue: `bg-blue-50/200` - Info sections  
- Warning/Amber: `bg-amber-50/600` - Important notices
- Success: `text-green-600` - Confirmations
```

### Responsive Breakpoints
- `md:` - Medium screens and up (768px+)
- Mobile-first approach throughout

### Progress Indicator
- 4 numbered steps with connecting lines
- Inactive: Gray (opacity-50)
- Active: Green (opacity-100, filled)
- Completed: Green with filled background

---

## Testing

### Test Cases

1. **Component Rendering**
   - Verify page loads without errors
   - Progress steps display correctly
   - Food listings load and display

2. **Form Validation**
   - Submit with empty fields → Error messages
   - Enter invalid phone → Error message
   - Enter valid data → Proceed to next step

3. **Code Generation**
   - Each pickup gets unique code
   - Code format is correct (6 chars)
   - Code displays prominently

4. **Copy/Share Functionality**
   - Copy button copies code to clipboard
   - Share button works with device share API
   - Download creates text file with details

5. **Navigation**
   - Can return from confirmation
   - Can return from details form
   - Progress updates correctly through steps

### Mock Data for Testing
```typescript
const testFood = {
  foodName: "Vegetable Biryani",
  businessName: "Green Leaf Restaurant",
  category: "veg",
  quantity: 50,
  location: "123 Main St",
  pickupWindow: {
    openingTime: "2:00 PM",
    closingTime: "4:00 PM"
  }
}
```

---

## Troubleshooting

### Issue: "Unauthorized" Error
- Check user authentication
- Verify auth component in Convex
- Check token validity

### Issue: Pickup Code Not Generating
- Verify assignPickupCode mutation exists
- Check Convex deployment
- Review browser console for errors

### Issue: Food Listings Not Loading
- Verify getAvailableFoodListings query
- Check if food listings exist in database
- Verify "available" status is set correctly

### Issue: Form Not Submitting
- Check phone number format (must be 10 digits)
- Verify all fields are filled
- Check browser console for validation errors

### Issue: Styling Not Applied
- Verify Tailwind CSS is configured
- Check if shadcn components installed correctly
- Clear `.next` cache: `rm -rf .next`

---

## Next Steps

1. ✅ Set up the page and components
2. ✅ Configure Convex backend
3. ✅ Test the user flow
4. ✅ Deploy to production
5. 📋 Add NGO dashboard to manage pickups
6. 📋 Add map integration
7. 📋 Add notification system
8. 📋 Add rating system

---

## Support & Questions

For issues or questions:
1. Check the VOLUNTEER_PICKUP_DESIGN.md documentation
2. Review error messages in browser console
3. Check Convex dashboard for database issues
4. Verify all files are created in correct locations
5. Test with sample data first

---

**Status:** ✅ Ready to Deploy
**Last Updated:** February 2026
