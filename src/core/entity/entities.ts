import { EntityConfig } from './entity.types';

export const ENTITIES: Record<string, EntityConfig> = {
  // Phase 1: core booking & money

  // Client = backend party (customer)
  party: {
    key: 'party',
    label: 'Party',
    api: 'parties',
    listApi: '/parties/customers',
    idKey: 'id',
    fields: [
      { name: 'name', label: 'Name', type: 'text', required: true, class: 'input', wrapperClass: 'col-6' },
      { name: 'phone', label: 'Phone', type: 'text', class: 'input', wrapperClass: 'col-6' },
      { name: 'eventType', label: 'Event Type', type: 'text', class: 'input', wrapperClass: 'col-6' },
      { name: 'eventDate', label: 'Event Date', type: 'date', class: 'input', wrapperClass: 'col-6' },
      { name: 'notes', label: 'Notes', type: 'textarea', class: 'textarea', wrapperClass: 'col-12' },
    ],
    columns: [
      { key: 'name', label: 'Name' },
      { key: 'phone', label: 'Phone' },
      { key: 'eventDate', label: 'Event Date' },
      { key: 'eventType', label: 'Event Type' },
    ],
  },

  // Package = backend item
  services: {
    key: 'services',
    label: 'Services',
    api: '/items',
    idKey: 'id',
    fields: [
      { name: 'name', label: 'Name', type: 'text', required: true, class: 'input', wrapperClass: 'col-6' },
      { name: 'price', label: 'Base Price', type: 'number', required: true, class: 'input', wrapperClass: 'col-3' },
      { name: 'category', label: 'Category', type: 'text', class: 'input', wrapperClass: 'col-3' },
      { name: 'durationHours', label: 'Duration (Hours)', type: 'number', class: 'input', wrapperClass: 'col-3' },
      { name: 'description', label: 'Description', type: 'textarea', class: 'textarea', wrapperClass: 'col-12' },
    ],
    columns: [
      { key: 'name', label: 'Name' },
      { key: 'price', label: 'Base Price' },
      { key: 'category', label: 'Category' },
    ],
  },

  // Quote = SALE_QUOTATION transaction
  quotes: {
    key: 'quotes',
    label: 'Quotes',
    api: '/transactions/sales/quotations',
    idKey: 'id',
    fields: [
      {
        name: 'partyId',
        label: 'Client',
        type: 'relation',
        relation: { entity: 'client', valueKey: 'id', labelKey: 'name' },
        required: true,
        class: 'input',
        wrapperClass: 'col-6',
      },
      {
        name: 'items[0].itemId',
        label: 'Package',
        type: 'relation',
        relation: { entity: 'package', valueKey: 'id', labelKey: 'name' },
        required: true,
        class: 'input',
        wrapperClass: 'col-6',
      },
      {
        name: 'items[0].quantity',
        label: 'Quantity',
        type: 'number',
        required: true,
        class: 'input',
        wrapperClass: 'col-3',
      },
      {
        name: 'items[0].price',
        label: 'Price',
        type: 'number',
        required: true,
        class: 'input',
        wrapperClass: 'col-3',
      },
      {
        name: 'discount',
        label: 'Discount',
        type: 'number',
        class: 'input',
        wrapperClass: 'col-3',
      },
      {
        name: 'notes',
        label: 'Notes / Extra Services',
        type: 'textarea',
        class: 'textarea',
        wrapperClass: 'col-12',
      },
    ],
    columns: [
      { key: 'id', label: 'Quote #' },
      { key: 'party.name', label: 'Client' },
      { key: 'total', label: 'Total' },
      { key: 'status.name', label: 'Status' },
      { key: 'createdAt', label: 'Created' },
    ],
  },

  // Invoice = SALE_INVOICE transaction
  invoices: {
    key: 'invoices',
    label: 'Invoices',
    api: '/transactions/sales/invoices',
    idKey: 'id',
    fields: [
      {
        name: 'partyId',
        label: 'Client',
        type: 'relation',
        relation: { entity: 'client', valueKey: 'id', labelKey: 'name' },
        required: true,
        class: 'input',
        wrapperClass: 'col-6',
      },
      {
        name: 'notes',
        label: 'Notes',
        type: 'textarea',
        class: 'textarea',
        wrapperClass: 'col-12',
      },
    ],
    columns: [
      { key: 'id', label: 'Invoice #' },
      { key: 'party.name', label: 'Client' },
      { key: 'total', label: 'Total' },
      { key: 'status.name', label: 'Status' },
      { key: 'createdAt', label: 'Created' },
    ],
  },

  // Payment on a transaction (invoice)
  payments: {
    key: 'payments',
    label: 'Payments',
    api: '/payments',
    idKey: 'id',
    fields: [
      {
        name: 'transactionId',
        label: 'Invoice',
        type: 'relation',
        relation: { entity: 'invoice', valueKey: 'id', labelKey: 'id' },
        required: true,
        class: 'input',
        wrapperClass: 'col-6',
      },
      {
        name: 'paymentMethodId',
        label: 'Payment Method Id',
        type: 'number',
        required: true,
        class: 'input',
        wrapperClass: 'col-3',
      },
      {
        name: 'amount',
        label: 'Amount',
        type: 'number',
        required: true,
        class: 'input',
        wrapperClass: 'col-3',
      },
      {
        name: 'reference',
        label: 'Note / Reference',
        type: 'text',
        class: 'input',
        wrapperClass: 'col-6',
      },
    ],
    columns: [
      { key: 'id', label: 'Payment #' },
      { key: 'transactionId', label: 'Invoice #' },
      { key: 'amount', label: 'Amount' },
      { key: 'createdAt', label: 'Date' },
    ],
  },
};

export function getEntityConfig(entityKey: string): EntityConfig | null {
  return ENTITIES[entityKey] ?? null;
}

