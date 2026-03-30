export const GLOBAL_STATUSES = {
  // Operational Workflow
  DRAFT: 'DRAFT',
  CONFIRMED: 'CONFIRMED',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
  
  // Sales / Transitions (Internal)
  SENT: 'SENT',
  ACCEPTED: 'ACCEPTED',
  REJECTED: 'REJECTED',
  CONVERTED: 'CONVERTED',

  // Payment States (Now Separate)
  UNPAID: 'UNPAID',
  PARTIAL: 'PARTIAL',
  PAID: 'PAID'
};

/**
 * Clean Operational Workflow (Bookings, Jobs, Quotations, Invoices)
 */
export const WORKFLOW_STATUS_OPTIONS = [
  { label: 'Draft', value: GLOBAL_STATUSES.DRAFT },
  { label: 'Confirmed', value: GLOBAL_STATUSES.CONFIRMED },
  { label: 'In Progress', value: GLOBAL_STATUSES.IN_PROGRESS },
  { label: 'Completed', value: GLOBAL_STATUSES.COMPLETED },
  { label: 'Cancelled', value: GLOBAL_STATUSES.CANCELLED }
];

/**
 * Billing and Finance (Bookings, Invoices)
 */
export const PAYMENT_STATUS_OPTIONS = [
  { label: 'Unpaid', value: GLOBAL_STATUSES.UNPAID },
  { label: 'Partial Payment', value: GLOBAL_STATUSES.PARTIAL },
  { label: 'Fully Paid', value: GLOBAL_STATUSES.PAID }
];

// For backward compatibility during migration
export const GLOBAL_STATUS_OPTIONS = [...WORKFLOW_STATUS_OPTIONS, ...PAYMENT_STATUS_OPTIONS];
