<script lang="ts">
	import type { OptionsBaseTable } from "$lib/app-types";
	import type { OptionsActions } from "$lib/data-utils/settings/options-actions.svelte";
	import { fade, fly, slide } from "svelte/transition";

	export interface OptionsTableColumn<T> {
		key: keyof T;
		label: string;
		info?: string;
		class?: string;
	}

	interface OptionsTableProps {
		data: OptionsBaseTable[];
		optActions: OptionsActions;
		draft: OptionsBaseTable[]; //based on svelte the property of optActions.dirtyOptions needs to be bindable;
	}

	let {
		data,
		optActions = $bindable(),
		draft = $bindable(),
	}: OptionsTableProps = $props();
	const COLUMNS: OptionsTableColumn<OptionsBaseTable>[] = [
		{ key: "id", label: "ID", info: "Data ID", class: "center-align width-1" },
		{ key: "code", label: "Code", info: "Unique code", class: "width-2" },
		{ key: "name", label: "Name", info: "Title or label" },
		{ key: "description", label: "Description", info: "Description" },
		{
			key: "active",
			label: "Active",
			info: "Visibility on dropdown selection",
			class: "center-align min",
		},
	];
</script>

<table class="border">
	<thead class="fixed small-blur transparent">
		<tr>
			{#each COLUMNS as col, i (i)}
				<th class={col.class ?? ""}>
					<span>
						{col.label}
						<div class="tooltip right medium-space">{col.info}</div>
					</span>
				</th>
			{/each}
			<th class="center-align min">Action</th>
		</tr>
	</thead>
	<tbody>
		{#each data as row (row.id)}
			{@const inputNameEdit = (prefix: string) => `${prefix}_${row.id}`}
			{@const idxEdit = draft.findIndex((o) => o.id === row.id)}
			{@const rowId = `${row.id}-${new Date().getTime()}`}
			{#key rowId}
				<tr transition:fade>
					{#if idxEdit >= 0}
						<td class="center-align"
							>{optActions.dirtyOptions[idxEdit].id}
							<input type="hidden" name={inputNameEdit("id")} value={row.id} />
						</td>
						<td class="no-padding left-padding">
							<div class="field small fill round no-padding">
								<input
									type="text"
									name={inputNameEdit("code")}
									placeholder="Code"
									value={optActions.dirtyOptions[idxEdit].code}
									required />
							</div>
						</td>
						<td class="no-padding left-padding">
							<div class="field small fill round no-padding">
								<input
									type="text"
									name={inputNameEdit("name")}
									placeholder="Name"
									value={optActions.dirtyOptions[idxEdit].name}
									required />
							</div>
						</td>
						<td class="no-padding left-padding">
							<div class="field small fill round no-padding">
								<input
									type="text"
									name={inputNameEdit("description")}
									placeholder="Description"
									value={optActions.dirtyOptions[idxEdit].description} />
							</div>
						</td>
						<td class="center-align">
							<input
								type="hidden"
								name={inputNameEdit("active")}
								value={optActions.dirtyOptions[idxEdit].active} />
							<label class="switch scaled">
								<input
									type="checkbox"
									bind:checked={optActions.dirtyOptions[idxEdit].active} />
								<span></span>
							</label>
						</td>
						<td class="center-align width-1">
							<button
								class="transparent circle small"
								onclick={() =>
									optActions.cancelEdit(optActions.dirtyOptions[idxEdit].id)}
								><i>cancel</i></button>
						</td>
					{:else}
						<td class="center-align">{row.id}</td>
						<td>{row.code}</td>
						<td>{row.name}</td>
						<td>{row.description}</td>
						<td class="center-align">{row.active ? "Yes" : "No"}</td>
						<td class="center-align">
							<button
								class="transparent circle small"
								onclick={() => optActions.editOption(row)}
								disabled={!optActions.canUpdate}><i>edit</i></button>
						</td>
					{/if}
				</tr>
			{/key}
		{/each}
	</tbody>
	{#if optActions.newOptions.length > 0}
		<tbody>
			{#each optActions.newOptions as newOpt (newOpt.uuid)}
				{@const inputNameNew = (prefix: string) => `${prefix}_${newOpt.uuid}`}
				<tr>
					<td class="center-align">-</td>
					<td>
						<div class="field fill round small">
							<input
								type="text"
								name={inputNameNew("code")}
								placeholder="Code"
								required />
						</div>
					</td>
					<td>
						<div class="field fill round small">
							<input
								type="text"
								name={inputNameNew("name")}
								placeholder="Name"
								required />
						</div>
					</td>
					<td>
						<div class="field fill round small">
							<input
								type="text"
								name={inputNameNew("description")}
								placeholder="Description" />
						</div>
					</td>
					<td class="center-align">
						<input
							type="hidden"
							name={inputNameNew("active")}
							value={newOpt.active} />
						<label class="switch scaled">
							<input type="checkbox" bind:checked={newOpt.active} />
							<span></span>
						</label>
					</td>
					<td class="center-align width-1">
						<button
							class="transparent circle small"
							onclick={() => optActions.removeNewOption(newOpt.uuid)}
							><i>delete</i></button>
					</td>
				</tr>
			{/each}
		</tbody>
	{/if}
</table>

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
