import type { PageServerLoad } from './$types';
import type { Actions } from '@sveltejs/kit';
import type { User } from '$lib/types/app-types';
import type {PermissionResource} from '$lib/server/controller/permission'

import { getAppOptions } from '$lib/server/controller/settings-options';
import { fail, redirect } from '@sveltejs/kit';
import { UserAccess} from '$lib/server/controller/permission';
import { clientDepartments, clientJobs, clientRoles, clientTimeEvents } from '$lib/server/controller/settings-options';
import { parseRequest } from '$lib/utils'
import { OPTIONS_TAB } from '$lib/defaults';

const canCreate = (resource: PermissionResource, user: User | null) => (new UserAccess(user)).canCreate(resource);
const canUpdate = (resource: PermissionResource, user: User | null) => (new UserAccess(user)).canUpdate(resource);

export const load = (async ({locals: {user}}) => {
  if(!user){
    return redirect(301, "/login");
  }
  
  const settingsOptions = await getAppOptions()
  const userResource = Object.keys(user.permissions)
  const optionsTab = OPTIONS_TAB.filter(opt => userResource.includes(opt.id))
  return {
    settingsOptions,
    optionsTab
  };
}) satisfies PageServerLoad;

export const actions = {
  "create-jobs": async ({ locals, request }) => {
    return await createOption('jobs', {locals, request})
  },
  "update-jobs": async ({ locals, request }) => {
    return await updateOption('jobs', {locals, request})
  },
  "create-departments": async ({ locals, request }) => {
    return await createOption('departments', {locals, request})
  },
  "update-departments": async ({ locals, request }) => {
    return await updateOption('departments', {locals, request})
  },
  "create-roles": async ({ locals, request }) => {
    return await createOption('roles', {locals, request})
  },
  "update-roles": async ({ locals, request }) => {
    return await updateOption('roles', {locals, request})
  },
  "create-time_events": async ({ locals, request }) => {
    return await createOption('time_events', {locals, request})
  },
  "update-time_events": async ({ locals, request }) => {
    return await updateOption('time_events', {locals, request})
  }
} satisfies Actions;


async function createOption(resource: PermissionResource, { locals, request }: { locals: App.Locals; request: Request }) {
  const optionInfo = OPTIONS_TAB.find((option) => option.id === resource);
  if (!optionInfo) {
    return fail(404, { error: `Option ${resource} not found!` })
  }

  if (!canCreate(resource, locals.user)) {
    return fail(403, { error: `User don't have permission to update ${optionInfo.title}` })
  }

  const parsedData = await parseRequest(request)
  switch (resource) {
    case 'jobs':
      return await clientJobs.createOptions(parsedData);
    case 'departments':
      return await clientDepartments.createOptions(parsedData);
    case 'roles':
      return await clientRoles.createOptions(parsedData);
    case 'time_events':
      return await clientTimeEvents.createOptions(parsedData);
  }
}

async function updateOption(resource: PermissionResource, { locals, request }: { locals: App.Locals; request: Request }) {
  const optionInfo = OPTIONS_TAB.find((option) => option.id === resource);
  if (!optionInfo) {
    return fail(404, { error: `Option ${resource} not found!` })
  }

  if (!canUpdate(resource, locals.user)) {
    return fail(403, { error: `User don't have permission to update ${optionInfo.title}` })
  }

  const parsedData = await parseRequest(request)
  switch (resource) {
    case 'jobs':
      return await clientJobs.updateOptions(parsedData);
    case 'departments':
      return await clientDepartments.updateOptions(parsedData);
    case 'roles':
      return await clientRoles.updateOptions(parsedData);
    case 'time_events':
      return await clientTimeEvents.updateOptions(parsedData);
  }
}
