<script lang="ts">
	import Navbar from '$lib/components/block/Navbar.svelte';
	import '../app.css';
	import { ModeWatcher } from 'mode-watcher';
	let { children } = $props();
</script>

<ModeWatcher />

<Navbar />
{@render children()}
