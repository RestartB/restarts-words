<script lang="ts">
	import { authClient } from '$lib/auth-client';
	const session = authClient.useSession();
	let { data } = $props();

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

	// Extract the data from the server load function
	const { userStats, authenticated, error } = data;
</script>

<div
	class="flex h-fit w-full max-w-lg flex-col items-center justify-center gap-4 rounded-xl border-4 border-zinc-200 bg-zinc-100 p-6 dark:bg-zinc-800"
>
	<h1 class="text-3xl font-bold">Stats</h1>

	{#if error}
		<p class="text-red-500">Error loading stats. Please try again later.</p>
	{:else if !authenticated}
		<p class="text-red-500">You must be logged in to view stats.</p>
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
	{:else if !userStats}
		<p class="text-gray-500">No stats available.</p>
	{:else}
		<div class="flex items-center justify-center gap-2">
			<p>for</p>
			<img
				src={data.session.user.image}
				alt="User Avatar"
				height="24"
				width="24"
				class="rounded-full"
			/>
			<p class="text-lg font-semibold">{data.session.user.name}</p>
		</div>

		<h2 class="text-xl font-bold">Daily Puzzle Stats</h2>
		<div class="grid w-full gap-4 sm:grid-cols-2">
			<div class="flex-1 rounded-lg border-2 border-zinc-300 bg-zinc-200 p-4 dark:bg-zinc-700">
				<h3 class="font-semibold">Last Day Completed</h3>
				<p>Day {userStats.lastCompletedDaily}</p>
			</div>
			<div class="flex-1 rounded-lg border-2 border-zinc-300 bg-zinc-200 p-4 dark:bg-zinc-700">
				<h3 class="font-semibold">Total Days Completed</h3>
				<p>{userStats.dailyCompleted}</p>
			</div>
			<div class="flex-1 rounded-lg border-2 border-zinc-300 bg-zinc-200 p-4 dark:bg-zinc-700">
				<h3 class="font-semibold">Total Days Won</h3>
				<p>{userStats.dailyWon}</p>
			</div>
			<div class="flex-1 rounded-lg border-2 border-zinc-300 bg-zinc-200 p-4 dark:bg-zinc-700">
				<h3 class="font-semibold">Streak</h3>
				<p>{userStats.dailyStreak} days</p>
			</div>
		</div>

		<h2 class="text-xl font-bold">Random Puzzle Stats</h2>
		<div class="grid w-full gap-4 sm:grid-cols-2">
			<div class="flex-1 rounded-lg border-2 border-zinc-300 bg-zinc-200 p-4 dark:bg-zinc-700">
				<h3 class="font-semibold">Games Played</h3>
				<p>{userStats.customCompleted}</p>
			</div>
			<div class="flex-1 rounded-lg border-2 border-zinc-300 bg-zinc-200 p-4 dark:bg-zinc-700">
				<h3 class="font-semibold">Games Won</h3>
				<p>{userStats.customWon}</p>
			</div>
		</div>
	{/if}
</div>
