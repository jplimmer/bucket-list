export type FormControl =
  | HTMLInputElement
  | HTMLSelectElement
  | HTMLTextAreaElement;

export interface FormInput {
  element: FormControl;
  errorElement: HTMLElement;
}

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

export interface FormElements {
  form: HTMLFormElement;
  inputs: Record<string, FormInput>;
  buttonConfig: ButtonConfig;
  announcer?: HTMLElement;
}

export interface FormState {
  isSubmitting: boolean;
}
