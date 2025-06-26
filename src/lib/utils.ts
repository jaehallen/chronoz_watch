import { customAlphabet } from "nanoid";

export const customId = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyz', 8);

export function capitalize(str: string): string {
  if (typeof str !== 'string') {
    str = String(str);
  }

  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export function toBoolean(value: unknown): boolean {
  if (typeof value === "boolean") return value;

  const str = String(value).trim().toLowerCase();

  if (str === "true") return true;
  const num = Number(str);
  return !isNaN(num) && num > 0;
}

const keyPattern = /^([^_]+)_([a-z0-9]{1,8})$/;

function parseValue(value: FormDataEntryValue) {
  if (typeof value === 'string') {
    if (value === 'false' || value === '0') return "";
  }
  return value;
}

export async function parseRequest(request: Request): Promise<Record<string, FormDataEntryValue>[]> {
  const formData = await request.formData();
  const temp: Record<string, Record<string, FormDataEntryValue>> = {};

  for (const [key, value] of formData.entries()) {
    const match = keyPattern.exec(key);
    if (!match) continue;

    const [, field, id] = match;
    if (!Object.hasOwn(temp, id)) {
      temp[id] = {};
    }

    temp[id][field] = parseValue(value);
  }

  return Object.values(temp);
}
