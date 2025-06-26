<script lang="ts">
	import "material-dynamic-colors";
	import "beercss/dist/cdn/beer.min.css";
	import { ui } from "beercss/dist/cdn/beer.min.js";
	import "../../style.css";

	import LayoutHeader from "$lib/components/LayoutHeader.svelte";
	import type { LayoutProps } from "./$types";
	import { page } from "$app/state";
	// import { AVATAR_SRC } from '$lib/defaults';
	import { onMount } from "svelte";
	import { fly, slide } from "svelte/transition";

	let { data, children }: LayoutProps = $props();
	let currentMode: ReturnType<typeof ui>;

	const currentPage = $derived(
		[...data.userRoutes, ...data.settingRoutes].find((route) => route.href === page.url.pathname),
	);

	onMount(async () => {
		currentMode = String(ui("mode"));
		ui("mode", currentMode);
	});
</script>

<LayoutHeader {currentPage} userRoutes={data.userRoutes} settingRoutes={data.settingRoutes} user={data.user} />

{#key page.url.pathname}
	<main in:fly={{ x: -200, duration: 300, delay: 300 }} out:fly={{ x: 200, duration: 300 }}>
		{@render children()}
	</main>
{/key}
