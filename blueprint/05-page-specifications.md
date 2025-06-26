## 5. Page Specifications & Implementation

This section details the design vision, AI-readable JSON structure, and
SvelteKit implementation for each primary page of SocialCraft. All Svelte
component `script` tags will use `lang='ts'` and leverage Svelte 5 Runes for
reactivity.

### Home Page (/)

The home page is designed as a modern, visually captivating landing page,
serving as the primary entry point to attract users and highlight SocialCraft's
unique value proposition.

**Purpose & Design Vision:** The page aims to immediately convey the
application's core functionality and benefits. It features a prominent hero
section with a dual-column layout for impactful messaging and a compelling
visual. Below the hero, a feature grid will concisely present the key
capabilities. The design incorporates a gradient background, bold typography,
and strategic use of shadows to create a modern and inviting aesthetic, drawing
inspiration from contemporary landing page designs. This strong focus on visual
appeal and user engagement from the landing page is critical for a hackathon
project to make an immediate impact and effectively communicate its value.

**JSON Design:**

```json
{
  "page": "Home",
  "layout": {
    "backgroundColor": "theme('colors.background')",
    "padding": "py-12 px-4 sm:px-6 lg:px-8",
    "tailwindClasses": "min-h-screen flex flex-col font-body text-text"
  },
  "components": [
    {
      "type": "HeroSection",
      "id": "hero",
      "layout": {
        "tailwindClasses": "flex flex-col md:flex-row justify-center items-center gap-8 md:gap-16 py-16 md:py-24 lg:py-32 bg-gradient-to-br from-primary-dark to-secondary rounded-3xl shadow-2xl overflow-hidden relative z-10 mx-auto max-w-7xl w-full"
      },
      "textSection": {
        "tailwindClasses": "w-full md:w-1/2 min-w-[300px] text-center md:text-left p-6 md:p-8 lg:p-10 relative z-20",
        "title": {
          "text": "Transform Your Ideas into <span class='text-accent font-display'>Trend-Setting Visuals</span> with AI",
          "tailwindClasses": "text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight font-display drop-shadow-md",
          "color": "theme('colors.white')"
        },
        "subtitle": {
          "text": "Leverage cutting-edge AI to generate stunning, on-trend images for your business, social media, and creative projects. Stay ahead of the curve, effortlessly.",
          "tailwindClasses": "text-lg sm:text-xl lg:text-2xl text-indigo-100 mb-8 max-w-xl mx-auto md:mx-0 leading-relaxed",
          "color": "theme('colors.indigo.100')"
        },
        "button": {
          "shadcnComponent": "Button",
          "text": "Start Creating Now",
          "link": "/generate",
          "variant": "primary",
          "tailwindClasses": "bg-accent text-text-dark font-semibold rounded-full px-8 py-4 text-lg hover:bg-amber-400 transition-all duration-300 ease-in-out shadow-lg hover:shadow-xl transform hover:-translate-y-1",
          "icon": "ArrowRight"
        }
      },
      "imageSection": {
        "tailwindClasses": "w-full md:w-1/2 min-w-[300px] p-6 md:p-8 lg:p-10 flex justify-center items-center relative z-20",
        "image": {
          "src": "/images/hero-image.png",
          "alt": "AI-generated abstract art representing trends and creativity",
          "tailwindClasses": "w-full h-auto max-w-sm md:max-w-md lg:max-w-lg rounded-xl shadow-2xl border-4 border-white/20 transform rotate-3 hover:rotate-0 transition-transform duration-500 ease-in-out"
        }
      },
      "backgroundOverlay": {
        "tailwindClasses": "absolute inset-0 bg-black opacity-10 z-0"
      }
    },
    {
      "type": "FeatureGrid",
      "id": "feature-overview",
      "layout": {
        "tailwindClasses": "grid grid-cols-1 md:grid-cols-3 gap-8 py-16 max-w-7xl mx-auto"
      },
      "cards": [
        {
          "icon": "Sparkles",
          "title": "AI-Powered Generation",
          "desc": "Instantly create unique visuals with advanced artificial intelligence."
        },
        {
          "icon": "TrendingUp",
          "title": "Real-time Trend Insights",
          "desc": "Stay relevant by generating images based on the latest social media trends."
        },
        {
          "icon": "Palette",
          "title": "Customizable Styles",
          "desc": "Choose from a wide range of artistic styles to match your brand's aesthetic."
        }
      ]
    },
    {
      "type": "CallToAction",
      "id": "cta-bottom",
      "layout": {
        "tailwindClasses": "py-16 bg-primary-dark text-white text-center rounded-2xl mx-auto max-w-7xl my-12 shadow-xl"
      },
      "title": {
        "text": "Ready to Transform Your Content?",
        "tailwindClasses": "text-3xl sm:text-4xl font-bold mb-4 font-display"
      },
      "description": {
        "text": "Join SocialCraft today and start creating visuals that captivate your audience and elevate your brand.",
        "tailwindClasses": "text-lg sm:text-xl text-indigo-200 mb-8 max-w-2xl mx-auto"
      },
      "button": {
        "shadcnComponent": "Button",
        "text": "Sign Up for Free",
        "link": "/generate",
        "variant": "secondary",
        "tailwindClasses": "bg-secondary text-white font-semibold rounded-full px-8 py-4 text-lg hover:bg-emerald-400 transition-all duration-300 ease-in-out shadow-lg"
      }
    }
  ]
}
```

