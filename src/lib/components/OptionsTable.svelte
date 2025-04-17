<script lang="ts">
  import type { OptionsBaseTable } from '$lib/app-types';
  import { OPTIONS_COLUMNS } from '$lib/data-utils/settings-data';
  import { SettingsOptionsTable } from '$lib/data-utils/table-handler.svelte';
  let { data }: { data: OptionsBaseTable[] } = $props();
  let table = new SettingsOptionsTable(data, OPTIONS_COLUMNS);
</script>

<div class="row right-align">
  <button class="border small-elevate">
    <i>add</i>
    <span>Add</span>
  </button>
</div>
<div class="small-height scroll surfac">
  <table class="border">
    <thead class="fixed">
      <tr>
        <th class="no-padding" style:width="5rem">Actions</th>
        {#each table.headers() as header}
          <th>{header.name}</th>
        {/each}
      </tr>
    </thead>
    <tbody>
      {#each data as row}
        <tr>
          <td class="no-padding">
            <button class="transparent circle small" onclick={() => console.log(row.id)}>
              <i>edit</i>
            </button>
          </td>
          {#each table.headers() as header}
            <td>{row[header.key]}</td>
          {/each}
        </tr>
      {/each}
    </tbody>
  </table>
</div>
