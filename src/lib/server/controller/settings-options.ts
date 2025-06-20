import type { SettingsOptions, UserAction } from "$lib/types/app-types";
import { z, ZodError } from "zod";
import { db } from "$lib/server/database/db-client"
import { tblRoles, tblDepartments, tblJobs, tblTimeEvents } from "$lib/schema/schema";
import { createSchemaFactory } from "drizzle-zod";
import { inArray, SQL, sql } from "drizzle-orm";

export type DrizzleClient = typeof db;

type BaseOptionsType = typeof tblJobs | typeof tblDepartments | typeof tblRoles | typeof tblTimeEvents;
type UpdatableFields = Partial<keyof Pick<BaseOptionsType, "id" | "active" | "code" | "name" | "description" | "locked">>;
const { createInsertSchema, createUpdateSchema } = createSchemaFactory({ coerce: true });

export class TableOptionsController<T extends BaseOptionsType> {
  private db: DrizzleClient = db;
  private tblOptions: BaseOptionsType;
  private updatableFields: UpdatableFields[];

  constructor(tblOptions: BaseOptionsType, updateFields?: UpdatableFields[]) {
    this.tblOptions = tblOptions;
    this.updatableFields = updateFields?.length ? updateFields : ['name', 'code', 'description', 'active', 'locked'];
  }

  get client() {
    return this.db;
  }

  public validateFormData(action: 'create', data: Record<string, FormDataEntryValue>[]): ReturnType<typeof this.validateInsertData>;
  public validateFormData(action: 'update', data: Record<string, FormDataEntryValue>[]): ReturnType<typeof this.validateUpdateData>;
  public validateFormData(action: UserAction, data: Record<string, FormDataEntryValue>[]): ReturnType<typeof this.validateInsertData> | ReturnType<typeof this.validateUpdateData> {
    if (action === 'create') {
      return this.validateInsertData(data);
    } else if (action === 'update') {
      return this.validateUpdateData(data);
    } else {
      throw new Error("Invalid User Action!");
    }
  }

  public async createOptions(data: Record<string, FormDataEntryValue>[]):
    Promise<{ rows: T['$inferSelect'][]; error?: never } | { rows?: never; error: ZodError<T["$inferInsert"][]> }> {
    const validData = this.validateInsertData(data);

    if (validData.error) {
      return { error: validData.error };
    }

    return { rows: await this.db.insert(this.tblOptions).values(validData.data).returning() };
  }


  public async updateOptions(
    formData: Record<string, FormDataEntryValue>[]
  ): Promise<{ rows: T['$inferSelect'][]; error?: never } | { rows?: never; error: ZodError<Partial<T["$inferSelect"]>[]> }> {

    const validData = this.validateUpdateData(formData);

    if (validData.error) {
      console.error(validData.error)
      return { error: validData.error as ZodError<Partial<T["$inferSelect"]>[]> };
    }

    const ids = validData.data.map((u) => u.id);
    const sqlFields = validData.data.reduce((obj, row) => {
      this.updatableFields.forEach(field => {
        if (field in row) {
          if (!obj.hasOwnProperty(field)) {
            obj[field] = [];
            obj[field].push(sql`(case`)
          }

          obj[field].push(sql`WHEN ${this.tblOptions.id} = ${row.id} THEN ${row[field]}`);
        }
      })
      return obj;
    }, {} as Record<UpdatableFields, SQL<unknown>[]>)

    const sqlUpdates = (Object.keys(sqlFields) as (keyof typeof sqlFields)[])
      .reduce<Record<keyof typeof sqlFields, SQL>>((acc, field) => {
        sqlFields[field].push(sql`END)`);
        acc[field] = sql.join(sqlFields[field], sql.raw(' '));
        return acc;
      }, {} as Record<keyof typeof sqlFields, SQL>);

    return { rows: await db.update(this.tblOptions).set(sqlUpdates).where(inArray(this.tblOptions.id, ids)).returning() };
  }

  private validateInsertData(data: Record<string, FormDataEntryValue>[]) {
    return z.array(
      createInsertSchema(this.tblOptions, {
        description: (schema) => schema.transform((val) => val.length > 1 ? val : null),
      }).omit({ id: true })
    ).min(1).safeParse(data)
  };

  private validateUpdateData(data: Record<string, FormDataEntryValue>[]) {
    return z.array(
      createUpdateSchema(this.tblOptions, {
        description: (schema) => schema.transform((val) => val.length > 1 ? val : null),
      }).required({ id: true })
    ).min(1).safeParse(data)
  };
}

export async function getAppOptions(): Promise<SettingsOptions> {
  return await db.batch([
    db.select().from(tblDepartments),
    db.select().from(tblRoles),
    db.select().from(tblJobs),
    db.select().from(tblTimeEvents)
  ])
    .then(([departments, roles, jobs, time_events]) => ({ departments, roles, jobs, time_events }))
    .catch((err) => {
      console.error(err);
      return { departments: [], roles: [], jobs: [], time_events: [] }
    })
}

export const clientRoles = new TableOptionsController<typeof tblRoles>(tblRoles);
export const clientDepartments = new TableOptionsController<typeof tblDepartments>(tblDepartments);
export const clientJobs = new TableOptionsController<typeof tblJobs>(tblJobs);
export const clientTimeEvents = new TableOptionsController<typeof tblTimeEvents>(tblTimeEvents);