**SvelteKit `+page.svelte` Implementation:**

```svelte
<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import { Card } from '$lib/components/ui/card';
  import { ArrowRight, Sparkles, TrendingUp, Palette } from 'lucide-svelte'; // Example icons

  // Define the features array directly in the script for simplicity
  const features = [
    {
      icon: Sparkles,
      title: "AI-Powered Generation",
      desc: "Instantly create unique visuals with advanced artificial intelligence."
    },
    {
      icon: TrendingUp,
      title: "Real-time Trend Insights",
      desc: "Stay relevant by generating images based on the latest social media trends."
    },
    {
      icon: Palette,
      title: "Customizable Styles",
      desc: "Choose from a wide range of artistic styles to match your brand's aesthetic."
    }
  ];
</script>

<div class="min-h-screen flex flex-col items-center bg-background font-body text-text">
  <section class="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-16 py-16 md:py-24 lg:py-32 bg-gradient-to-br from-primary-dark to-secondary rounded-3xl shadow-2xl overflow-hidden relative z-10 mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8">
    <div class="absolute inset-0 bg-black opacity-10 z-0"></div>
    <div class="w-full md:w-1/2 min-w-[300px] text-center md:text-left p-6 md:p-8 lg:p-10 relative z-20">
      <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight font-display drop-shadow-md">
        Transform Your Ideas into <span class="text-accent font-display">Trend-Setting Visuals</span> with AI
      </h1>
      <p class="text-lg sm:text-xl lg:text-2xl text-indigo-100 mb-8 max-w-xl mx-auto md:mx-0 leading-relaxed">
        Leverage cutting-edge AI to generate stunning, on-trend images for your business, social media, and creative projects. Stay ahead of the curve, effortlessly.
      </p>
      <Button href="/generate" class="bg-accent text-text font-semibold rounded-full px-8 py-4 text-lg hover:bg-amber-400 transition-all duration-300 ease-in-out shadow-lg hover:shadow-xl transform hover:-translate-y-1">
        Start Creating Now <ArrowRight class="ml-2 h-5 w-5 inline-block" />
      </Button>
    </div>
    <div class="w-full md:w-1/2 min-w-[300px] p-6 md:p-8 lg:p-10 flex justify-center items-center relative z-20">
      <img src="/images/hero-image.png" alt="AI-generated abstract art representing trends and creativity" class="w-full h-auto max-w-sm md:max-w-md lg:max-w-lg rounded-xl shadow-2xl border-4 border-white/20 transform rotate-3 hover:rotate-0 transition-transform duration-500 ease-in-out" />
    </div>
  </section>

  <section class="grid grid-cols-1 md:grid-cols-3 gap-8 py-16 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
    {#each features as feature}
      <Card class="bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300 ease-in-out border border-border-light text-center flex flex-col items-center">
        <div class="mb-4">
          <svelte:component this={feature.icon} class="h-12 w-12 text-primary" />
        </div>
        <h3 class="text-2xl font-bold text-text mb-3 font-display">{feature.title}</h3>
        <p class="text-text-light leading-relaxed">{feature.desc}</p>
      </Card>
    {/each}
  </section>

  <section class="py-16 bg-primary-dark text-white text-center rounded-2xl mx-auto max-w-7xl my-12 shadow-xl w-full px-4 sm:px-6 lg:px-8">
    <h2 class="text-3xl sm:text-4xl font-bold mb-4 font-display">Ready to Transform Your Content?</h2>
    <p class="text-lg sm:text-xl text-indigo-200 mb-8 max-w-2xl mx-auto">
      Join SocialCraft today and start creating visuals that captivate your audience and elevate your brand.
    </p>
    <Button href="/generate" class="bg-secondary text-white font-semibold rounded-full px-8 py-4 text-lg hover:bg-emerald-400 transition-all duration-300 ease-in-out shadow-lg">
      Sign Up for Free
    </Button>
  </section>
</div>
```

