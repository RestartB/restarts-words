<script lang="ts">
	import { HomeIcon, CircleUser } from '@lucide/svelte';
	import { authClient } from '$lib/auth-client';
	const session = authClient.useSession();
</script>

<header
	class="fixed right-0 left-0 z-50 mb-auto flex w-full items-center justify-center px-4"
	style="view-transition-name='header'"
>
	<div
		class="flex w-full max-w-3xl items-center justify-between rounded-lg border-4 border-zinc-300 bg-zinc-100 p-2 px-4 shadow-md dark:bg-zinc-800"
	>
		<h1 class=" font-bold">Restart Words</h1>
		<div class="flex items-center justify-center gap-2">
			{#if $session.data}
				<img
					src={$session?.data?.user.image}
					alt="User Avatar"
					width="24"
					height="24"
					class="rounded-full border-1"
				/>
				<p class="hidden sm:block">{$session?.data?.user.name}</p>
			{:else}
				<CircleUser size="24" class="flex-shrink-0" />
				<p class="hidden sm:block">Not signed in</p>
			{/if}
		</div>
		<a
			href="/"
			class="flex items-center justify-center gap-2 transition-colors hover:text-zinc-800 dark:hover:text-zinc-200"
		>
			<HomeIcon />
			Home
		</a>
	</div>
</header>
