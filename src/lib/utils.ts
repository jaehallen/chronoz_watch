export function capitalize(str: string): string {
  if(typeof str !== 'string'){
    str = String(str);
  }

  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}