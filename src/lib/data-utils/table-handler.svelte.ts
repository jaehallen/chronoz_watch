import type { OptionsBaseTable } from "$lib/app-types";

interface TableColumn<T> {
  key: keyof T;
  name: string;
}

export class SettingsOptionsTable<T extends OptionsBaseTable> {
  private _columns: TableColumn<T>[] = [];
  private _data: T[];
  private _rows: T[keyof T][][];

  constructor(data: T[], header: TableColumn<T>[]) {
    this._columns = header;
    this._data = $state(data);
    this._rows = this.parseTableRows(data);
  }

  private parseTableRows(data: T[]): T[keyof T][][] {
    return data.map(row => this._columns.map(col => row[col.key]))
  }

  get data(): T[]{
    return this._data
  }

  get columns(): TableColumn<T>[]{
    return this._columns;
  }

  get rows(): T[keyof T][][]{
    return this._rows;
  }
}