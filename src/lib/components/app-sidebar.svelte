<script lang="ts">
	import { page } from '$app/state';
	import { authClient } from '$lib/auth-client';
	import { goto } from '$app/navigation';
	import logo from '$lib/assets/logo.png';
	import {
		Home,
		CheckSquare,
		Calendar,
		Settings,
		UserPlus,
		LogOut,
		User,
		Plus,
		Folder,
		Trash2
	} from 'lucide-svelte';

	// Import sidebar components as namespace
	import * as Sidebar from '$lib/components/ui/sidebar';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import { Button } from '$lib/components/ui/button';
	import ToggleThemes from '$lib/components/toggle-themes.svelte';
	import { createMutation, createQuery, useQueryClient } from '@tanstack/svelte-query';
	import { client } from '$lib/eden';
	import { toast } from 'svelte-sonner';

	// Delete modal state
	let deleteCategoryId = $state<string | null>(null);
	let deleteCategoryName = $state<string>('');

	// Reactive pathname
	let pathname = $derived(page.url.pathname);

	const session = authClient.useSession();
	const queryClient = useQueryClient();

	const categoryQuery = createQuery(() => ({
		queryKey: ['categories'],
		queryFn: async () => (await client.categories.get()).data
	}));

	const deleteCategoryMutation = createMutation(() => ({
		mutationKey: ['delete', deleteCategoryId],
		mutationFn: async () => {
			try {
				const response = await client.categories.remove({ id: deleteCategoryId! }).delete();

				if (response.error) {
					toast.error('Failed to delete category');
					return;
				}

				toast.success('Category deleted successfully');

				if (pathname === `/category/${deleteCategoryId}`) {
					goto('/');
				}

				closeDeleteModal();
			} catch (error) {
				toast.error('An error occurred while deleting');
			}
		},
		onSuccess: () => {
			queryClient.refetchQueries({ queryKey: ['categories'] });
		}
	}));

	// Menu items
	const menuItems = [
		{ href: '/', icon: Home, label: 'Home' },
		{ href: '/tasks', icon: CheckSquare, label: 'My Tasks' },
		{ href: '/calendar', icon: Calendar, label: 'Calendar' },
		{ href: '/settings', icon: Settings, label: 'Settings' }
	];

	// Helper function
	function isActive(href: string): boolean {
		return pathname === href;
	}

	// Logout handler
	function handleLogout() {
		authClient.signOut().then(() => {
			goto('/auth');
		});
	}

	function openDeleteModal(categoryId: string, categoryName: string) {
		deleteCategoryId = categoryId;
		deleteCategoryName = categoryName;
	}

	function closeDeleteModal() {
		deleteCategoryId = null;
		deleteCategoryName = '';
	}
</script>

