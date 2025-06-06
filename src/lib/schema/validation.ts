import { createSchemaFactory, type CreateSchemaFactoryOptions } from 'drizzle-zod';
import { tblRoles, tblDepartments, tblJobs } from './schema';
import { z } from "zod";


const { createInsertSchema, createUpdateSchema } = createSchemaFactory({
  coerce: true
})

export const schemaRolesUpdate = createUpdateSchema(tblRoles);
export const schemaRolesCreate = createInsertSchema(tblRoles, {
  id: (schema) => schema.transform((val) => val > 0 ? val : null).nullable()
});
export const schemaDepartmentsUpdate = createUpdateSchema(tblDepartments);
export const schemaDepartmentsCreate = createInsertSchema(tblDepartments, {
  id: (schema) => schema.transform((val) => val > 0 ? val : null).nullable()
});
export const schemaJobsUpdate = createUpdateSchema(tblJobs);
export const schemaJobsCreate = createInsertSchema(tblJobs, {
  id: (schema) => schema.transform((val) => val > 0 ? val : null).nullable()
});

export const schemaOptionsUpdate = z.union([schemaRolesUpdate, schemaDepartmentsUpdate, schemaJobsUpdate]);
export const schemaOptionsCreate = z.union([schemaRolesCreate, schemaDepartmentsCreate, schemaJobsCreate]);
export const schemaOptionsUpdateMany = z.array(schemaOptionsUpdate);
export const schemaOptionsCreateMany = z.array(schemaOptionsCreate);