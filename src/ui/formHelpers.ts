import {
  FormInput,
  ButtonConfig,
  FormElements,
  FormControl,
} from "../models/formUI.js";

export function createFormInput(
  element: FormControl,
  errorElement: HTMLElement
): FormInput {
  return { element, errorElement };
}

export function createButtonConfig(
  button: HTMLButtonElement,
  texts: { original: string; loading: string; success: string },
  successClass: string
): ButtonConfig {
  return {
    button,
    texts,
    classes: {
      success: successClass,
    },
  };
}

export function resetInputs(inputs: Record<string, FormControl>) {
  for (const input of Object.values(inputs)) {
    if (input instanceof HTMLSelectElement) {
      input.selectedIndex = 0;
    } else {
      input.value = "";
    }
  }
}
