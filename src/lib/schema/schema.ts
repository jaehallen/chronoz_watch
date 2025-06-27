import type { Preferences } from "$lib/types/app-types";
import { sql } from "drizzle-orm";
import { sqliteTable, integer, text, primaryKey, foreignKey, index, type AnySQLiteColumn } from "drizzle-orm/sqlite-core";

export const tblTimeEvents = sqliteTable("time_events", {
  id: integer().primaryKey(),
  active: integer({ mode: "boolean" }).default(true).notNull(),
  code: text().unique().notNull(),
  name: text().unique().notNull(),
  description: text(),
  locked: integer({ mode: "boolean" }).default(false).notNull()
});

export const tblDepartments = sqliteTable("departments", {
  id: integer().primaryKey(),
  active: integer({ mode: "boolean" }).default(true).notNull(),
  code: text().unique().notNull(),
  name: text().unique().notNull(),
  description: text(),
  locked: integer({ mode: "boolean" }).default(false).notNull()
});

export const tblJobs = sqliteTable("jobs", {
  id: integer().primaryKey(),
  active: integer({ mode: "boolean" }).default(true).notNull(),
  code: text().unique().notNull(),
  name: text().unique().notNull(),
  description: text(),
  locked: integer({ mode: "boolean" }).default(false).notNull()
});

export const tblRoles = sqliteTable("roles", {
  id: integer().primaryKey(),
  active: integer({ mode: "boolean" }).default(true).notNull(),
  code: text().unique().notNull(),
  name: text().unique().notNull(),
  description: text(),
  locked: integer({ mode: "boolean" }).default(false).notNull()
});

export const tblResources = sqliteTable("resources", {
  id: integer().primaryKey(),
  active: integer({ mode: "boolean" }).default(true).notNull(),
  code: text().unique().notNull(),
  name: text().unique().notNull(),
  description: text(),
  locked: integer({ mode: "boolean" }).default(true).notNull()
});

export const tblRolePermissions = sqliteTable("role_permissions", {
  roleId: integer().references(() => tblRoles.id, { onDelete: "cascade" }).notNull(),
  resourceId: integer().references(() => tblResources.id, { onDelete: "cascade" }).notNull(),
  canCreate: integer({ mode: "boolean" }).default(false).notNull(),
  canRead: integer({ mode: "boolean" }).default(false).notNull(),
  canUpdate: integer({ mode: "boolean" }).default(false).notNull(),
  canDelete: integer({ mode: "boolean" }).default(false).notNull()
},
  (table) => [
    primaryKey({ columns: [table.roleId, table.resourceId] }),
    index("role_permissions_role_id_idx").on(table.roleId)
  ]
);

export const tblUsers = sqliteTable("users", {
  id: integer().primaryKey(),
  active: integer({ mode: "boolean" }).notNull().default(true),
  name: text().notNull(),
  roleId: integer().notNull().references(() => tblRoles.id, { onDelete: "cascade" }),
  passwordHash: text().notNull(),
  supervisorId: integer().references((): AnySQLiteColumn => tblUsers.id, { onDelete: "set null" }),
  localTimezone: text().default("Asia/Manila").notNull(),
  clientTimezone: text().default("Asia/Manila").notNull(),
  lockPassword: integer({ mode: "boolean" }).notNull().default(false),
  preferences: text({ mode: "json" }).notNull().default('{"background": null, "avatar": null, "mode": "light"}').$type<Preferences>(),
  createdAt: text().notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text().notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => [
  index("users_role_id_idx").on(table.roleId),
]);

export const tblUserDepartments = sqliteTable("user_departments", {
  userId: integer().references(() => tblUsers.id, { onDelete: "cascade" }),
  departmentId: integer().references(() => tblDepartments.id, { onDelete: "cascade" })
},
  (table) => [
    primaryKey({ columns: [table.userId, table.departmentId] })
  ]
);

export const tblUserJobs = sqliteTable("user_jobs", {
  userId: integer().references(() => tblUsers.id, { onDelete: "cascade" }),
  jobId: integer().references(() => tblJobs.id, { onDelete: "cascade" })
}, (table) => [
  primaryKey({ columns: [table.userId, table.jobId] })
]);

export const tblSessions = sqliteTable("sessions", {
  id: text().primaryKey(),
  userId: integer().references(() => tblUsers.id, { onDelete: "cascade" }),
  expiresAt: integer({ mode: "timestamp" }).notNull(),
}, (table) => [
  index("sessions_user_idx").on(table.userId)
]);

export const tblSchedules = sqliteTable("schedules", {
  id: integer().primaryKey(),
  userId: integer().references(() => tblUsers.id, { onDelete: "cascade" }),
  startDate: text().default(sql`CURRENT_DATE`).notNull(),
  timeEventId: integer().references(() => tblTimeEvents.id, { onDelete: "cascade" }),
  startTime: text().default('00:00').notNull(),
  endTime: text().default('00:00').notNull(),
  description: text()
},
  (table) => [
    index("schedules_user_date_idx").on(table.userId, table.startDate)
  ]
);