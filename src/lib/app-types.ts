import type { IBeerCssTheme } from "beercss/src/cdn/interfaces";
import { tblDepartments, tblJobs, tblResources, tblRoles, tblUsers, tblRolePermissions } from "./schema/schema";

const APP_RESOURCES = ["profile", "entries", "timesheets", "settings", "users", "register"] as const;
const USER_ACTION = ["create", "read", "update", "delete"] as const;

export type UserAction = typeof USER_ACTION[number];
export type AppResources = typeof APP_RESOURCES[number];

export type TableUsers = typeof tblUsers.$inferSelect;
export type TableDepartments = typeof tblDepartments.$inferSelect
export type TableJobs = typeof tblJobs.$inferSelect;
export type TableRoles = typeof tblRoles.$inferSelect;
export type TableResources = typeof tblResources.$inferSelect;
export type TablePermissions = typeof tblRolePermissions.$inferSelect;
export type OptionsBaseTable = TableDepartments & TableJobs & TableRoles & TableResources;

export type Permissions = {
  [key: string]: {
    [key in UserAction]: boolean;
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

export type BeerUIFunction = (
  selector?: string | Element,
  options?: string | number | IBeerCssTheme
) => string | IBeerCssTheme | Promise<IBeerCssTheme> | undefined;

export type AppPages = {
  resource: AppResources;
  href: string;
  title: string;
  id: string;
  icon?: string;
}