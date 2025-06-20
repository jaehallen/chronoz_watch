<script lang="ts">
  import type { PageData, SubmitFunction } from "./$types";
  import type { RolePermission } from "$lib/types/app-types";

  import { enhance, applyAction } from "$app/forms";
  import { RolePermissionsData } from "$lib/data-utils/settings/permissions-data.svelte";
  import { PermissionsTable } from "$lib/components/PermissionsTableData";
  import ResourceTable from "$lib/components/ResourceTable.svelte";
  import ToastNotify, { type ToastParams } from "$lib/components/ToastNotify.svelte";

  // svelte-ignore non_reactive_update
  let roleForm: HTMLFormElement;
  let resourceDialog: HTMLDialogElement;

  let { data }: { data: PageData } = $props();
  let activeRoleId = $state(data.roles[0].id);
  let isBusy = $state(false);
  let isOverlay = $state(false);
  let toast: ToastNotify;

  const permData = new RolePermissionsData(data?.permissions ?? []);
  let draft = $derived(getUpdatedPermissions(permData.original, permData.rolePermissions));
  let isFullAccess = $derived(permData.rolePermissions.length >= data.resources.length);

  const formOptions: SubmitFunction = () => {
    isBusy = true;
    return async ({ result }) => {
      if (result.type === "success" && result.data) {
        const { permissions } = result.data;
        permData.rolePermissions = permissions;
      } else {
        console.error(result);
      }
      isBusy = false;
    };
  };

  function onClear() {
    permData.clearUpdates();
  }

  function getUpdatedPermissions(original: RolePermission[], updated: RolePermission[]): RolePermission[] {
    const key = (p: RolePermission) => `${p.resourceId}`;
    const originalMap = new Map(original.map((p) => [key(p), p]));

    return updated.filter((p) => {
      const originalItem = originalMap.get(key(p));
      if (!originalItem) return true;
      return (
        originalItem.canCreate !== p.canCreate ||
        originalItem.canRead !== p.canRead ||
        originalItem.canUpdate !== p.canUpdate ||
        originalItem.canDelete !== p.canDelete
      );
    });
  }

  function onAddPermission() {
    resourceDialog.show();
    isOverlay = true;
  }

  function closeDialog() {
    resourceDialog.close();
  }

  function notify(params?: ToastParams) {
    toast.add(params);
  }
</script>

<section class="responsive">
  <ToastNotify bind:this={toast} />
  <button onclick={() => notify()}>Toast</button>
  <div class={["overlay", isOverlay ? "active" : ""]} aria-hidden="true" onclick={closeDialog}></div>
  <dialog class="large right" bind:this={resourceDialog} onclose={() => (isOverlay = false)}>
    <form action="?/create-permissions">
      <header>
        <nav>
          <div class="max">
            <h5>Resources</h5>
          </div>
          <button type="submit" class="small no-round border">Add</button>
          <button class="circle transparent" onclick={closeDialog}><i>close</i></button>
        </nav>
      </header>
      <fieldset>
        <legend>Permissions List</legend>
        <ResourceTable permissions={permData.rolePermissions} resources={data.resources} />
      </fieldset>
    </form>
  </dialog>
  <form hidden></form>
  <article class="margin">
    {#if data.roles}
      <fieldset disabled={isBusy}>
        <legend>Roles Permissions</legend>
        <div class="row">
          <div class="max">
            <form method="POST" action="?/get-permissions" bind:this={roleForm} use:enhance={formOptions}>
              <div class="field label suffix border round small no-margin">
                <select name="role_id" bind:value={activeRoleId} onchange={() => roleForm.requestSubmit()}>
                  {#each data.roles as role (role.id)}
                    <option value={role.id}>{role.name}</option>
                  {/each}
                </select>
                <label for="role_id">Roles</label>
                <i>arrow_drop_down</i>
              </div>
            </form>
          </div>
          <div class="max"></div>
          <nav class="group connected">
            <button
              class="border left-round small"
              disabled={draft.length > 0 || isFullAccess}
              onclick={onAddPermission}>
              <i>add_moderator</i>
            </button>
            <button class="border no-round small" disabled={!draft.length}>
              <i>save</i>
              {#if draft.length}
                <span class="badge">{draft.length}</span>
              {/if}
            </button>
            <button class="border right-round small" onclick={onClear} disabled={!draft.length}>
              <i>delete_sweep</i>
            </button>
          </nav>
        </div>
      </fieldset>
    {/if}

    <fieldset disabled={isBusy}>
      <legend>Permissions</legend>
      {#if isBusy}
        <progress></progress>
      {:else if permData.rolePermissions.length}
        <PermissionsTable bind:data={permData.rolePermissions} {draft} />
      {:else}
        <h6>No permissions found.</h6>
      {/if}
    </fieldset>
  </article>
</section>
