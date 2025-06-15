<script lang="ts">
	import '../app.css';
	import Header from '$lib/components/Header.svelte';

	let { children } = $props();
</script>

<div class="w-full h-full absolute top-0 left-0 -z-10">
	<!-- <div class="w-full h-full absolute top-0 left-0 -z-10 blur-xl opacity-50 bg-center bg-cover box-border" style="background-image: url('https://picsum.photos/1920/1080');"></div> -->
</div>

<div class="min-h-screen w-full overflow-hidden text-lg font-display">
	<Header />
	{@render children()}
</div>

<style>
	:global(body) {
		background-color: white;
		color: black;
	}

	@media (prefers-color-scheme: dark) {
		:global(body) {
			background-color: black;
		}
	}
</style>