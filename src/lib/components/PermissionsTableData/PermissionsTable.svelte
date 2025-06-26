<script lang="ts">
  import type { RolePermission, SettingsTableColumn } from "$lib/types/app-types";

  interface RolePermissionsProps {
    data: RolePermission[];
    draft: RolePermission[];
  }

  let { data = $bindable(), draft }: RolePermissionsProps = $props();
  let draftIds = $derived(draft.map((item) => item.resourceId));

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
    // {
    //   key: "canDelete",
    //   label: "Delete",
    //   info: "Delete permission",
    //   class: "center-align",
    // },
  ];
</script>

<div class="large-height scroll">
  <table class="border no-space">
    <thead class="fixed secondary">
      <tr class="medium-space">
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
        {@const isDraft = draftIds.includes(row.resourceId)}
        {@const inputNameEdit = (prefix: string) => `${prefix}_${row.resourceId}`}
        <tr class={[isDraft ? "secondary-container" : ""]}>
          <td class="center-align">
            {row.resourceId}
            {#if isDraft}
              <input type="hidden" value={row.resourceId} name={inputNameEdit("resourceId")} />
              <input type="hidden" value={row.roleId} name={inputNameEdit("roleId")} />
            {/if}
          </td>
          <td>{row.name}</td>
          <td>{row.description}</td>
          {#each ["canCreate", "canRead", "canUpdate"] as permAction, i (i)}
            <td class="center-align">
              <label class="switch icon scaled">
                {#if isDraft}
                  <input type="hidden" value={row[permAction]} name={inputNameEdit(permAction)} />
                {/if}
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
</style>
