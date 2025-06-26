## 6. Reusable Functions & Utilities

Centralizing common logic into reusable functions is a foundational principle of
modular and maintainable software design. This approach significantly reduces
code duplication, improves testability, and makes the codebase easier to
understand and scale, directly contributing to the "production-ready" goal. All
these functions will reside in `src/lib/server` and be imported into relevant
`+page.server.ts` files or other server-side modules.

- `generateImage(prompt: string): Promise<string>`
  - **Purpose:** Handles the core logic of invoking Amazon Bedrock for image
    generation, performing content moderation, and uploading the resulting image
    to S3.
  - **Consumption:** Primarily used by `/generate/+page.server.ts` and
    potentially by a future batch generation page.
  - **Details:** Encapsulates AWS SDK calls for Bedrock and S3, and integrates
    the `moderateImage` function.

- `getTrends(): Promise<string[]>`
  - **Purpose:** Fetches real-time social media trends from configured external
    APIs (e.g., Glimpse, Apify) and caches them in the database.
  - **Consumption:** Used by `/generate/+page.server.ts` (for style suggestions)
    and `/trends/+page.server.ts` (for displaying trends).
  - **Details:** Manages API calls, error handling for external services, and
    database caching logic.

- `getStyleSuggestions(): Promise<string[]>`
  - **Purpose:** Maps the fetched social media trends to a curated list of image
    styles relevant to generative AI.
  - **Consumption:** Used by `/generate/+page.server.ts` to populate the style
    selection dropdown.
  - **Details:** Contains the mapping logic from trend keywords to visual
    styles.

- `moderateImage(imageBuffer: Buffer): Promise<boolean>`
  - **Purpose:** Analyzes an image buffer for inappropriate content using AWS
    Rekognition.
  - **Consumption:** Called by `generateImage` before an image is stored or
    displayed.
  - **Details:** Performs the Rekognition API call and interprets the moderation
    labels.

- `saveFeedback(imageId: number, rating: number, comment?: string): Promise<void>`
  - **Purpose:** Stores user feedback (ratings and optional comments) for
    generated images in the database.
  - **Consumption:** Used by an API route (e.g.,
    `src/routes/api/feedback/+server.ts`) which is invoked from the client-side
    after image generation.
  - **Details:** Handles database interaction with Prisma for the `Feedback`
    model.

- `logError(error: Error, context: Record<string, unknown>): void`
  - **Purpose:** A centralized utility for logging errors across the server-side
    application.
  - **Consumption:** Used throughout `+page.server.ts` files and other server
    utilities for consistent error reporting.
  - **Details:** Provides structured logging for easier debugging and monitoring
    in a production environment.