// Get user ID from URL
function getUserIdFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("userid");
}

// Update navigation links with user ID
function updateNavLinks() {
    const userId = getUserIdFromURL();
    if (!userId) return;

    const navLinks = {
        'nav-lessons-link': 'learning-path.html',
        'nav-dashboard-link': 'dashboard.html'
    };

    for (const [id, href] of Object.entries(navLinks)) {
        const link = document.getElementById(id);
        if (link) {
            link.href = `${href}?userid=${userId}`;
        }
    }
}

// Function to Open Any Modal
function openModal(id) {
  document.getElementById(id).style.display = "flex";
}

// Function to Close Any Modal
function closeModal(id) {
  document.getElementById(id).style.display = "none";
}

// Close modal when clicking outside the content
window.onclick = function(event) {
  const modals = document.querySelectorAll(".modal");
  modals.forEach(modal => {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  });
};

// Optional: Close with ESC key
document.addEventListener("keydown", function(event) {
  if (event.key === "Escape") {
    document.querySelectorAll(".modal").forEach(modal => {
      modal.style.display = "none";
    });
  }
});

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    updateNavLinks();
});
