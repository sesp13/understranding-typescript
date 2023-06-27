// Validation
export interface Validatable {
  value: string | number;
  required: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
}

export function validate(validatableInput: Validatable): boolean {
  let isValid = true;
  const { value, required, minLength, maxLength, min, max } = validatableInput;
  if (required) {
    isValid = isValid && value.toString().trim().length !== 0;
  }

  if (
    minLength !== null &&
    minLength !== undefined &&
    typeof value == 'string'
  ) {
    isValid = isValid && value.length > minLength;
  }

  if (
    maxLength !== null &&
    maxLength !== undefined &&
    typeof value == 'string'
  ) {
    isValid = isValid && value.length < maxLength;
  }

  if (min !== null && min !== undefined && typeof value == 'number') {
    isValid = isValid && value >= min;
  }

  if (max !== null && max !== undefined && typeof value == 'number') {
    isValid = isValid && value <= max;
  }

  return isValid;
}
