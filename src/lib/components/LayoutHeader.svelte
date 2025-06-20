<script lang="ts">
	import type { AppPages } from "$lib/types/app-types";

	let {
		currentPage = { href: "/profile", title: "Profile" },
		userRoutes,
		settingRoutes,
		user,
	} = $props();

	// svelte-ignore non_reactive_update
	let dialog: HTMLDialogElement;

	function onSettings(e: Event) {
		e.preventDefault();
		if (dialog.open) {
			dialog.close();
		} else {
			dialog.showModal();
		}
	}

	$effect(() => {
		if (currentPage) {
			dialog.close();
		}
	});
</script>

{#snippet appRoute(route: AppPages)}
	<a href={route.href}>
		<i>{route.icon}</i>
		<div>
			{route.title}
			{#if currentPage.href === route.href}
				<hr class="small-elevate primary" />
			{/if}
		</div>
	</a>
{/snippet}

{#snippet settingRoute(route: AppPages)}
	<li class="wave round">
		<a href={route.href}>
			<i>{route.icon}</i>
			<span class="max">{route.title}</span>
		</a>
	</li>
{/snippet}

{#if settingRoutes.length}
	<dialog class="left" bind:this={dialog} onmouseleave={() => dialog.close()}>
		<header>
			<nav>
				<i>settings</i>
				<h6 class="max">Settings</h6>
				<button class="transparent circle large" onclick={onSettings}>
					<i>close</i>
				</button>
			</nav>
		</header>
		<div class="space"></div>
		<ul class="list">
			{#each settingRoutes as route}
				{@render settingRoute(route)}
			{/each}
		</ul>
	</dialog>
{/if}

<nav class="m l left transparent">
	<header>
		<img class="circle" src="/logo.png" alt="chronoz" />
	</header>
	{#each userRoutes as route}
		{@render appRoute(route)}
	{/each}
	{#if settingRoutes.length}
		<a href="#settings" onclick={onSettings}>
			<i>settings</i>
			<div>Settings</div>
		</a>
	{/if}
</nav>
<header class="small-elevate fixed transparent">
	<nav>
		<h6 class="max">{currentPage.title}</h6>
		<h6>{user.name}</h6>
		<button class="circle transparent">
			<img class="responsive" src="/logo.png" alt="avatar" />
			<menu class="no-wrap left border">
				<li>
					<a href="/profile">
						<i class="primary-text">account_circle</i>
						<div class="max">
							<h6 class="small">{user.name}</h6>
							<span class="capitalize">{user.role}</span>
						</div>
					</a>
				</li>
				<li>
					<form action="/api/logout" method="POST">
						<i class="link">logout</i>
						<input
							class="button transparent no-padding"
							type="submit"
							value="Logout"
						/>
					</form>
				</li>
			</menu>
		</button>
	</nav>
</header>
