import type { UserAction, PermissionAction, User } from "$lib/types/app-types"
export type PermissionResource = string | string[] | URL;
const pathnameToDots = (pathname: string): string => pathname.split('/').filter(Boolean).join('.');
const ACTIONS_MAP: Record<UserAction, PermissionAction> = {
  create: 'canCreate',
  read: 'canRead',
  update: 'canUpdate',
  delete: 'canDelete'
}
export class UserAccess {
  private user: User | null;
  private _resource: string[] = []

  constructor(user: User | null) {
    if (!user) {
      throw new Error("User can't be empty");
    }

    this.user = user;
  }

  get resource() {
    return this._resource;
  }

  public validateResource(val: PermissionResource | undefined | null): string[] {
    if (!val) {
      return [];
    }

    if (typeof val === 'string') {
      const trimmed = val.trim();
      return trimmed ? [trimmed] : [];
    }

    if (Array.isArray(val)) {
      return val
        .map(v => v.trim())
        .filter(v => v.length > 0);
    }

    if (val instanceof URL) {
      const parsed = pathnameToDots(val.pathname).trim();
      return parsed ? [parsed] : [];
    }

    return [];
  }

  public checkPermission(action: UserAction, refResource?: string | string[] | URL) {
    this._resource = this.validateResource(refResource)

    if (!this.user) {
      throw new Error("User can't be empty")
    }

    if (!this.user.permissions) {
      return false
    }

    const permissions = this.user.permissions;
    const permAction = ACTIONS_MAP[action];

    return this._resource.some((r: string) => !!permissions[r]?.[permAction])
  }

  public canView(resource?: PermissionResource) {
    return this.checkPermission('read', resource)
  }

  public canCreate(resource?: PermissionResource) {
    return this.checkPermission('create', resource)
  }

  public canUpdate(resource?: PermissionResource) {
    return this.checkPermission('update', resource)
  }

  public canDelete(resource?: PermissionResource) {
    return this.checkPermission('delete', resource)
  }
}
