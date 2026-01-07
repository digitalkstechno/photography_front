export function unflattenObject(data: any) {
  const result: any = {};

  Object.keys(data).forEach(key => {
    if (!key.includes('.')) {
      result[key] = data[key];
      return;
    }

    const parts = key.split('.');
    let current = result;

    parts.forEach((part, index) => {
      if (index === parts.length - 1) {
        current[part] = data[key];
      } else {
        current[part] = current[part] || {};
        current = current[part];
      }
    });
  });

  return result;
}
