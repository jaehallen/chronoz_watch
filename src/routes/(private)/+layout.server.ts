import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import {
  APP_PAGES, SETTING_PAGES
} from '$lib/defaults';

export const load = (async ({ locals }) => {
  if (!locals.user) {
    return redirect(301, "/login")
  }

  const permissions = new Set(Object.keys(locals.user.permissions));
  const userRoutes = APP_PAGES.filter((route) => permissions.has(route.resource));
  const settingRoutes = SETTING_PAGES.filter((route) => permissions.has(route.resource));
  return {
    user: locals.user,
    userRoutes, settingRoutes
  };

}) satisfies LayoutServerLoad;