### Generate Page (/generate)

The Generate page is the core interface for users to create images, combining
prompt input with trend-aware style selection.

**Purpose & Design Vision:** This page provides a clean, focused interface for
image generation. It features a form for text prompts and style selection,
followed by a dedicated area to display the generated image. Feedback options
will be presented after an image is successfully generated. The layout
prioritizes usability and a clear visual hierarchy.

**JSON Design:**

```json
{
  "page": "Generate",
  "layout": {
    "backgroundColor": "theme('colors.white')",
    "padding": "py-8 px-4 sm:px-6 lg:px-8",
    "tailwindClasses": "min-h-screen flex flex-col items-center font-body text-text"
  },
  "components": [
    {
      "type": "HeadingSection",
      "id": "page-header",
      "layout": {
        "tailwindClasses": "text-center mb-8 max-w-2xl mx-auto"
      },
      "title": {
        "text": "Generate Your Masterpiece",
        "tailwindClasses": "text-4xl font-bold text-text mb-2 font-display"
      },
      "subtitle": {
        "text": "Describe your vision and choose a trend-inspired style.",
        "tailwindClasses": "text-lg text-text-light"
      }
    },
    {
      "type": "GenerationForm",
      "id": "generation-form",
      "layout": {
        "tailwindClasses": "w-full max-w-md bg-white p-8 rounded-xl shadow-lg border border-border-light mb-8"
      },
      "promptInput": {
        "label": "Your Creative Prompt",
        "placeholder": "e.g., 'A futuristic city at sunset, with flying cars'",
        "tailwindClasses": "w-full text-base p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary transition-all"
      },
      "styleSelect": {
        "label": "Trend-Inspired Style",
        "placeholder": "Select a style",
        "tailwindClasses": "w-full p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary transition-all"
      },
      "button": {
        "shadcnComponent": "Button",
        "text": "Generate Image",
        "variant": "primary",
        "tailwindClasses": "bg-primary text-white w-full rounded-lg py-3 text-lg font-semibold hover:bg-primary-dark transition-colors duration-300 ease-in-out shadow-md hover:shadow-lg",
        "loadingText": "Generating..."
      }
    },
    {
      "type": "ImagePreviewSection",
      "id": "image-display",
      "layout": {
        "tailwindClasses": "w-full max-w-md mt-4 rounded-xl p-6 bg-gray-50 border border-border-light text-center flex flex-col items-center justify-center min-h-[300px]"
      },
      "image": {
        "src": "generated_image_url_placeholder",
        "alt": "Generated Image Preview",
        "tailwindClasses": "w-full h-auto rounded-lg shadow-md max-h-[500px] object-contain"
      },
      "feedbackPrompt": {
        "text": "How do you like this image?",
        "tailwindClasses": "text-lg text-text-light mt-4"
      },
      "feedbackComponent": {
        "shadcnComponent": "Rating",
        "name": "imageRating",
        "tailwindClasses": "mt-2"
      },
      "noImagePlaceholder": {
        "text": "Your generated image will appear here.",
        "tailwindClasses": "text-text-light text-xl italic"
      }
    }
  ]
}
```

**SvelteKit `+page.server.ts` Implementation:**

