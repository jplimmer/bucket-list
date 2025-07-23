/** Union type representing HTML form control elements that can receive user input. */
export type FormControl =
  | HTMLInputElement
  | HTMLSelectElement
  | HTMLTextAreaElement;

/** Represents a form input field paired with its associated error display element. */
export interface FormInput {
  element: FormControl;
  errorElement: HTMLElement;
}

/** Configuration for a button's visual states and text content during form interactions. */
export interface ButtonConfig {
  button: HTMLButtonElement;
  texts: {
    original: string;
    loading: string;
    success: string;
  };
  classes: {
    success: string;
  };
}

/** Complete collection of form elements and their configurations for form management. */
export interface FormElements {
  form: HTMLFormElement;
  inputs: Record<string, FormInput>;
  buttonConfig: ButtonConfig;
  announcer?: HTMLElement;
}

/** Tracks the current submission state of a form.  */
export interface FormState {
  isSubmitting: boolean;
}
