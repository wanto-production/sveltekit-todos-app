<script lang="ts">
	import { Menu } from 'lucide-svelte';
	import { Button } from '$lib/components/ui/button';
	import { useSidebar } from '$lib/components/ui/sidebar';
	const { toggle, isMobile } = useSidebar();
</script>

{#if isMobile}
	<Button variant="ghost" size="icon" onclick={toggle} class="md:hidden">
		<Menu className="h-5 w-5" />
	</Button>
{/if}
