<script module>
  export type ToastParams = (
    | { type: "success" | "failure" | "info"; data?: Record<string, any> }
    | { type: "error"; error: any }
    | ActionResult
  ) & { timeout?: number };

  export type ToastInfo = {
    id: string;
    type: "success" | "failure" | "info" | "error" | "redirect";
    timeout?: number;
    message: string;
  };
</script>

<script lang="ts">
  import { customId } from "$lib/utils";
  import type { ActionResult } from "@sveltejs/kit";
  import { fade, slide } from "svelte/transition";

  let toasts: ToastInfo[] = $state([]);
  const classType = {
    success: "primary-container",
    error: "error",
    failure: "error-container",
    info: "tertiary-container",
    redirect: "tertiary-container",
  };
  function dismiss(id: string) {
    toasts = toasts.filter((toast) => toast.id !== id);
  }

  export function add(params?: ToastParams) {
    const id = customId();
    let message = "Success";
    let timeout = params?.timeout ?? 3000;

    if (params?.type === "failure") {
      message = params?.data ? JSON.stringify(params.data) : "Failure";
    } else if (params?.type === "error") {
      message = JSON.stringify(params?.error ?? "Error");
    } else if (params?.type === "info") {
      message = JSON.stringify(params?.data ?? "Info");
    } else {
      message = "Success";
    }

    const newToast: ToastInfo = {
      id,
      message,
      timeout,
      type: params?.type ?? "success",
    };

    if (newToast.timeout && newToast.type !== "success") {
      newToast.timeout = 0;
    }

    if (newToast.timeout) {
      setTimeout(() => {
        dismiss(id);
      }, newToast.timeout);
    }

    toasts.push(newToast);
  }
</script>

<section class="all-toast" in:slide out:fade>
  {#each toasts as toast (toast.id)}
    <div class={["row small-padding toast small-round small-elevate", classType[toast.type]]} in:slide out:fade>
      <div class="max">{toast.message}</div>
      <button class="circle transparent small" onclick={() => dismiss(toast.id)}><i>close</i></button>
    </div>
  {/each}
</section>

<style>
  :global(.all-toast) {
    position: fixed;
    align-items: center;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    display: flex;
    margin-bottom: 1rem;
    justify-content: center;
    flex-direction: column;
    z-index: 100;
  }
  .toast {
    min-width: 20rem;
    align-self: inherit;
  }
</style>
