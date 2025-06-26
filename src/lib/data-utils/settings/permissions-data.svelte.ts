import type { RolePermission, TablePermissions, TableResources } from "$lib/types/app-types";
type PermResource = Pick<TableResources, "id" | "name" | "description">;
export type AvailableResource = PermResource & { enabled: boolean }

export class RolePermissionsData {
  private _resources: PermResource[] = $state([]);
  private _rolePermissions: RolePermission[] = $state([]);
  private _original: RolePermission[] = $state([]);
  private _availableResources: AvailableResource[] = $state([])

  constructor(data: TablePermissions[], resources: PermResource[]) {
    const rolePermissions = this.merge(data, resources);
    this._resources = resources;
    this._rolePermissions = rolePermissions;
    this._original = $state.snapshot(rolePermissions);
    this._availableResources = this.getBlockedResources()
  }

  get rolePermissions(): RolePermission[] {
    return this._rolePermissions
  }

  set rolePermissions(value: TablePermissions[]) {
    const rolePermissions = this.merge(value)
    this._original = $state.snapshot(rolePermissions);
    this._rolePermissions = rolePermissions;
    this._availableResources = this.getBlockedResources();
  }

  get original(): RolePermission[] {
    return this._original;
  }

  get availableResources(): AvailableResource[] {
    return this._availableResources;
  }

  get resources(): PermResource[] {
    return this._resources;
  }

  public clearUpdates() {
    this._rolePermissions = this._original;
  }

  public updatePermissions(values: TablePermissions | TablePermissions[]) {
    if (!values || !this._rolePermissions) {
      return;
    }

    const updates = this.merge(Array.isArray(values) ? values : [values])

    if (this.isNewRole(updates[0])) {
      this.rolePermissions = updates;
      return;
    }

    const updateMap = new Map(updates.map(item => [item.resourceId, item]));
    this._rolePermissions = this._rolePermissions.map(item => updateMap.get(item.resourceId) ?? item);

    const oldIds = new Set(this._rolePermissions.map(item => item.resourceId));
    const newId = updates.filter(item => !oldIds.has(item.resourceId));

    this._rolePermissions = [...this._rolePermissions, ...newId];
    this._rolePermissions.sort((a, b) => a.resourceId - b.resourceId)
    this._original = $state.snapshot(this._rolePermissions);
    this._availableResources = this.getBlockedResources();
  }

  private merge(data: TablePermissions[], resources?: PermResource[]): RolePermission[] {
    this._resources = resources ? resources : this._resources;
    return data.map(item => {
      const resource = this._resources.find(resource => resource.id === item.resourceId);
      if (resource) {
        return {
          ...item,
          name: resource.name,
          description: resource.description
        }
      } else {
        return { ...item, name: "-", description: "-" }
      }
    });
  }

  private isNewRole(values: RolePermission): boolean {
    if (!values) {
      return true;
    }

    return !this._original.every(item => item.roleId === values.roleId);
  }

  private getBlockedResources(): AvailableResource[] {
    return this._resources.reduce((arr, resource) => {
      if (!this._rolePermissions.some(item => item.resourceId === resource.id)) {
        arr.push({ ...resource, enabled: false })
      }
      return arr;
    }, [] as AvailableResource[])
  }
}