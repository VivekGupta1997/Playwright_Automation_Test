/**
 * zephyr_sync.ts — Automated Test Case Synchronization with Zephyr Scale Cloud
 *
 * Synchronizes BDD/Gherkin test cases directly from source code into Zephyr Scale Cloud.
 * The script is idempotent: creates missing test cases, updates changed metadata, skips identical cases.
 *
 * Usage:
 *   npx tsx zephyr_sync.ts                          # Standard sync (recommended)
 *   npx tsx zephyr_sync.ts --clean                  # Delete & recreate all cases in the folder
 *   npx tsx zephyr_sync.ts --diagnose NET-T1234     # Inspect a specific test case
 *
 * Author:  Vivek Gupta (Etrak Playwright Automation Project)
 * Project: NET (NEW - eTrak)
 */

// ══════════════════════════════════════════════════════════════════════════════
// CONFIGURATION — Update these constants before first run
// ══════════════════════════════════════════════════════════════════════════════

const ZEPHYR_TOKEN = "YOUR_ZEPHYR_API_TOKEN_HERE";   // JWT Bearer token from Zephyr Scale API Tokens
const PROJECT_KEY  = "NET";                           // Jira/Zephyr project key
const FOLDER_NAME  = "Automation";                    // Target folder inside the project (must exist in Zephyr)
const BASE_URL     = "https://api.zephyrscale.smartbear.com/v2";
const DELAY        = 0.8;                             // Seconds between API calls (rate-limit throttle)

// ══════════════════════════════════════════════════════════════════════════════
// TYPE DEFINITIONS
// ══════════════════════════════════════════════════════════════════════════════

interface TestCaseDefinition {
    name: string;
    priority: "High" | "Medium" | "Low";
    objective: string;
    precondition: string;
    gherkin: string;
}

interface ZephyrTestCase {
    key: string;
    name: string;
    objective?: string;
    precondition?: string;
    priority?: { name: string };
    [key: string]: unknown;
}

interface ZephyrPaginatedResponse<T> {
    values: T[];
    isLast: boolean;
    startAt: number;
    maxResults: number;
    total?: number;
}

interface SyncResult {
    name: string;
    key: string;
    status: "CREATED" | "UPDATED" | "SKIPPED" | "ERROR";
}

type PriorityMap = Record<string, string>;

// ══════════════════════════════════════════════════════════════════════════════
// TEST CASES — BDD/Gherkin test case definitions from Playwright automation
// ══════════════════════════════════════════════════════════════════════════════

