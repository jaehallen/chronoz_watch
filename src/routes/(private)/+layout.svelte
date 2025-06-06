<script lang="ts">
	import LayoutHeader from "$lib/components/LayoutHeader.svelte";
	import type { LayoutProps } from "./$types";
	import { page } from "$app/state";
	import { APP_PAGES } from "$lib/defaults";
	// import { AVATAR_SRC } from '$lib/defaults';
	import { onMount } from "svelte";
	import { date } from "drizzle-orm/mysql-core";

	let { data, children }: LayoutProps = $props();
	let ui: Window["ui"];
	let currentMode: ReturnType<typeof ui>;

	const resources = new Set(Object.keys(data.user.permissions));
	const currentPage = $derived(
		[...data.userRoutes, ...data.settingRoutes].find(
			(route) => route.href === page.url.pathname,
		),
	);

	onMount(async () => {
		ui = window.ui;
		currentMode = String(ui("mode"));
		ui("mode", currentMode);
	});
</script>

<main>
	<LayoutHeader
		{currentPage}
		userRoutes={data.userRoutes}
		settingRoutes={data.settingRoutes}
		user={data.user} />
	{@render children()}
</main>
