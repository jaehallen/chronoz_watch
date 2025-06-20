import type { RolePermission } from "$lib/types/app-types";

export class RolePermissionsData {
  private _rolePermissions: RolePermission[] = $state([])
  private _original: RolePermission[] = [];

  constructor(data: RolePermission[]) {
    this._rolePermissions = data
    this._original = data;
  }

  get rolePermissions(): RolePermission[] {
    return this._rolePermissions
  }

  set rolePermissions(value: RolePermission[]) {
    this._rolePermissions = value;
    this._original = value;
  }

  get original(): RolePermission[] {
    return this._original;
  }
  
  public clearUpdates(){
    this._rolePermissions = this._original;
  }

  public updatePermissions(values: RolePermission | RolePermission[]) {
    if ((Array.isArray(values) && !values.length) || !values || !this._rolePermissions) {
      return;
    }

    const updates = Array.isArray(values) ? values : [values]
    const updateMap = new Map(updates.map(item => [item.resourceId, item]));
    this._rolePermissions = this._rolePermissions.map(item => updateMap.get(item.resourceId) ?? item);

    const oldIds = new Set(this._rolePermissions.map(item => item.resourceId));
    const newId = updates.filter(item => !oldIds.has(item.resourceId));

    this._rolePermissions = [...this._rolePermissions, ...newId];
    this._rolePermissions.sort((a,b) => a.resourceId - b.resourceId)
  }
}