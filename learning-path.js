document.addEventListener("DOMContentLoaded", function() {
    // Get user ID from URL
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

    // Fetch user data
    fetch(`http://localhost:8000/user?userid=${userId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                document.getElementById("username").innerText = data.user.username || "User";
                document.getElementById("streak-count").innerText = data.streak.total_streak || 0;
            } else {
                alert("Failed to load user data. Please log in again.");
                window.location.href = "home.html";
            }
        })
        .catch(error => {
            console.error("Error fetching user data:", error);
            alert("An error occurred while loading your data.");
        });

    // Handle level card clicks
    const levelCards = document.querySelectorAll('.level-card');
    
    levelCards.forEach(card => {
        card.addEventListener('click', function() {
            const level = this.querySelector('h3').textContent;
            
            console.log("Sending lesson data:", { userId: parseInt(userId), lesson: level });
            
            // Call the /lesson endpoint to update the user's lesson level
            fetch('http://localhost:8000/lesson', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    userId: parseInt(userId),
                    lesson: level
                })
            })
            .then(response => {
                console.log("Response status:", response.status);
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log("Response data:", data);
                if (data.success) {
                    // Redirect to the appropriate level page with user ID
                    const levelPage = level.toLowerCase().replace(/\s+/g, '-') + '.html';
                    window.location.href = `${levelPage}?userid=${userId}`;
                } else {
                    alert("Failed to update lesson level. Please try again.");
                }
            })
            .catch(error => {
                console.error("Error updating lesson level:", error);
                alert("An error occurred while updating your lesson level.");
            });
        });
    });
});
