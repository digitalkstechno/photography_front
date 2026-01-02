export interface FormField {
  key: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'textarea' | 'select' | 'checkbox';

  required?: boolean;
  disabled?: boolean;
  placeholder?: string;

  /** 🔥 NEW: CSS control */
  class?: string;                 // input / textarea class
  wrapperClass?: string;          // outer div class
  labelClass?: string;            // label class
}
