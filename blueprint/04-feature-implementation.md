## 4. Feature Implementation Details

This section outlines the detailed implementation strategy for SocialCraft's core
features, emphasizing server-side logic and robust AWS integrations.

### AI Image Generation Pipeline

The central functionality of SocialCraft is the generation of images from text
prompts, tailored by social media trends.

**Goal & Approach:** The primary goal is to generate high-quality, trend-aware
images from user-provided text prompts, utilizing Amazon Bedrock. The generated
images will then be uploaded to S3 and undergo content moderation via AWS
Rekognition before being presented to the user. All core logic for image
generation, moderation, and storage will reside server-side within
`+page.server.ts` or reusable server utility functions for enhanced security and
performance.

**SvelteKit Implementation:**

- User input (prompt, style selection) will be submitted from the frontend
  (`/generate/+page.svelte`) to the server via a SvelteKit form action
  (`/generate/+page.server.ts`).
- The `actions` function in `+page.server.ts` will handle the invocation of the
  image generation and moderation logic. This ensures that sensitive API keys
  and heavy computational tasks remain on the server, preventing exposure to the
  client and improving perceived performance.

**AWS Bedrock & S3 Integration (Demo Code):** The `generateImage` function
(located in `src/lib/server/imageGenerator.ts`) will encapsulate the logic for
interacting with Amazon Bedrock and S3. It will instantiate `BedrockClient` and
use `InvokeModelCommand` to send the prompt to a chosen model, such as
`stability.stable-diffusion-xl-v1`. The response, containing the image buffer,
will then be processed.

```typescript
// src/lib/server/imageGenerator.ts
import { BedrockClient, InvokeModelCommand } from "@aws-sdk/client-bedrock";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { moderateImage } from "./moderation"; // Import moderation function

const bedrockClient = new BedrockClient({ region: process.env.AWS_REGION });
const s3Client = new S3Client({ region: process.env.AWS_REGION });

export async function generateImage(prompt: string): Promise<string> {
  try {
    const command = new InvokeModelCommand({
      modelId: "stability.stable-diffusion-xl-v1", // Using Stable Diffusion XL as specified
      contentType: "application/json",
      accept: "image/png", // Request PNG format
      body: JSON.stringify({
        text_prompts: [{ text: prompt }],
        cfg_scale: 7, // Example parameter for quality
        seed: 0, // Example parameter for reproducibility
        steps: 30, // Example parameter for generation steps
      }),
    });

    const response = await bedrockClient.send(command);
    const imageBuffer = Buffer.from(response.body as Uint8Array); // Type assertion for SDK response

    // Proactive security measure: Moderate content before storage
    const isSafe = await moderateImage(imageBuffer);
    if (!isSafe) {
      throw new Error("Generated image contains inappropriate content.");
    }

    const imageKey = `images/${Date.now()}-${
      Math.random().toString(36).substring(2, 15)
    }.png`;
    const s3UploadCommand = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: imageKey,
      Body: imageBuffer,
      ContentType: "image/png",
      ACL: "public-read", // Make image publicly accessible (consider pre-signed URLs for private access)
    });

    await s3Client.send(s3UploadCommand);
    return `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${imageKey}`;
  } catch (error) {
    console.error("Error generating or uploading image:", error);
    throw new Error("Failed to generate image. Please try again.");
  }
}
```

### Real-Time Trend Aggregation

Providing real-time social media trends is crucial for the "trend-aware" aspect
of SocialCraft.

**Goal & Approach:** The objective is to fetch current social media trends to
guide image style suggestions and general content creation. These trends will be
aggregated from external APIs and cached in the PostgreSQL database via Prisma
to minimize API calls and improve response times.

**API Choices:**

- **Google Trends:** There is no official Google Trends API. Therefore,
  third-party services that scrape Google Trends data must be considered.
  - **Glimpse API:** Glimpse claims to provide reliable access to search trend
    data that matches Google Trends, converting relative indices into real
    search volume. It emphasizes accuracy and real-time data, which are critical
    for SocialCraft.
  - **Scrapingdog Google Trends API:** This service offers a Google Trends API
    designed to get insights from current trends globally, with features like
    precise trend tracking and comprehensive data extraction. It operates on a
    credit-based system with various subscription plans.
- **Reddit Trends:**
  - **Apify Reddit Trends Scraper:** This tool can extract trending posts and
    discussions from Reddit, including post titles, URLs, upvotes, comments,
    subreddit details, and author information. It handles dynamic content
    loading and supports proxy configurations for reliable scraping. This is a
    viable option for Reddit trends.

