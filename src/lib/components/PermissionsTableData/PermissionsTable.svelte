<script lang="ts">
  import type {
    RolePermission,
    SettingsTableColumn,
  } from "$lib/types/app-types";

  interface RolePermissionsProps {
    data: RolePermission[];
    draft: RolePermission[];
  }

  let { data = $bindable(), draft }: RolePermissionsProps = $props();
  let draftIds = $derived(draft.map(item => item.resourceId))

  const COLUMNS: SettingsTableColumn<RolePermission>[] = [
    {
      key: "resourceId",
      label: "ID",
      info: "Resource ID",
      class: "center-align width-1",
    },
    { key: "name", label: "Resource", info: "Resource name", class: "width-2" },
    { key: "description", label: "Description", info: "Resource description" },
    {
      key: "canCreate",
      label: "Create",
      info: "Create permission",
      class: "center-align",
    },
    {
      key: "canRead",
      label: "Read",
      info: "Read permission",
      class: "center-align",
    },
    {
      key: "canUpdate",
      label: "Update",
      info: "Update permission",
      class: "center-align",
    },
    {
      key: "canDelete",
      label: "Delete",
      info: "Delete permission",
      class: "center-align",
    },
  ];
</script>

<div class="large-height scroll">
  <table class="border">
    <thead class="fixed secondary">
      <tr>
        {#each COLUMNS as col, i (i)}
          <th class={col.class ?? ""}>
            <span>
              {col.label}
              <div class="tooltip bottom medium-space">{col.info}</div>
            </span>
          </th>
        {/each}
      </tr>
    </thead>
    <tbody>
      {#each data as row (row.resourceId)}
        <tr class={[draftIds.includes(row.resourceId) ? "secondary-container" : ""]}>
          <td class="center-align">{row.resourceId}</td>
          <td>{row.name}</td>
          <td>{row.description}</td>
          {#each ["canCreate", "canRead", "canUpdate", "canDelete"] as permAction, i (i)}
            <td class="center-align">
              <label class="switch icon scaled">
                <input type="checkbox" bind:checked={row[permAction]} />
                <span>
                  <i>close</i>
                  <i>done</i>
                </span>
              </label>
            </td>
          {/each}
        </tr>
      {/each}
    </tbody>
  </table>
</div>

<style lang="css">
  table > thead {
    z-index: 2;
  }

  .width-1 {
    width: 80px;
  }

  .width-2 {
    width: 160px;
  }

  .switch.scaled {
    transform: scale(0.75); /* Adjust the scale as needed */
    transform-origin: left center;
  }

  .l-cell-apdding {
    padding-left: 1px;
  }
</style>
