<script lang="ts">
  import type { AppPages, ConfirmationEvent } from "$lib/types/app-types";
  import type { PageData, SubmitFunction } from "./$types";
  import Dialog from "$lib/components/Dialog.svelte";
  import { OptionsTable } from "$lib/components/OptionsTableData";
  import { OptionsActions } from "$lib/data-utils/settings/options-actions.svelte";
  import { goto } from "$app/navigation";
  import { enhance, applyAction } from "$app/forms";
  import { OptionsData } from "$lib/data-utils/settings/options-data.svelte";

  type OptionPage = AppPages<"jobs" | "departments" | "roles" | "time_events">;

  let dialog: Dialog;
  let { data }: { data: PageData } = $props();
  let activeOption = $state(data.optionsTab[0].id);
  let dialogInfo = $state({
    title: "Warning",
    content: "You will lose all changes?",
  });

  const optActions = new OptionsActions();
  const optData = new OptionsData(data.settingsOptions);

  const formOptions: SubmitFunction = () => {
    return async ({ result }) => {
      if (result.type === "success" && result.data) {
        const { rows, error } = result.data;
        if (error) {
          console.error(error);
        } else {
          optData.updateOptions(activeOption, rows);
          onConfirm("clear");
        }
      } else if (result.type === "error") {
        console.error(result.error);
      }
      applyAction(result);
    };
  };

  function onOptionTab(e: Event, option: OptionPage) {
    if (optActions.hasChanges) {
      e.preventDefault();
      dialogInfo.title = "Warning";
      dialogInfo.content = "You will lose all changes?";
      dialog.open({ confirmEvent: "change", value: { option } });
    } else {
      activeOption = option.id;
    }
  }

  function onClear() {
    dialogInfo.title = "Warning";
    dialogInfo.content = "You will lose all changes?";
    dialog.open({ confirmEvent: "clear" });
  }

  function onSave(option: OptionPage) {
    dialogInfo.title = "Warning";
    dialogInfo.content = "Do you want to save your changes?";
    if ("formId" in option) {
      dialog.open({
        activeFormId: option.formId,
        confirmEvent: "save",
        value: { option },
      });
    }
  }

  function onConfirm(confirmEvent: ConfirmationEvent, value?: Record<string, unknown>) {
    switch (confirmEvent) {
      case "clear":
        optActions.clearActions();
      case "change":
        if (value) {
          let option = value.option as OptionPage;
          activeOption = option.id;
          goto(option.href);
          optActions.clearActions();
        }
      default:
        dialog.close();
    }
  }

  function onCancel() {
    dialog.close();
  }
</script>

{#snippet optionsTab(option: OptionPage)}
  <a href={option.href} class:active={option.id === activeOption} onclick={(e) => onOptionTab(e, option)}>
    <i>{option.icon}</i>
    <span>{option.title}</span>
  </a>
{/snippet}

<Dialog bind:this={dialog} {...dialogInfo} {onConfirm} {onCancel} />

<section class="responsive">
  <article class="margin">
    {#if data.optionsTab}
      <div>
        <div class="tabs min left-align">
          {#each data.optionsTab as option (option.id)}
            {@render optionsTab(option)}
          {/each}
        </div>

        {#each data.optionsTab as option (option.id)}
          {#if "formAction" in option && option.id === activeOption}
            <div class={["page right", option.id === activeOption ? "active" : ""]} id={option.id}>
              <div class="row top-margin">
                <div class="max"></div>
                <nav class="group connected">
                  <button
                    class="border left-round small"
                    disabled={!optActions.canCreate}
                    onclick={() => optActions.addNewOption()}>
                    <i>add</i>
                  </button>
                  <button
                    class="border no-round small"
                    disabled={!optActions.hasChanges}
                    onclick={() => onSave(option)}>
                    <i>save</i>
                    {#if optActions.hasChanges}
                      <span class="badge">{optActions.countChanges}</span>
                    {/if}
                  </button>
                  <button class="border right-round small" disabled={!optActions.hasChanges} onclick={onClear}>
                    <i>delete_sweep</i>
                  </button>
                </nav>
              </div>

              <fieldset>
                <legend>{option.title}</legend>
                <form
                  method="POST"
                  use:enhance={formOptions}
                  id={String(option.formId)}
                  action={option.formAction?.[optActions.actionState] ?? ""}>
                  <OptionsTable data={optData.table(option.id)} {optActions} bind:draft={optActions.dirtyOptions} />
                </form>
              </fieldset>
            </div>
          {/if}
        {/each}
      </div>
    {/if}
  </article>
</section>

<style lang="css">
  .top-margin {
    margin-top: var(--margin);
  }
</style>
