import type { IBeerCssTheme } from "beercss/src/cdn/interfaces";
import { tblDepartments, tblJobs, tblResources, tblRoles, tblUsers, tblRolePermissions, tblTimeEvents } from "./schema/schema";

const APP_RESOURCES = ["profile", "entries", "timesheets", "settings.options", "users", "register"] as const;
const APP_TABLES = ['users', 'roles', 'jobs', 'departments', 'resources', 'roles', 'time_events'] as const;
const USER_ACTION = ["create", "read", "update", "delete"] as const;

export type UserAction = typeof USER_ACTION[number];
export type PermissionAction = keyof Pick<typeof tblRolePermissions, "canCreate" | "canRead" | "canUpdate" | "canDelete">;
export type ConfirmationEvent = "save" | "clear" | "change" | "ok" | "cancel";
export type AppResources = typeof APP_RESOURCES[number];
export type AppTables = typeof APP_TABLES[number];
export type OptionsAppTables = Extract<AppTables, "jobs" | "departments" | "roles" | "time_events">;

export type TableUsers = typeof tblUsers.$inferSelect;
export type TableDepartments = typeof tblDepartments.$inferSelect
export type TableJobs = typeof tblJobs.$inferSelect;
export type TableRoles = typeof tblRoles.$inferSelect;
export type TableTimeEvents = typeof tblTimeEvents.$inferSelect
export type TableResources = typeof tblResources.$inferSelect;
export type TablePermissions = typeof tblRolePermissions.$inferSelect;

export type OptionsBaseTable = TableDepartments | TableJobs | TableRoles | TableTimeEvents;
export type SettingsOptions = {
  jobs: TableJobs[];
  departments: TableDepartments[];
  roles: TableRoles[];
  time_events: TableTimeEvents[];
} & {
  [key: string]: OptionsBaseTable[];
};

export type Permissions = {
  [key: string]: {
    [key in PermissionAction]: boolean;
  };
}

export interface Preferences {
  background: string | null;
  avatar: string | null;
  theme: "dark" | "light";
}

export interface User extends Pick<TableUsers, 'id' | 'active' | 'name' | 'preferences'> {
  role: string;
  permissions: Permissions;
}

export interface Session {
  id: string;
  userId: number;
  expiresAt: Date;
}

export type RolePermission = TablePermissions & Pick<TableResources, "name" | "description">

export type BeerUIFunction = (
  selector?: string | Element,
  options?: string | number | IBeerCssTheme
) => string | IBeerCssTheme | Promise<IBeerCssTheme> | undefined;

interface BaseAppPage<T = string> {
  id: T;
  resource: string;
  href: string;
  title: string;
  icon?: string;
}

interface FormAppPage<T = string> extends BaseAppPage<T> {
  formId: `formapp-${string}`;
  formAction: Partial<{
    [K in UserAction]: `?/${K}-${string}`;
  }>
}

export type AppPages<T = string> = BaseAppPage<T> | FormAppPage<T>;
export type UUID = ReturnType<typeof crypto.randomUUID>;

export interface NewOptionsValue extends Omit<OptionsBaseTable, "id"> {
  uuid: UUID;
}