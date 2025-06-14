<script lang="ts">
	import '../app.css';

	let { children } = $props();
</script>

<div class="w-full h-full absolute top-0 left-0 -z-10 blur-xl opacity-50 bg-center bg-cover box-border" style="background-image: url('https://picsum.photos/1920/1080');"></div>

<div class="min-h-screen w-full overflow-hidden">
	{@render children()}
</div>
