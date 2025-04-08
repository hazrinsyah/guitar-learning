document.addEventListener("DOMContentLoaded", function () {
    function getUserIdFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get("userid");
    }

    const userId = getUserIdFromURL();

    if (!userId) {
        alert("User ID is missing. Redirecting to login...");
        window.location.href = "home.html"; 
        return;
    }

    // Update the Lessons link with the user ID
    const lessonsLink = document.getElementById("lessons-link");
    if (lessonsLink) {
        lessonsLink.href = `learning-path.html?userid=${userId}`;
    }

    fetch(`http://localhost:8000/user?userid=${userId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                document.getElementById("userName").textContent = data.user.username || "User";
                document.getElementById("streak-days").textContent = data.streak.total_streak || 0;
                document.getElementById("current-badge").textContent = data.lesson && data.lesson.data ? data.lesson.data : "-";

                localStorage.setItem("streakDays", data.streak.total_streak || 0);
            } else {
                alert("Failed to load user data. Please log in again.");
                window.location.href = "home.html";
            }
        })
        .catch(error => {
            console.error("Error fetching user data:", error);
            alert("An error occurred while loading your data.");
        });
});
