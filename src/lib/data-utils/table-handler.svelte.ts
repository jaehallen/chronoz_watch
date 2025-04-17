
export interface TableHeader<T> {
  key: keyof T;
  name: string | ((val: keyof T) => string);
}

export class SettingsOptionsTable<T> {
  private data: T[] = $state<T[]>([]);
  private tblHeader: TableHeader<T>[] ;

  constructor(data: T[], headers: TableHeader<T>[]){
    this.data = data;
    this.tblHeader = headers;
  }

  public rows(): T[] {
    return this.data;
  }

  public headers(): TableHeader<T>[] {
    return this.tblHeader;
  }
}