const TEST_CASES: TestCaseDefinition[] = [
    // ──────────────────────────────────────────────────────────────────────────
    // AUTHENTICATION & LOGIN
    // ──────────────────────────────────────────────────────────────────────────
    {
        name: "Login with Valid Admin Credentials",
        priority: "High",
        objective: "Verify that a registered admin user can successfully authenticate and access the Etrak dashboard with valid credentials.",
        precondition: "User has an active admin account with valid credentials (email and password) in the Etrak system.",
        gherkin: [
            'Given the admin user is on the Etrak login page "https://www.etrak-recsoftware.com/login"',
            'When the user enters a valid admin email address',
            '  And enters the correct password',
            '  And clicks the "Sign in" button',
            'Then the system should authenticate the session',
            '  And the URL should no longer contain "/login"',
            '  And the user should be redirected to the dashboard',
        ].join("\n"),
    },

    // ──────────────────────────────────────────────────────────────────────────
    // USER MANAGEMENT
    // ──────────────────────────────────────────────────────────────────────────
    {
        name: "Add New User via UI",
        priority: "High",
        objective: "Verify that an admin can create a new user account with full details including organization, role, and date of birth.",
        precondition: "Admin user is logged into the Etrak application. The target organization exists in the system.",
        gherkin: [
            'Given the admin user is logged into the Etrak application',
            'When the user navigates to the Users management page',
            '  And clicks the "Add Users" button',
            '  And selects the organization from the dropdown',
            '  And fills in user details including first name, last name, email, address, city, state, zip code, and phone number',
            '  And selects the user role',
            '  And selects the date of birth',
            '  And clicks Save',
            'Then the user should be created successfully',
            '  And the URL should contain "/users"',
        ].join("\n"),
    },
    {
        name: "Add Family Member to Existing User",
        priority: "Medium",
        objective: "Verify that a family member can be added to an existing user profile with required details.",
        precondition: "Admin user is logged in. At least one user exists in the organization with a viewable profile.",
        gherkin: [
            'Given the admin user is logged into the Etrak application',
            'When the user navigates to the Users management page',
            '  And filters users by organization',
            '  And opens the profile of the first user in the list',
            '  And adds a family member with first name, last name, city, and date of birth',
            'Then the system should display a "Family User Added" confirmation message',
        ].join("\n"),
    },

    // ──────────────────────────────────────────────────────────────────────────
    // RESOURCE MANAGEMENT
    // ──────────────────────────────────────────────────────────────────────────
    {
        name: "Add New Resource via UI",
        priority: "Medium",
        objective: "Verify that an admin can create a new resource with associated fee details and publish it successfully.",
        precondition: "Admin user is logged in. Connected resource and fee configuration options (GLA, Deferred Revenue) exist.",
        gherkin: [
            'Given the admin user is logged into the Etrak application',
            'When the user navigates to the Add Resource page',
            '  And fills in the resource name and connected resource details',
            '  And fills in the fee details including name, amount, GLA, and deferred revenue',
            '  And publishes the resource',
            'Then the resource should be created successfully',
            '  And the URL should contain "/resources"',
        ].join("\n"),
    },

    // ──────────────────────────────────────────────────────────────────────────
    // EVENT MANAGEMENT
    // ──────────────────────────────────────────────────────────────────────────
    {
        name: "Add New Event via UI",
        priority: "Medium",
        objective: "Verify that an admin can create a new event with ticket details and publish it to the event listings.",
        precondition: "Admin user is logged in. Connected resource exists. GLA, Deferred Revenue, and Tax configuration are available.",
        gherkin: [
            'Given the admin user is logged into the Etrak application',
            'When the user navigates to the Add Event page',
            '  And fills in event details including name, connected resource, max attendance, and ticket limits',
            '  And fills in ticket details including fee name, amount, GLA, deferred revenue, tax ID, and tax rate',
            '  And publishes the event',
            'Then the event should be created successfully',
            '  And the URL should contain "/events"',
        ].join("\n"),
    },

    // ──────────────────────────────────────────────────────────────────────────
    // PROGRAM MANAGEMENT
    // ──────────────────────────────────────────────────────────────────────────
    {
        name: "Add New Program via UI",
        priority: "Medium",
        objective: "Verify that an admin can create a new program with fee details, tax configuration, and addon settings.",
        precondition: "Admin user is logged in. Connected resource, GLA accounts, and tax configuration are available.",
        gherkin: [
            'Given the admin user is logged into the Etrak application',
            'When the user navigates to the Add Program page',
            '  And fills in program details including name, connected resource, and max attendance',
            '  And fills in fee details including fee name, amount, and GLA',
            '  And adds tax configuration with GLA account, tax ID, and tax rate',
            '  And publishes the program',
            'Then the program should be created successfully',
            '  And the URL should contain "/programs"',
        ].join("\n"),
    },

    // ──────────────────────────────────────────────────────────────────────────
    // PASS MANAGEMENT
    // ──────────────────────────────────────────────────────────────────────────
    {
        name: "Add New Pass via UI",
        priority: "Medium",
        objective: "Verify that an admin can create a new pass (Punch Pass / Family level) with fee details and publish it.",
        precondition: "Admin user is logged in. Pass type and level options are configured in the system.",
        gherkin: [
            'Given the admin user is logged into the Etrak application',
            'When the user navigates to the Add Pass page',
            '  And fills in pass details including name, pass type, pass level, and number of punches',
            '  And fills in fee details including fee name, amount, GLA, and deferred revenue',
            '  And publishes the pass',
            'Then the pass should be created successfully',
            '  And the URL should contain "/passes"',
        ].join("\n"),
    },

    // ──────────────────────────────────────────────────────────────────────────
    // SESSION MANAGEMENT
    // ──────────────────────────────────────────────────────────────────────────
    {
        name: "Add New Session via UI",
        priority: "Medium",
        objective: "Verify that an admin can create a new session with schedule and fee details and publish it.",
        precondition: "Admin user is logged in. Schedule configuration (day offset, start/end hours) and fee options are available.",
        gherkin: [
            'Given the admin user is logged into the Etrak application',
            'When the user navigates to the Add Session page',
            '  And fills in session details including name and max attendance',
            '  And fills in schedule details including day offset, start hour, and end hour',
            '  And fills in fee details including fee name, amount, GLA, deferred revenue, tax ID, and tax rate',
            '  And publishes the session',
            'Then the session should be created successfully',
            '  And the URL should contain "/sessions"',
        ].join("\n"),
    },

    // ──────────────────────────────────────────────────────────────────────────
    // SALE ITEM MANAGEMENT
    // ──────────────────────────────────────────────────────────────────────────
    {
        name: "Add New Sale Item via UI",
        priority: "Medium",
        objective: "Verify that an admin can create a new sale item with fee and tax details and navigate to the sale list view.",
        precondition: "Admin user is logged in. Connected offerings and tax configuration are available.",
        gherkin: [
            'Given the admin user is logged into the Etrak application',
            'When the user navigates to the Add Sale page',
            '  And fills in sale item details including name, connected offerings, and starting quantity',
            '  And fills in fee details including fee name, amount, GLA, tax ID, and tax rate',
            '  And publishes the sale item',
            '  And navigates to the sale list view',
            'Then the sale item should be created successfully',
            '  And the URL should contain "/sales"',
        ].join("\n"),
    },

    // ──────────────────────────────────────────────────────────────────────────
    // SEAT-SELECTION EVENT CREATION
    // ──────────────────────────────────────────────────────────────────────────
    {
        name: "Create Seat-Selection Event with Layout",
        priority: "Medium",
        objective: "Verify that an admin can create a seat-selection event with a custom seating layout (table type, shape, count) and publish it.",
        precondition: "Admin user is logged in. Connected resource for seat events exists. Layout seating options are configured.",
        gherkin: [
            'Given the admin user is logged into the Etrak application',
            'When the user navigates to the Add Event page',
            '  And fills in event details including name, connected resource, max attendance, and ticket limits',
            '  And enables the seat selection toggle',
            '  And creates a seating layout with name, seating type, number of tables, seats per table, and table shape',
            '  And proceeds to the ticket step',
            '  And fills in ticket details including fee name, amount, GLA, deferred revenue, tax ID, and tax rate',
            '  And publishes the event',
            'Then the seat-selection event should be created successfully',
            '  And the URL should contain "/events"',
        ].join("\n"),
    },

    // ──────────────────────────────────────────────────────────────────────────
    // SEAT BOOKING
    // ──────────────────────────────────────────────────────────────────────────
    {
        name: "Book Seats for User in Seat-Selection Event",
        priority: "High",
        objective: "Verify that an admin can book seats for a user in a seat-selection event, selecting specific seats from the layout and completing checkout.",
        precondition: "Admin user is logged in. A seat-selection event with available seats exists. Target users exist in the system.",
        gherkin: [
            'Given the admin user is logged into the Etrak application',
            'When the user selects the seat event from the catalog for the organization',
            '  And selects a user with available seats from the user dropdown',
            '  And enters the quantity of seats to book',
            '  And selects the desired seats from the seating layout',
            '  And adds the selection to the cart',
            '  And completes the checkout with cash payment',
            'Then the seat booking should be completed successfully',
            '  And the "Complete Order" button should no longer be visible',
        ].join("\n"),
    },

    // ──────────────────────────────────────────────────────────────────────────
    // CATALOG — BOOK PASS
    // ──────────────────────────────────────────────────────────────────────────
    {
        name: "Book Pass from Catalog",
        priority: "High",
        objective: "Verify that an admin can book a pass offering from the catalog by filtering, selecting user, adding to cart, and completing checkout.",
        precondition: "Admin user is logged in. A published pass offering exists in the catalog. Target user exists in the organization.",
        gherkin: [
            'Given the admin user is logged into the Etrak application',
            'When the user navigates to the Catalog page for the organization',
            '  And filters offerings by type "Pass"',
            '  And selects the "Membership Recurring" pass offering',
            '  And searches for user "test" and selects "Test, Nancy"',
            '  And adds the pass to the cart',
            '  And completes the checkout process',
            '  And returns to the dashboard',
            'Then the URL should contain "/dashboard"',
            '  And the pass should be booked successfully for the selected user',
        ].join("\n"),
    },

    // ──────────────────────────────────────────────────────────────────────────
    // CATALOG — BOOK PROGRAM
    // ──────────────────────────────────────────────────────────────────────────
    {
        name: "Book Program from Catalog",
        priority: "High",
        objective: "Verify that an admin can book a program offering from the catalog with specific pricing, user selection, and complete the checkout.",
        precondition: "Admin user is logged in. A published program offering with pricing tiers exists. Target user exists.",
        gherkin: [
            'Given the admin user is logged into the Etrak application',
            'When the user navigates to the Catalog page for the organization',
            '  And filters offerings by type "Program"',
            '  And selects the "New Program" program offering',
            '  And searches for user "test" and selects "More, Steven"',
            '  And selects the "$60.00" pricing option',
            '  And adds the program to the cart',
            '  And completes the checkout process with cash payment',
            '  And returns to the dashboard',
            'Then the URL should contain "/dashboard"',
            '  And the program should be booked successfully for the selected user',
        ].join("\n"),
    },

    // ──────────────────────────────────────────────────────────────────────────
    // SCHEDULER — BOOK OFFERING
    // ──────────────────────────────────────────────────────────────────────────
    {
        name: "Book Offering from Scheduler",
        priority: "High",
        objective: "Verify that an admin can book an offering through the scheduler by selecting a time slot, filling booking details, selecting user and resource, and completing checkout.",
        precondition: "Admin user is logged in. Scheduler is accessible for the organization. Available time slots exist on the calendar.",
        gherkin: [
            'Given the admin user is logged into the Etrak application',
            'When the user navigates to the Scheduler page for organization "Etrak demo 3"',
            '  And selects a time slot on the calendar grid',
            '  And fills in booking details including description and notes',
            '  And searches for user "test" and selects "Test, Nancy"',
            '  And selects the resource or checkbox option',
            '  And adds the booking to cart and completes checkout',
            '  And returns to the dashboard',
            'Then the URL should contain "/dashboard"',
            '  And the offering should be booked successfully from the scheduler',
        ].join("\n"),
    },

    // ──────────────────────────────────────────────────────────────────────────
    // CATALOG — PURCHASE PASS
    // ──────────────────────────────────────────────────────────────────────────
    {
        name: "Purchase Pass from Catalog via Offerings",
        priority: "High",
        objective: "Verify that an admin can purchase a pass by navigating through the offerings tab, filtering by pass type, selecting a user, and completing checkout.",
        precondition: "Admin user is logged in. A published pass offering exists. Target user exists in the organization.",
        gherkin: [
            'Given the admin user is logged into the Etrak application',
            'When the user navigates to the Catalog page for organization "Etrak demo 3"',
            '  And navigates to the Offerings tab',
            '  And filters offerings by type "Pass"',
            '  And selects the "months membership" pass offering',
            '  And selects user "carry, alex" and adds to cart',
            '  And completes the checkout process',
            'Then the URL should contain "/receipt"',
            '  And the pass purchase should be completed successfully',
        ].join("\n"),
    },

    // ──────────────────────────────────────────────────────────────────────────
    // POINT OF SALE
    // ──────────────────────────────────────────────────────────────────────────
    {
        name: "Point of Sale Checkout with Pay Later",
        priority: "High",
        objective: "Verify that an admin can process a Point of Sale transaction by selecting organization, searching user, adding fees to cart, and completing checkout with Pay Later option.",
        precondition: "Admin user is logged in. POS module is accessible. Organization with users and fee items is configured.",
        gherkin: [
            'Given the admin user is logged into the Etrak application',
            'When the user navigates to the Point of Sale page',
            '  And selects the organization "Etrak demo 3"',
            '  And searches for user "test" and selects the matching user',
            '  And adds the first available fee item to the cart',
            '  And proceeds to checkout',
            '  And enables the "Pay Later" checkbox option',
            '  And clicks "Complete Order"',
            '  And returns to the dashboard',
            'Then the order should be completed successfully with Pay Later status',
        ].join("\n"),
    },

    // ──────────────────────────────────────────────────────────────────────────
    // REFUND ORDER
    // ──────────────────────────────────────────────────────────────────────────
    {
        name: "Refund Order for User",
        priority: "High",
        objective: "Verify that an admin can process a refund by navigating to user orders, initiating refund on a receipt, selecting refund items, and completing with cash.",
        precondition: "Admin user is logged in. At least one user has a completed order with refundable items.",
        gherkin: [
            'Given the admin user is logged into the Etrak application',
            'When the user navigates to the User list and filters by organization',
            '  And opens the user profile',
            '  And goes to the Orders tab',
            '  And views a receipt and initiates a refund',
            '  And selects the item to refund',
            '  And completes the refund with cash payment',
            '  And returns to the dashboard',
            'Then the refund should be processed successfully',
        ].join("\n"),
    },

    // ──────────────────────────────────────────────────────────────────────────
    // END-TO-END FLOW
    // ──────────────────────────────────────────────────────────────────────────
    {
        name: "Complete End-to-End User and Offerings Management Flow",
        priority: "High",
        objective: "Verify the complete end-to-end flow: login, add user, add resource, add event, add program, add pass, add session, create seat event with layout, and book seats.",
        precondition: "Admin user has valid credentials. All prerequisite configurations (organizations, resources, GLA, tax) are available in the system.",
        gherkin: [
            'Given the admin user is on the Etrak login page',
            'When the user logs in with valid admin credentials',
            '  And navigates to Users page and creates a new user with full details',
            'Then the URL should contain "/users"',
            'Given the user is on the dashboard',
            'When the user navigates to Add Resource and creates a new resource with fees',
            'Then the URL should contain "/resources"',
            'Given the user is on the dashboard',
            'When the user navigates to Add Event and creates a new event with ticket details',
            'Then the URL should contain "/events"',
            'Given the user is on the dashboard',
            'When the user navigates to Add Program and creates a new program with fees and tax',
            'Then the URL should contain "/programs"',
            'Given the user is on the dashboard',
            'When the user navigates to Add Pass and creates a new pass with fee details',
            'Then the URL should contain "/passes"',
            'Given the user is on the dashboard',
            'When the user navigates to Add Session and creates a new session with schedule and fees',
            'Then the URL should contain "/sessions"',
            'Given the user is on the dashboard',
            'When the user creates a seat-selection event with custom layout and publishes it',
            'Then the URL should contain "/events"',
            'Given the seat-selection event is published',
            'When the user navigates to the full catalog and opens the event offering',
            '  And fills in the seat quantity and completes cash checkout',
            'Then the seat booking should be completed successfully',
        ].join("\n"),
    },

    // ──────────────────────────────────────────────────────────────────────────
    // API TESTING — AUTHENTICATION
    // ──────────────────────────────────────────────────────────────────────────
    {
        name: "API Login Endpoint Verification",
        priority: "Medium",
        objective: "Verify that the API login endpoint accepts valid credentials and returns a valid HTTP response status code.",
        precondition: "API endpoint is accessible. Valid admin credentials are available.",
        gherkin: [
            'Given the API endpoint "/login" is accessible',
            'When a POST request is sent with valid admin email and password',
            'Then the response status code should be one of 200, 201, 302, or 405',
        ].join("\n"),
    },
    {
        name: "API Login with Invalid Credentials",
        priority: "Medium",
        objective: "Verify that the API login endpoint rejects invalid credentials and returns an appropriate error response.",
        precondition: "API endpoint is accessible.",
        gherkin: [
            'Given the API endpoint "/login" is accessible',
            'When a POST request is sent with invalid email "invalid_user@test.com" and password "WrongPassword123"',
            'Then the response status code should be one of 200, 302, 400, 401, 403, 404, or 405',
        ].join("\n"),
    },
    {
        name: "API Direct GET Login Page Verification",
        priority: "Low",
        objective: "Verify that a GET request to the login page returns HTTP 200 OK, confirming the page is accessible.",
        precondition: "API endpoint is accessible.",
        gherkin: [
            'Given the API base URL is configured',
            'When a GET request is sent to the "/login" endpoint',
            'Then the response status code should be 200',
        ].join("\n"),
    },

    // ──────────────────────────────────────────────────────────────────────────
    // API TESTING — USER MANAGEMENT
    // ──────────────────────────────────────────────────────────────────────────
    {
        name: "Create New User via API",
        priority: "Medium",
        objective: "Verify that a new user can be created via the API with full details including name, email, address, role, and organization.",
        precondition: "API is accessible. Organization exists in the system.",
        gherkin: [
            'Given the API is accessible and the target organization exists',
            'When a POST request is sent to create a user with first name, last name, email, address, city, state, zip code, phone, role, DOB, and organization',
            'Then the response status code should be less than 500',
            '  And the user should be provisioned in the system',
        ].join("\n"),
    },
    {
        name: "Fetch User List via API",
        priority: "Low",
        objective: "Verify that the user list can be retrieved via API filtered by organization.",
        precondition: "API is accessible. At least one user exists in the organization.",
        gherkin: [
            'Given the API is accessible',
            'When a GET request is sent to fetch users filtered by organization',
            'Then the response status code should be less than 500',
            '  And the response should contain user records',
        ].join("\n"),
    },
    {
        name: "Fetch Specific User Details by ID via API",
        priority: "Low",
        objective: "Verify that specific user details can be retrieved via API using user ID.",
        precondition: "API is accessible. A valid user ID exists.",
        gherkin: [
            'Given the API is accessible and a valid user ID is known',
            'When a GET request is sent to fetch user details by ID',
            'Then the response status code should be less than 500',
            '  And the response should contain the user details',
        ].join("\n"),
    },
    {
        name: "Update User Details via API",
        priority: "Medium",
        objective: "Verify that user details (name, phone number) can be updated via API using user ID.",
        precondition: "API is accessible. A valid user ID exists with modifiable fields.",
        gherkin: [
            'Given the API is accessible and a valid user ID is known',
            'When a PUT request is sent to update the user first name and phone number',
            'Then the response status code should be less than 500',
            '  And the user details should be updated in the system',
        ].join("\n"),
    },

    // ──────────────────────────────────────────────────────────────────────────
    // API TESTING — OFFERINGS & RESOURCES
    // ──────────────────────────────────────────────────────────────────────────
    {
        name: "Create Program Offering via API",
        priority: "Medium",
        objective: "Verify that a new program offering can be created via API with name, organization, connected resource, max attendance, and fee details.",
        precondition: "API is accessible. Organization and connected resource exist.",
        gherkin: [
            'Given the API is accessible and the target organization exists',
            'When a POST request is sent to create a program with name, organization, connected resource, max attendance, and fee details',
            'Then the response status code should be less than 500',
            '  And the program offering should be created in the system',
        ].join("\n"),
    },
    {
        name: "Fetch Program Offerings via API",
        priority: "Low",
        objective: "Verify that program offerings can be retrieved via API.",
        precondition: "API is accessible. At least one program offering exists.",
        gherkin: [
            'Given the API is accessible',
            'When a GET request is sent to fetch program offerings',
            'Then the response status code should be less than 500',
            '  And the response should contain program offering records',
        ].join("\n"),
    },
    {
        name: "Create Pass Offering via API",
        priority: "Medium",
        objective: "Verify that a new pass offering can be created via API with pass type, level, punch count, and fee details.",
        precondition: "API is accessible. Organization exists. Pass types and levels are configured.",
        gherkin: [
            'Given the API is accessible and the target organization exists',
            'When a POST request is sent to create a pass with name, pass type, pass level, number of punches, organization, and fee details',
            'Then the response status code should be less than 500',
            '  And the pass offering should be created in the system',
        ].join("\n"),
    },
    {
        name: "Fetch Pass Offerings via API",
        priority: "Low",
        objective: "Verify that pass offerings can be retrieved via API.",
        precondition: "API is accessible. At least one pass offering exists.",
        gherkin: [
            'Given the API is accessible',
            'When a GET request is sent to fetch pass offerings',
            'Then the response status code should be less than 500',
            '  And the response should contain pass offering records',
        ].join("\n"),
    },
    {
        name: "Create Event Offering via API",
        priority: "Medium",
        objective: "Verify that a new event offering can be created via API with event name, connected resource, attendance limits, and organization.",
        precondition: "API is accessible. Organization and connected resource exist.",
        gherkin: [
            'Given the API is accessible and the target organization exists',
            'When a POST request is sent to create an event with name, connected resource, max attendance, user ticket limit, family ticket limit, and organization',
            'Then the response status code should be less than 500',
            '  And the event offering should be created in the system',
        ].join("\n"),
    },
    {
        name: "Create Resource via API",
        priority: "Medium",
        objective: "Verify that a new resource can be created via API with name, connected resource, and organization.",
        precondition: "API is accessible. Organization and connected resource exist.",
        gherkin: [
            'Given the API is accessible and the target organization exists',
            'When a POST request is sent to create a resource with name, connected resource, and organization',
            'Then the response status code should be less than 500',
            '  And the resource should be created in the system',
        ].join("\n"),
    },
];


