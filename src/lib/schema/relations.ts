import { tblUsers, tblResources, tblRolePermissions, tblRoles, tblUserJobs, tblUserDepartments, tblSessions } from "./schema";
import { relations, type InferSelectModel } from "drizzle-orm";

export const rltsSession = relations(tblSessions, ({ one }) => {
  return {
    user: one(tblUsers, {
      fields: [tblSessions.userId],
      references: [tblUsers.id]
    })
  }
});

export const rltsUser = relations(tblUsers, ({ many, one }) => {
  return {
    role: one(tblRoles, {
      fields: [tblUsers.roleId],
      references: [tblRoles.id]
    }),
    permissions: many(tblRolePermissions),
    jobs: many(tblUserJobs),
    departments: many(tblUserDepartments),
    sessions: many(tblSessions),
  }
})

export const rltsPermissions = relations(tblRolePermissions, ({ one }) => {
  return {
    user: one(tblUsers, {
      fields: [tblRolePermissions.roleId],
      references: [tblUsers.roleId]
    }),
    resource: one(tblResources, {
      fields: [tblRolePermissions.resourceId],
      references: [tblResources.id]
    })
  }
})