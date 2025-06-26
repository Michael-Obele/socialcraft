<script lang="ts">
	import { page } from '$app/state';
	import { Menu } from '@lucide/svelte';
	import Theme from './Theme.svelte';

	const links = [
		{ href: '/', text: 'Home' },
		{ href: '/generate', text: 'Generate' },
		{ href: '/gallery', text: 'Gallery' },
		{ href: '/trends', text: 'Trends' }
	];

	// Reactive statement to check if the current page is a demo page, so we can highlight the home link
	let isDemoPage = $derived(page.url.pathname.startsWith('/demo'));
</script>

<nav class="border-gray-200 bg-white dark:bg-gray-900">
	<div class="mx-auto flex max-w-screen-xl flex-wrap items-center justify-between p-4">
		<a href="/" class="flex items-center space-x-3 rtl:space-x-reverse">
			<img src="/favicon.png" class="h-8" alt="SocialCraft Logo" />
			<span class="self-center text-2xl font-semibold whitespace-nowrap dark:text-white"
				>SocialCraft</span
			>
		</a>
		<button
			data-collapse-toggle="navbar-default"
			type="button"
			class="inline-flex h-10 w-10 items-center justify-center rounded-lg p-2 text-sm text-gray-500 hover:bg-gray-100 focus:ring-2 focus:ring-gray-200 focus:outline-none md:hidden dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
			aria-controls="navbar-default"
			aria-expanded="false"
		>
			<span class="sr-only">Open main menu</span>
			<Menu />
		</button>
		<div class="hidden w-full md:block md:w-auto" id="navbar-default">
			<ul
				class="mt-4 flex flex-col rounded-lg border border-gray-100 bg-gray-50 p-4 font-medium md:mt-0 md:flex-row md:space-x-8 md:border-0 md:bg-white md:p-0 rtl:space-x-reverse dark:border-gray-700 dark:bg-gray-800 md:dark:bg-gray-900"
			>
				{#each links as link (link.text)}
					<li>
						<a
							href={link.href}
							class="block rounded-sm px-3 py-2 md:p-0 {page.url.pathname === link.href ||
							(isDemoPage && link.href === '/')
								? 'bg-blue-700 text-white md:bg-transparent md:text-blue-700 dark:text-white md:dark:text-blue-500'
								: 'text-gray-900 hover:bg-gray-100 md:border-0 md:hover:bg-transparent md:hover:text-blue-700 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent md:dark:hover:text-blue-500'}"
							aria-current={page.url.pathname === link.href || (isDemoPage && link.href === '/')
								? 'page'
								: undefined}>{link.text}</a
						>
					</li>
				{/each}
			</ul>
		</div>
		<Theme />
	</div>
</nav>
