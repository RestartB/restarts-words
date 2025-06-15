<script lang="ts">
	import { fly } from 'svelte/transition';
	import { onMount } from 'svelte';
	import { Confetti } from 'svelte-confetti';

	import { CircleCheck, CircleX } from '@lucide/svelte';

	// Get data from the page data
	let { data } = $props();
	const { fiveLetterWords, dailyWord, day } = data;

	const word = dailyWord.toUpperCase().split('');
	const length = word.length;

	let rows: string[][] = $state(Array.from({ length: 6 }, () => Array(length).fill('')));
	let rowStatuses: number[][] = $state(Array.from({ length: 6 }, () => Array(length).fill(null)));

	let position = $state(0);
	let currentRow = $state(0);
	let attempts = $state(0); // Track the number of attempts

	let hasWon = $state(false);
	let hasLost = $state(false);
	let playing = $state(true);

	function handleKeyPress(event: KeyboardEvent) {
		const key = event.key.toUpperCase();
		if (!playing) return; // Don't handle keys if game is over
		if (event.repeat) return; // Ignore repeated key presses

		// Prevent default behavior for game keys
		if (
			key === 'BACKSPACE' ||
			key === 'ENTER' ||
			key === 'ARROWLEFT' ||
			key === 'ARROWRIGHT' ||
			(key.length === 1 && key >= 'A' && key <= 'Z')
		) {
			event.preventDefault();
		}

		if (key === 'BACKSPACE') {
			// Handle backspace - remove character at current position or move back and remove
			if (rows[currentRow][position] !== '') {
				// If there's a character at current position, remove it
				rows[currentRow][position] = '';
			} else if (position > 0) {
				// If current position is empty, move back and remove previous character
				position--;
				rows[currentRow][position] = '';
			}
		} else if (key === 'ARROWLEFT') {
			// Move cursor left
			if (position > 0) {
				position--;
			}
		} else if (key === 'ARROWRIGHT') {
			// Move cursor right
			if (position < length - 1) {
				position++;
			}
		} else if (key.length === 1 && key >= 'A' && key <= 'Z') {
			rows[currentRow][position] = key; // Set the character at the current position
			if (position < length - 1) {
				// Move cursor to the right if not at the end of the row
				position++;
			}
		} else if (key === 'ENTER') {
			// Check if the current row is filled
			if (rows[currentRow].every((char) => char !== '')) {
				// Check if the word is valid
				if (fiveLetterWords.includes(rows[currentRow].join('').toLowerCase())) {
					position = length; // Move position to the end of the row

					// Check each tile
					for (let i = 0; i < rows[currentRow].length; i++) {
						setTimeout(() => {
							const char = rows[currentRow][i];
							if (char === word[i]) {
								rowStatuses[currentRow][i] = 2; // Correct position
							} else if (word.includes(char)) {
								rowStatuses[currentRow][i] = 1; // Wrong position
							} else {
								rowStatuses[currentRow][i] = 0; // Not in word
							}

							// Check for win
							if (i === rows[currentRow].length - 1) {
								if (rows[currentRow].join('') === word.join('')) {
									// Write to localStorage
									localStorage.setItem('dailyWord', dailyWord);
									localStorage.setItem('day', day.toString());
									localStorage.setItem('attempts', (currentRow + 1).toString());

									attempts = currentRow + 1;

									// Set playing to false and show confetti
									playing = false;
									setTimeout(() => {
										hasWon = true;
									}, 800);
								} else {
									currentRow++;
									position = 0;
								}
							}
						}, i * 500); // 500ms delay
					}
				} else {
					alert('Invalid word. Please try again.');
					return;
				}
			}
		}
	}

	onMount(() => {
		const storedWord = localStorage.getItem('dailyWord');
		const storedDay = localStorage.getItem('day');
		const storedAttempts = localStorage.getItem('attempts');

		if (storedWord && storedDay && storedAttempts) {
			const parsedDay = parseInt(storedDay, 10);
			attempts = parseInt(storedAttempts, 10);
			if (parsedDay === day) {
				if (storedWord === dailyWord) {
					// Set playing to false and show confetti
					playing = false;
					setTimeout(() => {
						hasWon = true;
					}, 800);
					return;
				}
			}
		}

		document.addEventListener('keydown', handleKeyPress);
	});
