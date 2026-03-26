export const GLOBAL_STATUSES = {
  PENDING: 'PENDING',
  PLANNED: 'PLANNED',
  CONFIRMED: 'CONFIRMED',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
  DRAFT: 'DRAFT',
  SENT: 'SENT',
  ACCEPTED: 'ACCEPTED',
  REJECTED: 'REJECTED',
  CONVERTED: 'CONVERTED',
  PARTIALLY_PAID: 'PARTIALLY_PAID',
  PAID: 'PAID'
};

export const GLOBAL_STATUS_OPTIONS = [
  { label: 'Pending', value: GLOBAL_STATUSES.PENDING },
  { label: 'Planned', value: GLOBAL_STATUSES.PLANNED },
  { label: 'Confirmed', value: GLOBAL_STATUSES.CONFIRMED },
  { label: 'In Progress', value: GLOBAL_STATUSES.IN_PROGRESS },
  { label: 'Completed', value: GLOBAL_STATUSES.COMPLETED },
  { label: 'Cancelled', value: GLOBAL_STATUSES.CANCELLED },
  { label: 'Draft', value: GLOBAL_STATUSES.DRAFT },
  { label: 'Sent', value: GLOBAL_STATUSES.SENT },
  { label: 'Accepted', value: GLOBAL_STATUSES.ACCEPTED },
  { label: 'Rejected', value: GLOBAL_STATUSES.REJECTED },
  { label: 'Converted', value: GLOBAL_STATUSES.CONVERTED },
  { label: 'Partially Paid', value: GLOBAL_STATUSES.PARTIALLY_PAID },
  { label: 'Paid', value: GLOBAL_STATUSES.PAID }
];