// ══════════════════════════════════════════════════════════════════════════════
// API HELPER FUNCTIONS
// ══════════════════════════════════════════════════════════════════════════════

function getHeaders(): Record<string, string> {
    return {
        "Authorization": `Bearer ${ZEPHYR_TOKEN}`,
        "Content-Type": "application/json",
    };
}

async function sleep(seconds: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, seconds * 1000));
}

async function apiGet<T = any>(endpoint: string, params?: Record<string, string | number>): Promise<{ status: number; data: T; text: string }> {
    const url = new URL(`${BASE_URL}${endpoint}`);
    if (params) {
        Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, String(v)));
    }

    const resp = await fetch(url.toString(), { method: "GET", headers: getHeaders() });
    await sleep(DELAY);

    const text = await resp.text();
    let data: T;
    try { data = JSON.parse(text); } catch { data = text as unknown as T; }

    return { status: resp.status, data, text };
}

async function apiPost<T = any>(endpoint: string, payload: unknown): Promise<{ status: number; data: T; text: string }> {
    const resp = await fetch(`${BASE_URL}${endpoint}`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(payload),
    });
    await sleep(DELAY);

    const text = await resp.text();
    let data: T;
    try { data = JSON.parse(text); } catch { data = text as unknown as T; }

    return { status: resp.status, data, text };
}

