<script lang="ts">
	import { HomeIcon, CircleUser } from '@lucide/svelte';
	import { authClient } from '$lib/auth-client';
	const session = authClient.useSession();
	let width: number;
</script>

<svelte:body bind:clientWidth={width} />

<header
	class="fixed right-0 left-0 z-50 mb-auto flex w-full items-center justify-center px-4"
	style="view-transition-name='header'"
>
	<div
		class="flex w-full max-w-3xl items-center justify-between gap-4 rounded-lg border-4 border-zinc-300 bg-zinc-100 p-2 px-4 shadow-md dark:bg-zinc-800"
	>
		<h1 class="font-bold text-nowrap">Restart Words</h1>
		<div
			class="flex w-full max-w-full items-center justify-center gap-2 overflow-hidden text-nowrap"
		>
			{#if width > 460}
				{#if $session.data}
					<img
						src={$session?.data?.user.image}
						alt="User Avatar"
						width="24"
						height="24"
						class="flex-shrink-0 rounded-full border-1"
					/>
					<p class="max-w-[80%] overflow-ellipsis">{$session?.data?.user.name}</p>
				{:else}
					<CircleUser size="24" class="flex-shrink-0" />
					<p class="max-w-[80%] overflow-hidden overflow-ellipsis">Not signed in</p>
				{/if}
			{/if}
		</div>
		<a
			href="/"
			class="flex items-center justify-center gap-2 transition-colors hover:text-zinc-800 dark:hover:text-zinc-200"
		>
			<HomeIcon />
			{#if width > 320}
				Home
			{/if}
		</a>
	</div>
</header>
