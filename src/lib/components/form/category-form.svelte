<script lang="ts">
	import { createForm } from '@tanstack/svelte-form';
	import { CheckCircle2, Folder, Loader2, XCircle } from 'lucide-svelte';

	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Textarea } from '$lib/components/ui/textarea';
	import { categorySchema } from '$lib/schemas';
	import { cn } from '$lib/utils';
	import { client } from '$lib/eden';
	import { useQueryClient } from '@tanstack/svelte-query';

	const queryClient = useQueryClient();

	//@ts-ignore
	const form = createForm(() => ({
		defaultValues: {
			name: '',
			description: '',
			color: '#3b82f6'
		},
		validators: {
			//@ts-ignore
			onChange: categorySchema
		},
		onSubmit: async ({ value }) => {
			const result = await client.categories.new.post(value);

			if (result.data?.status == 'success') {
				form.reset();
				queryClient.refetchQueries({ queryKey: ['categories'] });
			}
		}
	}));

	function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		e.stopPropagation();
		form.handleSubmit();
	}

	function handleReset() {
		form.reset();
	}
</script>

<Card.Root class="w-full max-w-md rounded-xl border shadow-lg">
	<Card.Header class="pb-3 text-center">
		<Card.Title class="text-2xl font-bold">New Category</Card.Title>
		<Card.Description>Create a new category to organize your content</Card.Description>
	</Card.Header>

	<form onsubmit={handleSubmit}>
		<Card.Content class="grid gap-5">
			<div class="space-y-4">
				<!-- Name Field -->
				<form.Field name="name">
					{#snippet children({ state, handleChange, handleBlur })}
						{@const hasError = state.meta.isTouched && state.meta.errors.length > 0}
						<div class="grid gap-2">
							<Label
								for="name"
								class={cn(
									'text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
									hasError && 'text-red-600 dark:text-red-400'
								)}
							>
								Category Name
							</Label>
							<Input
								id="name"
								name="name"
								type="text"
								value={state.value}
								oninput={(e) => handleChange(e.currentTarget.value)}
								onblur={handleBlur}
								placeholder="e.g., Technology"
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

				<!-- Description Field -->
				<form.Field name="description">
					{#snippet children({ state, handleChange, handleBlur })}
						{@const hasError = state.meta.isTouched && state.meta.errors.length > 0}
						<div class="grid gap-2">
							<Label
								for="description"
								class={cn(
									'text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
									hasError && 'text-red-600 dark:text-red-400'
								)}
							>
								Description (Optional)
							</Label>
							<Textarea
								id="description"
								name="description"
								value={state.value}
								oninput={(e) => handleChange(e.currentTarget.value)}
								onblur={handleBlur}
								placeholder="Brief description of this category..."
								rows={3}
								class={cn(
									'resize-none transition-colors',
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

				<!-- Color Field -->
				<div class="grid grid-cols-2 gap-4">
					<form.Field name="color">
						{#snippet children({ state, handleChange, handleBlur })}
							{@const hasError = state.meta.isTouched && state.meta.errors.length > 0}
							<div class="grid gap-2">
								<Label
									for="color"
									class={cn(
										'text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
										hasError && 'text-red-600 dark:text-red-400'
									)}
								>
									Color
								</Label>
								<div class="flex items-center gap-3">
									<Input
										id="color"
										name="color"
										type="color"
										value={state.value}
										oninput={(e) => handleChange(e.currentTarget.value)}
										onblur={handleBlur}
										class="h-10 w-20 cursor-pointer p-1"
									/>
									<span class="font-mono text-sm text-muted-foreground">
										{state.value}
									</span>
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
			</div>

			<!-- Preview -->
			<form.Subscribe>
				{#snippet children({ values })}
					{#if values.name}
						<div class="border-t pt-4">
							<p class="mb-3 text-sm text-muted-foreground">Preview:</p>
							<div
								class="flex items-center gap-3 rounded-lg border-2 p-4 transition-all"
								style="border-color: {values.color}; background-color: {values.color}15;"
							>
								<div class="flex items-center gap-3">
									<Folder size={30} color={values.color} />
									<h3 class="font-semibold">{values.name}</h3>
									{#if values.description}
										<p class="mt-1 text-sm text-muted-foreground">
											{values.description}
										</p>
									{/if}
								</div>
							</div>
						</div>
					{/if}
				{/snippet}
			</form.Subscribe>
		</Card.Content>

		<Card.Footer class="flex flex-col gap-4 pt-2">
			<form.Subscribe>
				{#snippet children({ canSubmit, isSubmitting })}
					<div class="grid w-full grid-cols-2 gap-3">
						<Button type="submit" disabled={!canSubmit || isSubmitting} class="w-full">
							{#if isSubmitting}
								<Loader2 class="mr-2 h-4 w-4 animate-spin" />
								Creating...
							{:else}
								Create Category
							{/if}
						</Button>

						<Button
							type="button"
							variant="outline"
							disabled={isSubmitting}
							onclick={handleReset}
							class="w-full"
						>
							Reset
						</Button>
					</div>
				{/snippet}
			</form.Subscribe>
		</Card.Footer>
	</form>
</Card.Root>
