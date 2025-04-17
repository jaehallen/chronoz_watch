import type { UserAction, User } from "$lib/app-types"

export class UserAccess {
  private user: User | null;
  private _resource: string[] | string = ""

  constructor(user: User | null, resource?: string[] | string) {
    if (!user) {
      throw new Error("User can't be empty");
    }
    this.user = user;
    this._resource = resource || "";
  }

  get resource() {
    return this._resource;
  }

  set resource(newResource: string | string[]) {
    if (!newResource?.length) {
      throw new Error("Resource cannot be empty");
    }

    this._resource = newResource;
  }

  public checkPermission(action: UserAction, resource?: string | string[]) {
    resource = resource || this._resource;
    if (!resource?.length) {
      return false
    }

    if (!this.user) {
      throw new Error("User can't be empty")
    }

    if (!this.user.permissions) {
      return false
    }
    
    const permissions = this.user.permissions;

    return Array.isArray(resource) ? resource.some((r: string) => !!permissions[r]?.[action]) : permissions[resource]?.[action]
  }

  public canView(resource?: string | string[]) {
    return this.checkPermission('read', resource)
  }

  public canCreate(resource?: string | string[]) {
    return this.checkPermission('create', resource)
  }

  public canUpdate(resource?: string | string[]) {
    return this.checkPermission('update', resource)
  }

  public canDelete(resource?: string | string[]) {
    return this.checkPermission('delete', resource)
  }
}