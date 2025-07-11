import { Dream } from "../models/types.js";

export function setUsername(username: string): void {
  localStorage.setItem("username", username);
}

export function getUsername(): string | null {
  return localStorage.getItem("username");
}

export function saveDreamList(dreamList: Dream[]): void {
  localStorage.setItem("dream-list", JSON.stringify(dreamList));
}

export function getDreamList(): Dream[] | null {
  const storedList = localStorage.getItem("dream-list");
  if (storedList) {
    const dreams: Dream[] = JSON.parse(storedList);
    return dreams;
  }
  return null;
}
