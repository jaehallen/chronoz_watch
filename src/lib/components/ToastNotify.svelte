<script module>
  interface ToastInfo {
    id: string;
    message: string;
    type: "success" | "error" | "info";
    timeout: number;
  }
  export type ToastParams = Omit<ToastInfo, "id">;
</script>

<script lang="ts">
  import { customId } from "$lib/utils";
  import { fade } from "svelte/transition";

  let toasts: ToastInfo[] = $state([]);
  const classType = {
    success: "primary-container",
    error: "error",
    info: "tertiary-container",
  };
  function dismiss(id: string) {
    toasts = toasts.filter((toast) => toast.id !== id);
  }

  export function add(params?: ToastParams) {
    const id = customId();
    const newToast: ToastInfo = {
      id,
      message: params?.message ?? "Success",
      type: params?.type ?? "success",
      timeout: params?.timeout ?? 3000,
    };

    if (newToast.timeout) {
      setTimeout(() => {
        dismiss(id);
      }, newToast.timeout);
    }

    toasts.push(newToast);
  }
</script>

{#snippet snackbar(toast: ToastInfo)}
  <div class={["row small-padding toast small-round small-elevate", classType[toast.type]]} transition:fade>
    <div class="max">{toast.message}</div>
    <button class="circle transparent small" onclick={() => dismiss(toast.id)}><i>close</i></button>
  </div>
{/snippet}

{#if toasts.length}
  <section class="all-toast">
    {#each toasts as toastInfo (toastInfo.id)}
      {#key toastInfo.id}
        {@render snackbar(toastInfo)}
      {/key}
    {/each}
  </section>
{/if}

<style>
  :global(.all-toast) {
    position: fixed;
    align-items: center;
    top: 0;
    left: 0;
    right: 0;
    width: 100%;
    display: flex;
    margin-top: 0.5rem;
    justify-content: center;
    flex-direction: column;
    z-index: 100;
  }
  .toast {
    width: 20rem;
    align-self: inherit;
  }
</style>
