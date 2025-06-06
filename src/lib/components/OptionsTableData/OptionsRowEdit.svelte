<script lang="ts">
  import type { OptionsBaseTable } from "$lib/app-types";

  interface OptionsRowEditProps {
    row: OptionsBaseTable;
    mode: "edit" | "add" | null;
  }

  let { row, mode }: OptionsRowEditProps = $props();
</script>

{#snippet renderBoolean(value: boolean)}
  {#if value}
    <i class="error-text">visibility_off</i>
  {:else}
    <i>visibility</i>
  {/if}
{/snippet}

<tr>
  <td>{row.id}</td>
  <td style:width="5rem">{@render renderBoolean(row.active)}</td>
  <td>{row.code}</td>
  <td>{row.name}</td>
  <td>{row.description}</td>
  <td style:width="5rem">
    {#if mode === "edit"}
      <button class="transparent circle small">
        <i>cancel</i>
      </button>
    {:else}
      <button class="transparent circle small">
        <i>edit</i>
      </button>
    {/if}
  </td>
</tr>
