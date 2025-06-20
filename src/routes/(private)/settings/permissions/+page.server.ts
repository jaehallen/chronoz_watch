import type { PageServerLoad } from './$types';
import type { Actions } from '@sveltejs/kit';
import { fail, redirect } from '@sveltejs/kit';
import { tblResources, tblRolePermissions, tblRoles } from '$lib/schema/schema';
import { db } from '$lib/server/database/db-client';
import { eq } from 'drizzle-orm';
import { UserAccess } from '$lib/server/controller/permission';
const RESOURCE = "role_permissions"
export const load = (async ({ locals: { user } }) => {
  if (!user) {
    return redirect(301, "/login");
  }

  const roles = await db.select({
    id: tblRoles.id,
    name: tblRoles.name,
    description: tblRoles.description
  }).from(tblRoles)


  roles.sort((a,b) => b.id - a.id)
  return {
    roles,
    permissions: await getPermissions(roles[0]?.id),
    resources: await db.select({
      id: tblResources.id,
      name: tblResources.name,
      description: tblResources.description
    }).from(tblResources)
  };
}) satisfies PageServerLoad;

export const actions = {
  "get-permissions": async ({ locals, request }) => {
    const userAccess = new UserAccess(locals.user);
    console.log(locals.user)
    if (!userAccess.canView(RESOURCE)) {
      return fail(403, { message: "You don't have permission to view this page" });
    }
    const data = await request.formData();
    const roleId = Number(data.get("role_id"));

    if (isNaN(roleId)) {
      return fail(400, { message: "Invalid Role Id" });
    }

    return { permissions: await getPermissions(roleId) }
  },
  "create-permissions": async ({ locals, request }) => {
    const userAcces = new UserAccess(locals.user);

    if (!userAcces.canCreate(RESOURCE)) {
      return fail(403, { message: "You don't have permission to view this page" })
    }

    const formData = await request.formData()
    console.log(formData);
    return { permissions: []};
  }
} satisfies Actions;

async function getPermissions(roleId: number) {

  if (isNaN(roleId) || roleId < 1) {
    return []
  }

  return await db.select({
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
}