async function apiPut<T = any>(endpoint: string, payload: unknown): Promise<{ status: number; data: T; text: string }> {
    const resp = await fetch(`${BASE_URL}${endpoint}`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify(payload),
    });
    await sleep(DELAY);

    const text = await resp.text();
    let data: T;
    try { data = JSON.parse(text); } catch { data = text as unknown as T; }

    return { status: resp.status, data, text };
}

async function apiDelete(endpoint: string): Promise<{ status: number; text: string }> {
    const resp = await fetch(`${BASE_URL}${endpoint}`, {
        method: "DELETE",
        headers: getHeaders(),
    });
    await sleep(DELAY);

    const text = await resp.text();
    return { status: resp.status, text };
}


// ══════════════════════════════════════════════════════════════════════════════
// FOLDER RESOLUTION
// ══════════════════════════════════════════════════════════════════════════════

async function getFolderId(projectKey: string, folderName: string): Promise<number | null> {
    console.log(`\n🔍 Searching for folder '${folderName}' in project '${projectKey}'...`);

    let startAt = 0;
    const maxResults = 50;

    while (true) {
        const { status, data } = await apiGet<ZephyrPaginatedResponse<any>>("/folders", {
            projectKey,
            folderType: "TEST_CASE",
            startAt,
            maxResults,
        });

        if (status !== 200) {
            console.log(`   ❌ Failed to fetch folders: ${status}`);
            return null;
        }

        const values = data.values || [];

        for (const folder of values) {
            if ((folder.name || "").trim().toLowerCase() === folderName.trim().toLowerCase()) {
                const folderId = folder.id;
                console.log(`   ✅ Found folder '${folderName}' → ID: ${folderId}`);
                return folderId;
            }
        }

        if (data.isLast || values.length === 0) break;
        startAt += maxResults;
    }

    console.log(`   ❌ Folder '${folderName}' not found in project '${projectKey}'.`);
    console.log(`   💡 Create this folder in Zephyr Scale → Test Cases → Folders before running the script.`);
    return null;
}


