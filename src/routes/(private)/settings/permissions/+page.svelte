<script lang="ts">
  import type { PageData, SubmitFunction } from "./$types";
  import type { ConfirmationEvent, RolePermission } from "$lib/types/app-types";
  import { PermissionsTable } from "$lib/components/PermissionsTableData";
  import ResourceTable from "$lib/components/ResourceTable.svelte";
  import ToastNotify, { type ToastParams } from "$lib/components/ToastNotify.svelte";
  import Dialog from "$lib/components/Dialog.svelte";

  import { enhance, applyAction } from "$app/forms";
  import { RolePermissionsData } from "$lib/data-utils/settings/permissions-data.svelte";

  const DEFAULT_PERMISSION = [1, 2, 5, 6];
  // svelte-ignore non_reactive_update
  let roleForm: HTMLFormElement;
  let resourceDialog: HTMLDialogElement;
  let dialog: Dialog;
  let dialogInfo = $state({
    title: "Warning",
    content: "You will lose all changes?",
  });

  let { data }: { data: PageData } = $props();
  let activeRoleId = $state(data.roles[0].id);
  let isBusy = $state(false);
  let isOverlay = $state(false);
  let newRoleResource = $state([]);
  let toast: ToastNotify;

  const permData = new RolePermissionsData(data?.permissions, data?.resources);
  let draft = $derived(getUpdatedPermissions(permData.original, permData.rolePermissions));
  let isFullAccess = $derived(permData.rolePermissions.length >= data.resources.length);
  let isAddResource = $derived(
    newRoleResource.length > 0 || permData.availableResources.some((r) => DEFAULT_PERMISSION.includes(r.id)),
  );

  const handleFormRequest: SubmitFunction = () => {
    isBusy = true;
    return async ({ result }) => {
      if (result.type === "success" && result.data) {
        newRoleResource = [];
        permData.updatePermissions(result.data.rows ?? []);
      } else {
        if (result.type === "error") {
          console.error(result.error);
        }
        notify(result);
      }
      isBusy = false;
      applyAction(result);
    };
  };

  function getUpdatedPermissions(updated: RolePermission[], original: RolePermission[]): RolePermission[] {
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

  function closeDialog() {
    resourceDialog.close();
  }

  function onAddPermission() {
    resourceDialog.show();
    isOverlay = true;
  }

  function notify(params?: ToastParams) {
    toast.add(params);
  }

  function onSave(formId: string) {
    dialogInfo.title = "Warning";
    dialogInfo.content = "Do you want to save your changes?";
    dialog.open({
      activeFormId: formId,
      confirmEvent: "save",
    });
  }

  function onClear() {
    dialogInfo.title = "Warning";
    dialogInfo.content = "You will lose all changes?";
    dialog.open({ confirmEvent: "clear" });
  }

  function onConfirm(confirmEvent: ConfirmationEvent) {
    switch (confirmEvent) {
      case "clear":
        permData.clearUpdates();
      default:
        dialog.close();
    }
  }

  function onCancel() {
    dialog.close();
  }

</script>

<ToastNotify bind:this={toast} />
<Dialog bind:this={dialog} {...dialogInfo} {onConfirm} {onCancel} />

<div class={["overlay", isOverlay ? "active" : ""]} aria-hidden="true" onclick={closeDialog}></div>
<dialog class="large right" bind:this={resourceDialog} onclose={() => (isOverlay = false)}>
  <form action="?/create-permissions" method="POST" use:enhance={handleFormRequest}>
    <header>
      <nav>
        <div class="max">
          <h5>Resources</h5>
        </div>
        <button type="submit" class="small no-round border" disabled={!isAddResource}>Add</button>
        <button type="button" class="circle transparent" onclick={closeDialog}><i>close</i></button>
      </nav>
    </header>
    <fieldset>
      <legend>Permissions List</legend>
      {#key activeRoleId}
        <ResourceTable
          {permData}
          bind:newRoleResource
          bind:availableResource={permData.availableResources}
          roleId={activeRoleId} />
      {/key}
    </fieldset>
  </form>
</dialog>
<section class="responsive">
  <article class="margin">
    {#if data.roles}
      <fieldset disabled={isBusy}>
        <legend>Roles Permissions</legend>
        <div class="row">
          <div class="max">
            <form method="POST" action="?/get-permissions" bind:this={roleForm} use:enhance={handleFormRequest}>
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
            <button
              class="border no-round small"
              disabled={!draft.length}
              onclick={() => onSave("formapp-role_permissions")}>
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
        <form id="formapp-role_permissions" action="?/update-permissions" method="POST" use:enhance={handleFormRequest}>
          <PermissionsTable bind:data={permData.rolePermissions} {draft} />
        </form>
      {:else}
        <h6>No permissions found.</h6>
      {/if}
    </fieldset>
  </article>
</section>
