/** Redirects to login page after 4 seconds splash screen delay */
window.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    window.location.replace("login.html");
  }, 4000);
});