// ══════════════════════════════════════════════════════════════════════════════
// PRIORITY MAPPING
// ══════════════════════════════════════════════════════════════════════════════

async function buildPriorityMap(projectKey: string): Promise<PriorityMap> {
    console.log("\n🔍 Building priority mapping...");

    const { status, data } = await apiGet<ZephyrPaginatedResponse<any>>("/priorities", { projectKey });

    if (status !== 200) {
        console.log(`   ⚠ Failed to fetch priorities: ${status}. Using defaults.`);
        return { High: "High", Medium: "Normal", Low: "Low" };
    }

    const values = data.values || [];
    const priorityMap: PriorityMap = {};

    for (const p of values) {
        const name = p.name || "";
        const nameLower = name.toLowerCase();
        if (nameLower.includes("high")) priorityMap["High"] = name;
        else if (nameLower.includes("normal") || nameLower.includes("medium")) priorityMap["Medium"] = name;
        else if (nameLower.includes("low")) priorityMap["Low"] = name;
    }

    // Fallback defaults
    if (!priorityMap["High"]) priorityMap["High"] = "High";
    if (!priorityMap["Medium"]) priorityMap["Medium"] = "Normal";
    if (!priorityMap["Low"]) priorityMap["Low"] = "Low";

    console.log(`   ✅ Priority mapping:`, priorityMap);
    return priorityMap;
}


