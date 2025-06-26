## 2. Core Technology Stack & Setup

The foundation of SocialCraft is built upon a robust and modern technology stack,
carefully chosen for its performance, developer experience, and scalability.
This section details the core components and their integration.

### Architectural Diagram

The following Mermaid diagram illustrates the high-level interaction between the
various components of the SocialCraft application, from the frontend user
interface to the backend services and cloud infrastructure.

```mermaid
graph TD
    User[User Interface] --> SvelteKit
    SvelteKit --> Bun
    Bun --> Prisma
    Prisma --> PostgreSQL_RDS[PostgreSQL RDS]
    Bun -- "Image Generation Request" --> AWS_Bedrock[AWS Bedrock]
    AWS_Bedrock -- "Generated Image" --> Bun
    Bun -- "Image Upload" --> AWS_S3[AWS S3]
    Bun -- "Content Moderation" --> AWS_Rekognition[AWS Rekognition]
    AWS_Rekognition -- "Moderation Result" --> Bun
    Bun -- "Trend Aggregation" --> External_APIs[External APIs]
    External_APIs -- "Trend Data" --> Bun
    Bun -- "Image URL / Trends" --> SvelteKit
    SvelteKit -- "Feedback" --> Prisma
```

### Frontend Stack

The frontend of SocialCraft is engineered for a fast, responsive, and intuitive
user experience, leveraging the latest advancements in SvelteKit and its
ecosystem.

#### SvelteKit & Svelte 5 Runes

SocialCraft will be developed using **SvelteKit**, with a strong emphasis on
**Svelte 5's new Runes API** for managing reactivity. This approach ensures
explicit and predictable state management, leading to cleaner and more
maintainable code. All Svelte component `script` tags will utilize `lang='ts'`
to enforce TypeScript, enhancing code quality and developer productivity.

Svelte 5 introduces a new reactivity model centered around "runes," which are
compiler instructions designed to make reactivity more explicit. Unlike Svelte
4's implicit reactivity for top-level `let` declarations, Svelte 5 requires
`let count = $state(0);` for reactive state variables. This shift from implicit
to explicit reactivity represents a significant architectural choice, reducing
"magic" in the codebase and making the flow of data more transparent. This
clarity is particularly beneficial for complex applications and large teams, as
it improves predictability and debugging. While this change might introduce a
learning curve for developers accustomed to Svelte 4, the long-term benefits in
terms of code maintainability and TypeScript integration are substantial.

Derived state, previously handled by `$:`, will now use `$derived`. For example,
`let doubled = $derived(count * 2);` ensures that `doubled` automatically
updates whenever `count` changes. Side effects, which were also managed by `$:`,
will now be explicitly declared using `$effect(() => { /*... */ });`. This
separation of concerns for derivations and effects leads to more focused and
understandable reactive blocks. Component properties will be declared using the
`$props` rune, allowing for destructuring and default values, such as
`let { greeting = 'Hello!' } = $props();`. This modernizes prop handling and
aligns with contemporary JavaScript patterns. Furthermore, event dispatchers are
deprecated in Svelte 5, with a move towards more direct event attributes for DOM
elements (e.g., `onclick` instead of `on:click`) and snippets for slot content.

#### Tailwind CSS v4 Integration

**Tailwind CSS** will be integrated for utility-first styling, providing a
highly customizable and efficient styling workflow. The project will leverage
Tailwind CSS v4, utilizing the `@tailwindcss/vite` plugin for seamless
integration with SvelteKit's Vite build process. The `tailwind.config.js` file
will be customized to define the application's design system, including the
color palette and typography.

The integration involves adding `@tailwindcss/vite` to `vite.config.ts`. A
central `src/app.css` file will import Tailwind CSS using
`@import "tailwindcss";`, which will then be imported into the root
`+layout.svelte`. For component-specific styles within `<style>` blocks,
`@reference "tailwindcss";` will be used to ensure Tailwind processes those
styles, and custom theme properties defined via `@theme` in `app.css` can be
directly accessed as CSS variables.

Tailwind CSS v4's design choice to rely on modern CSS features like `@property`
and `color-mix()` means it targets modern browsers (Safari 16.4+, Chrome 111+,
Firefox 128+). This is a forward-looking decision that prioritizes access to
cutting-edge styling capabilities and potentially improved performance,
accepting a trade-off by not supporting older browser versions. This strategic
alignment with modern web standards ensures the application can leverage the
latest design possibilities.

#### Shadcn-Svelte UI Components

**Shadcn-Svelte** will be incorporated for pre-built, customizable UI
components, providing a solid foundation for the user interface while allowing
for extensive theming and adaptation. The installation process will involve
`bunx shadcn-svelte@latest init` to configure aliases (e.g.,
`$lib/components/ui`) and then installing individual components as needed (e.g.,
`bunx shadcn-svelte@latest add button`). The project will also consider
`shadcn-svelte-extras` via `jsrepo` for additional components, enabling a
broader range of UI elements.

