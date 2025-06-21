<script lang="ts">
	import { authClient } from '$lib/auth-client';
	const session = authClient.useSession();

	import { fly } from 'svelte/transition';
	import { onMount } from 'svelte';
	import { Confetti } from 'svelte-confetti';
	import { toast } from 'svelte-sonner';

	import { CircleCheck, CircleX } from '@lucide/svelte';
	import Key from '$lib/components/Key.svelte';

	// Get data from the page data
	let { data } = $props();
	const { fiveLetterWords, dailyWord, day, accComplete, lastAttempts } = data;

	const word = dailyWord.toUpperCase().split('');
	const length = word.length;

	let rows: string[][] = $state(Array.from({ length: 6 }, () => Array(length).fill('')));
	let rowStatuses: number[][] = $state(Array.from({ length: 6 }, () => Array(length).fill(null)));

	let position = $state(0);
	let currentRow = $state(0);
	let attempts = $state(data.lastAttempts || 0);

	let hasWon = $state(false);
	let hasLost = $state(false);
	let playing = $state(true);
	let calculating = $state(false);

	let letterStatuses: Record<string, number> = $state({});

	// Get alphabet letters, set status
	const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
	alphabet.split('').forEach((letter) => {
		letterStatuses[letter] = -1; // -1 = not pressed
	});

	async function sendResult(won: boolean) {
		if ($session?.data?.user) {
			try {
				const response = await fetch('/api/validate-daily', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({ word: word.join('').toLowerCase(), wordID: day, won, attempts }),
					credentials: 'include'
				});

				if (!response.ok) {
					const error = await response.json();
					console.error('Failed to update stats:', error);
					return;
				}

				const result = await response.json();
				console.log('Stats updated');
			} catch (error) {
				console.error('Error updating stats:', error);
			}
		} else {
			console.warn('Not authenticated');
		}
	}

	function handleKeyPress(event: KeyboardEvent) {
		const key = event.key.toUpperCase();
		if (!playing) return; // Don't handle keys if game is over
		if (event.repeat) return; // Ignore repeated key presses
		if (calculating) return; // Prevent actions while calculating

		// Prevent default behavior for game keys
		if (
			key === 'BACKSPACE' ||
			key === 'ENTER' ||
			key === 'ARROWLEFT' ||
			key === 'ARROWRIGHT' ||
			key === ' ' ||
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
		} else if (key === ' ') {
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
			calculating = true;

			// Check if the current row is filled
			if (rows[currentRow].every((char) => char !== '')) {
				// Check if the word is valid
				if (fiveLetterWords.includes(rows[currentRow].join('').toLowerCase())) {
					position = length; // Move position to the end of the row

					// Calculate all statuses first (outside the setTimeout)
					const tempStatuses = Array(length).fill(-1);
					const remainingWordLetters: Record<string, number> = {};
					word.forEach((char) => {
						remainingWordLetters[char] = (remainingWordLetters[char] || 0) + 1;
					});

					// First pass: mark all correct positions (green)
					for (let j = 0; j < rows[currentRow].length; j++) {
						if (rows[currentRow][j] === word[j]) {
							tempStatuses[j] = 2; // Correct position
							remainingWordLetters[rows[currentRow][j]]--;
						}
					}

					// Second pass: mark wrong positions (orange) and not in word (gray)
					for (let j = 0; j < rows[currentRow].length; j++) {
						if (tempStatuses[j] === -1) {
							const letter = rows[currentRow][j];
							if (remainingWordLetters[letter] > 0) {
								tempStatuses[j] = 1; // Wrong position
								remainingWordLetters[letter]--;
							} else {
								tempStatuses[j] = 0; // Not in word
							}
						}
					}

					// Update letter statuses once for the entire row
					for (let j = 0; j < rows[currentRow].length; j++) {
						const letter = rows[currentRow][j];
						const status = tempStatuses[j];

						// Only update if the new status is better than the current one
						// Priority: 2 (green) > 1 (orange) > 0 (gray) > -1 (not used)
						if (letterStatuses[letter] === -1 || status > letterStatuses[letter]) {
							letterStatuses[letter] = status;
						}
					}

					// Now animate the tiles
					for (let i = 0; i < rows[currentRow].length; i++) {
						setTimeout(() => {
							// Apply the pre-calculated status for this tile
							rowStatuses[currentRow][i] = tempStatuses[i];

							// Check for win/loss only on the last tile
							if (i === rows[currentRow].length - 1) {
								if (rows[currentRow].join('') === word.join('')) {
									attempts = currentRow + 1;
									playing = false;
									sendResult(true);

									localStorage.setItem('dailyWord', dailyWord);
									localStorage.setItem('day', day.toString());
									localStorage.setItem('attempts', attempts.toString());
									localStorage.setItem('status', 'won');

									setTimeout(() => {
										hasWon = true;
									}, 800);
								} else {
									currentRow++;
									position = 0;

									if (currentRow >= 6) {
										playing = false;
										sendResult(false);

										localStorage.setItem('dailyWord', dailyWord);
										localStorage.setItem('day', day.toString());
										localStorage.setItem('attempts', attempts.toString());
										localStorage.setItem('status', 'lost');

										setTimeout(() => {
											hasLost = true;
										}, 800);
									}
								}

								calculating = false;
							}
						}, i * 500);
					}
				} else {
					// Show error if invalid word
					toast.error('Unknown word');
					calculating = false;
					return;
				}
			} else {
				// Show error if the row is not filled
				toast.error('Not enough letters');
				calculating = false;
				return;
			}
		}
	}

	onMount(() => {
		const storedWord = localStorage.getItem('dailyWord');
		const storedDay = localStorage.getItem('day');
		const storedAttempts = localStorage.getItem('attempts');
		const storedStatus = localStorage.getItem('status');

		console.log('Stored Word:', storedWord);
		console.log('Stored Day:', storedDay);
		console.log('Stored Attempts:', storedAttempts);
		console.log('Stored Status:', storedStatus);

		if (accComplete) {
			// Set playing to false and show confetti
			playing = false;
			setTimeout(() => {
				hasWon = true;
			}, 800);
			return;
		} else {
			if (storedWord && storedDay && storedAttempts) {
				const parsedDay = parseInt(storedDay, 10);
				attempts = parseInt(storedAttempts, 10);
				if (parsedDay === day) {
					if (storedWord === dailyWord) {
						if (storedStatus === 'won') {
							// Set playing to false and show confetti
							playing = false;
							setTimeout(() => {
								hasWon = true;
							}, 800);
							return;
						} else if (storedStatus === 'lost') {
							// Set playing to false and show loss message
							playing = false;
							setTimeout(() => {
								hasLost = true;
							}, 800);
							return;
						}
					}
				}
			}
		}

		document.addEventListener('keydown', handleKeyPress);
	});
