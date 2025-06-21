<script lang="ts">
	import '../app.css';
	import Header from '$lib/components/Header.svelte';
	import { Toaster } from 'svelte-sonner';

	import { onNavigate } from '$app/navigation';

	let { children } = $props();

	onNavigate((navigation) => {
		if (!document.startViewTransition) return;

		return new Promise((resolve) => {
			document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
		});
	});
</script>

<div class="fixed top-0 left-0 -z-10 h-full w-full">
	<div
		class="fixed top-0 left-0 -z-10 box-border h-full w-full bg-cover bg-fixed bg-center opacity-50 blur-xl"
		style="background-image: url('https://picsum.photos/1920/1080'); view-transition-name='background'"
	></div>
</div>

<div
	class="font-display flex min-h-screen w-full flex-col items-center gap-4 overflow-hidden p-4 text-lg"
>
	<Toaster position="top-center" closeButton richColors duration={3000} />
	<Header />
	<div class="mt-17 flex w-full flex-1 items-center justify-center">
		{@render children()}
	</div>
</div>

<style>
	@keyframes fade-in {
		from {
			opacity: 0;
		}
	}

	@keyframes fade-out {
		to {
			opacity: 0;
		}
	}

	:root::view-transition-old(root) {
		animation: 90ms cubic-bezier(0.4, 0, 1, 1) both fade-out;
	}

	:root::view-transition-new(root) {
		animation: 210ms cubic-bezier(0, 0, 0.2, 1) 90ms both fade-in;
	}

	@media (prefers-color-scheme: dark) {
		:global(body) {
			background-color: black;
			color: white;
		}
	}
</style>
