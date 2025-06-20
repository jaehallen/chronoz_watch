<script lang="ts">
  import type { TableResources, RolePermission } from "$lib/types/app-types";

  interface ResourceTableProps {
    permissions: RolePermission[];
    resources: Pick<TableResources, "id" | "name" | "description">[];
  }
  const defaultPermission = [1, 2, 5, 6];
  let { permissions, resources }: ResourceTableProps = $props();
  let availabedResource = $derived(resources.filter((r) => !permissions.some((p) => p.resourceId === r.id)));
  let addedResource = $derived(resources.filter((r) => permissions.some((p) => p.resourceId === r.id)));
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

    {#each availabedResource as resource (resource.id)}
      {@const isDefault = defaultPermission.includes(resource.id)}
      <tr>
        <td>
          <label class="checkbox"
            ><input type="checkbox" name={`resource_${resource.id}`} checked={isDefault} disabled={isDefault} /><span
            ></span
            ></label>
        </td>
        <td>{resource.id}</td>
        <td>{resource.name}</td>
        <td>{resource.description}</td>
      </tr>
    {/each}
  </tbody>
</table>
