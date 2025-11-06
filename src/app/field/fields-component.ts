import { NgControl } from '@angular/forms';
import { InputSignal } from '@angular/core';

/**
 * Base interface for all field components
 */
export interface FieldComponent<T = unknown> {
  isDisabled?: boolean;
  label?: InputSignal<string>;
  id?: InputSignal<string>;
  autoFocus?: InputSignal<boolean>;
  ngControl?: NgControl;
  setDisabledState?: (isDisabled: boolean) => void;
}

/**
 * Interface for date field components
 */
export interface DateFieldComponent extends FieldComponent<Date | null> {
  showIcon?: InputSignal<boolean>;
}

/**
 * Type for string/text input field components
 */
export type StringFieldComponent = FieldComponent<string>;

/**
 * Type for number input field components
 */
export type NumberFieldComponent = FieldComponent<number | null>;

/**
 * Interface for select field components
 */
export interface SelectFieldComponent<T = unknown> extends FieldComponent<T | null> {
  options: InputSignal<T[]>;
  optionLabel: InputSignal<string>;
  optionValue: InputSignal<string>;
  placeholder: InputSignal<string>;
}
