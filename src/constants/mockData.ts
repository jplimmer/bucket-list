import { Dream } from "../models/types.js";
import { addDream } from "../services/dreamService.js";
import { getLogger } from "../utils/logger.js";

const logger = getLogger();

/** Sample dream data for development and testing. */
const dreams: Dream[] = [
  {
    id: 1,
    name: "Lära mig HTML/CSS",
    theme: "teknikdrömmar",
    isChecked: true,
  },
  {
    id: 2,
    name: "Lära mig TypeScript",
    theme: "teknikdrömmar",
    isChecked: false,
  },
  {
    id: 3,
    name: "En dröm som tar flera rader lorem ipsum",
    theme: "vardagsdrömmar",
    isChecked: false,
  },
];

/** Saves mock dream data to storage for development/testing purposes. */
export function saveMockDreams(): void {
  try {
    for (const { name, theme } of dreams) {
      addDream(name, theme);
    }
  } catch (error) {
    logger.error("Mock dreams could not be added:", error);
  }
}
