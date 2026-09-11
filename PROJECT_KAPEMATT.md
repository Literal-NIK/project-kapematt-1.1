# Project Kapematt

## 1. Project Overview

Project Kapematt is the digital catalog for Kapematt Supermarket, a single-location neighbourhood supermarket on Kacheliba Road, Makutano. The website helps retail shoppers and wholesale customers discover products, departments, offers, store services and contact information before visiting the store.

The current product boundary is deliberate:

- The website is a catalog and information service.
- It does not sell products online.
- It has no cart, checkout, online payment, delivery flow or order-management workflow.
- Customers browse online and complete purchases in the physical store.
- Retail prices are shown in Kenyan shillings (KES) where appropriate.
- Wholesale customers can view case sizes and minimum order quantities, but prices are requested by quotation.
- Browsing does not require an account.

The next development phase is the data layer. The app database will receive stock information from the company database at predetermined intervals and expose the latest approved catalog state to the front end. The same database phase will store email addresses from users who want to be notified when future account and online-shopping features become available.

## 2. Current Technical Shape

The project is a TypeScript React application built with TanStack Start and TanStack Router. Routes are file-based under `src/routes`. The UI uses reusable components under `src/components`, shared styling in `src/styles.css`, and catalog fixtures in `src/data/catalog.ts`.

### Current data flow

```text
src/data/catalog.ts
        |
        +--> home, catalog, offers, departments and product pages
        +--> bakery, deli, store, about and wholesale pages
        +--> prices, offers, stock labels, departments and store details
```

At present, the catalog file is the source of truth used by the front end. The product type already anticipates operational data such as base price, promotional price, offer expiry, stock state, pack size and wholesale terms. This makes it a useful contract for the database migration, but it is not yet a live integration with the company database.

Contact and cake-inquiry forms already call server functions in `src/lib/mail.functions.ts`. The account page currently provides a local, client-side interest confirmation; its email is not yet persisted to the planned database.

## 3. Requirements

### Business requirements

1. Present Kapematt's products, departments, offers and store services clearly.
2. Support both retail browsing and wholesale product discovery.
3. Show stock and offer information while making it clear that availability can change.
4. Direct customers to the physical store for purchase and collection.
5. Support questions, feedback, wholesale quote requests and bakery inquiries.
6. Avoid requiring registration for normal catalog browsing.
7. Capture interest from users who want future account or online-shop notifications.
8. Keep the architecture ready for a later online shop without pretending that checkout exists today.

### Functional requirements

- Home page with current store positioning, featured offers and department navigation.
- Searchable and filterable retail catalog.
- Department pages with subcategory filtering and offer highlights.
- Product detail pages with images, prices, stock status and product information.
- Weekly offers with department filtering and offer expiry information.
- Bakery page with fresh-today products and custom cake inquiries.
- Deli page with today's meals and counter products.
- Store page with address, hours, counter times, map and directions.
- Contact page for general, stock, wholesale, bakery and feedback topics.
- Wholesale catalog with case sizes, MOQs and quote-oriented product details.
- FAQ, terms and about pages.
- Optional account entry point that currently records notification interest rather than authenticating users.
- Responsive presentation, metadata, route-level error handling and a not-found experience.

## 4. Requirements Met

The current implementation substantially meets the presentation and catalog requirements:

- The site clearly communicates that it is catalog-only and has no checkout.
- Retail and wholesale browsing are separated through the site mode and wholesale routes.
- Product data includes retail pricing, promotional pricing, stock labels, offers, expiry values, product descriptions, ingredients, allergens, nutrition details and counter information where relevant.
- The catalog supports department, brand, price, stock and offer filtering, plus sorting.
- Department and product URLs are dynamic and provide not-found handling for invalid values.
- Offers have their own page, department filtering and visible expiry messaging.
- Bakery and deli have dedicated experiences instead of being treated only as generic product categories.
- The bakery includes a custom cake inquiry flow.
- The contact page sends messages through a server-side function and reports loading and error states.
- The store page provides address, opening hours, counter times, embedded directions and a directions link.
- The about and FAQ pages explain the supermarket model and answer key customer questions.
- The site includes wholesale browsing with case sizes, unit measures, minimum order quantities and quote-oriented calls to action.
- Shared header, footer, loading, reveal, gallery and product-card components establish a consistent site shell.
- Route metadata includes titles, descriptions and social preview fields; the FAQ page also exposes FAQ structured data.
- The root route provides not-found and error states with recovery actions.
- The account route explicitly says browsing does not require an account and presents a notify-me flow for future functionality.

These are front-end and interaction requirements. They should not be read as evidence that the site already has live stock synchronization, durable newsletter storage or user authentication.

## 5. Page-by-Page Website Guide

### `/` - Home

