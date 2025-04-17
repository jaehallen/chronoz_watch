import type { Preferences } from "$lib/app-types";
import { sql } from "drizzle-orm";
import { sqliteTable, integer, text, primaryKey, foreignKey } from "drizzle-orm/sqlite-core";

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
  roleId: integer().references(() => tblRoles.id, { onDelete: "cascade" }),
  resourceId: integer().references(() => tblResources.id, { onDelete: "cascade" }),
  create: integer({ mode: "boolean" }).default(false).notNull(),
  read: integer({ mode: "boolean" }).default(false).notNull(),
  update: integer({ mode: "boolean" }).default(false).notNull(),
  delete: integer({ mode: "boolean" }).default(false).notNull()
},
  (table) => [
    primaryKey({ columns: [table.roleId, table.resourceId] }),
  ]
);

export const tblUsers = sqliteTable("users", {
  id: integer().primaryKey(),
  active: integer({ mode: "boolean" }).notNull().default(true),
  name: text().notNull(),
  roleId: integer().notNull().references(() => tblRoles.id, { onDelete: "cascade" }),
  passwordHash: text().notNull(),
  supervisorId: integer(),
  lockPassword: integer({ mode: "boolean" }).notNull().default(false),
  preferences: text({ mode: "json" }).notNull().default('{"background": null, "avatar": null, "mode": "light"}').$type<Preferences>(),
  createdAt: text().notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text().notNull().default(sql`CURRENT_TIMESTAMP`)
},
  (table) => [
    foreignKey({ columns: [table.supervisorId], foreignColumns: [table.id], })
  ]
);

export const tblUserDepartments = sqliteTable("user_departments", {
  userId: integer().references(() => tblUsers.id, { onDelete: "cascade" }),
  departmentId: integer().references(() => tblDepartments.id, { onDelete: "cascade" })
},
  (table) => [
    primaryKey({ columns: [table.userId, table.departmentId] })
  ]
);

export const tblUserJobs = sqliteTable("user_jobs", {
  userId: integer("user_id").references(() => tblUsers.id, { onDelete: "cascade" }),
  jobId: integer("job_id").references(() => tblJobs.id, { onDelete: "cascade" })
}, (table) => [
  primaryKey({ columns: [table.userId, table.jobId] })
]);

export const tblSessions = sqliteTable("sessions", {
  id: text().primaryKey(),
  userId: integer().references(() => tblUsers.id, { onDelete: "cascade" }),
  expiresAt: integer({ mode: "timestamp" }).notNull(),
});