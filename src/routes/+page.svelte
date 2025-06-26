<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card/index.js';
	import { ArrowRight, Sparkles, TrendingUp, Palette } from '@lucide/svelte'; // Example icons

	// Define the features array directly in the script for simplicity
	const features = [
		{
			icon: Sparkles,
			title: 'AI-Powered Generation',
			desc: 'Instantly create unique visuals with advanced artificial intelligence.'
		},
		{
			icon: TrendingUp,
			title: 'Real-time Trend Insights',
			desc: 'Stay relevant by generating images based on the latest social media trends.'
		},
		{
			icon: Palette,
			title: 'Customizable Styles',
			desc: "Choose from a wide range of artistic styles to match your brand's aesthetic."
		}
	];
</script>

<div
	class="bg-background font-body flex min-h-screen flex-col items-center py-10 text-black dark:bg-gray-900 dark:text-gray-100"
>
	<section
		class="relative z-10 mx-auto flex w-full max-w-7xl flex-col items-center justify-center gap-8 overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-400 via-teal-400 to-emerald-600 px-4 py-16 shadow-2xl sm:px-6 md:flex-row md:gap-16 md:py-24 lg:px-8 lg:py-32"
	>
		<div class="absolute inset-0 z-0 bg-black opacity-10 dark:opacity-30"></div>
		<div
			class="relative z-20 w-full min-w-[300px] p-6 text-center md:w-1/2 md:p-8 md:text-left lg:p-10"
		>
			<h1
				class="font-display mb-4 text-4xl leading-tight font-bold text-slate-900 drop-shadow-md sm:text-5xl lg:text-6xl dark:text-white"
			>
				Transform Your Ideas into
				<span class="font-display text-amber-500 dark:text-yellow-300">Trend-Setting Visuals</span>
				with AI
			</h1>
			<p
				class="mx-auto mb-8 max-w-xl text-lg leading-relaxed text-slate-700 sm:text-xl md:mx-0 lg:text-2xl dark:text-slate-200"
			>
				Leverage cutting-edge AI to generate stunning, on-trend images for your business, social
				media, and creative projects. Stay ahead of the curve, effortlessly.
			</p>
			<Button
				href="/generate"
				class="transform rounded-full bg-emerald-600 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all duration-300 ease-in-out hover:-translate-y-1 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-400"
			>
				Start Creating Now <ArrowRight class="ml-2 inline-block h-5 w-5" />
			</Button>
		</div>
		<div
			class="relative z-20 flex w-full min-w-[300px] items-center justify-center p-6 md:w-1/2 md:p-8 lg:p-10"
		>
			<img
				src="/images/hero-image.png"
				alt="AI-generated abstract art representing trends and creativity"
				class="h-auto w-full max-w-sm rotate-3 transform rounded-xl border-4 border-white/20 shadow-2xl transition-transform duration-500 ease-in-out hover:rotate-0 md:max-w-md lg:max-w-lg dark:border-white/30"
			/>
		</div>
	</section>

	<section
		class="mx-auto grid w-full max-w-7xl grid-cols-1 gap-8 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8"
	>
		{#each features as feature, i (feature.title)}
			<Card.Root
				class="flex flex-col items-center rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-xl transition-shadow duration-300 ease-in-out hover:shadow-2xl md:flex-row md:items-stretch dark:border-slate-700 dark:bg-slate-800 dark:hover:shadow-emerald-500/10"
			>
				<!-- Left Icon (hidden on mobile, shown on md+) -->
				<div class="hidden w-1/5 items-center justify-center md:flex">
					<feature.icon class="text-primary dark:text-accent h-12 w-12" />
				</div>
				<!-- Main Content -->
				<div class="flex flex-1 flex-col justify-center">
					<!-- Icon for mobile only -->
					<div class="mb-4 flex justify-center md:hidden">
						<feature.icon class="text-primary dark:text-accent h-12 w-12" />
					</div>
					<Card.Header>
						<Card.Title class="font-display mb-3 text-2xl font-bold text-slate-900 dark:text-white">
							{feature.title}
						</Card.Title>
					</Card.Header>
					<Card.Content>
						<p
							class="w-full text-left leading-relaxed text-slate-600 md:text-center dark:text-slate-300"
						>
							{feature.desc}
						</p>
					</Card.Content>
				</div>
				<!-- Right Icon (hidden on mobile, shown on md+), only for the first and last card -->
				{#if i === 0 || i === features.length - 1}
					<div class="hidden w-1/5 items-center justify-center md:flex">
						<feature.icon class="h-12 w-12 opacity-0" />
					</div>
				{/if}
			</Card.Root>
		{/each}
	</section>

	<section
		class="mx-auto my-12 w-full max-w-7xl rounded-2xl bg-slate-100 px-4 py-16 text-center text-slate-900 shadow-xl sm:px-6 lg:px-8 dark:bg-slate-900 dark:text-white"
	>
		<h2 class="font-display mb-4 text-3xl font-bold text-slate-900 sm:text-4xl dark:text-white">
			Ready to Transform Your Content?
		</h2>
		<p class="mx-auto mb-8 max-w-2xl text-lg text-slate-700 sm:text-xl dark:text-slate-300">
			Join SocialCraft today and start creating visuals that captivate your audience and elevate
			your brand.
		</p>
		<Button
			href="/generate"
			class="rounded-full bg-emerald-600 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all duration-300 ease-in-out hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-400"
		>
			Sign Up for Free
		</Button>
	</section>
</div>
