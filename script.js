// Function to open the login popup
function openLoginPopup() {
    document.getElementById("loginPopup").style.display = "flex";
    document.getElementById("signUpPopup").style.display = "none";
}

// Function to open the sign-up popup
function openSignUpPopup() {
    document.getElementById("signUpPopup").style.display = "flex";
    document.getElementById("loginPopup").style.display = "none";
}

// Function to close the popups
function closePopup() {
    document.getElementById("loginPopup").style.display = "none";
    document.getElementById("signUpPopup").style.display = "none";
}

// Function to check if the user is logged in
function isUserLoggedIn() {
    return localStorage.getItem("loggedInUser") !== null;
}

// Function to handle profile button click
function redirectToDashboard() {
    if (isUserLoggedIn()) {
        window.location.href = "dashboard.html"; // Redirect to dashboard
    } else {
        openLoginPopup(); // Show login popup if not logged in
    }
}

// Function to handle login
function handleLogin() {
    var username = document.getElementById("loginUsername").value;
    var password = document.getElementById("loginPassword").value;

    if (username && password) {
        fetch("http://localhost:8000/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
        })
        .then((response) => response.json())
        .then((data) => {
            if (data.success) {
                alert("Success: " + data.message);
                
                localStorage.setItem("loggedInUser", username); // Store login status
                localStorage.setItem("userStreak", data.streak); // Store streak

                // Redirect to dashboard.html with userid in query params
                window.location.href = `dashboard.html?userid=${data.userid}`;
            } else {
                alert("Error: " + data.message);
            }
        })
        .catch((error) => console.error("Fetch Error:", error));
    } else {
        alert("Please enter both username and password.");
    }
}

// Function to handle sign up
function handleSignUp() {
    var username = document.getElementById("signupUsername").value;
    var email = document.getElementById("signupEmail").value;
    var password = document.getElementById("signupPassword").value;

    if (username && email && password) {
        fetch("http://localhost:8000/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, email, password }),
        })
        .then((response) => response.json())
        .then((data) => {
            if (data.success) {
                alert("Success: " + data.message);
                openLoginPopup();
            } else {
                alert("Error: " + data.message);
            }
        })
        .catch((error) => console.error("Fetch Error:", error));
    } else {
        alert("Please fill in all the fields.");
    }
}

// Function to handle logout
function handleLogout() {
    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("userStreak");
    window.location.href = "home.html"; // Redirect to home page after logout
}