```typescript
// src/routes/generate/+page.server.ts
import type { Actions, PageServerLoad } from "./$types";
import { getStyleSuggestions } from "$lib/server/styles";
import { generateImage } from "$lib/server/imageGenerator";
import { saveFeedback } from "$lib/server/feedback";

export const load: PageServerLoad = async () => {
  // Fetch style suggestions based on trends
  const styles = await getStyleSuggestions();
  return { styles };
};

export const actions: Actions = {
  default: async ({ request }) => {
    const formData = await request.formData();
    const prompt = formData.get("prompt") as string;
    const style = formData.get("style") as string;

    if (!prompt) {
      return {
        status: 400,
        body: { success: false, message: "Prompt is required." },
      };
    }

    const fullPrompt = `${prompt} in ${style} style`;

    try {
      const imageUrl = await generateImage(fullPrompt);
      // In a real app, you'd save image metadata (prompt, style, URL) to DB here
      // For hackathon, we might just return the URL
      // Example: const newImage = await prisma.image.create({ data: { prompt: fullPrompt, style, imageUrl } });
      return { success: true, imageUrl, imageId: 123 }; // Placeholder imageId
    } catch (error: any) {
      console.error("Image generation failed:", error);
      return {
        status: 500,
        body: {
          success: false,
          message: error.message || "Failed to generate image.",
        },
      };
    }
  },
  // Action for submitting feedback
  submitFeedback: async ({ request }) => {
    const formData = await request.formData();
    const imageId = parseInt(formData.get("imageId") as string);
    const rating = parseInt(formData.get("rating") as string);
    const comment = formData.get("comment") as string;

    if (isNaN(imageId) || isNaN(rating) || rating < 1 || rating > 5) {
      return {
        status: 400,
        body: { success: false, message: "Invalid feedback data." },
      };
    }

    try {
      await saveFeedback(imageId, rating, comment);
      return { success: true, message: "Feedback submitted successfully!" };
    } catch (error) {
      console.error("Feedback submission failed:", error);
      return {
        status: 500,
        body: { success: false, message: "Failed to submit feedback." },
      };
    }
  },
};
```

**SvelteKit `+page.svelte` Implementation:**