**Considerations:** The reliance on third-party scrapers for Google Trends
introduces a critical dependency risk and potential cost burden. The accuracy
and stability of the "real-time" aspect of trend aggregation will be highly
dependent on these external services, which could impact the project's long-term
viability and data quality. Careful monitoring of API costs and reliability will
be necessary.

**SvelteKit Implementation:**

- The `getTrends` function (in `src/lib/server/trends.ts`) will orchestrate
  fetching trends from these external APIs.
- This function will be called by `+page.server.ts` files (e.g.,
  `/generate/+page.server.ts`, `/trends/+page.server.ts`) to populate
  trend-related UI elements.

**Prisma Integration:** Trends fetched from external APIs will be cached in the
`Trend` model in the RDS database using Prisma. A timestamp will be stored to
ensure trends are updated periodically (e.g., hourly) to maintain freshness
while avoiding excessive API calls to third-party services.

```typescript
// src/lib/server/trends.ts
import axios from "axios";
import prisma from "$lib/prisma"; // Re-using the Prisma client

interface TrendItem {
  name: string;
  source: string;
}

export async function getTrends(): Promise<string[]> {
  const CACHE_DURATION_MS = 3600000; // 1 hour

  // Check for cached trends
  const cachedTrends = await prisma.trend.findMany({
    where: {
      updatedAt: { gte: new Date(Date.now() - CACHE_DURATION_MS) },
    },
    orderBy: { updatedAt: "desc" },
  });

  if (cachedTrends.length > 0) {
    return cachedTrends.map((t) => t.name);
  }

  // Fetch from external APIs if cache is stale or empty
  let allTrends: TrendItem[] = [];

  // Example: Fetch from a hypothetical Glimpse API for Google Trends
  try {
    const glimpseResponse = await axios.get("https://api.glimpse.com/trends", {
      params: { geo: "US", resolution: "daily" },
      headers: { "X-API-Key": process.env.GLIMPSE_API_KEY },
    });
    if (glimpseResponse.data && glimpseResponse.data.trends) {
      allTrends.push(
        ...glimpseResponse.data.trends.map((t: any) => ({
          name: t.keyword,
          source: "Google Trends",
        })),
      );
    }
  } catch (error) {
    console.error("Error fetching Google Trends from Glimpse:", error);
  }

  // Example: Fetch from Apify Reddit Trends Scraper
  try {
    const apifyResponse = await axios.post(
      "https://api.apify.com/v2/acts/easyapi~reddit-trends-scraper/run-sync?token=" +
        process.env.APIFY_API_TOKEN,
      {
        maxItems: 20,
      },
    );
    if (
      apifyResponse.data && apifyResponse.data.output &&
      apifyResponse.data.output.posts
    ) {
      allTrends.push(
        ...apifyResponse.data.output.posts.map((p: any) => ({
          name: p.title,
          source: "Reddit",
        })),
      );
    }
  } catch (error) {
    console.error("Error fetching Reddit Trends from Apify:", error);
  }

  // Deduplicate and limit trends
  const uniqueTrends = Array.from(new Set(allTrends.map((t) => t.name))).slice(
    0,
    15,
  );

  // Store new trends in DB
  await prisma.trend.deleteMany({}); // Clear old trends
  await prisma.trend.createMany({
    data: uniqueTrends.map((name) => ({ name, updatedAt: new Date() })),
    skipDuplicates: true, // In case of concurrent updates
  });

  return uniqueTrends;
}
```

### Style Suggestions & Feedback Loop

To enhance the user experience and improve AI output, SocialCraft will provide
style suggestions based on trends and collect user feedback.

**Goal & Approach:** Dynamically suggest image styles (e.g., "Pastel," "Neon,"
"Vintage") based on the aggregated social media trends. Implement a mechanism
for users to rate generated images, providing valuable data to refine style
mapping and potentially fine-tune AI models in the future.

**SvelteKit Implementation:**

- The `getStyleSuggestions` function (in `src/lib/server/styles.ts`) will map
  fetched trends to predefined or dynamically generated style options. This
  function will be used to populate `<Select>` components on the `/generate`
  page.
- A `saveFeedback` function (in `src/lib/server/feedback.ts`) will handle
  storing user ratings and comments in the database. This function will be
  invoked from a client-side modal or component after an image is generated.

**Prisma Integration:** User feedback (image ID, rating, optional comment) will
be saved to the `Feedback` model in the PostgreSQL database using Prisma. This
data will be crucial for future analysis and potential AI model refinement.

