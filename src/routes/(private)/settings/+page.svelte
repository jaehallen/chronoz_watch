<script lang="ts">
  import type { PageData } from './$types';
  import type { AppPages } from '$lib/app-types';
  import { SETTINGS_TAB, OPTIONS_LIST } from '$lib/defaults';
  import DataTable from '$lib/components/OptionsTable.svelte';

  let { data }: { data: PageData extends Record<string, any> ? PageData : never } = $props();
  let selectedTab = $state(SETTINGS_TAB[0].title.toLowerCase());
  let selectedOptions = $state(OPTIONS_LIST[0].id);
</script>

{#snippet tabsMenu(info: AppPages)}
  <a
    href={info.href}
    class:active={info.id === selectedTab}
    onclick={() => (selectedTab = info.id || '')}
  >
    <i>{info.icon}</i>
    <span>{info.title}</span>
  </a>
{/snippet}

{#snippet optionsMenu({ id, href, title }: AppPages)}
  {@const isSelected = selectedOptions === id}
  <div class="row left-align">
    <a
      {href}
      class={['max right-align', isSelected ? 'bold link' : 'inverse-link']}
      onclick={() => (selectedOptions = id)}>{title}</a
    >
    <i>{isSelected ? 'arrow_right' : ''}</i>
  </div>
{/snippet}

<article class="large-margin">
  <div>
    <div class="tabs left-align">
      {#each SETTINGS_TAB as info}
        {@render tabsMenu(info)}
      {/each}
    </div>
    <div id="options" class="page padding" class:active={selectedTab === 'options'}>
      <div class="grid">
        <div class="m2">
          {#each OPTIONS_LIST as opt}
            {@render optionsMenu(opt)}
          {/each}
        </div>
        <div class="m10">
          <DataTable data={data[selectedOptions]} />
        </div>
      </div>
    </div>

    <div id="access" class="page padding" class:active={selectedTab === 'access'}>
      <h5>User Access</h5>
    </div>
  </div>
</article>