The philosophy behind Shadcn-Svelte emphasizes "building your own" components
rather than simply copy-pasting pre-configured examples. This approach, combined
with the use of `jsrepo` for managing component additions, signifies a strong
commitment to component ownership and deep customizability. Developers are
encouraged to understand and adapt the underlying components to fit the specific
design system and requirements of SocialCraft, rather than relying on a fixed,
opinionated library. This provides unparalleled flexibility and ensures a unique
visual identity, but it also implies a greater responsibility for component
maintenance and a deeper understanding of their composition.

### Backend & Runtime

The backend infrastructure is designed for high performance, efficient data
management, and seamless integration with AWS services.

#### Bun Runtime

**Bun** will serve as the primary JavaScript runtime for development, package
management, and server-side execution. Bun is chosen for its exceptional speed,
native TypeScript support, and its all-in-one toolkit approach, which includes a
bundler, test runner, and Node.js-compatible package manager. Its ability to
directly execute `.ts` and `.tsx` files and respect `tsconfig.json` settings
streamlines the development workflow.

While Bun offers compelling performance benefits and a cohesive developer
experience, community discussions highlight potential maturity issues and edge
cases for production deployments. For instance, some users have reported
difficulties with Bun builds on certain Linux environments and suggest using the
regular Node.js adapter for SvelteKit to avoid bugs. This observation points to
a strategic trade-off between adopting bleeding-edge performance and ensuring
production stability. For SocialCraft, this means while Bun will be heavily
utilized in development for its speed (e.g., `bun --bun run dev` to explicitly
use Bun's runtime for development scripts), the deployment strategy will
carefully consider the stability of the SvelteKit adapter for Bun versus the
more mature Node.js adapter, potentially opting for the latter until Bun's
production readiness fully matures.

#### Prisma ORM with PostgreSQL on Amazon RDS

**Prisma** will be used as the Object-Relational Mapper (ORM) for database
management, connected to a **PostgreSQL** instance hosted on **Amazon RDS**.
This combination provides a robust, scalable, and type-safe database solution.

The setup involves installing `@prisma/client` and `prisma` development
dependencies, followed by `bunx prisma init` to generate the `prisma` directory
and `schema.prisma` file. Database models for images, trends, and feedback will
be defined in `schema.prisma`, and `bunx prisma migrate dev` will be used for
schema migrations. The `DATABASE_URL` will be securely stored in the `.env` file
and accessed via `$env/static/private` in SvelteKit's server-side code.

A critical consideration for database performance and scalability, especially in
a serverless or highly concurrent environment, is connection management. The
recommendation to use a connection pooler like **Prisma Accelerate** is
paramount. Without a pooler, frequent instantiation of `PrismaClient` per
request could exhaust database connections, leading to application instability
and performance degradation. Therefore, `src/lib/prisma.ts` will instantiate
`PrismaClient` with `.$extends(withAccelerate())` to ensure efficient connection
pooling. This proactive approach to managing database resources is fundamental
to the "production-ready" goal.

### Cloud Services (AWS)

SocialCraft will heavily rely on **Amazon Web Services (AWS)** for its core AI,
storage, and moderation functionalities, leveraging the AWS SDK for JavaScript
v3 for seamless integration.

- **Amazon Bedrock:** Used for text-to-image generation. The
  `@aws-sdk/client-bedrock` package will be utilized to invoke foundation models
  like Stable Diffusion XL.
- **Amazon S3:** Employed for scalable and durable storage of generated images.
  The `@aws-sdk/client-s3` package will handle image uploads and retrieval.
- **Amazon Rekognition:** Integrated for automated content moderation of
  generated images, ensuring compliance and platform safety. The
  `@aws-sdk/client-rekognition` package will be used for detecting inappropriate
  content.

AWS SDK for JavaScript v3 will be configured with credentials and region
settings via environment variables (`.env`). All AWS interactions will leverage
`async/await` patterns for clean and efficient asynchronous operations, as
demonstrated in AWS SDK examples.

### Initial Project Setup & Configuration Steps

A systematic approach to project setup is crucial for consistency and
efficiency. This section provides a more detailed, step-by-step guide to setting up the SocialCraft development environment.

1.  **Initialize SvelteKit with Bun:**
    ```bash
    bun create svelte@latest SocialCraft
    cd SocialCraft
    bun install
    ```
    This command sequence scaffolds a new SvelteKit project and installs dependencies using Bun, taking advantage of its superior speed.

2.  **Integrate Tailwind CSS v4:**
    ```bash
    bunx sv add tailwindcss
    ```
    This command integrates Tailwind CSS into the SvelteKit project. Next, update `tailwind.config.js` to define the custom color palette and typography:
    ```javascript
    // tailwind.config.js
    const defaultTheme = require("tailwindcss/defaultTheme");
    module.exports = {
      content: ["./src/**/*.{html,js,ts,svelte}"],
      theme: {
        extend: {
          colors: {
            primary: "#4F46E5", // Indigo-600
            "primary-dark": "#4338CA", // Indigo-700 for hover
            secondary: "#10B981", // Emerald-500
            accent: "#F59E0B", // Amber-500
            background: "#F9FAFB", // Light Gray
            text: "#1F2937", // Dark Gray
            "text-light": "#4B5563", // Medium Gray
            "border-light": "#E5E7EB", // Light Border
          },
          fontFamily: {
            display: ["Space Grotesk", ...defaultTheme.fontFamily.sans],
            body: ["Inter", ...defaultTheme.fontFamily.sans],
          },
        },
      },
      plugins: [], // Add any necessary plugins here
    };
    ```
    Finally, ensure `src/app.css` contains `@import "tailwindcss";` and this file is imported in the root layout `src/routes/+layout.svelte`.

3.  **Install Shadcn-Svelte:**
    ```bash
    bunx shadcn-svelte@latest init
    bunx shadcn-svelte@latest add button input select card dialog progress toast textarea
    ```
    These commands initialize and add the required `shadcn-svelte` components to the project.

4.  **Set Up Prisma with Amazon RDS:**
    First, install the Prisma CLI and Client:
    ```bash
    bun add @prisma/client
    bun add -D prisma
    ```
    Initialize Prisma, which creates the `prisma` directory and `schema.prisma` file:
    ```bash
    bunx prisma init
    ```
    Update `prisma/schema.prisma` with the necessary models:
    ```prisma
    // prisma/schema.prisma
    generator client {
      provider = "prisma-client-js"
      output   = "../src/lib/generated/prisma/client"
    }

    datasource db {
      provider = "postgresql"
      url      = env("DATABASE_URL")
    }

    model Image {
      id        Int      @id @default(autoincrement())
      prompt    String
      style     String?
      imageUrl  String
      isPublic  Boolean  @default(false)
      createdAt DateTime @default(now())
      feedback  Feedback[]
    }

    model Trend {
      id        Int      @id @default(autoincrement())
      name      String   @unique
      updatedAt DateTime @default(now())
    }

    model Feedback {
      id        Int      @id @default(autoincrement())
      imageId   Int
      rating    Int
      comment   String?
      createdAt DateTime @default(now())
      image     Image    @relation(fields: [imageId], references: [id])
    }
    ```
    Create a `.env` file and add your `DATABASE_URL` for your Amazon RDS PostgreSQL instance:
    ```dotenv
    # .env
    DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"
    ```
    Run the initial migration to create the tables in your database:
    ```bash
    bunx prisma migrate dev --name init
    ```
    Create `src/lib/server/prisma.ts` for Prisma Client instantiation with Accelerate for connection pooling:
    ```typescript
    // src/lib/server/prisma.ts
    import { PrismaClient } from '../generated/prisma/client';
    import { withAccelerate } from '@prisma/extension-accelerate';

    const prisma = new PrismaClient().$extends(withAccelerate());

    export default prisma;
    ```

5.  **Set Up AWS SDK:**
    Install the required AWS SDK v3 packages:
    ```bash
    bun add @aws-sdk/client-bedrock-runtime @aws-sdk/client-s3 @aws-sdk/client-rekognition
    ```
    Add your AWS credentials to the `.env` file created in the previous step:
    ```dotenv
    # .env
    # ... existing DATABASE_URL
    AWS_ACCESS_KEY_ID=your_access_key
    AWS_SECRET_ACCESS_KEY=your_secret_key
    AWS_REGION=us-east-1
    S3_BUCKET_NAME=socialcraft-images
    ```
    The AWS SDKs will automatically use these environment variables for authentication.

### Core Dependencies & Versions

Maintaining a clear record of core dependencies and their versions is essential
for project stability and reproducibility.

| Dependency | Category | Version | Purpose |
| :--- | :--- | :--- | :--- |
| SvelteKit | Framework | `^2.x.x` (latest) | Full-stack web framework for Svelte applications. |
| Svelte | UI Library | `^5.0.0-next.x` | Reactive UI library with Runes for explicit reactivity. |
| Bun | Runtime | `^1.x.x` (latest) | Fast JavaScript runtime, package manager, bundler, test runner. |
| Tailwind CSS | Styling | `^4.x.x` (latest) | Utility-first CSS framework for rapid UI development. |
| `@tailwindcss/vite` | Plugin | `^4.x.x` (latest) | Vite plugin for Tailwind CSS v4 integration. |
| Shadcn-Svelte | UI Components | `latest` | Customizable UI components built with Radix UI and Tailwind CSS. |
| `@aws-sdk/client-bedrock` | AWS SDK | `^3.x.x` (latest) | Interact with Amazon Bedrock for AI models. |
| `@aws-sdk/client-s3` | AWS SDK | `^3.x.x` (latest) | Interact with Amazon S3 for object storage. |
| `@aws-sdk/client-rekognition` | AWS SDK | `^3.x.x` (latest) | Interact with Amazon Rekognition for image analysis. |
| Prisma | ORM | `^5.x.x` (latest) | Next-generation ORM for Node.js and TypeScript. |
| `@prisma/client` | Prisma Client | `^5.x.x` (latest) | Auto-generated database client for Prisma. |
| `@prisma/extension-accelerate` | Prisma Extension | `^1.x.x` (latest) | Connection pooling for Prisma Client. |
| PostgreSQL | Database | `latest stable` | Relational database for persistent data storage. |
| Axios | HTTP Client | `^1.x.x` | Promise-based HTTP client for browser and Node.js. |