<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { QueryClient, QueryClientProvider } from '@tanstack/svelte-query';
	import { browser } from '$app/environment';
	import { SvelteQueryDevtools } from '@tanstack/svelte-query-devtools';
	import { ModeWatcher } from 'mode-watcher';
	import * as Sidebar from '$lib/components/ui/sidebar';
	import AppSidebar from '$lib/components/app-sidebar.svelte';
	import MobileTrigger from '$lib/components/mobile-trigger.svelte';

	let { children } = $props();

	const client = new QueryClient({
		defaultOptions: {
			queries: {
				enabled: browser
			}
		}
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<QueryClientProvider {client}>
	<Sidebar.Provider>
		<AppSidebar />
		<Sidebar.Inset>
			<header
				class="fixed top-0 z-10 flex items-center gap-4 border-b bg-background px-4 py-3 md:hidden"
			>
				<MobileTrigger />
				<h1 class="font-semibold">Todos</h1>
			</header>
			<main class="flex-1">
				{@render children()}
			</main>
		</Sidebar.Inset>
	</Sidebar.Provider>
	<SvelteQueryDevtools />
	<ModeWatcher />
</QueryClientProvider>
