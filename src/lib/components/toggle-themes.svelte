<script lang="ts">
	import { theme, toggleMode } from 'mode-watcher';

	import { SidebarMenuButton } from '$lib/components/ui/sidebar';
	import { Sun, Moon } from 'lucide-svelte';

	let title = $derived.by(() => {
		return theme.current == 'light' ? 'Light Mode' : 'Dark Mode';
	});
</script>

<SidebarMenuButton onclick={toggleMode}>
	{#if theme.current === 'light'}
		<Sun size={20} />
	{:else}
		<Moon size={20} />
	{/if}
	<span>{title}</span>
</SidebarMenuButton>
