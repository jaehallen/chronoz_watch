import { db, type DrizzleClient } from "$lib/server/database/db-client";
import { tblResources, tblRolePermissions } from "$lib/schema/schema";
import { createSchemaFactory } from "drizzle-zod";
import { and, eq, inArray, sql, SQL } from 'drizzle-orm';
import { z, ZodError } from "zod";
import type { TablePermissions, UserAction } from "$lib/types/app-types";
const { createInsertSchema, createUpdateSchema } = createSchemaFactory({ coerce: true });

export class RolePermissionController<T extends typeof tblRolePermissions> {
  private db: DrizzleClient = db;
  private tbl: typeof tblRolePermissions;
  private defaultActions = [{ canCreate: false, canRead: true, canUpdate: false, canDelete: false }];
  private updatableFields: Partial<keyof Partial<TablePermissions>>[];

  constructor(tbl: T, updateFields?: Partial<keyof Partial<TablePermissions>>[]) {
    this.tbl = tbl;
    this.updatableFields = updateFields ? updateFields : ['canDelete', 'roleId', 'resourceId', 'canCreate', 'canRead', 'canUpdate'];
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


  public async select(roleId: number) {
    return {
      rows: await db.select({
        roleId: this.tbl.roleId,
        resourceId: this.tbl.resourceId,
        canCreate: this.tbl.canCreate,
        canRead: this.tbl.canRead,
        canUpdate: this.tbl.canUpdate,
        canDelete: this.tbl.canDelete
      })
        .from(this.tbl)
        .leftJoin(tblResources, eq(this.tbl.resourceId, tblResources.id))
        .where(eq(this.tbl.roleId, roleId))
    }
  }

  public async create(formData: Record<string, FormDataEntryValue>[]):
    Promise<{ rows: T['$inferSelect'][]; error?: never } | { rows?: never; error: ZodError<T["$inferInsert"][]> }> {
    const permissions = formData.map(item => Object.assign(item, ...this.defaultActions));
    const validData = this.validateInsertData(permissions);

    if (validData.error) {
      return { error: validData.error };
    }

    return { rows: await this.db.insert(this.tbl).values(validData.data).returning() };
  }

  public async update(formData: Record<string, FormDataEntryValue>[]) {
    const validData = this.validateUpdateData(formData);

    if (validData.error) {
      console.error(validData.error)
      return { error: validData.error }
    }

    const roleIds = validData.data.map((u) => u.roleId);
    const resourceIds = validData.data.map((u) => u.resourceId);
    const sqlFields = validData.data.reduce((obj, row) => {
      this.updatableFields.forEach(field => {
        if (field in row) {
          if (!obj.hasOwnProperty(field)) {
            obj[field] = [];
            obj[field].push(sql`(case`)
          }

          obj[field].push(sql`WHEN ${this.tbl.roleId} = ${row.roleId} AND ${this.tbl.resourceId} = ${row.resourceId} THEN ${row[field]}`);
        }
      });
      return obj;
    }, {} as Record<keyof TablePermissions, SQL<unknown>[]>)

    const sqlUpdates = (Object.keys(sqlFields) as (keyof typeof sqlFields)[])
      .reduce<Record<keyof typeof sqlFields, SQL>>((acc, field) => {
        sqlFields[field].push(sql`END)`);
        acc[field] = sql.join(sqlFields[field], sql.raw(' '));
        return acc;
      }, {} as Record<keyof typeof sqlFields, SQL>);

    return {
      rows: await db.update(this.tbl).set(sqlUpdates).where(
        and(inArray(this.tbl.roleId, roleIds), inArray(this.tbl.resourceId, resourceIds))
      ).returning()
    };
  }

  private validateInsertData(formData: Record<string, FormDataEntryValue>[]) {
    return z.array(
      createInsertSchema(this.tbl)
    ).min(1).safeParse(formData);
  }

  private validateUpdateData(formData: Record<string, FormDataEntryValue>[]) {
    return z.array(
      createUpdateSchema(this.tbl).required({ roleId: true, resourceId: true })
    ).min(1).safeParse(formData)
  }
}

export const clientRolePerms = new RolePermissionController(tblRolePermissions);