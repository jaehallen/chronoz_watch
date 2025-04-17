<script lang="ts">
  import LayoutHeader from '$lib/components/LayoutHeader.svelte';
  import type { LayoutProps } from './$types';
  import { page } from '$app/state';
  import { APP_PAGES } from '$lib/defaults';
  // import { AVATAR_SRC } from '$lib/defaults';
  import { onMount } from 'svelte';

  let { data, children }: LayoutProps = $props();
  let ui: Window['ui'];
  let currentMode: ReturnType<typeof ui>;

  const resources = new Set(Object.keys(data.user.permissions));
  const routes = APP_PAGES.filter((route) => resources.has(route.resource));
  const currentPage = $derived(routes.find((route) => route.href === page.url.pathname));

  onMount(async () => {
    ui = window.ui;
    currentMode = String(ui('mode'));
    ui('mode', currentMode);
  });
</script>

<main>
  <LayoutHeader {currentPage} {routes} user={data.user} />
  <section class="responsive">
    {@render children()}
  </section>
</main>
