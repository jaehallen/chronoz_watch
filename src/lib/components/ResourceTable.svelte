<script lang="ts">
  import { RolePermissionsData, type AvailableResource } from "$lib/data-utils/settings/permissions-data.svelte";

  interface ResourceTableProps {
    permData: RolePermissionsData;
    availableResource: AvailableResource[];
    roleId: number;
    newRoleResource: number[];
  }

  const defaultPermission = [1, 2, 5, 6];

  let {
    permData,
    availableResource = $bindable(),
    roleId,
    newRoleResource = $bindable(),
  }: ResourceTableProps = $props();

  let addedResource = $derived(
    permData.resources.filter((resource) => permData.rolePermissions.some((p) => p.resourceId === resource.id)),
  );

  function onChange(resource: AvailableResource) {
    if (resource.enabled && !newRoleResource.includes(resource.id)) {
      newRoleResource.push(resource.id);
    } else if (!resource.enabled && newRoleResource.includes(resource.id)) {
      newRoleResource.splice(newRoleResource.indexOf(resource.id), 1);
    }
  }
</script>

<table class="border">
  <thead>
    <tr>
      <th>Action</th>
      <th>ID</th>
      <th>Resource</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    {#each addedResource as added (added.id)}
      <tr>
        <td>
          <label class="checkbox"><input type="checkbox" checked disabled /><span></span></label>
        </td>
        <td>{added.id}</td>
        <td>{added.name}</td>
        <td>{added.description}</td>
      </tr>
    {/each}

    {#each availableResource as resource (resource.id)}
      {@const isDefault = defaultPermission.includes(resource.id)}
      {@const inputName = (prefix: string) => `${prefix}_${resource.id}`}
      <tr>
        <td>
          {#if isDefault}
            <input type="number" name={inputName("roleId")} value={roleId} hidden />
            <input type="number" name={inputName("resourceId")} value={resource.id} hidden />
            <label class="checkbox">
              <input type="checkbox" checked disabled />
              <span></span>
            </label>
          {:else}
            <input type="hidden" name={resource.enabled ? inputName("roleId") : ""} value={roleId} hidden />
            <label class="checkbox">
              <input
                type="checkbox"
                name={resource.enabled ? inputName("resourceId") : ""}
                bind:checked={resource.enabled}
                value={resource.id}
                onchange={() => onChange(resource)} />
              <span></span>
            </label>
          {/if}
        </td>
        <td>{resource.id}</td>
        <td>{resource.name}</td>
        <td>{resource.description}</td>
      </tr>
    {/each}
  </tbody>
</table>
