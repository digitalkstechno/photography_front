export interface FormField {
  key: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'textarea' | 'select' | 'checkbox';

  required?: boolean;
  disabled?: boolean;
  placeholder?: string;

  /** 🔥 NEW (BACKWARD COMPATIBLE) */
  options?: {
    label: string;
    value: string;
  }[];

  /** 🎨 CSS control */
  class?: string;
  wrapperClass?: string;
  labelClass?: string;
}
