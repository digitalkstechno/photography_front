export class LineItemsHandler {
  onChange(field: any, model: any) {
    const items = model[field.name];
    if (!Array.isArray(items)) return;

    items.forEach((item: any) => {
      if (item.service && item.pricePerDay === 0) {
        const opt = field.options?.find((o: { value: any; }) => o.value === item.service);
        if (opt?.data?.pricePerDay) {
          item.pricePerDay = opt.data.pricePerDay;
        }
      }

      item.total = (item.days || 0) * (item.pricePerDay || 0);
    });
  }
}
