import type { OptionsBaseTable, UserAction, UUID, NewOptionsValue } from "$lib/app-types";

export class OptionsActions {
  private _newOptions: NewOptionsValue[] = $state([]);
  private _dirtyOptions: OptionsBaseTable[] = $state([]);
  private _actionState: UserAction = $state("read");

  constructor(newOptions: NewOptionsValue[] = [], dirtyOptions: OptionsBaseTable[] = []) {
    this._newOptions = newOptions;
    this._dirtyOptions = dirtyOptions;
    this.setActionState();
  }

  get newOptions(): NewOptionsValue[] {
    return this._newOptions;
  }

  get dirtyOptions(): OptionsBaseTable[] {
    return this._dirtyOptions;
  }

  get actionState(): UserAction {
    return this._actionState;
  }

  get canUpdate(): boolean {
    return ['read', 'update'].includes(this._actionState);
  }

  get canCreate(): boolean {
    return ['read', 'create'].includes(this._actionState);
  }

  get hasChanges(): boolean {
    return this._dirtyOptions.length > 0 || this._newOptions.length > 0;
  }

  public addNewOption() {
    this._newOptions.push({ uuid: crypto.randomUUID(), name: '', code: '', description: '', active: true, locked: true });
    this.setActionState()
  }

  public editOption(values: OptionsBaseTable) {
    this._dirtyOptions.push({ ...values })
    this.setActionState()
  }

  public removeNewOption(uuid: UUID) {
    this._newOptions = this._newOptions.filter(v => v.uuid !== uuid);
    this.setActionState();
  }

  public cancelEdit(id: number) {
    this._dirtyOptions = this._dirtyOptions.filter(v => v.id !== id);
    this.setActionState();
  }

  public clearActions() {
    this._newOptions = [];
    this._dirtyOptions = [];
    this._actionState = "read";
  }

  private setActionState() {
    if (this._newOptions.length > 0 && !this._dirtyOptions.length) {
      this._actionState = 'create';
    } else if (this._dirtyOptions.length > 0 && !this._newOptions.length) {
      this._actionState = 'update';
    } else {
      this._actionState = 'read'
    }

  }
}