The primary discovery page. It presents the store proposition through a hero slideshow, links to weekly offers and departments, surfaces selected offer products, and progressively reveals the wider product feed. It is the main route for a first-time visitor.

### `/catalog` - Full retail catalog

The complete retail browsing view. Users can search by product name, brand or subcategory; filter by department, brand, price, availability and active offers; and sort the results. Product cards link to product detail pages. This route is currently backed by `src/data/catalog.ts` and is the main consumer of future synchronized stock data.

### `/departments/:slug` - Department catalog

A dynamic page for one of the supermarket's departments. It validates the department slug, displays the department description, filters products by subcategory, highlights active offers and links to other departments.

### `/product/:productId` - Retail product detail

A dynamic product page with image gallery, brand, pack size, stock indicator, offer status, retail price, unit price where applicable, description, preparation notes, ingredients, allergens, nutrition data and related products. It explicitly tells users that availability must be confirmed in store and that there is no online checkout.

### `/offers` - Weekly retail offers

Displays products with active promotions, offer labels and expiry times. Users can filter the offer list by department. Promotional pricing is presented as temporary and subject to stock availability.

### `/bakery` - Bakery counter

Showcases bakery products, fresh-today items, bakery counter hours and a custom cake inquiry form. The inquiry collects the customer's name, phone, requested date, serving count and notes, then sends it to the store through a server function.

### `/deli` - Deli counter

Showcases deli products, today's meals and their availability, plus counter hours. It is intended to help visitors decide what is available at the deli before visiting; it is not an ordering or reservation page.

### `/store` - Store information

Provides the physical address, opening hours, counter times, contact details, embedded map and an external directions link. This route is the bridge between online discovery and an in-store purchase.

### `/about` - About Kapematt

Explains the single-store operating model, daily restocking, on-site bakery and counter service, supplier and waste principles, and the wholesale offering.

### `/contact` - Contact the store

Provides direct contact details and a form for general questions, stock availability, wholesale quotes, bakery or custom-cake requests, and feedback or complaints. The form is submitted server-side and exposes success, busy and error states.

### `/faq` - Frequently asked questions

Answers the core customer questions: no online buying, price freshness, accounts, wholesale pricing, offer expiry, custom cakes and delivery. The route includes FAQ structured data for search engines.

### `/login` - Account interest / future account entry point

Despite its route name, this is not an authentication system. It explains that users can browse without an account and currently collects an email address so interested users can be notified when saved products, accounts or later online-shop capabilities launch. At present, the submitted email is only acknowledged in the browser and is not stored durably.

### `/notifications` - Store notices

A notices-oriented page for store updates, offer announcements and restock news. Its current content is derived from catalog offer data. The future notification system should use this area as a presentation surface for approved notices and subscriber communications.

### `/careers` - Careers

Presents current employment opportunities and application guidance for store roles such as bakery, deli, till and stock control. It is an information page rather than a full recruitment system.

### `/terms` - Terms and privacy information

Explains how the catalog operates, the limits of price and availability accuracy, and how user details are handled. This page must be updated when persistent email storage, notification consent and future accounts are introduced.

### `/admin` - Internal catalog view

An internal-facing route for reviewing product and pricing information. It should be treated as an operational or protected route before deployment. It is not a public customer checkout or inventory-management system.

## 6. Wholesale Routes

Wholesale has its own route group and does not imply online ordering.

### `/wholesale`

The wholesale landing page. It explains the bulk-buying proposition and directs customers to bulk catalog browsing, offers and quote requests.

### `/wholesale/catalog`

A wholesale version of the catalog. It focuses on case sizes, units, minimum order quantities and product discovery rather than retail shelf pricing.

### `/wholesale/product/:productId`

Wholesale detail for a product, including case information, MOQ and wholesale terms. Pricing is handled through quotation.

### `/wholesale/offers`

Displays bulk and repeat-order promotions, including terms such as fixed pricing periods or allocation for short-stock items. It is an offer-information page, not a wholesale checkout.

### `/wholesale/*` route shell

The wholesale route layout provides the shared parent structure for the wholesale pages. Future wholesale quote workflows should be added here without coupling them to retail checkout behavior.

## 7. Remaining Hurdles

### 7.1 Live catalog database

Replace the direct front-end dependency on `src/data/catalog.ts` with a database-backed catalog service. The database should store, at minimum:

- Stable product ID and SKU.
- Product name, brand, department and subcategory.
- Images and descriptive content.
- Pack size, unit of measure and wholesale case information.
- Base retail price and promotional price.
- Promotion label, start time and end time.
- Stock status or quantity-derived availability.
- Counter metadata for bakery and deli products.
- Publication status and last synchronization timestamp.
- Source-system identifier and source-system update timestamp.

The fixture file can remain as seed data, local fallback data or test data, but it should no longer be the production source of current stock information.