</script>

<noscript>
	<div class="flex w-full items-center justify-center" in:fly={{ y: 100 }}>
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

<div class="flex w-full items-center justify-center" id="gameContainer">
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

		<div class="flex w-full items-center justify-center" in:fly={{ y: 100 }}>
			<div class="flex flex-col items-center gap-4">
				<div
					class="flex h-fit w-fit max-w-lg flex-col items-center justify-center gap-4 rounded-xl border-4 border-zinc-400 bg-zinc-100 p-6 text-center dark:bg-zinc-800"
				>
					<CircleCheck size="64" color="green" />
					<h1 class="text-3xl font-bold">Congratulations!</h1>
					<p class="text-xl">
						You guessed the word <strong>{word.join('')}</strong> in
						<strong>{attempts}</strong> guesses.
					</p>

					<a
						href="/"
						class="cursor-pointer rounded bg-gray-500 px-4 py-2 text-white transition-colors hover:bg-gray-600"
					>
						Home
					</a>
					<a
						href="/stats"
						class="cursor-pointer rounded bg-gray-500 px-4 py-2 text-white transition-colors hover:bg-gray-600"
					>
						Stats
					</a>
				</div>
			</div>
		</div>
	{:else if hasLost}
		<div class="flex w-full items-center justify-center" in:fly={{ y: 100 }}>
			<div class="flex flex-col items-center gap-4">
				<div
					class="flex h-fit w-fit max-w-lg flex-col items-center justify-center gap-4 rounded-xl border-4 border-zinc-400 bg-zinc-100 p-6 text-center dark:bg-zinc-800"
				>
					<CircleX size="64" color="red" />
					<h1 class="text-3xl font-bold">Uh oh!</h1>
					<p class="text-xl">
						You couldn't guess the word in 6 guesses. The word was <strong>{word.join('')}</strong>.
					</p>

					<a
						href="/"
						class="cursor-pointer rounded bg-gray-500 px-4 py-2 text-white transition-colors hover:bg-gray-600"
					>
						Home
					</a>
					<a
						href="/stats"
						class="cursor-pointer rounded bg-gray-500 px-4 py-2 text-white transition-colors hover:bg-gray-600"
					>
						Stats
					</a>
				</div>
			</div>
		</div>
	{:else if playing}
		<div
			class="flex h-fit w-full max-w-lg flex-col items-center gap-4"
			out:fly={{ y: 100 }}
			id="game"
		>
			<div class="flex w-full items-center justify-between">
				<h1
					class="rounded-full border-2 border-zinc-400 bg-zinc-100 p-1 px-4 font-bold dark:bg-zinc-800"
				>
					Daily Puzzle
				</h1>
				<p
					class="font-smibold rounded-full border-2 border-zinc-400 bg-zinc-100 p-1 px-4 dark:bg-zinc-800"
				>
					Day {day}
				</p>
			</div>
			<div class="max-w-full overflow-x-auto px-4">
				<div class="flex flex-col gap-4">
					{#each Array.from({ length: 6 }) as _, row}
						<div class="flex items-center justify-center gap-2">
							{#each Array.from({ length }) as _, i}
								<!-- svelte-ignore a11y_click_events_have_key_events -->
								<!-- svelte-ignore a11y_no_static_element_interactions -->
								<div
									class="overflow-hidden rounded-lg border-2 border-zinc-400 bg-zinc-100 dark:bg-zinc-900"
								>
									<div
										class="tile-size box-border flex aspect-square items-center justify-center text-center transition-colors"
										class:cursor-pointer={row === currentRow}
										class:bg-zinc-300={position === i && row === currentRow}
										class:dark:bg-zinc-700={position === i && row === currentRow}
										class:bg-zinc-400={rowStatuses[row][i] === 0}
										class:dark:bg-zinc-600={rowStatuses[row][i] === 0}
										class:bg-orange-300={rowStatuses[row][i] === 1}
										class:dark:bg-orange-600={rowStatuses[row][i] === 1}
										class:bg-green-300={rowStatuses[row][i] === 2}
										class:dark:bg-green-600={rowStatuses[row][i] === 2}
										onclick={() => {
											if (row === currentRow && !calculating) {
												position = i;
											}
										}}
									>
										<span class="text-4xl font-bold" transition:fly={{ y: 20 }}>{rows[row][i]}</span
										>
									</div>
								</div>
							{/each}
						</div>
					{/each}
				</div>
			</div>
			<div
				class="flex h-fit w-full max-w-2xl flex-col items-center justify-center gap-4 rounded-xl border-4 border-zinc-400 bg-zinc-100 p-2 py-4 sm:p-6 dark:bg-zinc-800"
			>
				<div class="flex w-full flex-nowrap items-center justify-center gap-2">
					<Key key="Q" size={48} status={letterStatuses['Q']} />
					<Key key="W" size={48} status={letterStatuses['W']} />
					<Key key="E" size={48} status={letterStatuses['E']} />
					<Key key="R" size={48} status={letterStatuses['R']} />
					<Key key="T" size={48} status={letterStatuses['T']} />
					<Key key="Y" size={48} status={letterStatuses['Y']} />
					<Key key="U" size={48} status={letterStatuses['U']} />
					<Key key="I" size={48} status={letterStatuses['I']} />
					<Key key="O" size={48} status={letterStatuses['O']} />
					<Key key="P" size={48} status={letterStatuses['P']} />
				</div>
				<div class="flex w-full flex-nowrap items-center justify-center gap-2">
					<Key key="A" size={48} status={letterStatuses['A']} />
					<Key key="S" size={48} status={letterStatuses['S']} />
					<Key key="D" size={48} status={letterStatuses['D']} />
					<Key key="F" size={48} status={letterStatuses['F']} />
					<Key key="G" size={48} status={letterStatuses['G']} />
					<Key key="H" size={48} status={letterStatuses['H']} />
					<Key key="J" size={48} status={letterStatuses['J']} />
					<Key key="K" size={48} status={letterStatuses['K']} />
					<Key key="L" size={48} status={letterStatuses['L']} />
				</div>
				<div class="flex w-full flex-nowrap items-center justify-center gap-2">
					<Key key="ENTER" size={48} status={-1} />
					<Key key="Z" size={48} status={letterStatuses['Z']} />
					<Key key="X" size={48} status={letterStatuses['X']} />
					<Key key="C" size={48} status={letterStatuses['C']} />
					<Key key="V" size={48} status={letterStatuses['V']} />
					<Key key="B" size={48} status={letterStatuses['B']} />
					<Key key="N" size={48} status={letterStatuses['N']} />
					<Key key="M" size={48} status={letterStatuses['M']} />
					<Key key="BACK" size={48} status={-1} />
				</div>
			</div>
		</div>
	{/if}
</div>

<style>
	.tile-size {
		height: clamp(3rem, 8vw, 4rem);
	}
</style>
