import { tblDepartments, tblJobs, tblRoles } from "$lib/schema/schema";
import { db } from "$lib/server/database/db-client";

export async function getAppOptions() {
  return await db.batch([
    db.select().from(tblDepartments),
    db.select().from(tblRoles),
    db.select().from(tblJobs)
  ])
    .then(([departments, roles, jobs]) => ({ departments, roles, jobs }))
    .catch((err) => {
      console.log(err);
      return { departments: [], roles: [], jobs: [] }
    })
}