```typescript
// src/lib/server/styles.ts
import { getTrends } from "./trends";

// A more sophisticated mapping could involve AI or a larger curated list
const styleMap: Record<string, string[]> = {
  // Example mappings: Trend keyword to suggested styles
  "AI Art": ["Cyberpunk", "Digital Painting", "Abstract"],
  "Gaming": ["Pixel Art", "Isometric", "Vaporwave"],
  "Fashion": ["Minimalist", "Editorial", "Vintage"],
  "Travel": ["Landscape Photography", "Watercolor", "Sketch"],
  "Food": ["Food Photography", "Illustrative", "Macro Photography"],
  // Default styles if no specific trend match
  "Default": ["Photorealistic", "Cartoon", "Watercolor", "Oil Painting"],
};

export async function getStyleSuggestions(): Promise<string[]> {
  const trends = await getTrends();
  let suggestedStyles: Set<string> = new Set();

  trends.forEach((trend) => {
    // Simple keyword matching for demonstration
    const matchedStyles = Object.keys(styleMap).find((key) =>
      trend.toLowerCase().includes(key.toLowerCase())
    );
    if (matchedStyles) {
      styleMap[matchedStyles].forEach((style) => suggestedStyles.add(style));
    }
  });

  if (suggestedStyles.size === 0) {
    // If no trends match, fall back to default styles
    styleMap["Default"].forEach((style) => suggestedStyles.add(style));
  }

  return Array.from(suggestedStyles);
}
```

```typescript
// src/lib/server/feedback.ts
import prisma from "$lib/prisma";

export async function saveFeedback(
  imageId: number,
  rating: number,
  comment?: string,
): Promise<void> {
  try {
    await prisma.feedback.create({
      data: {
        imageId,
        rating,
        comment,
      },
    });
  } catch (error) {
    console.error("Error saving feedback:", error);
    throw new Error("Failed to save feedback.");
  }
}
```

### Content Moderation

Ensuring that generated content is appropriate and safe is a top priority for
SocialCraft.

**Goal & Approach:** Automatically filter inappropriate or harmful images using
AWS Rekognition's content moderation capabilities. This check will occur
immediately after image generation by Bedrock and before the image is stored in
S3 or displayed to the user.

**SvelteKit Implementation:** The `moderateImage` function (in
`src/lib/server/moderation.ts`) will be called within the `generateImage`
pipeline. If moderation flags are detected, the image will be rejected,
preventing its storage and display. This integration within the image generation
flow is a proactive security measure that minimizes the storage of potentially
harmful content and significantly reduces legal and reputational risks. This
demonstrates a "security-by-design" approach, which is crucial for any platform
handling user-generated or AI-generated content.

**AWS Rekognition Integration (Demo Code):** The `moderateImage` function will
instantiate `RekognitionClient` and use `DetectModerationLabelsCommand` to
analyze the image buffer. The presence of any moderation labels will indicate
inappropriate content.

```typescript
// src/lib/server/moderation.ts
import {
  DetectModerationLabelsCommand,
  RekognitionClient,
} from "@aws-sdk/client-rekognition";

const rekognitionClient = new RekognitionClient({
  region: process.env.AWS_REGION,
});

export async function moderateImage(imageBuffer: Buffer): Promise<boolean> {
  try {
    const command = new DetectModerationLabelsCommand({
      Image: { Bytes: imageBuffer },
    });
    const response = await rekognitionClient.send(command);
    // If ModerationLabels array is empty, content is considered safe
    return response.ModerationLabels?.length === 0;
  } catch (error) {
    console.error("Error during image moderation:", error);
    // In case of an error with Rekognition, default to unsafe or handle based on policy
    // For production, consider logging and alerting for such failures.
    return false; // Fail safe: assume unsafe if moderation fails
  }
}
```

### API Endpoints Summary

A clear overview of the primary API endpoints and their functionalities is
essential for development and debugging.

| Route | Method | Purpose | Server-side Logic | Client-side Interaction |
| :--- | :--- | :--- | :--- | :--- |
| `/generate` | `POST` | Generate an AI image based on prompt and style. | `actions` function in `+page.server.ts` calls `generateImage` (which includes `moderateImage`). | Form submission with prompt and style; displays generated image. |
| `/generate` | `GET` | Load the image generation page. | `load` function in `+page.server.ts` fetches trends and style suggestions. | Renders form with dynamic trend/style options. |
| `/gallery` | `GET` | Display a gallery of publicly available generated images. | `load` function in `+page.server.ts` fetches images from Prisma. | Renders image grid, handles pagination/lazy loading. |
| `/trends` | `GET` | Display aggregated social media trends. | `load` function in `+page.server.ts` calls `getTrends`. | Renders a list or cards of current trends. |
| `/api/feedback` | `POST` | Submit user feedback for a generated image. | Dedicated API route (e.g., `src/routes/api/feedback/+server.ts`) calls `saveFeedback`. | Modal or inline form for rating and comments. |