### 7.2 Company-database synchronization

Define and implement a scheduled import from the company database. The synchronization design needs explicit answers to these questions:

- What database engine and access protocol does the company system use?
- Is the integration read-only from the website's perspective?
- What is the agreed refresh interval: for example, every 5, 15 or 60 minutes?
- Which system owns product identity, price, promotion and stock values?
- How are discontinued products, renamed products and new SKUs handled?
- How are weighted products represented?
- What happens when the source is unavailable or sends incomplete data?
- Should the last known good snapshot remain visible during an outage?
- How will a partial import be prevented from replacing a valid full snapshot?

A robust first implementation should import into a staging area, validate the payload, record an import run, and publish a complete successful snapshot only after validation. It should be idempotent, observable and safe to retry.

### 7.3 Front-end read API and caching

Add a server-side data-access layer or API that reads the published catalog snapshot. The browser should not receive company-database credentials or connect directly to the operational source. Product and offer pages should use a controlled read path with caching, timeout handling and a clear stale-data policy.

The UI should expose a last-updated timestamp where this helps set expectations. It should continue to state that in-store availability is final because stock can change between scheduled imports and a customer's visit.

### 7.4 Account-interest email storage

The `/login` notify-me form must be connected to the new database. The next phase should:

1. Validate and normalize the email on the server.
2. Store a deduplicated subscriber record.
3. Record consent, purpose, created time, source route and notification status.
4. Return a generic success response without exposing whether an email already exists.
5. Rate-limit submissions and add abuse protection.
6. Provide an unsubscribe or deletion process.
7. Keep this interest list separate from future authenticated user accounts.

The current form should not be described as sign-in until authentication exists. Its product language should remain “notify me” or “register interest”.

### 7.5 Security and privacy

Before the database is used in production, add server-side validation, access controls, secret management, encrypted connections, audit logging and backups. The admin route must be protected or removed from the public deployment. Email retention, deletion, consent and notification practices must be reflected in the terms and privacy page and aligned with applicable data-protection obligations.

### 7.6 Operational reliability

Add monitoring for scheduled imports and customer-facing reads. At minimum, record:

- Import start, completion and failure.
- Number of records received, accepted, rejected and published.
- Source and destination timestamps.
- Last successful synchronization time.
- API latency and error rates.
- Stale-data age.

Create alerts for repeated import failures, unexpectedly small imports, missing prices, invalid stock states and stale published data.

### 7.7 Testing and rollout

The database phase needs tests for schema validation, mapping, idempotent upserts, offer expiry, stock-state conversion, partial imports, source outages and stale fallback behavior. Add route-level tests for catalog filters and product lookup against database responses.

Use a staged rollout:

1. Seed a development database from the current catalog fixture.
2. Run scheduled imports without changing the public read path.
3. Compare database results against the fixture and company source.
4. Enable database reads in a non-production environment.
5. Monitor synchronization and catalog correctness.
6. Switch production reads only after a successful rollback plan exists.
7. Retain the fixture as a controlled fallback until the new path is stable.

## 8. Future Online Shop Scope

An online shop is a separate phase, not an implicit part of the current catalog. It will require new capabilities and new business decisions:

- User accounts and secure authentication.
- Password reset or passwordless sign-in.
- Customer profile and consent management.
- Cart and checkout.
- Payment provider integration.
- Order creation, status and fulfillment.
- Inventory reservation, oversell handling and reconciliation.
- Delivery or collection rules.
- Refunds, cancellations and customer support workflows.
- Transactional email and notification preferences.
- Stronger audit, fraud and security controls.

The current account page should therefore be treated as a lead-capture and notification-interest entry point. It should not create user accounts, promise saved products, or imply that checkout is available.

## 9. Recommended Database-Phase Definition of Done

The next phase is complete when:

- The production catalog read path no longer depends on hard-coded fixture data.
- A scheduled, authenticated import retrieves company stock data at the agreed interval.
- Imports validate, stage, publish atomically and can be retried safely.
- The front end reads a published snapshot with documented caching and stale-data behavior.
- Product, price, offer and stock mappings are tested against representative source records.
- Import health and stale data are observable by the responsible team.
- The `/login` interest form stores deduplicated, consented email records server-side.
- Subscribers can be removed and notification status can be managed.
- The admin route and database credentials are protected.
- Terms and privacy documentation reflect the new data collected.
- The website still clearly communicates that it is catalog-only and that purchases happen in store.

## 10. Project Summary

Project Kapematt has a strong catalog and information foundation. The main remaining work is operational rather than visual: establish a reliable database boundary, synchronize approved stock data from the company system, make the front end read published catalog snapshots, and persist notification interest responsibly. Online shopping and user accounts should follow later as a separately scoped commerce project once the catalog data layer is reliable.
