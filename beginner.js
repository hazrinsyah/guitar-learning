// Lesson Data with Video Tutorials
const lessons = {
    "getting-started": {
        title: "Getting Started",
        description: "Learn how to hold and strum your guitar.",
        video: "https://www.youtube.com/embed/BBz-Jyr23M4?si=0k64dJGaSWrNLzkY"
    },
    "plucking-strings": {
        title: "Plucking Open Strings",
        description: "Practice plucking individual strings to build accuracy.",
        video: "https://www.youtube.com/embed/zZSNQK0NmW8?si=LAm0dmYj57-aR1Wj"
    },
    "basic-transitions": {
        title: "Basic String Transitions",
        description: "Learn to move between strings smoothly.",
        video: "https://www.youtube.com/embed/VaegrntyEgk?si=Chi6yoo8_YM50f8q"
    }
};

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

// Function to Open Lesson Modal
function openLesson(lessonKey) {
    const lesson = lessons[lessonKey];
    document.getElementById("lesson-title").innerText = lesson.title;
    document.getElementById("lesson-description").innerText = lesson.description;
    document.getElementById("lesson-video").src = lesson.video;
    document.getElementById("lesson-modal").style.display = "flex";
}

// Function to Close Lesson Modal
function closeLesson() {
    document.getElementById("lesson-modal").style.display = "none";
    document.getElementById("lesson-video").src = ""; // Stop video playback
}

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    updateNavLinks();
});
