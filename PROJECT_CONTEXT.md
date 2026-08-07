You are working on the Arhaviora E-commerce Frontend freelance project.

IMPORTANT:
Do NOT immediately start implementing the UI.

We will first:
1. Understand the project requirements.
2. Initialize the frontend project because the repository currently contains only README.md.
3. Create the agreed folder architecture.
4. Create the Git feature branch.
5. Extract the complete approved Figma design into a local design-reference system.
6. Only after the documentation/design extraction is complete should actual UI implementation begin.

==================================================
1. PROJECT CONTEXT
==================================================

Project:
Arhaviora E-commerce Frontend

Project type:
Freelance frontend development.

Client/team:
Arhaviora project team.

Agreed project budget:
₹6,000

Agreed advance:
30%

Technology:
- React.js
- JavaScript
- Vite
- CSS

The repository currently contains only README.md.
There is no existing React source code, package.json, src folder, or implemented frontend.

Therefore, we need to initialize the frontend project from scratch while following the architecture described in the provided README and handover document.

==================================================
2. AGREED RESPONSIBILITY
==================================================

My responsibility:

- Frontend UI implementation
- Responsive implementation
- React frontend architecture
- Reusable components
- Frontend-side UI interactions required by the design
- Proper page/component structure
- Figma-accurate implementation

Client/team responsibility:

- API integration
- Backend
- Database
- Server-side functionality
- Actual API implementation

The client explicitly confirmed:

"Yes I will handle the api, but make sure your future initiative to develop. Not just like ui implement"

Interpretation:

The frontend should be developed as a proper React application and should not consist of disconnected static screenshots.

However, DO NOT implement backend or API functionality unless explicitly requested later.

Keep the frontend architecture API-ready.

==================================================
3. OFFICIAL PROJECT REQUIREMENTS
==================================================

The provided handover specifies:

Main pages:

- Homepage
- Shop Listing Page
- Product Detail Page
- Cart Page
- Checkout Flow
  - Address
  - Order Summary
  - Payment
  - Order Confirmation

Additional frontend modules mentioned:

- Authentication
- User Profile
- Order History
- Wishlist

Product-related UI:

- Search
- Filter
- Sorting
- Product details
- Personalization options

Cart-related UI:

- Add/remove products
- Quantity update
- Persistent cart storage

IMPORTANT:

Do not invent additional pages or features.

First inspect the approved Figma and determine exactly which pages, screens, modals, states and flows are actually present.

The approved Figma is the source of truth for visual design and page scope.

==================================================
4. DESIGN REQUIREMENTS
==================================================

The frontend must be:

- Pixel-perfect according to Figma
- Responsive
- Desktop compatible
- Tablet compatible
- Mobile compatible
- Component-based
- Reusable
- Accessible
- Cleanly structured

The README specifies these responsive targets:

Desktop:
- 1440px
- 1280px

Tablet:
- 768px

Mobile:
- 390px
- 375px

Do not assume these are the only breakpoints.

Inspect the Figma for actual responsive behavior where available.

==================================================
5. TECHNOLOGY STACK
==================================================

Use:

- React.js
- JavaScript
- Vite
- CSS

The README mentions:

- Redux Toolkit
- React Router
- Axios
- React Hook Form
- Zod

Prepare the project so these technologies can be used where appropriate.

IMPORTANT:

Do not add unnecessary dependencies.

Do not implement API calls because the client will handle API integration.

Use JavaScript/JSX, NOT TypeScript, unless the client explicitly changes this requirement.

The README currently contains "App.tsx", but the agreed stack is JavaScript.

Therefore use:

App.jsx
main.jsx

not:

App.tsx
main.tsx

==================================================
6. GITHUB WORKFLOW
==================================================

Expected Git workflow:

main
→ Production

develop
→ Integration

