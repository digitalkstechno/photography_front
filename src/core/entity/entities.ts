import { EntityConfig } from './entity.types';

export const ENTITIES: Record<string, EntityConfig> = {

  // ── Parties (Customers & Vendors) ──
  party: {
    key: 'party',
    label: 'Parties',
    icon: '👥',
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
    sidebar: true,
    ui: {
      rowActions: [
        {
          label: 'Ledger',
          class: 'btn-sm btn-info',
          onClick: (row, router) => router.navigate(['/ledger', row.id]),
          isVisible: (row) => row.id !== undefined
        }
      ]
    }
  },

  // ── Services / Items ──
  services: {
    key: 'services',
    label: 'Services',
    icon: '📷',
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
      { name: 'description', label: 'Description', type: 'textarea', class: 'textarea', wrapperClass: 'col-12' },
    ],
    columns: [
      { key: 'name', label: 'Name' },
      { key: 'price', label: 'Price (₹)' },
      { key: 'unit.name', label: 'Unit' },
      { key: 'category.name', label: 'Category' },
    ],
    sidebar: true
  },

  // ── Packages ──
  packages: {
    key: 'packages',
    label: 'Packages',
    icon: '📦',
    api: '/packages',
    idKey: 'id',
    fields: [
      { name: 'name', label: 'Package Name', type: 'text', required: true, class: 'input', wrapperClass: 'col-6' },
      { name: 'price', label: 'Package Price (₹)', type: 'number', required: true, class: 'input', wrapperClass: 'col-6' },
      { name: 'days', label: 'Number of Days', type: 'number', required: true, class: 'input', wrapperClass: 'col-6' },
      { name: 'description', label: 'Description', type: 'textarea', class: 'textarea', wrapperClass: 'col-12' },
    ],
    columns: [
      { key: 'name', label: 'Package Name' },
      { key: 'price', label: 'Price (₹)' },
      { key: 'days', label: 'Days' },
    ],
    sidebar: true
  },

  // ── Team & Freelancers ──
  team: {
    key: 'team',
    label: 'Team & Freelancers',
    icon: '🛠️',
    api: '/users',
    idKey: 'id',
    fields: [
      { name: 'name', label: 'Name', type: 'text', required: true, class: 'input', wrapperClass: 'col-6' },
      { name: 'email', label: 'Email', type: 'text', required: true, class: 'input', wrapperClass: 'col-6' },
      { name: 'phone', label: 'Contact', type: 'text', class: 'input', wrapperClass: 'col-6' },
      { name: 'role', label: 'Role', type: 'text', required: true, class: 'input', wrapperClass: 'col-6' }, // Could be select
      { name: 'skillset', label: 'Skillset / Specialization', type: 'text', class: 'input', wrapperClass: 'col-12' },
      { name: 'charges', label: 'Daily Charges', type: 'number', class: 'input', wrapperClass: 'col-6' },
      { name: 'isFreelance', label: 'Is Freelancer', type: 'boolean', class: 'checkbox', wrapperClass: 'col-6' },
    ],
    columns: [
      { key: 'name', label: 'Name' },
      { key: 'role', label: 'Role' },
      { key: 'phone', label: 'Contact' },
      { key: 'skillset', label: 'Skills' },
    ],
    sidebar: true
  },

  // ── Equipment / Resources ──
  equipment: {
    key: 'equipment',
    label: 'Equipment',
    icon: '🎥',
    api: '/equipment',
    idKey: 'id',
    fields: [
      { name: 'name', label: 'Equipment Name', type: 'text', required: true, class: 'input', wrapperClass: 'col-6' },
      { name: 'type', label: 'Type (Camera/Light/Drone)', type: 'text', required: true, class: 'input', wrapperClass: 'col-6' },
      { name: 'serialNo', label: 'Serial Number', type: 'text', class: 'input', wrapperClass: 'col-6' },
      { name: 'dailyRate', label: 'Rental Rate (Daily)', type: 'number', class: 'input', wrapperClass: 'col-6' },
      { name: 'status', label: 'Status', type: 'text', class: 'input', wrapperClass: 'col-12' },
    ],
    columns: [
      { key: 'name', label: 'Equipment' },
      { key: 'type', label: 'Type' },
      { key: 'status', label: 'Status' },
      { key: 'dailyRate', label: 'Rate' },
    ],
    sidebar: true
  },

  // ── Ledger (Financial Entries) ──
  ledger: {
    key: 'ledger',
    label: 'Ledger',
    icon: '📒',
    api: '/ledger',
    idKey: 'id',
    fields: [
      {
        name: 'partyId',
        label: 'Client / Vendor',
        type: 'relation',
        relation: { entity: 'party', valueKey: 'id', labelKey: 'name' },
        required: true,
        class: 'input',
        wrapperClass: 'col-6',
      },
      { name: 'date', label: 'Date', type: 'date', required: true, class: 'input', wrapperClass: 'col-6' },
      { name: 'amount', label: 'Amount (₹)', type: 'number', required: true, class: 'input', wrapperClass: 'col-4' },
      {
        name: 'type',
        label: 'Entry Type',
        type: 'select',
        options: [{ label: 'Credit (In/Income)', value: 'CREDIT' }, { label: 'Debit (Out/Expense)', value: 'DEBIT' }],
        required: true,
        class: 'input',
        wrapperClass: 'col-4',
      },
      {
        name: 'paymentMethodId',
        label: 'Method',
        type: 'relation',
        relation: { entity: 'paymentMethods', valueKey: 'id', labelKey: 'name' },
        class: 'input',
        wrapperClass: 'col-4',
      },
      { name: 'category', label: 'Category / Head', type: 'text', class: 'input', wrapperClass: 'col-12' },
      { name: 'description', label: 'Description / Notes', type: 'textarea', class: 'textarea', wrapperClass: 'col-12' },
    ],
    sidebar: false
  },

  // ── Availability / Calendar Blockers ──
  availability: {
    key: 'availability',
    label: 'Studio Availability',
    icon: '🗓️',
    api: '/availability',
    idKey: 'id',
    fields: [
      { name: 'date', label: 'Date', type: 'date', required: true, class: 'input', wrapperClass: 'col-6' },
      {
        name: 'userId',
        label: 'Team Member (Leave empty for Studio-wide)',
        type: 'relation',
        relation: { entity: 'team', valueKey: 'id', labelKey: 'name' },
        class: 'input',
        wrapperClass: 'col-6',
      },
      { name: 'isBlocked', label: 'Block Booking?', type: 'boolean', defaultValue: true, class: 'checkbox', wrapperClass: 'col-6' },
      { name: 'reason', label: 'Reason / Holiday Name', type: 'text', class: 'input', wrapperClass: 'col-6' },
    ],
    columns: [
      { key: 'date', label: 'Date' },
      { key: 'user.name', label: 'Team Member' },
      { key: 'reason', label: 'Reason' },
      { key: 'isBlocked', label: 'Blocked', format: 'boolean' },
    ],
    sidebar: true
  },

  // ── Quotations (SALE_QUOTATION) ──
  quotes: {
    key: 'quotes',
    label: 'Quotations',
    icon: '📝',
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
        name: 'packageId',
        label: 'Package (Optional)',
        type: 'relation',
        relation: { entity: 'packages', valueKey: 'id', labelKey: 'name' },
        class: 'input',
        wrapperClass: 'col-6',
      },
      {
        name: 'items[0].itemId',
        label: 'Individual Service',
        type: 'relation',
        relation: { entity: 'services', valueKey: 'id', labelKey: 'name' },
        class: 'input',
        wrapperClass: 'col-6',
      },
      {
        name: 'items[0].quantity',
        label: 'Quantity',
        type: 'number',
        class: 'input',
        wrapperClass: 'col-3',
      },
      {
        name: 'items[0].price',
        label: 'Price',
        type: 'number',
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
      { key: 'package.name', label: 'Package' },
      { key: 'total', label: 'Total (₹)' },
      { key: 'status.name', label: 'Status' },
      { key: 'createdAt', label: 'Date' },
    ],
    sidebar: true,
    ui: {
      rowActions: [
        {
          label: 'Book',
          class: 'btn-sm btn-primary',
          onClick: (row, router) => router.navigate(['/bookings/new'], { queryParams: { quote: row.id } }),
          isVisible: (row) => row.id !== undefined
        }
      ]
    }
  },

  // ── Invoices (SALE_INVOICE) ──
  invoices: {
    key: 'invoices',
    label: 'Invoices',
    icon: '🧾',
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
        name: 'packageId',
        label: 'Package (Optional)',
        type: 'relation',
        relation: { entity: 'packages', valueKey: 'id', labelKey: 'name' },
        class: 'input',
        wrapperClass: 'col-6',
      },
      {
        name: 'items[0].itemId',
        label: 'Individual Service',
        type: 'relation',
        relation: { entity: 'services', valueKey: 'id', labelKey: 'name' },
        class: 'input',
        wrapperClass: 'col-6',
      },
      {
        name: 'items[0].quantity',
        label: 'Quantity',
        type: 'number',
        class: 'input',
        wrapperClass: 'col-3',
      },
      {
        name: 'items[0].price',
        label: 'Price',
        type: 'number',
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
      { key: 'package.name', label: 'Package' },
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
    icon: '💳',
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

  // ── Bookings ──
  bookings: {
    key: 'bookings',
    label: 'Bookings',
    icon: '✨',
    api: '/bookings',
    idKey: 'id',
    fields: [
      {
        name: 'customerId',
        label: 'Customer',
        type: 'relation',
        relation: { entity: 'party', valueKey: 'id', labelKey: 'name' },
        required: true,
        class: 'input',
        wrapperClass: 'col-6',
      },
      {
        name: 'status',
        label: 'Status',
        type: 'text',
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
      { key: 'id', label: 'ID' },
      { key: 'customer.name', label: 'Customer' },
      { key: 'status', label: 'Status' },
      { key: 'createdAt', label: 'Date' },
    ],
    sidebar: false,
    ui: {
      updateRoute: (row: any) => `/bookings/${row.id}`
    }
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
