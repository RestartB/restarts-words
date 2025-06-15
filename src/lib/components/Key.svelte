<script lang="ts">
	let { key, size = 48, className = '', status = -1 } = $props();

	function simulateKeyPress(key: string) {
		return () => {
			const event = new KeyboardEvent('keydown', { key });
			document.dispatchEvent(event);
		};
	}
</script>

<button
	class={`flex h-12 w-12 cursor-pointer items-center justify-center rounded-lg border-2 border-zinc-300 bg-zinc-200 sm:p-2 text-xl font-bold transition-all hover:brightness-105 ${className}`}
	style="min-width: fit-content; flex: 1; height: 48px;"
	class:bg-zinc-200={status === -1}
	class:bg-zinc-400={status === 0}
	class:bg-orange-400={status === 1}
	class:bg-green-400={status === 2}
	onclick={simulateKeyPress(key)}
>
	<span class="text-center">{key}</span>
</button>
