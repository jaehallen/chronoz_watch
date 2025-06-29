<script lang="ts">
	import type { OptionsBaseTable, SettingsTableColumn } from "$lib/types/app-types";
	import type { OptionsActions } from "$lib/data-utils/settings/options-actions.svelte";
	import { fade } from "svelte/transition";

	interface OptionsTableProps {
		data: OptionsBaseTable[];
		optActions: OptionsActions;
		draft: OptionsBaseTable[]; //based on svelte the property of optActions.dirtyOptions needs to be bindable;
	}

	let { data, optActions = $bindable(), draft = $bindable() }: OptionsTableProps = $props();
	const COLUMNS: SettingsTableColumn<OptionsBaseTable>[] = [
		{ key: "id", label: "ID", info: "Data ID", class: "center-align width-1" },
		{ key: "code", label: "Code", info: "Unique code", class: "width-2" },
		{ key: "name", label: "Name", info: "Title or label" },
		{ key: "description", label: "Description", info: "Description" },
		{
			key: "active",
			label: "Active",
			info: "Visibility on dropdown selection",
			class: "center-align width-1",
		},
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
				<th class="center-align">Action</th>
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
							<td class="tiny-padding">
								<div class="field small round fill no-padding half-space">
									<input
										class="small-padding"
										type="text"
										name={inputNameEdit("code")}
										placeholder="Code"
										value={optActions.dirtyOptions[idxEdit].code}
										required />
								</div>
							</td>
							<td class="tiny-padding">
								<div class="field small round fill no-padding half-space">
									<input
										class="small-padding"
										type="text"
										name={inputNameEdit("name")}
										placeholder="Name"
										value={optActions.dirtyOptions[idxEdit].name}
										required />
								</div>
							</td>
							<td class="tiny-padding">
								<div class="field small round fill no-padding half-space">
									<input
										class="small-padding"
										type="text"
										name={inputNameEdit("description")}
										placeholder="Description"
										value={optActions.dirtyOptions[idxEdit].description} />
								</div>
							</td>
							<td class="center-align">
								<input type="hidden" name={inputNameEdit("active")} value={optActions.dirtyOptions[idxEdit].active} />
								<label class="switch icon scaled">
									<input type="checkbox" bind:checked={optActions.dirtyOptions[idxEdit].active} />
									<span>
										<i>close</i>
										<i>done</i>
									</span>
								</label>
							</td>
							<td class="center-align width-1">
								<button
									class="transparent circle small"
									onclick={() => optActions.cancelEdit(optActions.dirtyOptions[idxEdit].id)}><i>cancel</i></button>
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
				{#each optActions.newOptions as newOpt (newOpt.cid)}
					{@const inputNameNew = (prefix: string) => `${prefix}_${newOpt.cid}`}
					<tr>
						<td class="center-align">-</td>
						<td class="tiny-padding">
							<div class="field small round fill no-padding medium-space">
								<input class="small-padding" type="text" name={inputNameNew("code")} placeholder="Code" required />
							</div>
						</td>
						<td class="tiny-padding">
							<div class="field small round fill no-padding medium-space">
								<input class="small-padding" type="text" name={inputNameNew("name")} placeholder="Name" required />
							</div>
						</td>
						<td class="tiny-padding">
							<div class="field small round fill no-padding medium-space">
								<input class="small-padding" type="text" name={inputNameNew("description")} placeholder="Description" />
							</div>
						</td>
						<td class="center-align">
							<input type="hidden" name={inputNameNew("active")} value={newOpt.active} />
							<label class="switch icon scaled">
								<input type="checkbox" bind:checked={newOpt.active} />
								<span>
                  <i>close</i>
                  <i>done</i>
                </span>
							</label>
						</td>
						<td class="center-align width-1">
							<button class="transparent circle small" onclick={() => optActions.removeNewOption(newOpt.cid)}
								><i>delete</i></button>
						</td>
					</tr>
				{/each}
			</tbody>
		{/if}
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
