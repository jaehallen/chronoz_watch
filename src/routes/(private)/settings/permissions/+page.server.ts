import type { PageServerLoad } from './$types';
import type { Actions } from '@sveltejs/kit';
import { fail, redirect } from '@sveltejs/kit';
import { tblResources, tblRolePermissions, tblRoles } from '$lib/schema/schema';
import { db } from '$lib/server/database/db-client';
import { eq } from 'drizzle-orm';
import { UserAccess } from '$lib/server/controller/permission';

export const load = (async ({ locals: { user } }) => {
  if (!user) {
    return redirect(301, "/login");
  }

  const roles = await db.select({
    id: tblRoles.id,
    name: tblRoles.name,
    description: tblRoles.description
  }).from(tblRoles)


  return {
    roles
  };
}) satisfies PageServerLoad;

export const actions = {
  "get-permissions": async ({ locals, request }) => {
    const userAccess = new UserAccess(locals.user);

    const data = await request.formData();
    const roleId = Number(data.get("role_id"));

    if (isNaN(roleId)) {
      return fail(400, { message: "Invalid Role Id" });
    }

    const permissions = await db.select({
      name: tblResources.name,
      description: tblResources.description,
      roleId: tblRolePermissions.roleId,
      resourceId: tblRolePermissions.resourceId,
      canCreate: tblRolePermissions.canCreate,
      canRead: tblRolePermissions.canRead,
      canUpdate: tblRolePermissions.canUpdate,
      canDelete: tblRolePermissions.canDelete
    })
      .from(tblRolePermissions)
      .leftJoin(tblResources, eq(tblRolePermissions.resourceId, tblResources.id))
      .where(eq(tblRolePermissions.roleId, roleId))


    return { permissions }
  }
} satisfies Actions;