```svelte
<script lang="ts">
  import { page } from '$app/stores';
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '$lib/components/ui/select';
  import { Card } from '$lib/components/ui/card';
  import { Star } from 'lucide-svelte'; // For a simple rating display
  import { Spinner } from '$lib/components/ui/spinner'; // Assuming a Spinner component exists or will be created

  // Svelte 5 Runes for reactivity
  let prompt = $state('');
  let selectedStyle = $state('');
  let imageUrl = $state('');
  let generatedImageId = $state<number | null>(null);
  let isLoading = $state(false);
  let generationError = $state<string | null>(null);
  let feedbackSubmitted = $state(false);
  let currentRating = $state(0);

  // Access styles from page data
  $effect(() => {
    if ($page.data.styles && $page.data.styles.length > 0) {
      selectedStyle = $page.data.styles[0]; // Pre-select first style
    }
  });

  async function handleSubmit() {
    isLoading = true;
    generationError = null;
    feedbackSubmitted = false;
    imageUrl = ''; // Clear previous image

    const formData = new FormData();
    formData.append('prompt', prompt);
    formData.append('style', selectedStyle);

    try {
      const response = await fetch('/generate', {
        method: 'POST',
        body: formData
      });
      const result = await response.json();

      if (result.success) {
        imageUrl = result.imageUrl;
        generatedImageId = result.imageId;
      } else {
        generationError = result.message || 'An unknown error occurred.';
      }
    } catch (error: any) {
      console.error('Client-side fetch error:', error);
      generationError = 'Network error or server unreachable.';
    } finally {
      isLoading = false;
    }
  }

  async function submitRating() {
    if (generatedImageId === null || currentRating === 0) return;

    const formData = new FormData();
    formData.append('imageId', String(generatedImageId));
    formData.append('rating', String(currentRating));
    // formData.append('comment', 'Optional comment here');

    try {
      const response = await fetch('/generate?/submitFeedback', {
        method: 'POST',
        body: formData
      });
      const result = await response.json();
      if (result.success) {
        feedbackSubmitted = true;
        console.log(result.message);
      } else {
        console.error('Failed to submit feedback:', result.message);
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
    }
  }
</script>

<div class="min-h-screen flex flex-col items-center py-8 px-4 sm:px-6 lg:px-8 font-body text-text">
  <div class="text-center mb-8 max-w-2xl mx-auto">
    <h1 class="text-4xl font-bold text-text mb-2 font-display">Generate Your Masterpiece</h1>
    <p class="text-lg text-text-light">Describe your vision and choose a trend-inspired style.</p>
  </div>

  <form onsubmit|preventDefault={handleSubmit} class="w-full max-w-md bg-white p-8 rounded-xl shadow-lg border border-border-light mb-8">
    <div class="mb-6">
      <label for="prompt" class="block text-text text-sm font-medium mb-2">Your Creative Prompt</label>
      <Input id="prompt" name="prompt" type="text" placeholder="e.g., 'A futuristic city at sunset, with flying cars'" bind:value={prompt} class="w-full text-base p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary transition-all" />
    </div>
    <div class="mb-6">
      <label for="style" class="block text-text text-sm font-medium mb-2">Trend-Inspired Style</label>
      <Select name="style" bind:value={selectedStyle}>
        <SelectTrigger class="w-full p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary transition-all">
          <SelectValue placeholder="Select a style" />
        </SelectTrigger>
        <SelectContent class="bg-white rounded-md shadow-lg border border-gray-200">
          {#each $page.data.styles as styleOption}
            <SelectItem value={styleOption}>{styleOption}</SelectItem>
          {/each}
        </SelectContent>
      </Select>
    </div>
    <Button type="submit" disabled={isLoading} class="bg-primary text-white w-full rounded-lg py-3 text-lg font-semibold hover:bg-primary-dark transition-colors duration-300 ease-in-out shadow-md hover:shadow-lg">
      {#if isLoading}
        <Spinner class="animate-spin h-5 w-5 mr-3 text-white" />
        Generating...
      {:else}
        Generate Image
      {/if}
    </Button>
    {#if generationError}
      <p class="text-red-500 text-center mt-4">{generationError}</p>
    {/if}
  </form>

  <Card class="w-full max-w-md mt-4 rounded-xl p-6 bg-gray-50 border border-border-light text-center flex flex-col items-center justify-center min-h-[300px]">
    {#if imageUrl}
      <img src={imageUrl} alt="Generated Image Preview" class="w-full h-auto rounded-lg shadow-md max-h-[500px] object-contain" />
      {#if generatedImageId && !feedbackSubmitted}
        <p class="text-lg text-text-light mt-4">How do you like this image?</p>
        <div class="flex space-x-1 mt-2">
          {#each [1, 2, 3, 4, 5] as star}
            <button
              class="p-1 rounded-full transition-colors duration-200"
              class:text-accent={currentRating >= star}
              class:text-gray-400={currentRating < star}
              onclick={() => { currentRating = star; submitRating(); }}
            >
              <Star class="h-8 w-8 fill-current" />
            </button>
          {/each}
        </div>
      {:else if feedbackSubmitted}
        <p class="text-secondary text-lg mt-4">Thank you for your feedback!</p>
      {/if}
    {:else}
      <p class="text-text-light text-xl italic">Your generated image will appear here.</p>
    {/if}
  </Card>
</div>
```

### Gallery Page (/gallery)

The Gallery page will showcase a collection of publicly available AI-generated
images, demonstrating the platform's capabilities and inspiring users.

**Purpose & Design Vision:** This page provides a visually appealing grid of
images, allowing users to browse and appreciate the output of SocialCraft. It
will feature lazy loading and potentially pagination for efficient display of a
large number of images. Each image will be presented within a card, potentially
with minimal metadata like prompt or style.

**JSON Design:**