<Sidebar.Root variant="floating" collapsible="icon">
	<Sidebar.Header>
		<Sidebar.Menu>
			<Sidebar.MenuItem>
				<div class="flex w-full items-center justify-between px-2 py-2">
					<a
						href="/"
						class="flex items-center gap-2 transition-opacity group-data-[collapsible=icon]:hidden hover:opacity-80"
					>
						<img src={logo} alt="Todos Logo" class="h-10 w-10 rounded-full object-cover" />
						<h1 class="text-xl font-bold text-sidebar-foreground">Todos</h1>
					</a>
					<Sidebar.Trigger class="ml-auto" />
				</div>
			</Sidebar.MenuItem>
		</Sidebar.Menu>

		<Sidebar.Menu>
			<Sidebar.MenuItem>
				{#if $session.isPending}
					<Skeleton class="h-10 w-full" />
				{:else}
					<div class="flex h-10 w-full items-center gap-2 rounded-sm border-2 p-2">
						<User size={20} />
						{#if $session.data?.user}
							<h2 class="group-data-[collapsible=icon]:hidden">
								{$session.data.user.name}
							</h2>
						{:else}
							<h2 class="group-data-[collapsible=icon]:hidden">Guest</h2>
						{/if}
					</div>
				{/if}
			</Sidebar.MenuItem>
		</Sidebar.Menu>
	</Sidebar.Header>

	<Sidebar.Content>
		<Sidebar.Group>
			<Sidebar.GroupLabel>Navigation</Sidebar.GroupLabel>
			<Sidebar.GroupContent>
				<Sidebar.Menu>
					{#each menuItems as item (item.href)}
						<Sidebar.MenuItem>
							<Sidebar.MenuButton isActive={isActive(item.href)}>
								{#snippet child({ props })}
									<a href={item.href} {...props}>
										<item.icon size={20} />
										<span>{item.label}</span>
									</a>
								{/snippet}
							</Sidebar.MenuButton>
						</Sidebar.MenuItem>
					{/each}
				</Sidebar.Menu>
			</Sidebar.GroupContent>
		</Sidebar.Group>

		<Sidebar.Group>
			<Sidebar.GroupLabel>Categories</Sidebar.GroupLabel>
			<Sidebar.GroupContent>
				<Sidebar.Menu>
					<!-- Create New Category Button -->
					{#if $session.data?.user}
						<Sidebar.MenuItem>
							<Sidebar.MenuButton isActive={isActive('/category/new')}>
								{#snippet child({ props })}
									<a href="/category/new" {...props}>
										<Plus size={20} />
										<span>Create New</span>
									</a>
								{/snippet}
							</Sidebar.MenuButton>
						</Sidebar.MenuItem>
					{/if}

					<!-- Categories List -->
					{#if $session.data?.user && categoryQuery.isLoading}
						<!-- Loading skeleton -->
						{#each [1, 2, 3] as i (i)}
							<Sidebar.MenuItem>
								<Sidebar.MenuSkeleton />
							</Sidebar.MenuItem>
						{/each}
					{:else if $session.data?.user && categoryQuery.data && categoryQuery.data?.length > 0}
						<!-- Render categories -->
						{#each categoryQuery.data as category (category.id)}
							<Sidebar.MenuItem>
								<div
									class="group/item relative flex w-full items-center rounded-md border p-1.5"
									style="background-color: {category.color}15; border-color: {category.color};"
								>
									<Sidebar.MenuButton
										isActive={isActive(`/category/${category.id}`)}
										class="peer flex-1"
									>
										{#snippet child({ props })}
											<a href="/category/{category.id}" {...props} class="flex gap-2">
												<Folder size={20} style="color: {category.color}" />
												<span class="group-data-[collapsible=icon]:hidden">{category.name}</span>
											</a>
										{/snippet}
									</Sidebar.MenuButton>

									<!-- Delete Button - Shows on hover -->
									<Button
										variant="ghost"
										size="icon"
										class="absolute right-1 h-6 w-6 opacity-0 transition-opacity group-hover/item:opacity-100 group-data-[collapsible=icon]:hidden hover:bg-destructive/10 hover:text-destructive"
										onclick={(e) => {
											openDeleteModal(category.id, category.name);
										}}
									>
										<Trash2 size={14} />
									</Button>
								</div>
							</Sidebar.MenuItem>
						{/each}
					{:else if $session.data?.user}
						<!-- Empty state when logged in -->
						<Sidebar.MenuItem>
							<div
								class="px-2 py-2 text-sm text-muted-foreground group-data-[collapsible=icon]:hidden"
							>
								No categories yet
							</div>
						</Sidebar.MenuItem>
					{/if}
				</Sidebar.Menu>
			</Sidebar.GroupContent>
		</Sidebar.Group>
	</Sidebar.Content>

	<Sidebar.Footer>
		<Sidebar.Menu>
			<!-- Dark Mode Toggle -->
			<Sidebar.MenuItem>
				<ToggleThemes />
			</Sidebar.MenuItem>

			<!-- Auth Buttons -->
			<Sidebar.MenuItem>
				{#if $session.isPending}
					<div class="flex items-center gap-2 rounded-md px-2 py-2">
						<div class="h-5 w-5 animate-pulse rounded bg-muted"></div>
						<div
							class="h-4 flex-1 animate-pulse rounded bg-muted group-data-[collapsible=icon]:hidden"
						></div>
					</div>
				{:else if !$session.data?.user}
					<Sidebar.MenuButton
						onclick={() => goto('/auth')}
						class="bg-primary text-primary-foreground hover:bg-primary/90"
					>
						<UserPlus size={20} />
						<span>Get Started</span>
					</Sidebar.MenuButton>
				{:else}
					<Sidebar.MenuButton
						onclick={handleLogout}
						class="text-destructive hover:bg-destructive/10"
					>
						<LogOut size={20} />
						<span>Logout</span>
					</Sidebar.MenuButton>
				{/if}
			</Sidebar.MenuItem>
		</Sidebar.Menu>
	</Sidebar.Footer>

	<Sidebar.Rail />
</Sidebar.Root>

<!-- Delete Confirmation Modal -->
<AlertDialog.Root open={deleteCategoryId !== null}>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Delete Category</AlertDialog.Title>
			<AlertDialog.Description>
				Are you sure you want to delete <strong>{deleteCategoryName}</strong>? This action cannot be
				undone and will remove all tasks in this category.
			</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel onclick={closeDeleteModal} disabled={deleteCategoryMutation.isPending}>
				Cancel
			</AlertDialog.Cancel>
			<AlertDialog.Action
				onclick={() => deleteCategoryMutation.mutateAsync()}
				disabled={deleteCategoryMutation.isPending}
				class="text-destructive-foreground bg-destructive hover:bg-destructive/90"
			>
				{#if deleteCategoryMutation.isPending}
					Deleting...
				{:else}
					Delete
				{/if}
			</AlertDialog.Action>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
