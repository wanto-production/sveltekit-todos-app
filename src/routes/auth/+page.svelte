<script>
	import RegisterForm from '$lib/components/form/register-form.svelte';
	import LoginForm from '$lib/components/form/login-form.svelte';
	import * as Tabs from '$lib/components/ui/tabs';
</script>

<svelte:head>
	<title>Auth</title>
	<meta name="description" content="Auth page for login and register" />
</svelte:head>

<div class="flex h-screen w-full items-center justify-center">
	<Tabs.Root value="register">
		<Tabs.List>
			<Tabs.Trigger value="register">Register</Tabs.Trigger>
			<Tabs.Trigger value="login">Login</Tabs.Trigger>
		</Tabs.List>
		<Tabs.Content value="register">
			<RegisterForm />
		</Tabs.Content>
		<Tabs.Content value="login">
			<LoginForm />
		</Tabs.Content>
	</Tabs.Root>
</div>
