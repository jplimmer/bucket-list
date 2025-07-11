export function setUsername(username: string) {
  localStorage.setItem("username", username);
}

export function getUsername(): string | null {
  return localStorage.getItem("username");
}
