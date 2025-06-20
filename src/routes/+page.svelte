<script lang="ts">
	import { authClient } from '$lib/auth-client';
	const session = authClient.useSession();

	import CustomOptionsPopup from '$lib/components/CustomOptionsPopup.svelte';
	import { CalendarDays, Dice5, CircleUser } from '@lucide/svelte';

	let popupOpen = $state(false);

	async function handleSignIn() {
		try {
			await authClient.signIn.social({
				provider: 'discord',
				callbackURL: '/'
			});
		} catch (error) {
			console.error('Sign in error:', error);
		}
	}

	async function handleSignOut() {
		try {
			await authClient.signOut({
				fetchOptions: {
					onSuccess: () => {
						window.location.reload();
					}
				}
			});
		} catch (error) {
			console.error('Sign out error:', error);
		}
	}
</script>

<div class="flex w-full items-center justify-center">
	<div class="flex flex-col items-center gap-4">
		<div
			class="flex h-fit w-fit max-w-lg flex-col items-center justify-center gap-4 rounded-xl border-4 border-zinc-200 bg-zinc-100 p-6 dark:bg-zinc-800"
		>
			<h1 class="text-3xl font-bold">Restart Words</h1>
			<a
				class="flex w-full cursor-pointer items-center gap-4 rounded-xl border-2 border-zinc-300 bg-zinc-200 p-3 transition-colors hover:bg-zinc-300 dark:bg-zinc-700 dark:hover:bg-zinc-600"
				href="/game/daily"
				title="Daily Puzzle"
			>
				<CalendarDays size="48" class="flex-shrink-0" />
				<div>
					<h2 class=" font-semibold">Daily Puzzle</h2>
					<p>Complete today's word puzzle.</p>
				</div>
			</a>
			<button
				class="flex w-full cursor-pointer items-center gap-4 rounded-xl border-2 border-zinc-300 bg-zinc-200 p-3 text-left transition-colors hover:bg-zinc-300 dark:bg-zinc-700 dark:hover:bg-zinc-600"
				onclick={() => (popupOpen = true)}
			>
				<Dice5 size="48" class="flex-shrink-0" />
				<div>
					<h2 class=" font-semibold">Random Puzzle</h2>
					<p>Complete a random puzzle, with a custom amount of letters.</p>
				</div>
			</button>

			<CustomOptionsPopup bind:popupOpen />
		</div>

		<div
			class="flex h-fit w-full max-w-lg flex-col gap-4 rounded-xl border-4 border-zinc-200 bg-zinc-100 p-6 dark:bg-zinc-800"
		>
			<div class="flex items-center gap-4">
				{#if $session.data}
					<img
						src={$session?.data?.user.image}
						alt="User Avatar"
						width="48"
						height="48"
						class="rounded-full"
					/>
				{:else}
					<CircleUser size="48" class="flex-shrink-0" />
				{/if}
				<div>
					<h3 class=" font-bold">Restart Words Account</h3>
					{#if $session.data}
						<p>
							Welcome, <strong>{$session?.data?.user.name}!</strong>
						</p>
					{:else}
						<p>Want to save your stats? Use Discord to create an account!</p>
					{/if}
				</div>
			</div>

			<div class="flex w-full items-center justify-center gap-2">
				{#if $session.data}
					<a
						class="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg bg-zinc-500 px-4 py-2 text-white transition-colors hover:bg-zinc-600"
						href="/stats"
					>
						Stats
					</a>
					<button
						class="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg bg-zinc-500 px-4 py-2 text-white transition-colors hover:bg-zinc-600"
						onclick={handleSignOut}
					>
						Sign out
					</button>
				{:else}
					<button
						class="flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600"
						onclick={handleSignIn}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="16"
							height="16"
							fill="currentColor"
							class="bi bi-discord"
							viewBox="0 0 16 16"
						>
							<path
								d="M13.545 2.907a13.2 13.2 0 0 0-3.257-1.011.05.05 0 0 0-.052.025c-.141.25-.297.577-.406.833a12.2 12.2 0 0 0-3.658 0 8 8 0 0 0-.412-.833.05.05 0 0 0-.052-.025c-1.125.194-2.22.534-3.257 1.011a.04.04 0 0 0-.021.018C.356 6.024-.213 9.047.066 12.032q.003.022.021.037a13.3 13.3 0 0 0 3.995 2.02.05.05 0 0 0 .056-.019q.463-.63.818-1.329a.05.05 0 0 0-.01-.059l-.018-.011a9 9 0 0 1-1.248-.595.05.05 0 0 1-.02-.066l.015-.019q.127-.095.248-.195a.05.05 0 0 1 .051-.007c2.619 1.196 5.454 1.196 8.041 0a.05.05 0 0 1 .053.007q.121.1.248.195a.05.05 0 0 1-.004.085 8 8 0 0 1-1.249.594.05.05 0 0 0-.03.03.05.05 0 0 0 .003.041c.24.465.515.909.817 1.329a.05.05 0 0 0 .056.019 13.2 13.2 0 0 0 4.001-2.02.05.05 0 0 0 .021-.037c.334-3.451-.559-6.449-2.366-9.106a.03.03 0 0 0-.02-.019m-8.198 7.307c-.789 0-1.438-.724-1.438-1.612s.637-1.613 1.438-1.613c.807 0 1.45.73 1.438 1.613 0 .888-.637 1.612-1.438 1.612m5.316 0c-.788 0-1.438-.724-1.438-1.612s.637-1.613 1.438-1.613c.807 0 1.451.73 1.438 1.613 0 .888-.631 1.612-1.438 1.612"
							/>
						</svg>
						Sign in with Discord
					</button>
				{/if}
			</div>
		</div>
	</div>
</div>
