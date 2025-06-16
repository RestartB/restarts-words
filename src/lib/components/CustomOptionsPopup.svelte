<script lang="ts">
	import { fly, fade } from 'svelte/transition';
	import { CircleX } from '@lucide/svelte';

	import NumberFlow, { continuous } from '@number-flow/svelte';
	import { Slider } from 'bits-ui';
	import cn from 'clsx';

	let { popupOpen = $bindable() } = $props();
	let value = $state(5);
</script>

{#if popupOpen}
	<div
		class="absolute top-0 left-0 z-50 flex h-full w-full items-center justify-center bg-zinc-300/70 backdrop-blur-sm dark:bg-zinc-700/70"
		transition:fade={{ duration: 200 }}
	>
		<div
			class="flex flex-col items-center justify-center gap-6 rounded-xl border-4 border-zinc-200 bg-zinc-100 p-6 dark:bg-zinc-900"
			transition:fly={{ y: 20, duration: 300 }}
		>
			<div class="flex w-full items-center justify-between">
				<h2 class="font-bold">Custom Options</h2>
				<button
					class="cursor-pointer text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
					onclick={() => (popupOpen = false)}
				>
					<CircleX />
				</button>
			</div>
			<h2 class="text-2xl font-bold">How many letters?</h2>
			<div class="flex items-center justify-center gap-2">
				<div class="w-40">
					<Slider.Root
						type="single"
						bind:value
						class="relative flex w-full touch-none items-center select-none"
						min={4}
						max={9}
						step={1}
					>
						<span
							class="relative h-2 w-full grow cursor-pointer overflow-hidden rounded-full bg-zinc-300 dark:bg-zinc-700"
						>
							<Slider.Range class="bg-foreground absolute h-full" />
						</span>
						<Slider.Thumb
							index={0}
							class={cn(
								'block size-[25px] cursor-pointer rounded-full border bg-zinc-800 shadow-sm transition-colors focus:border-zinc-300 dark:bg-zinc-200 dark:focus:border-zinc-600'
							)}
						/>
					</Slider.Root>
				</div>

				<NumberFlow
					locales="en-US"
					willChange
					{value}
					aria-hidden="true"
					plugins={[continuous]}
					opacityTiming={{
						duration: 250,
						easing: 'ease-out'
					}}
					transformTiming={{
						easing: `linear(0, 0.0033 0.8%, 0.0263 2.39%, 0.0896 4.77%, 0.4676 15.12%, 0.5688, 0.6553, 0.7274, 0.7862, 0.8336 31.04%, 0.8793, 0.9132 38.99%, 0.9421 43.77%, 0.9642 49.34%, 0.9796 55.71%, 0.9893 62.87%, 0.9952 71.62%, 0.9983 82.76%, 0.9996 99.47%)`,
						duration: 500
					}}
					class="text-xl font-semibold"
				/>
			</div>
			<a
				href={`/game/custom?letters=${value}`}
				class="w-full cursor-pointer rounded-xl border-2 border-zinc-300 bg-zinc-200 p-3 text-center transition-colors hover:bg-zinc-300 dark:bg-zinc-800 dark:hover:bg-zinc-700"
				onclick={() => (popupOpen = false)}
				data-sveltekit-reload
			>
				<h2 class="font-semibold">Start Puzzle</h2>
			</a>
		</div>
	</div>
{/if}
