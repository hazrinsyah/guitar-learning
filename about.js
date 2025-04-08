document.addEventListener("DOMContentLoaded", function() {
    gsap.from(".fade-in", { duration: 1, opacity: 0, y: -50, stagger: 0.3 });
    gsap.from(".slide-up", { duration: 1, opacity: 0, y: 50, stagger: 0.3 });
});
