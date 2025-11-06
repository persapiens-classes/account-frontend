import { NgControl } from '@angular/forms';
import { InputSignal } from '@angular/core';

/**
 * Base interface for all field components
 */
export interface FieldSComponent<T = unknown> {
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
export interface DateFieldSComponent extends FieldSComponent<Date | null> {
  showIcon?: InputSignal<boolean>;
}

/**
 * Type for string/text input field components
 */
export type StringFieldSComponent = FieldSComponent<string>;

/**
 * Type for number input field components
 */
export type NumberFieldSComponent = FieldSComponent<number | null>;

/**
 * Interface for select field components
 */
export interface SelectFieldSComponent<T = unknown> extends FieldSComponent<T | null> {
  options: InputSignal<T[]>;
  optionLabel: InputSignal<string>;
  optionValue: InputSignal<string>;
  placeholder: InputSignal<string>;
}
