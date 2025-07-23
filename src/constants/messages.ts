import { AUTH_CONFIG } from "./authConfig.js";

/** User-facing messages for authentication functionality. */
export const AUTH_MESSAGES = {
  BUTTONS: {
    /** Button text states for login action. */
    LOGIN_TEXTS: {
      original: "Logga in",
      loading: "Loggar in...",
      success: "Inloggad!",
    },
    /** Button text states for update/save action. */
    UPDATE_TEXTS: {
      original: "Spara",
      loading: "Sparar...",
      success: "Sparat!",
    },
  },
  ERROR: {
    /** Error shown when input contains spaces. */
    CONTAINS_SPACES: "Fältet får inte innehålla mellanslag.",
    /** Error shown when username is too short. */
    USERNAME_TOO_SHORT: `Användarnamnet måste vara minst ${AUTH_CONFIG.USERNAME_MIN_LENGTH} tecken långt.`,
    /** Error shown when password is too short. */
    PASSWORD_TOO_SHORT: `Lösenordet måste vara minst ${AUTH_CONFIG.PASSWORD_MIN_LENGTH} tecken långt.`,
    /** Error shown when password lacks required number. */
    PASSWORD_REQUIRES_NUMBER: "Lösenordet måste innehålla en siffra.",
    /** Error shown when password visibility toggle fails. */
    PASSWORD_NOT_SHOWN: "Något gick fel när lösenordet skulle visas.",
    /** Error shown when logout fails. */
    LOGOUT: "Problem vid utloggning, försök igen.",
  },
} as const;

/** User-facing messages for dream functionality. */
export const DREAM_MESSAGES = {
  BUTTONS: {
    /** Button text states for 'add dream' action. */
    ADD_DREAM_TEXTS: {
      original: "Lägg till",
      loading: "Lägger till din dröm...",
      success: "Dröm tillagd!",
    },
  },
  ERROR: {
    /** Error shown when no dreams found in storage. */
    NO_DREAMS_FOUND:
      "Inga drömmar hittades, lägg till en dröm för att komma igång",
    /** Error shown when dreams fail to display. */
    NO_DREAMS_DISPLAYED: "Drömmar kunde inte visas, vänligen uppdatera sidan.",
    /** Error shown when dream deletion fails. */
    NOT_DELETED: "Drömmen kunde inte tas bort.",
    /** Error shown when dream 'checked' toggle fails. */
    NOT_TOGGLED: "Drömmen kunde inte (av)bockas.",
  },
};

/** User-facing messages for theme functionality. */
export const THEME_MESSAGES = {
  BUTTONS: {
    /** Button text states for 'add theme' action. */
    ADD_THEME_TEXTS: {
      original: "Lägg till",
      loading: "Sparar...",
      success: "Tillagd!",
    },
  },
  ERROR: {
    /** Error shown when no themes found in storage. */
    NO_THEMES_FOUND:
      "Inga teman hittades, lägg till ett tema i inställningarna för att komma igång!",
    /** Error shown when themes fail to display. */
    NO_THEMES_DISPLAYED:
      "Drömteman kunde inte visas, vänligen uppdatera sidan.",
    /** Error shown when theme deletion fails. */
    NOT_DELETED: "Temat kunde inte tas bort.",
  },
};
