<script lang="ts">
	import { HomeIcon } from '@lucide/svelte';
</script>

<header class="fixed right-0 left-0 z-50 m-5 flex items-center justify-center">
	<div
		class="flex w-full max-w-3xl items-center justify-between rounded-lg border-4 border-zinc-400 bg-zinc-100 p-2 px-4 shadow-md"
	>
		<h1 class=" font-bold">Restart Words</h1>
		<a href="/" class="flex items-center justify-center gap-2 text-zinc-600 hover:text-zinc-800">
			<HomeIcon />
			Home
		</a>
	</div>
</header>

<style>
	@media (max-height: 900px) {
		header {
			position: initial;
		}
	}
</style>
