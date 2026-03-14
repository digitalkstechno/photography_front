export function flattenObject(obj: any, prefix = '', out: any = {}) {
  if (obj == null) return out;

  Object.keys(obj).forEach((key) => {
    const value = obj[key];
    const nextKey = prefix ? `${prefix}.${key}` : key;

    if (value && typeof value === 'object' && !Array.isArray(value) && !(value instanceof Date)) {
      flattenObject(value, nextKey, out);
      return;
    }

    out[nextKey] = value;
  });

  return out;
}