// ══════════════════════════════════════════════════════════════════════════════
// FETCH EXISTING TEST CASES
// ══════════════════════════════════════════════════════════════════════════════

async function fetchExistingCases(projectKey: string, folderId: number): Promise<Map<string, ZephyrTestCase>> {
    console.log(`\n📥 Fetching existing test cases from folder ID ${folderId}...`);

    const existing = new Map<string, ZephyrTestCase>();
    let startAt = 0;
    const maxResults = 50;

    while (true) {
        const { status, data } = await apiGet<ZephyrPaginatedResponse<ZephyrTestCase>>("/testcases", {
            projectKey,
            folderId,
            startAt,
            maxResults,
        });

        if (status !== 200) {
            console.log(`   ❌ Failed to fetch test cases: ${status}`);
            return existing;
        }

        const values = data.values || [];

        for (const tc of values) {
            const key = (tc.name || "").trim().toLowerCase();
            existing.set(key, tc);
        }

        if (data.isLast || values.length === 0) break;
        startAt += maxResults;
    }

    console.log(`   ✅ Found ${existing.size} existing test case(s) in the folder.`);
    return existing;
}


// ══════════════════════════════════════════════════════════════════════════════
// CREATE TEST CASE
// ══════════════════════════════════════════════════════════════════════════════

