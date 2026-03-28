import { LineItemsHandler } from './line-items.handler';

export const FIELD_HANDLERS: Record<string, any> = {
  'line-items': new LineItemsHandler(),
};
