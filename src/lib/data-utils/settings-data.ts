import type {  OptionsBaseTable } from "$lib/app-types";
import type { TableHeader } from "$lib/data-utils/table-handler.svelte"

export const OPTIONS_COLUMNS: TableHeader<OptionsBaseTable>[] = [
  {
    key: 'id',
    name: 'ID'
  },
  {
    key: 'active',
    name: 'Active'
  },
  {
    key: 'code',
    name: 'Code'
  },
  {
    key: 'name',
    name: 'Name'
  },
  {
    key: 'description',
    name: 'Description'
  }
];