async function createTestCase(
    testCase: TestCaseDefinition,
    projectKey: string,
    folderId: number,
    priorityMap: PriorityMap
): Promise<string | null> {
    const priorityName = priorityMap[testCase.priority] || "Normal";

    // Phase 1: Create the base test case metadata
    const payload = {
        projectKey,
        name: testCase.name,
        objective: testCase.objective || "",
        precondition: testCase.precondition || "",
        priorityName,
        statusName: "Draft",
        folderId,
    };

    const { status, data, text } = await apiPost<ZephyrTestCase>("/testcases", payload);

    if (status !== 200 && status !== 201) {
        console.log(`   ❌ CREATE FAILED: ${status} — ${text}`);
        return null;
    }

    const tcKey = (data as any).key || "UNKNOWN";

    // Phase 2: Attach BDD/Gherkin test script
    if (testCase.gherkin) {
        const scriptPayload = {
            type: "bdd",
            text: testCase.gherkin,
        };
        const scriptResp = await apiPost(`/testcases/${tcKey}/testscript`, scriptPayload);

        if (scriptResp.status !== 200 && scriptResp.status !== 201) {
            console.log(`   ⚠ Script attach failed for ${tcKey}: ${scriptResp.status} — ${scriptResp.text}`);
        }
    }

    return tcKey;
}


// ══════════════════════════════════════════════════════════════════════════════
// UPDATE TEST CASE
// ══════════════════════════════════════════════════════════════════════════════

async function updateTestCase(
    testCase: TestCaseDefinition,
    existingTc: ZephyrTestCase,
    priorityMap: PriorityMap
): Promise<boolean> {
    const tcKey = existingTc.key || "";
    const priorityName = priorityMap[testCase.priority] || "Normal";

    const remoteObjective = (existingTc.objective || "").trim();
    const remotePrecondition = (existingTc.precondition || "").trim();
    const localObjective = (testCase.objective || "").trim();
    const localPrecondition = (testCase.precondition || "").trim();

    // Check if metadata has changed
    if (remoteObjective === localObjective && remotePrecondition === localPrecondition) {
        return false; // No changes, skip
    }

    // Update metadata
    const payload = {
        name: testCase.name,
        objective: localObjective,
        precondition: localPrecondition,
        priorityName,
    };

    const { status, text } = await apiPut(`/testcases/${tcKey}`, payload);

    if (status !== 200 && status !== 201) {
        console.log(`   ⚠ UPDATE metadata failed for ${tcKey}: ${status} — ${text}`);
        return false;
    }

    // Also update the BDD script
    if (testCase.gherkin) {
        const scriptPayload = {
            type: "bdd",
            text: testCase.gherkin,
        };
        const scriptResp = await apiPost(`/testcases/${tcKey}/testscript`, scriptPayload);
        if (scriptResp.status !== 200 && scriptResp.status !== 201) {
            console.log(`   ⚠ Script update failed for ${tcKey}: ${scriptResp.status}`);
        }
    }

    return true;
}


// ══════════════════════════════════════════════════════════════════════════════
// DELETE ALL CASES IN FOLDER (Clean Mode)
// ══════════════════════════════════════════════════════════════════════════════

async function deleteAllCases(existingCases: Map<string, ZephyrTestCase>): Promise<number> {
    console.log(`\n🧹 Clean Mode: Attempting to delete ${existingCases.size} test case(s)...`);

    let deleted = 0;
    let failed = 0;

    for (const [, tc] of existingCases) {
        const tcKey = tc.key || "";
        const { status } = await apiDelete(`/testcases/${tcKey}`);

        if (status === 200 || status === 204) {
            deleted++;
            console.log(`   🗑 Deleted: ${tcKey} — ${tc.name || ""}`);
        } else {
            failed++;
            if (status === 405) {
                console.log(`   ⚠ Cannot delete ${tcKey} (405 Method Not Allowed). Use Zephyr UI Archive instead.`);
            } else {
                console.log(`   ❌ Delete failed for ${tcKey}: ${status}`);
            }
        }
    }

    console.log(`\n   📊 Deleted: ${deleted} | Failed: ${failed}`);

    if (failed > 0) {
        console.log("   ⚠ Falling back to standard update/skip mode for remaining cases.");
    }

    return deleted;
}


// ══════════════════════════════════════════════════════════════════════════════
// DIAGNOSE MODE
// ══════════════════════════════════════════════════════════════════════════════

async function diagnoseTestCase(testCaseKey: string): Promise<void> {
    console.log(`\n🔬 Diagnosing test case: ${testCaseKey}`);

    // Fetch test case metadata
    const { status, data } = await apiGet(`/testcases/${testCaseKey}`);

    if (status !== 200) {
        console.log(`   ❌ Failed to fetch test case: ${status}`);
        return;
    }

    console.log(`\n📋 Test Case Metadata:`);
    console.log(JSON.stringify(data, null, 2));

    // Fetch test script
    const scriptResp = await apiGet(`/testcases/${testCaseKey}/testscript`);

    if (scriptResp.status === 200) {
        console.log(`\n📜 Test Script:`);
        console.log(JSON.stringify(scriptResp.data, null, 2));
    } else {
        console.log(`\n   ⚠ No test script found: ${scriptResp.status}`);
    }
}


// ══════════════════════════════════════════════════════════════════════════════
// MAIN SYNCHRONIZATION PIPELINE
// ══════════════════════════════════════════════════════════════════════════════

