import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ locals, cookies }) => {

  return new Response(null, { status: 401 })
}