import { ControlValueAccessor, NgControl } from '@angular/forms';

/**
 * Base interface for all field components
 * Extends ControlValueAccessor to ensure Angular Forms compatibility
 */
export interface FieldComponent<T = unknown> extends ControlValueAccessor {
  value: T;
  onChange: (value: T) => void;
  onTouched: () => void;
  isDisabled?: boolean;
  label?: string;
  id?: string;
  autoFocus?: boolean;
  ngControl?: NgControl;
  setDisabledState?: (isDisabled: boolean) => void;
}

/**
 * Interface for date field components
 */
export interface DateFieldComponent extends FieldComponent<Date | null> {
  showIcon?: boolean;
}

/**
 * Type alias for string/text input field components
 */
export type StringFieldComponent = FieldComponent<string>;

/**
 * Type alias for number input field components
 */
export type NumberFieldComponent = FieldComponent<number | null>;

/**
 * Interface for select field components
 */
export interface SelectFieldComponent<T = unknown> extends FieldComponent<T | null> {
  options: T[];
  optionLabel?: string;
  optionValue?: string;
  placeholder?: string;
}