</script>

<noscript>
	<div class="flex min-h-screen w-full items-center justify-center" in:fly={{ y: 100 }}>
		<div class="flex flex-col items-center gap-4">
			<div
				class="flex h-fit w-fit max-w-lg flex-col items-center justify-center gap-4 rounded-xl border-4 border-zinc-400 bg-zinc-100 p-6 text-center"
			>
				<CircleX size="64" color="red" />
				<h1 class="text-3xl font-bold">Enable JavaScript</h1>
				<p class="text-xl">
					To play this game, please enable JavaScript in your browser settings, or switch to a
					browser that supports JavaScript.
				</p>
			</div>
		</div>
	</div>

	<style>
		.game {
			display: none;
		}
	</style>
</noscript>

<div class="flex min-h-screen w-full items-center justify-center">
	{#if hasWon}
		<div
			style="
					position: fixed;
					top: -50px;
					left: 0;
					height: 100%;
					width: 100%;
					display: flex;
					justify-content: center;
					overflow: hidden;
					pointer-events: none;"
		>
			<Confetti
				x={[-5, 5]}
				y={[0, 0.1]}
				infinite
				duration={3000}
				amount={500}
				fallDistance="100vh"
			/>
		</div>

		<div class="flex min-h-screen w-full items-center justify-center" in:fly={{ y: 100 }}>
			<div class="flex flex-col items-center gap-4">
				<div
					class="flex h-fit w-fit max-w-lg flex-col items-center justify-center gap-4 rounded-xl border-4 border-zinc-400 bg-zinc-100 p-6 text-center"
				>
					<CircleCheck size="64" color="green" />
					<h1 class="text-3xl font-bold">Congratulations!</h1>
					<p class="text-xl">
						You guessed the word <strong>{word.join('')}</strong> in
						<strong>{attempts}</strong> guesses.
					</p>
				</div>
			</div>
		</div>
	{:else if hasLost}
		<div class="flex min-h-screen w-full items-center justify-center" in:fly={{ y: 100 }}>
			<div class="flex flex-col items-center gap-4">
				<div
					class="flex h-fit w-fit max-w-lg flex-col items-center justify-center gap-4 rounded-xl border-4 border-zinc-400 bg-zinc-100 p-6 text-center"
				>
					<CircleX size="64" color="red" />
					<h1 class="text-3xl font-bold">Uh oh!</h1>
					<p class="text-xl">
						You couldn't guess the word in 6 guesses. The word was <strong>{word.join('')}</strong>.
					</p>
				</div>
			</div>
		</div>
	{:else if playing}
		<div class="flex flex-col items-center gap-2" out:fly={{ y: 100 }} id="game">
			<div class="flex w-full items-center justify-between">
				<h1 class="rounded-full border-2 border-zinc-400 bg-zinc-100 p-1 px-4 font-bold">
					Daily Puzzle
				</h1>
				<p class="font-smibold rounded-full border-2 border-zinc-400 bg-zinc-100 p-1 px-4">
					Day {day}
				</p>
			</div>
			<div
				class="flex h-fit w-fit max-w-lg flex-col items-center justify-center gap-4 rounded-xl border-4 border-zinc-400 bg-zinc-100 p-6"
			>
				{#each Array.from({ length: 6 }) as _, row}
					<div class="flex items-center justify-center gap-2">
						{#each Array.from({ length }) as _, i}
							<!-- svelte-ignore a11y_click_events_have_key_events -->
							<!-- svelte-ignore a11y_no_static_element_interactions -->
							<div
								class="box-border flex min-h-20 w-20 items-center justify-center rounded-lg border-2 border-zinc-400 text-center transition-colors"
								class:cursor-pointer={row === currentRow}
								class:bg-zinc-200={position === i && row === currentRow}
								class:bg-zinc-300={rowStatuses[row][i] === 0}
								class:bg-orange-300={rowStatuses[row][i] === 1}
								class:bg-green-300={rowStatuses[row][i] === 2}
								onclick={() => {
									if (row === currentRow) {
										position = i;
									}
								}}
							>
								<span class="text-4xl font-bold" transition:fly={{ y: 20 }}>{rows[row][i]}</span>
							</div>
						{/each}
					</div>
				{/each}
			</div>
		</div>
	{/if}
</div>
