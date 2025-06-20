<script lang="ts">
	import type { ConfirmationEvent } from "$lib/types/app-types";

	export interface DialogProps {
		title: string;
		content: string;
		onConfirm: (
			confirmEvent: ConfirmationEvent,
			value?: Record<string, unknown>,
		) => void;
		onCancel: (value?: Record<string, unknown>) => void;
	}
	let { title, content, onConfirm, onCancel }: DialogProps = $props();
	let active = $state(false);
	let dialog: HTMLDialogElement;
	let formId: string = $state("");
	let confirmEvent: ConfirmationEvent = $state("cancel");
	let value: Record<string, unknown> | undefined = $state(undefined);

	export function open(params: {
		confirmEvent: ConfirmationEvent;
		activeFormId?: string;
		value?: Record<string, unknown>;
	}) {
		formId = params.activeFormId ?? "";
		confirmEvent = params.confirmEvent;
		value = params.value;
		active = true;
		dialog.showModal();
	}

	export function close() {
		dialog.close();
	}

	function onDialogConfirm() {
		onConfirm(confirmEvent, value);
	}
</script>

<div class="overlay blur" class:active></div>
<dialog bind:this={dialog} onclose={() => (active = false)}>
	<h6>{title}</h6>
	<div>{content}</div>
	<nav class="right-align no-space">
		<button class="transparent link" onclick={() => onCancel(value)}>Cancel</button>
		<button
			class="transparent link"
			onclick={onDialogConfirm}
			type={formId ? "submit" : "button"}
			form={formId}>Confirm</button>
	</nav>
</dialog>
