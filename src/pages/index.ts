// när användaren kommer in på sidan (DOMen laddats in), ska den omdirigeras till index.html 
window.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        window.location.replace('pages/login.html');
    }, 4000); // 4000 ms = 4 sekunder
});