async function runSync(cleanMode: boolean = false): Promise<void> {
    console.log("=".repeat(70));
    console.log("  ZEPHYR SCALE — Automated Test Case Synchronization");
    console.log(`  Project: ${PROJECT_KEY}  |  Folder: ${FOLDER_NAME}`);
    console.log(`  Total local cases: ${TEST_CASES.length}`);
    console.log("=".repeat(70));

    // Step 1: Resolve folder ID
    const folderId = await getFolderId(PROJECT_KEY, FOLDER_NAME);
    if (folderId === null) {
        console.log("\n💥 Aborting: Target folder not found.");
        process.exit(1);
    }

    // Step 2: Build priority map
    const priorityMap = await buildPriorityMap(PROJECT_KEY);

    // Step 3: Fetch existing cases
    let existingCases = await fetchExistingCases(PROJECT_KEY, folderId);

    // Step 4: Clean mode — delete first
    if (cleanMode) {
        await deleteAllCases(existingCases);
        // Re-fetch after deletion
        existingCases = await fetchExistingCases(PROJECT_KEY, folderId);
    }

    // Step 5: Sync each local test case
    console.log(`\n🔄 Synchronizing ${TEST_CASES.length} test case(s)...\n`);

    const stats = { CREATED: 0, UPDATED: 0, SKIPPED: 0, ERROR: 0 };
    const results: SyncResult[] = [];

    for (let i = 0; i < TEST_CASES.length; i++) {
        const testCase = TEST_CASES[i];
        const caseName = testCase.name;
        const caseKeyLower = caseName.trim().toLowerCase();
        const idx = String(i + 1).padStart(2, "0");

        console.log(`  [${idx}/${TEST_CASES.length}] ${caseName}`);

        let status: SyncResult["status"];
        let tcKey: string;

        if (existingCases.has(caseKeyLower)) {
            // Case exists remotely — check for updates
            const existingTc = existingCases.get(caseKeyLower)!;
            const wasUpdated = await updateTestCase(testCase, existingTc, priorityMap);

            if (wasUpdated) {
                status = "UPDATED";
                tcKey = existingTc.key || "N/A";
                console.log(`         → 🔄 UPDATED (${tcKey})`);
            } else {
                status = "SKIPPED";
                tcKey = existingTc.key || "N/A";
                console.log(`         → ⏭ SKIPPED (${tcKey}) — no changes`);
            }
        } else {
            // Case does not exist remotely — create it
            const createdKey = await createTestCase(testCase, PROJECT_KEY, folderId, priorityMap);

            if (createdKey) {
                status = "CREATED";
                tcKey = createdKey;
                console.log(`         → ✅ CREATED (${tcKey})`);
            } else {
                status = "ERROR";
                tcKey = "N/A";
                console.log(`         → ❌ ERROR`);
            }
        }

        stats[status]++;
        results.push({ name: caseName, key: tcKey, status });
    }

    // Step 6: Execution summary
    console.log("\n" + "=".repeat(70));
    console.log("  EXECUTION SUMMARY");
    console.log("=".repeat(70));
    console.log(`  ✅ CREATED:  ${stats.CREATED}`);
    console.log(`  🔄 UPDATED:  ${stats.UPDATED}`);
    console.log(`  ⏭ SKIPPED:  ${stats.SKIPPED}`);
    console.log(`  ❌ ERROR:    ${stats.ERROR}`);
    console.log(`  📊 TOTAL:    ${stats.CREATED + stats.UPDATED + stats.SKIPPED + stats.ERROR}`);
    console.log("=".repeat(70));

    // Detailed results table
    const pad = (s: string, n: number) => s.padEnd(n);
    console.log(`\n${pad("Status", 10)} ${pad("Key", 15)} Test Case Name`);
    console.log("-".repeat(70));
    for (const r of results) {
        console.log(`  ${pad(r.status, 10)} ${pad(r.key, 15)} ${r.name}`);
    }

    console.log("\n✨ Synchronization complete.\n");
}


// ══════════════════════════════════════════════════════════════════════════════
// CLI ENTRY POINT
// ══════════════════════════════════════════════════════════════════════════════

async function main(): Promise<void> {
    const args = process.argv.slice(2);

    // Parse CLI arguments
    const cleanMode = args.includes("--clean");
    const diagnoseIdx = args.indexOf("--diagnose");
    const diagnoseKey = diagnoseIdx !== -1 ? args[diagnoseIdx + 1] : null;

    // Show help
    if (args.includes("--help") || args.includes("-h")) {
        console.log(`
Zephyr Scale — Automated BDD/Gherkin Test Case Synchronization

Usage:
  npx tsx zephyr_sync.ts                          # Standard sync (recommended)
  npx tsx zephyr_sync.ts --clean                  # Delete & recreate all cases
  npx tsx zephyr_sync.ts --diagnose NET-T1234     # Inspect a specific test case
  npx tsx zephyr_sync.ts --help                   # Show this help message

Configuration:
  Update ZEPHYR_TOKEN, PROJECT_KEY, and FOLDER_NAME at the top of this script.
`);
        process.exit(0);
    }

    // Validate token
    if (ZEPHYR_TOKEN === "YOUR_ZEPHYR_API_TOKEN_HERE") {
        console.log("\n❌ Error: ZEPHYR_TOKEN is not configured!");
        console.log("   Please update the ZEPHYR_TOKEN constant at the top of this script");
        console.log("   with your Zephyr Scale API Bearer token.");
        console.log("\n   To generate a token:");
        console.log("   1. Log in to Atlassian → Click your profile avatar");
        console.log("   2. Select 'Zephyr API Access Tokens'");
        console.log("   3. Click 'Create Token' and copy the generated hash");
        process.exit(1);
    }

    if (diagnoseKey) {
        await diagnoseTestCase(diagnoseKey);
    } else {
        await runSync(cleanMode);
    }
}

main().catch((err) => {
    console.error("\n💥 Fatal error:", err);
    process.exit(1);
});
