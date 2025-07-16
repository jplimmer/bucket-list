import { defaultThemes } from "../constants/dreamThemes.js";
import { getLogger } from "../utils/logger.js";
import { themeStorage } from "../utils/storage.js";

const logger = getLogger();

export function loadThemes(): string[] {
  const themeList = themeStorage.load();
  if (!themeList) {
    logger.error("Theme list could not be loaded from storage.");
    return [];
  }
  return themeList;
}

export function addTheme() {}

export function deleteTheme() {}

export function saveDefaultThemes(): void {
  const defaultSaved = themeStorage.save(defaultThemes);
  if (!defaultSaved) {
    try {
      themeStorage.save(["dröm"]);
      logger.warn("Default themes not saved on login, using fallback.");
    } catch (error) {
      logger.error("No themes saved on login.");
    }
  }
}
