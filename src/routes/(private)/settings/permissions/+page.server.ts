import type { PageServerLoad } from './$types';
import type { Actions } from '@sveltejs/kit';

import { fail, redirect } from '@sveltejs/kit';
import { db } from '$lib/server/database/db-client';
import { tblResources, tblRoles } from '$lib/schema/schema';
import { UserAccess } from '$lib/server/controller/permission';
import { clientRolePerms } from '$lib/server/controller/settings-roles';
import { parseRequest } from '$lib/utils';

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

  roles.sort((a, b) => b.id - a.id)
  const { rows = [] } = await clientRolePerms.select(roles[0]?.id);

  return {
    roles,
    permissions: rows,
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

    if (!userAccess.canView(RESOURCE)) {
      return fail(403, { message: "You don't have permission to view" });
    }
    const formData = await request.formData();
    const roleId = Number(formData.get("role_id"));

    if (isNaN(roleId)) {
      return fail(400, { message: "Invalid Role Id" });
    }
    const { rows } = await clientRolePerms.select(roleId);

    return { rows };
  },
  "update-permissions": async ({ locals, request }) => {
    const userAcces = new UserAccess(locals.user);

    if (!userAcces.canUpdate(RESOURCE)) {
      return fail(403, { message: "You don't have permission to update" })
    }

    const formData = await parseRequest(request);

    return await clientRolePerms.update(formData);

  },
  "create-permissions": async ({ locals, request }) => {
    const userAcces = new UserAccess(locals.user);

    if (!userAcces.canCreate(RESOURCE)) {
      return fail(403, { message: "You don't have permission to create" })
    }

    const parsedData = await parseRequest(request)
  
    const { rows, error } = await clientRolePerms.create(parsedData.filter(item => item.hasOwnProperty("resourceId")));
    if (error) {
      return fail(400, { error: error.errors })
    }

    return { rows };
  }
} satisfies Actions;