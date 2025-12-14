<script lang="ts">
	import { createForm } from '@tanstack/svelte-form';
	import { goto } from '$app/navigation';
	import { CheckCircle2, Eye, EyeOff, Loader2, XCircle } from 'lucide-svelte';

	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { loginSchema } from '$lib/schemas';
	import { cn } from '$lib/utils';
	import { authClient } from '$lib/auth-client';

	let showPassword = $state(false);

	const form = createForm(() => ({
		defaultValues: {
			email: '',
			password: ''
		},
		validators: {
			onChange: loginSchema
		},
		onSubmit: async ({ value }) => {
			const result = await authClient.signIn.email({
				email: value.email,
				password: value.password
			});

			if (!result.error) {
				goto('/');
			}
		}
	}));

	function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		e.stopPropagation();
		form.handleSubmit();
	}
</script>

<Card.Root class="w-87.5 rounded-xl border border-gray-200 shadow-lg dark:border-gray-700">
	<Card.Header class="pb-3 text-center">
		<Card.Title class="text-2xl font-bold">Welcome Back</Card.Title>
		<Card.Description class="text-gray-600 dark:text-gray-400">
			Sign in to your account to continue
		</Card.Description>
	</Card.Header>

	<form onsubmit={handleSubmit}>
		<Card.Content class="grid gap-5">
			<div class="space-y-4">
				<!-- Email Field -->
				<form.Field name="email">
					{#snippet children({ state, handleChange, handleBlur })}
						{@const hasError = state.meta.isTouched && state.meta.errors.length > 0}
						<div class="grid gap-2">
							<Label
								for="email"
								class={cn(
									'text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
									hasError && 'text-red-600 dark:text-red-400'
								)}
							>
								Email or Username
							</Label>
							<Input
								id="email"
								name="email"
								type="text"
								value={state.value}
								oninput={(e) => handleChange(e.currentTarget.value)}
								onblur={handleBlur}
								placeholder="john@doe.com or johndoe"
								class={cn(
									'transition-colors',
									hasError && 'border-red-500 focus-visible:ring-red-500 dark:border-red-400'
								)}
								aria-invalid={hasError}
							/>
							{#if hasError}
								<p
									class="flex items-start gap-1 text-sm font-medium text-red-600 dark:text-red-400"
								>
									<span class="mt-0.5 inline-block">⚠</span>
									<span>{state.meta.errors[0]?.message}</span>
								</p>
							{/if}
						</div>
					{/snippet}
				</form.Field>

				<!-- Password Field -->
				<form.Field name="password">
					{#snippet children({ state, handleChange, handleBlur })}
						{@const hasError = state.meta.isTouched && state.meta.errors.length > 0}
						<div class="grid gap-2">
							<Label
								for="password"
								class={cn(
									'text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
									hasError && 'text-red-600 dark:text-red-400'
								)}
							>
								Password
							</Label>
							<div class="relative">
								<Input
									id="password"
									name="password"
									type={showPassword ? 'text' : 'password'}
									value={state.value}
									oninput={(e) => handleChange(e.currentTarget.value)}
									onblur={handleBlur}
									placeholder="••••••••"
									class={cn(
										'pr-10 transition-colors',
										hasError && 'border-red-500 focus-visible:ring-red-500 dark:border-red-400'
									)}
									aria-invalid={hasError}
								/>
								<Button
									type="button"
									variant="ghost"
									size="sm"
									class="absolute top-0 right-0 h-full px-3 py-2"
									onclick={() => (showPassword = !showPassword)}
									aria-label={showPassword ? 'Hide password' : 'Show password'}
								>
									{#if showPassword}
										<EyeOff class="h-4 w-4 text-gray-500 dark:text-gray-400" />
									{:else}
										<Eye class="h-4 w-4 text-gray-500 dark:text-gray-400" />
									{/if}
								</Button>
							</div>
							{#if hasError}
								<p
									class="flex items-start gap-1 text-sm font-medium text-red-600 dark:text-red-400"
								>
									<span class="mt-0.5 inline-block">⚠</span>
									<span>{state.meta.errors[0]?.message}</span>
								</p>
							{/if}
						</div>
					{/snippet}
				</form.Field>
			</div>
		</Card.Content>

		<Card.Footer class="flex flex-col gap-4 pt-2">
			<form.Subscribe>
				{#snippet children({ canSubmit, isSubmitting })}
					<Button type="submit" disabled={!canSubmit || isSubmitting} class="w-full">
						{#if isSubmitting}
							<Loader2 class="mr-2 h-4 w-4 animate-spin" />
							Signing in...
						{:else}
							Sign In
						{/if}
					</Button>
				{/snippet}
			</form.Subscribe>
		</Card.Footer>
	</form>
</Card.Root>