```json
{
  "page": "Gallery",
  "layout": {
    "backgroundColor": "theme('colors.background')",
    "padding": "py-8 px-4 sm:px-6 lg:px-8",
    "tailwindClasses": "min-h-screen flex flex-col items-center font-body text-text"
  },
  "components": [
    {
      "type": "HeadingSection",
      "id": "page-header",
      "layout": {
        "tailwindClasses": "text-center mb-8 max-w-2xl mx-auto"
      },
      "title": {
        "text": "Explore the SocialCraft Gallery",
        "tailwindClasses": "text-4xl font-bold text-text mb-2 font-display"
      },
      "subtitle": {
        "text": "Discover stunning AI-generated images created by our community.",
        "tailwindClasses": "text-lg text-text-light"
      }
    },
    {
      "type": "ImageGrid",
      "id": "gallery-grid",
      "layout": {
        "tailwindClasses": "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-7xl mx-auto w-full"
      },
      "imageCard": {
        "shadcnComponent": "Card",
        "tailwindClasses": "bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden border border-border-light",
        "imageClass": "w-full h-48 object-cover rounded-t-xl",
        "titleClass": "text-lg font-semibold text-text truncate",
        "subtitleClass": "text-sm text-text-light mt-1"
      },
      "pagination": {
        "shadcnComponent": "Pagination",
        "tailwindClasses": "mt-12 flex justify-center",
        "prevLink": "/gallery?page={currentPage - 1}",
        "nextLink": "/gallery?page={currentPage + 1}",
        "pageLink": "/gallery?page={pageNumber}"
      },
      "emptyState": {
        "text": "No public images available yet. Be the first to generate one!",
        "tailwindClasses": "text-text-light text-xl italic text-center py-16"
      },
      "loadingState": {
        "shadcnComponent": "Spinner",
        "tailwindClasses": "text-primary h-8 w-8 mt-8"
      }
    }
  ]
}
```

**SvelteKit `+page.server.ts` Implementation:**

```typescript
// src/routes/gallery/+page.server.ts
import type { PageServerLoad } from "./$types";
import prisma from "$lib/prisma";

export const load: PageServerLoad = async ({ url }) => {
  const page = parseInt(url.searchParams.get("page") || "1");
  const limit = 24; // Number of images per page
  const skip = (page - 1) * limit;

  const images = await prisma.image.findMany({
    where: { isPublic: true },
    take: limit,
    skip: skip,
    orderBy: { createdAt: "desc" },
  });

  const totalImages = await prisma.image.count({ where: { isPublic: true } });
  const totalPages = Math.ceil(totalImages / limit);

  return {
    images: images.map((img) => ({
      id: img.id,
      imageUrl: img.imageUrl,
      prompt: img.prompt,
      style: img.style,
      createdAt: img.createdAt.toISOString(),
    })),
    currentPage: page,
    totalPages: totalPages,
  };
};
```

**SvelteKit `+page.svelte` Implementation:**

```svelte
<script lang="ts">
  import { page } from '$app/stores';
  import { Card } from '$lib/components/ui/card';
  import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '$lib/components/ui/pagination';
  import { Spinner } from '$lib/components/ui/spinner'; // Assuming a Spinner component exists or will be created

  let { images, currentPage, totalPages } = $page.data;
  let isLoading = $state(false); // For future lazy loading/infinite scroll
</script>

<div class="min-h-screen flex flex-col items-center py-8 px-4 sm:px-6 lg:px-8 font-body text-text bg-background">
  <div class="text-center mb-8 max-w-2xl mx-auto">
    <h1 class="text-4xl font-bold text-text mb-2 font-display">Explore the SocialCraft Gallery</h1>
    <p class="text-lg text-text-light">Discover stunning AI-generated images created by our community.</p>
  </div>

  {#if images.length > 0}
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-7xl mx-auto w-full">
      {#each images as image}
        <Card class="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden border border-border-light">
          <img src={image.imageUrl} alt={image.prompt} class="w-full h-48 object-cover rounded-t-xl" />
          <div class="p-4">
            <h3 class="text-lg font-semibold text-text truncate">{image.prompt}</h3>
            {#if image.style}
              <p class="text-sm text-text-light mt-1">Style: {image.style}</p>
            {/if}
          </div>
        </Card>
      {/each}
    </div>

    <Pagination class="mt-12 flex justify-center">
      <PaginationContent>
        {#if currentPage > 1}
          <PaginationItem>
            <PaginationPrevious href={`/gallery?page=${currentPage - 1}`} />
          </PaginationItem>
        {/if}
        {#each Array(totalPages).keys() as i}
          <PaginationItem>
            <PaginationLink href={`/gallery?page=${i + 1}`} isActive={currentPage === i + 1}>{i + 1}</PaginationLink>
          </PaginationItem>
        {/each}
        {#if currentPage < totalPages}
          <PaginationItem>
            <PaginationNext href={`/gallery?page=${currentPage + 1}`} />
          </PaginationItem>
        {/if}
      </PaginationContent>
    </Pagination>
  {:else}
    <div class="text-text-light text-xl italic text-center py-16">
      No public images available yet. Be the first to generate one!
    </div>
  {/if}

  {#if isLoading}
    <div class="mt-8">
      <Spinner class="text-primary h-8 w-8" />
    </div>
  {/if}
</div>
```

