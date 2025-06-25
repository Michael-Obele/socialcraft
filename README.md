# SocialCraft

AI-Powered Visual Content Platform for Social Media

## Overview

SocialCraft is an AI-powered web application designed to empower small businesses and content creators by generating trend-aware images. The platform leverages real-time social media insights to produce stunning visuals, ensuring brand relevance and engagement.

## License

This project is proprietary and confidential. All rights reserved.

**Copyright (c) 2025 MiniApps**

Unauthorized use, copying, modification, distribution, or disclosure of this software is strictly prohibited without the express written permission of MiniApps. This software was created specifically for participation in the AWS Lambda Hackathon and may not be used in any other hackathon, competition, or commercial context without prior written authorization.

For permission requests, contact: admin@svelte-apps.me

---

## Getting Started

### Prerequisites

- Node.js 18+ (LTS recommended)
- Bun 1.0+
- AWS CLI (for backend development)
- PostgreSQL 14+

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/socialcraft.git
   cd socialcraft
   ```

2. Install dependencies:
   ```bash
   bun install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   # Update the .env file with your configuration
   ```

4. Start the development server:
   ```bash
   bun run dev
   ```

## Tech Stack

- **Frontend**: SvelteKit 5 with Svelte 5 Runes
- **Styling**: Tailwind CSS v4 with custom theming
- **UI Components**: Shadcn-Svelte with custom adaptations
- **Runtime**: Bun
- **Backend**: Node.js with AWS SDK v3
- **Database**: PostgreSQL with Prisma ORM
- **AI/ML**: AWS Bedrock (Stable Diffusion XL)
- **Storage**: AWS S3
- **Content Moderation**: AWS Rekognition

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines and code of conduct.

## License

This project is proprietary and confidential. All rights reserved.

**Copyright (c) 2025 MiniApps**

For more information, see [LICENSE](LICENSE).
