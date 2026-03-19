export type EntityFieldType =
  | 'text'
  | 'number'
  | 'date'
  | 'datetime'
  | 'textarea'
  | 'select'
  | 'boolean'
  | 'relation'
  | 'email'
  | 'phone'
  | 'password'
  | 'file'
  | 'image'
  | 'array-key-value'
  | 'line-items';

export interface EntitySelectOption {
  label: string;
  value: any;
  data?: any;
}

export interface EntityRelationConfig {
  /** Entity key in registry */
  entity: string;

  /** Which property to store in DB */
  valueKey?: string; // default _id

  /** Which field to show in dropdown */
  labelKey?: string; // default name

  /** Optional custom API */
  api?: string;

  /** Allow multiple relation */
  multiple?: boolean;
}

export interface EntityValidation {
  min?: number;
  max?: number;
  pattern?: string;
  minLength?: number;
  maxLength?: number;
}

export interface EntityField {
  /** Dot notation supported (profile.name) */
  name: string;

  label?: string;

  type: EntityFieldType;

  required?: boolean;

  placeholder?: string;

  disabled?: boolean;

  hidden?: boolean;

  readonly?: boolean;

  defaultValue?: any;

  validation?: EntityValidation;

  /** Select fields */
  options?: EntitySelectOption[];

  /** Relation fields */
  relation?: EntityRelationConfig;

  /** Table settings */
  sortable?: boolean;
  searchable?: boolean;

  /** UI Layout */
  width?: string;
  group?: string;

  /** File uploads */
  accept?: string;

  /** Styling */
  class?: string;
  wrapperClass?: string;
  labelClass?: string;

  /** Help text */
  help?: string;
}

export interface EntityColumn {
  key: string;

  label: string;

  sortable?: boolean;

  searchable?: boolean;

  width?: string;

  /** Format display */
  format?: 'date' | 'currency' | 'boolean';

  /** Custom render */
  render?: (row: any) => string;
}

export interface EntityRowAction {
  label: string;
  icon?: string;
  class?: string;
  onClick: (row: any, router: any, reload: () => void) => void;
  /** Optional visibility check */
  isVisible?: (row: any) => boolean;
}

export interface EntityPermissions {
  create?: boolean;
  update?: boolean;
  delete?: boolean;
  view?: boolean;
}

export interface EntityHooks {
  beforeCreate?: (data: any) => any;
  beforeUpdate?: (data: any) => any;
  afterLoad?: (data: any) => any;
}

export interface EntityConfig {
  sidebar: boolean;
  /** Unique key */
  key: string;

  /** Label in UI */
  label: string;

  /** Sidebar Icon */
  icon?: string;

  /** REST endpoint */
  api: string;

  /** Optional custom list endpoint */
  listApi?: string;

  /** Field definitions */
  fields: EntityField[];

  /** Table columns */
  columns?: EntityColumn[];

  /** ID field */
  idKey?: string; // default _id

  /** Default sorting */
  defaultSort?: {
    field: string;
    direction: 'asc' | 'desc';
  };

  /** Search fields */
  searchFields?: string[];

  /** Pagination */
  pageSize?: number;

  /** Permissions */
  permissions?: EntityPermissions;

  /** Lifecycle hooks */
  hooks?: EntityHooks;

  /** UI configuration */
  ui?: {
    showCreateButton?: boolean;
    showDeleteButton?: boolean;
    showEditButton?: boolean;
    updateRoute?: (row: any) => string;
    rowActions?: EntityRowAction[];
  };
}
