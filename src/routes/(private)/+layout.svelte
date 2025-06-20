<script lang="ts">
	import "material-dynamic-colors";
	import "beercss/dist/cdn/beer.min.css";
	import { ui } from "beercss/dist/cdn/beer.min.js";

	import LayoutHeader from "$lib/components/LayoutHeader.svelte";
	import type { LayoutProps } from "./$types";
	import { page } from "$app/state";
	// import { AVATAR_SRC } from '$lib/defaults';
	import { onMount } from "svelte";

	let { data, children }: LayoutProps = $props();
	let currentMode: ReturnType<typeof ui>;

	const currentPage = $derived(
		[...data.userRoutes, ...data.settingRoutes].find(
			(route) => route.href === page.url.pathname,
		),
	);

	onMount(async () => {
		currentMode = String(ui("mode"));
		ui("mode", currentMode);
	});
</script>

<LayoutHeader
	{currentPage}
	userRoutes={data.userRoutes}
	settingRoutes={data.settingRoutes}
	user={data.user}
/>

<main>
	{@render children()}
</main>
