import { UserAccess } from '$lib/server/controller/permission';
import { getAppOptions } from '$lib/server/controller/settings';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

const resource = "settings"
export const load = (async ({locals}) => {
    if(!locals.user){
        redirect(301, '/login')
    }

    const userAccess = new UserAccess(locals.user, resource);
    if(!userAccess.canView()){
        redirect(301, '/profile');
    }

    return await getAppOptions();

}) satisfies PageServerLoad;