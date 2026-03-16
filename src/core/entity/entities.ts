import { EntityConfig } from './entity.types';

export const ENTITIES: Record<string, EntityConfig> = {

  // ── Parties (Customers & Vendors) ──
  party: {
    key: 'party',
    label: 'Parties',
    api: '/parties',
    listApi: '/parties',
    idKey: 'id',
    fields: [
      { name: 'name', label: 'Name', type: 'text', required: true, class: 'input', wrapperClass: 'col-6' },
      { name: 'phone', label: 'Phone', type: 'text', class: 'input', wrapperClass: 'col-6' },
      { name: 'email', label: 'Email', type: 'text', class: 'input', wrapperClass: 'col-6' },
      {
        name: 'partyTypeId',
        label: 'Type',
        type: 'relation',
        relation: { entity: 'partyTypes', valueKey: 'id', labelKey: 'name' },
        required: true,
        class: 'input',
        wrapperClass: 'col-6',
      },
      { name: 'address', label: 'Address', type: 'textarea', class: 'textarea', wrapperClass: 'col-12' },
    ],
    columns: [
      { key: 'name', label: 'Name' },
      { key: 'phone', label: 'Phone' },
      { key: 'email', label: 'Email' },
      { key: 'partyType.name', label: 'Type' },
    ],
    sidebar: true
  },

  // ── Services / Items ──
  services: {
    key: 'services',
    label: 'Services',
    api: '/items',
    idKey: 'id',
    fields: [
      { name: 'name', label: 'Name', type: 'text', required: true, class: 'input', wrapperClass: 'col-6' },
      { name: 'price', label: 'Price (₹)', type: 'number', required: true, class: 'input', wrapperClass: 'col-6' },
      {
        name: 'unitId',
        label: 'Unit',
        type: 'relation',
        relation: { entity: 'units', valueKey: 'id', labelKey: 'name' },
        required: true,
        class: 'input',
        wrapperClass: 'col-6',
      },
      {
        name: 'categoryId',
        label: 'Category',
        type: 'relation',
        relation: { entity: 'categories', valueKey: 'id', labelKey: 'name' },
        class: 'input',
        wrapperClass: 'col-6',
      },
    ],
    columns: [
      { key: 'name', label: 'Name' },
      { key: 'price', label: 'Price (₹)' },
      { key: 'unit.name', label: 'Unit' },
      { key: 'category.name', label: 'Category' },
    ],
    sidebar: true
  },

  // ── Quotations (SALE_QUOTATION) ──
  quotes: {
    key: 'quotes',
    label: 'Quotations',
    api: '/transactions/sales/quotations',
    idKey: 'id',
    fields: [
      {
        name: 'partyId',
        label: 'Customer',
        type: 'relation',
        relation: { entity: 'party', valueKey: 'id', labelKey: 'name' },
        required: true,
        class: 'input',
        wrapperClass: 'col-6',
      },
      {
        name: 'items[0].itemId',
        label: 'Service',
        type: 'relation',
        relation: { entity: 'services', valueKey: 'id', labelKey: 'name' },
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
        name: 'notes',
        label: 'Notes',
        type: 'textarea',
        class: 'textarea',
        wrapperClass: 'col-12',
      },
    ],
    columns: [
      { key: 'id', label: 'Quote #' },
      { key: 'party.name', label: 'Customer' },
      { key: 'total', label: 'Total (₹)' },
      { key: 'status.name', label: 'Status' },
      { key: 'createdAt', label: 'Date' },
    ],
    sidebar: true
  },

  // ── Invoices (SALE_INVOICE) ──
  invoices: {
    key: 'invoices',
    label: 'Invoices',
    api: '/transactions/sales/invoices',
    idKey: 'id',
    fields: [
      {
        name: 'partyId',
        label: 'Customer',
        type: 'relation',
        relation: { entity: 'party', valueKey: 'id', labelKey: 'name' },
        required: true,
        class: 'input',
        wrapperClass: 'col-6',
      },
      {
        name: 'items[0].itemId',
        label: 'Service',
        type: 'relation',
        relation: { entity: 'services', valueKey: 'id', labelKey: 'name' },
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
        name: 'notes',
        label: 'Notes',
        type: 'textarea',
        class: 'textarea',
        wrapperClass: 'col-12',
      },
    ],
    columns: [
      { key: 'id', label: 'Invoice #' },
      { key: 'party.name', label: 'Customer' },
      { key: 'total', label: 'Total (₹)' },
      { key: 'status.name', label: 'Status' },
      { key: 'createdAt', label: 'Date' },
    ],
    sidebar: true
  },

  // ── Payments ──
  payments: {
    key: 'payments',
    label: 'Payments',
    api: '/payments',
    idKey: 'id',
    fields: [
      {
        name: 'transactionId',
        label: 'Invoice #',
        type: 'relation',
        relation: { entity: 'invoices', valueKey: 'id', labelKey: 'id' },
        required: true,
        class: 'input',
        wrapperClass: 'col-6',
      },
      {
        name: 'paymentMethodId',
        label: 'Payment Method',
        type: 'relation',
        relation: { entity: 'paymentMethods', valueKey: 'id', labelKey: 'name' },
        required: true,
        class: 'input',
        wrapperClass: 'col-6',
      },
      {
        name: 'amount',
        label: 'Amount (₹)',
        type: 'number',
        required: true,
        class: 'input',
        wrapperClass: 'col-6',
      },
      {
        name: 'reference',
        label: 'Reference / Note',
        type: 'text',
        class: 'input',
        wrapperClass: 'col-6',
      },
    ],
    columns: [
      { key: 'id', label: 'Payment #' },
      { key: 'transaction.party.name', label: 'Customer' },
      { key: 'paymentMethod.name', label: 'Method' },
      { key: 'amount', label: 'Amount (₹)' },
      { key: 'createdAt', label: 'Date' },
    ],
    sidebar: true
  },

  // ── Lookup entities (for relation dropdowns, not shown in sidebar) ──
  partyTypes: {
    key: 'partyTypes',
    label: 'Party Types',
    api: '/lookups/party-types',
    idKey: 'id',
    fields: [],
    columns: [],
    sidebar: false
  },

  units: {
    key: 'units',
    label: 'Units',
    api: '/lookups/units',
    idKey: 'id',
    fields: [
      { name: 'name', label: 'Name', type: 'text', required: true, class: 'input', wrapperClass: 'col-6' },
      { name: 'shortName', label: 'Short Name', type: 'text', class: 'input', wrapperClass: 'col-6' },
    ],
    columns: [
      { key: 'name', label: 'Name' },
      { key: 'shortName', label: 'Short Name' },
    ],
    sidebar: false
  },

  categories: {
    key: 'categories',
    label: 'Categories',
    api: '/lookups/categories',
    idKey: 'id',
    fields: [
      { name: 'name', label: 'Name', type: 'text', required: true, class: 'input', wrapperClass: 'col-12' },
    ],
    columns: [
      { key: 'name', label: 'Name' },
    ],
    sidebar: false
  },

  paymentMethods: {
    key: 'paymentMethods',
    label: 'Payment Methods',
    api: '/lookups/payment-methods',
    idKey: 'id',
    fields: [],
    columns: [],
    sidebar: false
  },
};

export function getEntityConfig(entityKey: string): EntityConfig | null {
  return ENTITIES[entityKey] ?? null;
}