feature/*
→ Individual developer branches

Workflow:

1. Start from develop.
2. Create a feature branch.
3. Develop on the feature branch.
4. Push the branch.
5. Create Pull Request to develop.
6. Review and merge.
7. Test develop.
8. Merge develop into main.

IMPORTANT:

Do NOT work directly on main.

Create an appropriate feature branch such as:

feature/arunjith-frontend

Before doing implementation, make sure the branch is based on develop.

==================================================
7. INITIAL PROJECT SETUP
==================================================

Because the repository currently contains only README.md:

First initialize a Vite React JavaScript project.

Create the basic project files:

- package.json
- vite.config.js
- index.html
- src/
- src/main.jsx
- src/App.jsx

Install only the required dependencies.

Potential dependencies:

- react
- react-dom
- react-router-dom
- @reduxjs/toolkit
- react-redux
- axios
- react-hook-form
- zod

Do not create unnecessary business logic yet.

==================================================
8. PROJECT STRUCTURE
==================================================

Follow this architecture:

src/
│
├── assets/
│
├── components/
│   ├── Navbar/
│   ├── Footer/
│   ├── ProductCard/
│   ├── Button/
│   ├── Input/
│   └── Modal/
│
├── pages/
│   ├── Home/
│   ├── Shop/
│   ├── ProductDetails/
│   ├── Cart/
│   └── Checkout/
│
├── features/
│   ├── cart/
│   ├── wishlist/
│   ├── auth/
│   └── checkout/
│
├── services/
│   └── api/
│
├── hooks/
│
├── utils/
│
├── routes/
│
├── App.jsx
└── main.jsx

IMPORTANT:

Do not create unnecessary files inside every folder just for the sake of structure.

Create files based on actual implementation requirements.

==================================================
9. DO NOT IMPLEMENT UI YET
==================================================

After creating the initial project structure:

STOP UI IMPLEMENTATION.

Do NOT start building:

- Navbar
- Homepage
- Product cards
- Shop page
- Cart
- Checkout

yet.

First complete the Figma analysis and local design documentation.

==================================================
10. FIGMA DESIGN SOURCE
==================================================

Approved editable Figma:

https://www.figma.com/design/4zINSthaDp4CpjdnwPOddQ/Arhaviora

This is the primary visual source of truth.

The previous prototype is NOT the final source.

Use the editable Figma design.

==================================================
11. FIGMA MCP STRATEGY
==================================================

IMPORTANT:

Figma MCP has usage/time limitations.

Therefore:

DO NOT repeatedly query Figma MCP throughout development.

Instead, perform a comprehensive extraction of the approved Figma design now.

For every page/screen:

1. Inspect the complete frame.
2. Inspect relevant child elements.
3. Extract design measurements.
4. Extract typography.
5. Extract colors.
6. Extract spacing.
7. Extract dimensions.
8. Extract borders.
9. Extract shadows.
10. Identify icons.
11. Identify images.
12. Identify reusable components.
13. Identify interactions.
14. Identify responsive behavior.
15. Save everything locally.

After this, the local documentation becomes the primary development reference.

Only call Figma MCP again if genuinely necessary because information is missing or ambiguous.

Do NOT repeatedly inspect the same element.

==================================================
12. DESIGN REFERENCE DIRECTORY
==================================================

Create:

design_reference/

Structure:

design_reference/
│
├── README.md
├── design_tokens.md
├── user_flow.md
│
├── global/
│   ├── colors.md
│   ├── typography.md
│   ├── spacing.md
│   ├── borders.md
│   ├── shadows.md
│   ├── breakpoints.md
│   ├── icons.md
│   └── common_components.md
│
├── home/
│   ├── README.md
│   ├── layout.md
│   ├── sections.md
│   ├── typography.md
│   ├── spacing.md
│   ├── colors.md
│   ├── components.md
│   ├── interactions.md
│   └── assets.md
│
├── shop/
│   ├── README.md
│   ├── layout.md
│   ├── sections.md
│   ├── typography.md
│   ├── spacing.md
│   ├── colors.md
│   ├── components.md
│   ├── interactions.md
│   └── assets.md
│
├── product-details/
│   ├── README.md
│   ├── layout.md
│   ├── sections.md
│   ├── typography.md
│   ├── spacing.md
│   ├── colors.md
│   ├── components.md
│   ├── interactions.md
│   └── assets.md
│
├── cart/
│   ├── README.md
│   ├── layout.md
│   ├── sections.md
│   ├── typography.md
│   ├── spacing.md
│   ├── colors.md
│   ├── components.md
│   ├── interactions.md
│   └── assets.md
│
└── checkout/
    ├── README.md
    ├── layout.md
    ├── sections.md
    ├── typography.md
    ├── spacing.md
    ├── colors.md
    ├── components.md
    ├── interactions.md
    └── assets.md

If the Figma contains additional approved pages or screens, create appropriate folders.

Do not invent pages.

==================================================
13. PROJECT CONTEXT FILE
==================================================

Create:

project_context.md

This must document:

- Project overview
- How the project was received
- Freelance project
- Budget
- Advance
- Responsibilities
- Technology
- Pages
- Design requirements
- Responsive requirements
- Git workflow
- Figma source
- Scope boundaries
- API/backend responsibility
- Important communication decisions
- Development approach
- Important assumptions

Clearly separate:

MY RESPONSIBILITY:
Frontend UI + responsive frontend implementation

CLIENT RESPONSIBILITY:
API + backend + database + API integration

==================================================
14. GLOBAL DESIGN EXTRACTION
==================================================

Create:

design_reference/design_tokens.md

Extract exact Figma values for:

Colors:
- Primary
- Secondary
- Background
- Surface
- Text
- Muted text
- Border
- Accent
- Error
- Success
- Any other colors

Typography:
- Font family
- Font sizes
- Font weights
- Line heights
- Letter spacing

Spacing:
- Page padding
- Section spacing
- Component spacing
- Grid gaps
- Card gaps

Borders:
- Width
- Radius
- Colors

Shadows:
- X
- Y
- Blur
- Spread
- Color
- Opacity

Containers:
- Maximum widths
- Desktop widths
- Mobile widths

Breakpoints:
- Desktop
- Tablet
- Mobile

==================================================
15. PAGE EXTRACTION
==================================================

For EACH actual Figma page:

Document:

- Frame dimensions
- Overall layout
- Sections
- Components
- Component dimensions
- Typography
- Colors
- Spacing
- Padding
- Margins
- Gaps
- Borders
- Radius
- Shadows
- Images
- Icons
- Buttons
- Inputs
- Cards
- States
- Interactions
- Responsive behavior

Use exact Inspect values whenever available.

Do not estimate values when Figma provides them.

==================================================
16. ICON EXTRACTION
==================================================

Identify every icon.

Document:

- Icon
- Location
- Size
- Color
- Stroke/fill
- Asset source
- Reusability

Use exact project/Figma assets where available.

Do not substitute random icons just because they look similar.

==================================================
17. IMAGE/ASSET EXTRACTION
==================================================

Create an asset inventory.

For each asset:

- Name
- Page
- Purpose
- Dimensions
- Aspect ratio
- Format
- Figma source
- Local source
- Whether WebP is appropriate
- Whether lazy loading is appropriate

Priority:

1. Existing project assets
2. Figma assets
3. Exported assets
4. Replacement only if absolutely necessary

Do not use random stock assets when the actual Figma asset is available.

==================================================
18. COMPONENT ANALYSIS
==================================================

Identify reusable components across the design.

Examples:

- Navbar
- Footer
- Button
- Input
- ProductCard
- ProductGrid
- Search
- Filter
- Sort
- Modal
- Badge
- Rating
- QuantitySelector
- ProductGallery
- Breadcrumb
- CartItem
- OrderSummary
- AddressCard
- Checkout components

For each component document:

- Where used
- Variants
- States
- Dimensions
- Typography
- Colors
- Responsive behavior
- Interactions

Do not create duplicate components unnecessarily.

==================================================
19. USER FLOW
==================================================

Create:

design_reference/user_flow.md

Document the actual user flow shown in the Figma.

Example:

Home
↓
Shop
↓
Product Details
↓
Cart
↓
Checkout
↓
Order Confirmation

Also document:

- Navigation buttons
- Links
- Modals
- Dropdowns
- Tabs
- Forms
- Product interactions
- Checkout steps

Do not invent interactions that aren't represented or reasonably required.

==================================================
20. RESPONSIVE ANALYSIS
==================================================

Analyze:

- Desktop
- Tablet
- Mobile

Document how:

- Navbar changes
- Grids change
- Cards resize
- Sections stack
- Typography changes
- Padding changes
- Images resize/crop
- Buttons change
- Forms stack
- Checkout layout changes

The final website must remain responsive while preserving the approved visual design.

==================================================
21. DESIGN REFERENCE IS THE LOCAL SOURCE
==================================================

After Figma extraction:

During implementation, prefer:

1. Local design_reference/
2. Existing local assets
3. Existing source code
4. Figma MCP only when required

Do not repeatedly query Figma for values already documented locally.

==================================================
22. FINAL CHECK BEFORE IMPLEMENTATION
==================================================

Before starting UI implementation, verify:

[ ] Repository initialized
[ ] React + Vite configured
[ ] JavaScript/JSX confirmed
[ ] Git feature branch created from develop
[ ] Folder architecture created
[ ] project_context.md created
[ ] Figma fully inspected
[ ] Actual pages identified
[ ] Modals identified
[ ] Components identified
[ ] Icons documented
[ ] Images documented
[ ] Typography documented
[ ] Colors documented
[ ] Spacing documented
[ ] Borders documented
[ ] Shadows documented
[ ] Responsive behavior documented
[ ] User flow documented
[ ] Design tokens documented
[ ] No unnecessary UI implementation started

==================================================
23. FINAL RESPONSE
==================================================

When this phase is complete, provide:

1. Git branch name
2. Project structure created
3. Dependencies installed
4. Figma pages discovered
5. Number of pages
6. Number of modals/popups
7. Reusable components discovered
8. Assets discovered
9. Design tokens extracted
10. Responsive breakpoints
11. User flow
12. Any uncertainties
13. Any questions requiring client confirmation
14. Recommended implementation order

IMPORTANT FINAL STATEMENT:

"Project setup and Figma design extraction are complete. UI implementation has not started yet."

Do not begin actual page implementation until this documentation/setup phase is complete.