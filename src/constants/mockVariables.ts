import { Dream } from "../models/types.js";
import { saveDreamList } from "../utils/storage.js";

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

export function saveMockDreams(): void {
  const saveSuccess = saveDreamList(dreams);
  if (!saveSuccess) {
    console.error("Mock dream list not saved.");
  }
}
