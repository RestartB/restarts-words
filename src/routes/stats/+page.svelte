<script lang="ts">
	import { authClient } from '$lib/auth-client';
	const session = authClient.useSession();

	let { data } = $props();

	// Extract the data from the server load function
    const { userStats, authenticated, error } = data;
	console.log('User Data:', userStats);
</script>

<div class="flex min-h-screen w-full items-center justify-center">
	<div class="flex flex-col items-center gap-4">
		<div
			class="flex h-fit w-fit max-w-lg flex-col items-center justify-center gap-4 rounded-xl border-4 border-zinc-200 bg-zinc-100 p-6"
		>
			<h1 class="text-3xl font-bold">Stats</h1>
			<p>Account ID: {userStats?.id}</p>
			<p>Last Day Completed: {userStats?.lastCompletedDaily}</p>
			<p>Total Days Completed: {userStats?.dailyCompleted}</p>
			<p>Total Days Won: {userStats?.dailyWon}</p>
			<p>Streak: {userStats?.dailyStreak}</p>
			<p>Custom games played: {userStats?.customCompleted}</p>
			<p>Custom games won: {userStats?.customWon}</p>
		</div>
	</div>
</div>
