# FeedForward

FeedForward is a food rescue and redistribution platform connecting donors, NGOs, and volunteers.
The app helps reduce food waste by enabling donation listings, pickup coordination, and delivery tracking with real-time updates powered by Socket.io.

## Current Project Status

Implemented and working modules:

1. Authentication flow with role-based onboarding.
2. Donor profile and food listing workflows.
3. NGO profile and pickup management workflows.
4. Volunteer pickup workflow (browse, accept, details, pickup code).
5. Delivery and map-tracking UI components.
6. Convex backend functions and schema for users, profiles, listings, and pickups.

## Tech Stack

- Next.js 16 (App Router)
- React 19 + TypeScript
- Tailwind CSS 4
- Convex (database + backend functions)
- better-auth (auth integration)
- Socket.io client (real-time communication)
- Zod + React Hook Form (validation and forms)
- Leaflet / React-Leaflet (maps)

## Project Structure

```text
repo/
	FeedForward/
		app/
			(shared-layout)/
				about/
				contact/
				donor/
				ngo/
				volunteer/
			api/
			auth/
		components/
			ui/
			web/
		convex/
			schema.ts
			user.ts
			donorProfile.ts
			ngoProfile.ts
			volunteerProfile.ts
			foodList.ts
			pickups.ts
		lib/
		schemas/
	socketServer/
		index.js
		package.json
```

## Key Functional Areas

1. Donor
	 - Create and manage food listings.
	 - Track donation-related activity.

2. NGO
	 - Browse and coordinate available food pickups.
	 - Assign and manage pickup operations.

3. Volunteer
	 - View available food listings.
	 - Accept pickup requests.
	 - Submit pickup details.
	 - Receive and use pickup code.

4. Shared
	 - About and contact pages.
	 - Reusable UI and map components.

## Backend (Convex)

Core backend modules:

- `convex/schema.ts`: Database schema definitions.
- `convex/user.ts`: User-level operations.
- `convex/donorProfile.ts`: Donor profile logic.
- `convex/ngoProfile.ts`: NGO profile logic.
- `convex/volunteerProfile.ts`: Volunteer profile logic.
- `convex/foodList.ts`: Food listing operations.
- `convex/pickups.ts`: Pickup lifecycle and assignment flow.

## Real-Time Server (Socket.io)

The `socketServer/` folder contains a Node.js server powered by Socket.io for real-time communication features such as:

- Live location tracking for deliveries
- Real-time notifications for pickups and donations
- Live map updates for volunteers and NGOs
- Instant status updates across the platform

### Running Socket Server

1. Navigate to the socketServer folder:

```bash
cd socketServer
```

2. Install dependencies:

```bash
npm install
```

3. Start the server:

```bash
npm start
```

The socket server will run on its configured port (default: 4000) and enable real-time features for the FeedForward application.

## Local Setup

1. Install dependencies for FeedForward:

```bash
cd FeedForward
pnpm install
```

2. Set up Socket Server (in a new terminal):

```bash
cd socketServer
npm install
npm start
```

3. Configure environment variables in `FeedForward/.env.local`.

4. Start FeedForward dev server (in the FeedForward directory):

```bash
pnpm dev
```

5. Open:

```text
http://localhost:3000
```

Both services should be running for full real-time functionality.

## Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint checks

## Current Notes

- About and Contact pages are available from navbar and footer.
- Home page behavior changes based on logged-in state.
- Some role-landing CTA interactions are pending refinement.

## GitHub Push Checklist

1. Ensure `.env*`, `node_modules`, and `.next` are not committed.
2. Run `pnpm lint` and `pnpm build` successfully.
3. Review `git status` to confirm only intended files are included.
4. Push branch after final verification.
