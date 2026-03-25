import { EntityConfig } from './entity.types';
import { environment } from '../../../environments/environment';

export const ENTITIES: Record<string, EntityConfig> = {

  // ── Parties (Customers & Vendors) ──
  party: {
    key: 'party',
    label: 'Parties',
    icon: '👥',
    api: '/parties',
    listApi: '/parties',
    idKey: '_id',
    fields: [
      { name: 'name', label: 'Name', type: 'text', required: true, class: 'input', wrapperClass: 'col-6' },
      { name: 'phone', label: 'Phone', type: 'text', class: 'input', wrapperClass: 'col-6' },
      { name: 'email', label: 'Email', type: 'text', class: 'input', wrapperClass: 'col-6' },
      {
        name: 'partyType',
        label: 'Type',
        type: 'select',
        options: [
          { label: 'Customer', value: 'CUSTOMER' },
          { label: 'Vendor', value: 'VENDOR' },
          { label: 'Both', value: 'BOTH' }
        ],
        required: true,
        class: 'input',
        wrapperClass: 'col-6',
      },
      { name: 'address', label: 'Address', type: 'textarea', class: 'textarea', wrapperClass: 'col-12' },
      { name: 'notes', label: 'Notes', type: 'textarea', class: 'textarea', wrapperClass: 'col-12' },
    ],
    columns: [
      { key: 'name', label: 'Name' },
      { key: 'phone', label: 'Phone' },
      { key: 'email', label: 'Email' },
      { key: 'partyType', label: 'Type' },
    ],
    sidebar: true,
    ui: {
      rowActions: [
        {
          label: 'Ledger',
          class: 'btn-sm btn-info',
          onClick: (row, router) => router.navigate(['/ledger', row._id]),
          isVisible: (row) => !!row._id
        }
      ]
    }
  },

  // ── Photography Services ──
  services: {
    key: 'services',
    label: 'Services',
    icon: '📷',
    api: '/services',
    idKey: '_id',
    fields: [
      { name: 'name', label: 'Name', type: 'text', required: true, class: 'input', wrapperClass: 'col-6' },
      { name: 'pricePerDay', label: 'Price Per Day (₹)', type: 'number', required: true, class: 'input', wrapperClass: 'col-6' },
      {
        name: 'type',
        label: 'Type',
        type: 'select',
        options: [
          { label: 'Photo', value: 'PHOTO' },
          { label: 'Video', value: 'VIDEO' }
        ],
        required: true,
        class: 'input',
        wrapperClass: 'col-6',
      },
      { name: 'description', label: 'Description', type: 'textarea', class: 'textarea', wrapperClass: 'col-12' },
    ],
    columns: [
      { key: 'name', label: 'Name' },
      { key: 'pricePerDay', label: 'Price/Day (₹)' },
      { key: 'type', label: 'Type' },
    ],
    sidebar: true
  },

  // ── Packages ──
  packages: {
    key: 'packages',
    label: 'Packages',
    icon: '📦',
    api: '/packages',
    idKey: '_id',
    fields: [
      { name: 'name', label: 'Package Name', type: 'text', required: true, class: 'input', wrapperClass: 'col-6' },
      { name: 'price', label: 'Package Price (₹)', type: 'number', readonly: true, help: 'Auto-calculated based on services and custom items', class: 'input', wrapperClass: 'col-6' },
      {
        name: 'includedServices',
        label: 'Included Services',
        type: 'relation',
        relation: { entity: 'services', valueKey: '_id', labelKey: 'name', multiple: true },
        class: 'input',
        wrapperClass: 'col-12',
      },
      {
        name: 'customItems',
        label: 'Custom Items (Extra charges)',
        type: 'array-key-value',
        class: 'input',
        wrapperClass: 'col-12',
      },
      { name: 'description', label: 'Description', type: 'textarea', class: 'textarea', wrapperClass: 'col-12' },
    ],
    columns: [
      { key: 'name', label: 'Package Name' },
      { key: 'price', label: 'Price (₹)' },
    ],
    sidebar: true
  },

  // ── Freelancers ──
  freelancers: {
    key: 'freelancers',
    label: 'Freelancers',
    icon: '🛠️',
    api: '/freelancers',
    idKey: '_id',
    fields: [
      { name: 'name', label: 'Name', type: 'text', required: true, class: 'input', wrapperClass: 'col-6' },
      { name: 'phone', label: 'Phone', type: 'text', class: 'input', wrapperClass: 'col-6' },
      { name: 'email', label: 'Email', type: 'text', class: 'input', wrapperClass: 'col-6' },
      {
        name: 'skill',
        label: 'Skill',
        type: 'select',
        options: [
          { label: 'Candid', value: 'CANDID' },
          { label: 'Video', value: 'VIDEO' },
          { label: 'Drone', value: 'DRONE' },
          { label: 'DSLR', value: 'DSLR' },
          { label: 'Editor', value: 'EDITOR' },
          { label: 'Other', value: 'OTHER' },
        ],
        required: true,
        class: 'input',
        wrapperClass: 'col-6',
      },
      { name: 'chargePerDay', label: 'Charge Per Day (₹)', type: 'number', required: true, class: 'input', wrapperClass: 'col-6' },
      { name: 'notes', label: 'Notes', type: 'textarea', class: 'textarea', wrapperClass: 'col-12' },
    ],
    columns: [
      { key: 'name', label: 'Name' },
      { key: 'phone', label: 'Phone' },
      { key: 'skill', label: 'Skill' },
      { key: 'chargePerDay', label: 'Charge/Day (₹)' },
    ],
    sidebar: true
  },

  // ── Bookings (formerly Events) ──
  bookings: {
    key: 'bookings',
    label: 'Bookings',
    icon: '✨',
    api: '/events',
    idKey: '_id',
    fields: [
      {
        name: 'invoice',
        label: 'Invoice (auto-fills customer & amount)',
        type: 'relation',
        relation: { entity: 'invoices', valueKey: '_id', labelKey: 'invoiceNumber' },
        class: 'input',
        wrapperClass: 'col-6',
      },
      {
        name: 'customer',
        label: 'Customer',
        type: 'relation',
        relation: { entity: 'party', valueKey: '_id', labelKey: 'name' },
        required: true,
        class: 'input',
        wrapperClass: 'col-6',
      },
      {
        name: 'eventType',
        label: 'Event Type',
        type: 'select',
        options: [
          { label: 'Wedding', value: 'WEDDING' },
          { label: 'Haldi', value: 'HALDI' },
          { label: 'Mehndi', value: 'MEHNDI' },
          { label: 'Sangeet', value: 'SANGEET' },
          { label: 'Reception', value: 'RECEPTION' },
          { label: 'Engagement', value: 'ENGAGEMENT' },
          { label: 'Birthday', value: 'BIRTHDAY' },
          { label: 'Corporate', value: 'CORPORATE' },
          { label: 'Other', value: 'OTHER' },
        ],
        required: true,
        class: 'input',
        wrapperClass: 'col-6',
      },
      { name: 'title', label: 'Title', type: 'text', class: 'input', wrapperClass: 'col-12' },
      { name: 'startDate', label: 'Start Date', type: 'date', required: true, class: 'input', wrapperClass: 'col-6' },
      { name: 'endDate', label: 'End Date', type: 'date', required: true, class: 'input', wrapperClass: 'col-6' },
      { name: 'location', label: 'Location', type: 'text', class: 'input', wrapperClass: 'col-12' },
      {
        name: 'status',
        label: 'Status',
        type: 'select',
        options: [
          { label: 'Pending', value: 'PENDING' },
          { label: 'Confirmed', value: 'CONFIRMED' },
          { label: 'Completed', value: 'COMPLETED' },
          { label: 'Cancelled', value: 'CANCELLED' },
        ],
        class: 'input',
        wrapperClass: 'col-6',
      },
      {
        name: 'package',
        label: 'Package',
        type: 'relation',
        relation: { entity: 'packages', valueKey: '_id', labelKey: 'name' },
        class: 'input',
        wrapperClass: 'col-6',
      },
      { name: 'totalAmount', label: 'Total Amount (₹)', type: 'number', class: 'input', wrapperClass: 'col-6' },
      {
        name: 'assignments',
        label: 'Team & Equipment Assignments',
        type: 'team-assignments',
        wrapperClass: 'col-12',
      },
      { name: 'notes', label: 'Notes', type: 'textarea', class: 'textarea', wrapperClass: 'col-12' },
    ],
    filters: [
      {
        name: 'status',
        label: 'Status',
        type: 'select',
        options: [
          { label: 'Pending', value: 'PENDING' },
          { label: 'Confirmed', value: 'CONFIRMED' },
          { label: 'Completed', value: 'COMPLETED' },
          { label: 'Cancelled', value: 'CANCELLED' },
        ],
      },
    ],
    columns: [
      { key: 'customer.name', label: 'Customer' },
      { key: 'eventType', label: 'Type' },
      { key: 'startDate', label: 'Start', format: 'date' },
      { key: 'endDate', label: 'End', format: 'date' },
      { key: 'location', label: 'Location' },
      { key: 'status', label: 'Status' },
      { key: 'invoice.invoiceNumber', label: 'Invoice' },
    ],
    sidebar: true,
    ui: {
      rowActions: [
        {
          label: 'Create Job',
          class: 'btn-sm btn-primary',
          onClick: (row, router) => router.navigate(['/admin/jobs/new'], { queryParams: { event: row._id } }),
          isVisible: (row) => row.status === 'CONFIRMED'
        }
      ]
    }
  },

  // ── Quotations ──
  quotations: {
    key: 'quotations',
    label: 'Quotations',
    icon: '📝',
    api: '/quotations',
    idKey: '_id',
    fields: [
      {
        name: 'quotationNumber',
        label: 'Quotation #',
        type: 'text',
        readonly: true,
        class: 'input',
        wrapperClass: 'col-12',
      },
      {
        name: 'customer',
        label: 'Customer',
        type: 'relation',
        relation: { entity: 'party', valueKey: '_id', labelKey: 'name' },
        required: true,
        class: 'input',
        wrapperClass: 'col-6',
      },
      {
        name: 'packages',
        label: 'Select Packages (Auto-populates items)',
        type: 'relation',
        relation: { entity: 'packages', valueKey: '_id', labelKey: 'name', multiple: true },
        class: 'input',
        wrapperClass: 'col-6',
        help: 'All services from selected packages will be added below.'
      },
      {
        name: 'services',
        label: 'Select Services (Auto-populates items)',
        type: 'relation',
        relation: { entity: 'services', valueKey: '_id', labelKey: 'name', multiple: true },
        class: 'input',
        wrapperClass: 'col-6',
        help: 'Selected individual services will be added below.'
      },
      {
        name: 'items',
        label: 'Quotation Items',
        type: 'line-items',
        relation: { entity: 'services', valueKey: '_id', labelKey: 'name' },
        class: 'input',
        wrapperClass: 'col-12',
      },
      {
        name: 'status',
        label: 'Status',
        type: 'select',
        options: [
          { label: 'Draft', value: 'DRAFT' },
          { label: 'Sent', value: 'SENT' },
          { label: 'Accepted', value: 'ACCEPTED' },
          { label: 'Rejected', value: 'REJECTED' },
        ],
        class: 'input',
        wrapperClass: 'col-4',
      },
      { name: 'discount', label: 'Discount (₹)', type: 'number', class: 'input', wrapperClass: 'col-4' },
      { name: 'taxRate', label: 'Tax (%)', type: 'number', defaultValue: 18, class: 'input', wrapperClass: 'col-4' },
      { name: 'tax', label: 'Tax Amount (₹)', type: 'number', readonly: true, class: 'input', wrapperClass: 'col-4' },
      { name: 'validUntil', label: 'Valid Until', type: 'date', class: 'input', wrapperClass: 'col-4' },
      { name: 'totalAmount', label: 'Total Amount (₹)', type: 'number', readonly: true, class: 'input', wrapperClass: 'col-4' },
      { name: 'finalAmount', label: 'Final Amount (₹)', type: 'number', readonly: true, class: 'input', wrapperClass: 'col-4' },
      { name: 'grandTotal', label: 'Grand Total (₹)', type: 'number', readonly: true, class: 'input', wrapperClass: 'col-4' },
      { name: 'notes', label: 'Notes', type: 'textarea', class: 'textarea', wrapperClass: 'col-6' },
      { name: 'terms', label: 'Terms & Conditions', type: 'textarea', class: 'textarea', wrapperClass: 'col-6' },
    ],
    columns: [
      { key: 'quotationNumber', label: 'QN' },
      { key: 'customer.name', label: 'Customer' },
      { key: 'totalAmount', label: 'Total (₹)' },
      { key: 'finalAmount', label: 'Final (₹)' },
      { key: 'status', label: 'Status' },
      { key: 'createdAt', label: 'Date', format: 'date' },
    ],
    sidebar: true,
    ui: {
      rowActions: [
        {
          label: 'Mark as Accepted',
          icon: '✅',
          class: 'btn-sm btn-info',
          isVisible: (row: any) => row.status !== 'ACCEPTED' && row.status !== 'REJECTED' && row.status !== 'CONVERTED',
          onClick: (row, router, reload) => {
            if (!confirm('Mark this quotation as accepted?')) return;
            const token = localStorage.getItem('token');
            fetch(`${environment.apiUrl}/quotations/${row._id}`, {
              method: 'PUT',
              headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
              body: JSON.stringify({ status: 'ACCEPTED' })
            }).then(() => reload());
          }
        },
        {
          label: 'Mark as Sent',
          icon: '📩',
          class: 'btn-sm btn-success',
          isVisible: (row: any) => row.status === 'DRAFT',
          onClick: (row, router, reload) => {
            const token = localStorage.getItem('token');
            fetch(`${environment.apiUrl}/quotations/${row._id}/send`, {
              method: 'PATCH',
              headers: { 'Authorization': `Bearer ${token}` }
            }).then(() => reload());
          }
        },
        {
          label: 'Mark as Rejected',
          icon: '🚫',
          class: 'btn-sm btn-danger',
          isVisible: (row: any) => row.status !== 'REJECTED' && row.status !== 'ACCEPTED',
          onClick: (row, router, reload) => {
            if (!confirm('Mark this quotation as rejected?')) return;
            const token = localStorage.getItem('token');
            fetch(`${environment.apiUrl}/quotations/${row._id}`, {
              method: 'PUT',
              headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
              body: JSON.stringify({ status: 'REJECTED' })
            }).then(() => reload());
          }
        },
        {
          label: 'Create Invoice',
          icon: '💰',
          class: 'btn-sm btn-primary',
          isVisible: (row: any) => row.status !== 'ACCEPTED',
          onClick: (row, router) => {
            const token = localStorage.getItem('token');
            fetch(`${environment.apiUrl}/invoices/from-quotation/${row._id}`, {
              method: 'POST',
              headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
            })
              .then(r => r.json())
              .then(res => {
                if (res.success) {
                  alert('Invoice created: ' + res.data.invoiceNumber);
                  router.navigate(['/admin/invoices/edit', res.data._id]);
                } else {
                  alert(res.message || 'Failed to create invoice');
                }
              })
              .catch(() => alert('Error creating invoice'));
          }
        },
        {
          label: 'Create Booking',
          icon: '📸',
          class: 'btn-sm btn-primary',
          onClick: (row, router) => router.navigate(['/admin/bookings/new'], { queryParams: { quotation: row._id } }),
          isVisible: (row: any) => row.status === 'ACCEPTED' || row.status === 'CONVERTED'
        },
        {
          label: 'Delete',
          icon: '🗑️',
          class: 'btn-sm btn-danger',
          onClick: (row, router, reload) => {
            if (!confirm('Are you sure you want to delete this quotation?')) return;
            const token = localStorage.getItem('token');
            fetch(`${environment.apiUrl}/quotations/${row._id}`, {
              method: 'DELETE',
              headers: { 'Authorization': `Bearer ${token}` }
            }).then(() => reload());
          }
        }
      ]
    }
  },

  // ── Invoices ──
  invoices: {
    key: 'invoices',
    label: 'Invoices',
    icon: '🧾',
    api: '/invoices',
    idKey: '_id',
    fields: [
      {
        name: 'invoiceNumber',
        label: 'Invoice #',
        type: 'text',
        readonly: true,
        class: 'input',
        wrapperClass: 'col-12',
      },
      {
        name: 'customer',
        label: 'Customer',
        type: 'relation',
        relation: { entity: 'party', valueKey: '_id', labelKey: 'name' },
        required: true,
        class: 'input',
        wrapperClass: 'col-6',
      },
      {
        name: 'quotation',
        label: 'Linked Quotation',
        type: 'relation',
        relation: { entity: 'quotations', valueKey: '_id', labelKey: 'quotationNumber' },
        class: 'input',
        wrapperClass: 'col-6',
        help: 'Selecting a quotation will auto-fill items, customer, and other details.'
      },
      {
        name: 'items',
        label: 'Invoice Items',
        type: 'line-items',
        relation: { entity: 'services', valueKey: '_id', labelKey: 'name' },
        class: 'input',
        wrapperClass: 'col-12',
      },
      {
        name: 'event',
        label: 'Booking (Event)',
        type: 'relation',
        relation: { entity: 'bookings', valueKey: '_id', labelKey: 'title' },
        required: true,
        class: 'input',
        wrapperClass: 'col-6',
      },
      {
        name: 'status',
        label: 'Status',
        type: 'select',
        options: [
          { label: 'Pending', value: 'PENDING' },
          { label: 'Sent', value: 'SENT' },
          { label: 'Partially Paid', value: 'PARTIALLY_PAID' },
          { label: 'Paid', value: 'PAID' },
          { label: 'Cancelled', value: 'CANCELLED' },
        ],
        class: 'input',
        wrapperClass: 'col-4',
      },
      { name: 'discount', label: 'Discount (₹)', type: 'number', class: 'input', wrapperClass: 'col-4' },
      { name: 'taxRate', label: 'Tax (%)', type: 'number', defaultValue: 18, class: 'input', wrapperClass: 'col-4' },
      { name: 'tax', label: 'Tax Amount (₹)', type: 'number', readonly: true, class: 'input', wrapperClass: 'col-4' },
      { name: 'dueDate', label: 'Due Date', type: 'date', class: 'input', wrapperClass: 'col-4' },
      { name: 'totalAmount', label: 'Total Amount (₹)', type: 'number', readonly: true, class: 'input', wrapperClass: 'col-4' },
      { name: 'finalAmount', label: 'Final Amount (₹)', type: 'number', readonly: true, class: 'input', wrapperClass: 'col-4' },
      { name: 'grandTotal', label: 'Grand Total (₹)', type: 'number', readonly: true, class: 'input', wrapperClass: 'col-4' },
      { name: 'notes', label: 'Notes', type: 'textarea', class: 'textarea', wrapperClass: 'col-12' },
    ],
    filters: [
      {
        name: 'status',
        label: 'Status',
        type: 'select',
        options: [
          { label: 'Draft', value: 'DRAFT' },
          { label: 'Sent', value: 'SENT' },
          { label: 'Partially Paid', value: 'PARTIALLY_PAID' },
          { label: 'Paid', value: 'PAID' },
          { label: 'Cancelled', value: 'CANCELLED' },
        ],
      },
    ],
    columns: [
      { key: 'invoiceNumber', label: 'Invoice #' },
      { key: 'customer.name', label: 'Customer' },
      { key: 'grandTotal', label: 'Total (₹)' },
      { key: 'paidAmount', label: 'Paid (₹)' },
      { key: 'status', label: 'Status' },
      { key: 'createdAt', label: 'Date', format: 'date' },
    ],
    sidebar: true,
    ui: {
      rowActions: [
        {
          label: 'Mark as Sent',
          icon: '📩',
          class: 'btn-sm btn-info',
          isVisible: (row: any) => row.status === 'PENDING',
          onClick: (row, router, reload) => {
            const token = localStorage.getItem('token');
            fetch(`${environment.apiUrl}/invoices/${row._id}`, {
              method: 'PUT',
              headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
              body: JSON.stringify({ status: 'SENT' })
            }).then(() => reload());
          }
        },
        {
          label: 'Mark as Paid',
          icon: '✅',
          class: 'btn-sm btn-success',
          isVisible: (row: any) => row.status !== 'PAID' && row.status !== 'CANCELLED',
          onClick: (row, router, reload) => {
            if (!confirm('Mark this invoice as fully paid?')) return;
            const token = localStorage.getItem('token');
            fetch(`${environment.apiUrl}/invoices/${row._id}`, {
              method: 'PUT',
              headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
              body: JSON.stringify({ status: 'PAID' })
            }).then(() => reload());
          }
        },
        {
          label: 'Mark as Cancelled',
          icon: '🚫',
          class: 'btn-sm btn-danger',
          isVisible: (row: any) => row.status !== 'CANCELLED' && row.status !== 'PAID',
          onClick: (row, router, reload) => {
            if (!confirm('Cancel this invoice?')) return;
            const token = localStorage.getItem('token');
            fetch(`${environment.apiUrl}/invoices/${row._id}`, {
              method: 'PUT',
              headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
              body: JSON.stringify({ status: 'CANCELLED' })
            }).then(() => reload());
          }
        },
        {
          label: 'Create Booking',
          icon: '📸',
          class: 'btn-sm btn-primary',
          onClick: (row, router) => router.navigate(['/admin/bookings/new'], { queryParams: { invoice: row._id } }),
          isVisible: (row) => row.status !== 'CANCELLED'
        },
        {
          label: 'Record Payment',
          icon: '💳',
          class: 'btn-sm btn-success',
          onClick: (row, router) => router.navigate(['/admin/payments/new'], { queryParams: { invoice: row._id, party: row.customer?._id || row.customer } }),
          isVisible: (row) => row.status !== 'PAID' && row.status !== 'CANCELLED'
        },
        {
          label: 'Delete',
          icon: '🗑️',
          class: 'btn-sm btn-danger',
          onClick: (row, router, reload) => {
            if (!confirm('Are you sure you want to delete this invoice?')) return;
            const token = localStorage.getItem('token');
            fetch(`${environment.apiUrl}/invoices/${row._id}`, {
              method: 'DELETE',
              headers: { 'Authorization': `Bearer ${token}` }
            }).then(() => reload());
          }
        }
      ]
    }
  },

  // ── Payments ──
  payments: {
    key: 'payments',
    label: 'Payments',
    icon: '💳',
    api: '/payments',
    idKey: '_id',
    fields: [
      {
        name: 'party',
        label: 'Party',
        type: 'relation',
        relation: { entity: 'party', valueKey: '_id', labelKey: 'name' },
        required: true,
        class: 'input',
        wrapperClass: 'col-6',
      },
      { name: 'amount', label: 'Amount (₹)', type: 'number', required: true, class: 'input', wrapperClass: 'col-6' },
      {
        name: 'type',
        label: 'Payment Type',
        type: 'select',
        options: [
          { label: 'Payment In (Customer)', value: 'IN' },
          { label: 'Payment Out (Freelancer/Vendor)', value: 'OUT' }
        ],
        required: true,
        class: 'input',
        wrapperClass: 'col-6',
      },
      {
        name: 'mode',
        label: 'Payment Mode',
        type: 'select',
        options: [
          { label: 'Cash', value: 'CASH' },
          { label: 'UPI', value: 'UPI' },
          { label: 'Bank Transfer', value: 'BANK' },
          { label: 'Cheque', value: 'CHEQUE' },
          { label: 'Other', value: 'OTHER' }
        ],
        class: 'input',
        wrapperClass: 'col-6',
      },
      { name: 'date', label: 'Date', type: 'date', class: 'input', wrapperClass: 'col-6' },
      {
        name: 'invoice',
        label: 'Invoice',
        type: 'relation',
        relation: { entity: 'invoices', valueKey: '_id', labelKey: 'invoiceNumber' },
        class: 'input',
        wrapperClass: 'col-6',
      },
      {
        name: 'event',
        label: 'Booking (Optional)',
        type: 'relation',
        relation: { entity: 'bookings', valueKey: '_id', labelKey: 'title' },
        class: 'input',
        wrapperClass: 'col-6',
      },
      { name: 'description', label: 'Description', type: 'textarea', class: 'textarea', wrapperClass: 'col-12' },
      { name: 'reference', label: 'Reference', type: 'text', class: 'input', wrapperClass: 'col-6' },
    ],
    columns: [
      { key: 'party.name', label: 'Party' },
      { key: 'amount', label: 'Amount (₹)' },
      { key: 'type', label: 'Type' },
      { key: 'mode', label: 'Mode' },
      { key: 'invoice.invoiceNumber', label: 'Invoice' },
      { key: 'date', label: 'Date', format: 'date' },
    ],
    sidebar: true
  },

  // ── Jobs ──
  jobs: {
    key: 'jobs',
    label: 'Jobs',
    icon: '📋',
    api: '/jobs',
    idKey: '_id',
    fields: [
      {
        name: 'event',
        label: 'Booking',
        type: 'relation',
        relation: { entity: 'bookings', valueKey: '_id', labelKey: 'title' },
        required: true,
        class: 'input',
        wrapperClass: 'col-6',
      },
      {
        name: 'status',
        label: 'Status',
        type: 'select',
        options: [
          { label: 'Pending', value: 'PENDING' },
          { label: 'In Progress', value: 'IN_PROGRESS' },
          { label: 'Completed', value: 'COMPLETED' },
          { label: 'Cancelled', value: 'CANCELLED' },
        ],
        class: 'input',
        wrapperClass: 'col-6',
      },
      { name: 'notes', label: 'Notes', type: 'textarea', class: 'textarea', wrapperClass: 'col-12' },
    ],
    columns: [
      { key: 'event.eventType', label: 'Event' },
      { key: 'status', label: 'Status' },
      { key: 'totalCost', label: 'Total Cost (₹)' },
      { key: 'createdAt', label: 'Created', format: 'date' },
    ],
    sidebar: false
  },

  // ── Team (Users) ──
  team: {
    key: 'team',
    label: 'Team',
    icon: '👤',
    api: '/auth/users',
    idKey: '_id',
    fields: [
      { name: 'name', label: 'Name', type: 'text', required: true, class: 'input', wrapperClass: 'col-6' },
      { name: 'email', label: 'Email', type: 'text', required: true, class: 'input', wrapperClass: 'col-6' },
      { name: 'phone', label: 'Phone', type: 'text', class: 'input', wrapperClass: 'col-6' },
      {
        name: 'role',
        label: 'Role',
        type: 'select',
        options: [
          { label: 'Admin', value: 'ADMIN' },
          { label: 'Staff', value: 'STAFF' },
          { label: 'Freelancer', value: 'FREELANCER' },
        ],
        required: true,
        class: 'input',
        wrapperClass: 'col-6',
      },
    ],
    columns: [
      { key: 'name', label: 'Name' },
      { key: 'email', label: 'Email' },
      { key: 'role', label: 'Role' },
      { key: 'phone', label: 'Phone' },
    ],
    sidebar: false
  },

  // ── Equipments ──
  equipments: {
    key: 'equipments',
    label: 'Equipment',
    icon: '📷',
    api: '/equipments',
    idKey: '_id',
    fields: [
      { name: 'name', label: 'Name', type: 'text', required: true, class: 'input', wrapperClass: 'col-6' },
      {
        name: 'category',
        label: 'Category',
        type: 'select',
        options: [
          { label: 'Camera', value: 'CAMERA' },
          { label: 'Lens', value: 'LENS' },
          { label: 'Drone', value: 'DRONE' },
          { label: 'Lighting', value: 'LIGHTING' },
          { label: 'Audio', value: 'AUDIO' },
          { label: 'Other', value: 'OTHER' }
        ],
        required: true,
        class: 'input',
        wrapperClass: 'col-6',
      },
      { name: 'serialNumber', label: 'Serial Number', type: 'text', class: 'input', wrapperClass: 'col-6' },
      {
        name: 'condition',
        label: 'Condition',
        type: 'select',
        options: [
          { label: 'Excellent', value: 'EXCELLENT' },
          { label: 'Good', value: 'GOOD' },
          { label: 'Fair', value: 'FAIR' },
          { label: 'Poor', value: 'POOR' }
        ],
        class: 'input',
        wrapperClass: 'col-6',
      },
      { name: 'notes', label: 'Notes', type: 'textarea', class: 'textarea', wrapperClass: 'col-12' },
    ],
    columns: [
      { key: 'name', label: 'Name' },
      { key: 'category', label: 'Category' },
      { key: 'condition', label: 'Condition' },
      { key: 'serialNumber', label: 'Serial No.' }
    ],
    sidebar: true
  }
};


export function getEntityConfig(entityKey: string): EntityConfig | null {
  return ENTITIES[entityKey] ?? null;
}