### Trends Page (/trends)

A dedicated page to display the aggregated social media trends that inform the
image generation styles.

**Purpose & Design Vision:** This page offers users transparency into the trend
data driving the application. It will present trends in a clear, digestible
format, possibly as a list or a series of interactive cards, allowing users to
explore current popular topics.

**JSON Design:**

```json
{
  "page": "Trends",
  "layout": {
    "backgroundColor": "theme('colors.background')",
    "padding": "py-8 px-4 sm:px-6 lg:px-8",
    "tailwindClasses": "min-h-screen flex flex-col items-center font-body text-text"
  },
  "components": [
    {
      "type": "HeadingSection",
      "id": "page-header",
      "layout": {
        "tailwindClasses": "text-center mb-8 max-w-2xl mx-auto"
      },
      "title": {
        "text": "Current Social Media Trends",
        "tailwindClasses": "text-4xl font-bold text-text mb-2 font-display"
      },
      "subtitle": {
        "text": "See what's trending now and inspire your next creation.",
        "tailwindClasses": "text-lg text-text-light"
      }
    },
    {
      "type": "TrendGrid",
      "id": "trend-display",
      "layout": {
        "tailwindClasses": "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto w-full"
      },
      "trendCard": {
        "shadcnComponent": "Card",
        "tailwindClasses": "bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-border-light flex flex-col justify-between",
        "titleClass": "text-xl font-semibold text-text mb-2 font-display",
        "button": {
          "shadcnComponent": "Button",
          "text": "Generate with this Trend",
          "variant": "outline",
          "tailwindClasses": "mt-4 w-full border-primary text-primary hover:bg-primary-dark hover:text-white transition-colors"
        }
      },
      "emptyState": {
        "text": "No trends available at the moment. Please check back later!",
        "tailwindClasses": "text-text-light text-xl italic text-center py-16"
      }
    }
  ]
}
```

**SvelteKit `+page.server.ts` Implementation:**

```typescript
// src/routes/trends/+page.server.ts
import type { PageServerLoad } from "./$types";
import { getTrends } from "$lib/server/trends";

export const load: PageServerLoad = async () => {
  const trends = await getTrends();
  return { trends };
};
```

**SvelteKit `+page.svelte` Implementation:**

```svelte
<script lang="ts">
  import { page } from '$app/stores';
  import { Card } from '$lib/components/ui/card';
  import { Button } from '$lib/components/ui/button';
  import { goto } from '$app/navigation';

  let { trends } = $page.data;

  function generateWithTrend(trendName: string) {
    // Navigate to generate page and pass trend as a query parameter or state
    goto(`/generate?prompt=${encodeURIComponent(trendName)}`);
  }
</script>

<div class="min-h-screen flex flex-col items-center py-8 px-4 sm:px-6 lg:px-8 font-body text-text bg-background">
  <div class="text-center mb-8 max-w-2xl mx-auto">
    <h1 class="text-4xl font-bold text-text mb-2 font-display">Current Social Media Trends</h1>
    <p class="text-lg text-text-light">See what's trending now and inspire your next creation.</p>
  </div>

  {#if trends.length > 0}
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto w-full">
      {#each trends as trend}
        <Card class="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-border-light flex flex-col justify-between">
          <div>
            <h3 class="text-xl font-semibold text-text mb-2 font-display">{trend}</h3>
          </div>
          <Button variant="outline" class="mt-4 w-full border-primary text-primary hover:bg-primary-dark hover:text-white transition-colors" onclick={() => generateWithTrend(trend)}>
            Generate with this Trend
          </Button>
        </Card>
      {/each}
    </div>
  {:else}
    <div class="text-text-light text-xl italic text-center py-16">
      No trends available at the moment. Please check back later!
    </div>
  {/if}
</div>