require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const db = require("./db");

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(bodyParser.json());

// Test route
app.get("/", (req, res) => {
  res.send("Node.js Backend is Running!");
});

// Handle User Signup
app.post("/signup", (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const query = "INSERT INTO account (username, email, pass) VALUES (?, ?, ?)";

    db.query(query, [username, email, password], (err, result) => {
        if (err) {
            return res.status(500).json({ success: false, message: "Signup failed", error: err });
        }

        const userId = result.insertId; // Get the new user's ID
        const streakQuery = "INSERT INTO streak (user_id, total_streak, datetime) VALUES (?, ?, NOW())";

        db.query(streakQuery, [userId, 1], (streakErr) => {
            if (streakErr) {
                return res.status(500).json({ success: false, message: "Signup successful, but streak not initialized", error: streakErr });
            }

            res.json({ success: true, message: "Signup successful! Streak started at 1." });
        });
    });
});
  
  // Handle User Login
  app.post("/login", (req, res) => {
    const { username, password } = req.body;

    // First, check if the user exists
    const query = "SELECT id FROM account WHERE username = ? AND pass = ? LIMIT 1";
    db.query(query, [username, password], (err, results) => {
        if (err) {
            return res.status(500).json({ success: false, message: "Login failed", error: err });
        }

        if (results.length > 0) {
            const userId = results[0].id;

            // Fetch the latest streak entry for the user
            const streakQuery = "SELECT total_streak, datetime FROM streak WHERE user_id = ? ORDER BY datetime DESC LIMIT 1";
            db.query(streakQuery, [userId], (streakErr, streakResults) => {
                if (streakErr) {
                    return res.status(500).json({ success: false, message: "Error fetching streak data", error: streakErr });
                }

                const currentTime = new Date();
                let newStreak = 1;

                if (streakResults.length > 0) {
                    const lastStreak = streakResults[0];
                    const lastLoginTime = new Date(lastStreak.datetime);

                    const timeDiffHours = Math.abs((currentTime - lastLoginTime) / (1000 * 60 * 60)); // Convert milliseconds to hours

                    if (timeDiffHours >= 24 && timeDiffHours < 42) {
                        newStreak = lastStreak.total_streak + 1;
                    } else if (timeDiffHours >= 42) {
                        newStreak = 1; // Reset streak if exceeded 42 hours
                    } else {
                        newStreak = lastStreak.total_streak; // Keep current streak
                    }
                }

                // Update streak table with the new streak value
                const updateStreakQuery = "UPDATE streak SET total_streak = ?, datetime = NOW() WHERE user_id = ? AND datetime = (SELECT datetime FROM (SELECT datetime FROM streak WHERE user_id = ? ORDER BY datetime DESC LIMIT 1) AS temp)";
                db.query(updateStreakQuery, [newStreak, userId, userId], (updateErr) => {
                    if (updateErr) {
                        return res.status(500).json({ success: false, message: "Error updating streak", error: updateErr });
                    }

                    res.json({
                        success: true,
                        message: "Login successful",
                        userid: userId,
                        streak: newStreak
                    });
                });
            });
        } else {
            res.json({ success: false, message: "Invalid username or password" });
        }
    });
});

app.get("/user", (req, res) => {
    const userId = req.query.userid; // Get userId from query parameters

    if (!userId) {
        return res.status(400).json({ success: false, message: "User ID is required" });
    }

    // Query to fetch user details from account table
    const userQuery = "SELECT id, username, email FROM account WHERE id = ?";
    
    // Query to fetch streak details from streak table
    const streakQuery = "SELECT total_streak, datetime FROM streak WHERE user_id = ? ORDER BY datetime DESC LIMIT 1";

    // Query to fetch lesson data from lessontype table
    const lessonQuery = "SELECT lesson FROM lessontype WHERE userId = ?";

    db.query(userQuery, [userId], (userErr, userResults) => {
        if (userErr) {
            return res.status(500).json({ success: false, message: "Error fetching user data", error: userErr });
        }

        if (userResults.length === 0) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const userData = userResults[0];

        db.query(streakQuery, [userId], (streakErr, streakResults) => {
            if (streakErr) {
                return res.status(500).json({ success: false, message: "Error fetching streak data", error: streakErr });
            }

            const streakData = streakResults.length > 0 ? streakResults[0] : { total_streak: 0, datetime: null };

            db.query(lessonQuery, [userId], (lessonErr, lessonResults) => {
                if (lessonErr) {
                    return res.status(500).json({ success: false, message: "Error fetching lesson data", error: lessonErr });
                }

                const lessonData = lessonResults.length > 0 ? lessonResults[0] : { lesson: null };

                res.json({
                    success: true,
                    user: {
                        id: userData.id,
                        username: userData.username,
                        email: userData.email,
                    },
                    streak: {
                        total_streak: streakData.total_streak,
                        last_streak_datetime: streakData.datetime,
                    },
                    lesson: {
                        data: lessonData.lesson
                    }
                });
            });
        });
    });
});

// Handle User Lesson Data
app.post("/lesson", (req, res) => {
    const { userId, lesson } = req.body;

    if (!userId || !lesson) {
        return res.status(400).json({ success: false, message: "User ID and lesson data are required" });
    }

    // First check if the user exists
    const userCheckQuery = "SELECT id FROM account WHERE id = ?";
    db.query(userCheckQuery, [userId], (userErr, userResults) => {
        if (userErr) {
            return res.status(500).json({ success: false, message: "Error checking user", error: userErr });
        }

        if (userResults.length === 0) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Check if lesson data already exists for this user
        const checkLessonQuery = "SELECT id FROM lessontype WHERE userId = ?";
        db.query(checkLessonQuery, [userId], (checkErr, checkResults) => {
            if (checkErr) {
                return res.status(500).json({ success: false, message: "Error checking lesson data", error: checkErr });
            }

            if (checkResults.length > 0) {
                // Update existing lesson data
                const updateQuery = "UPDATE lessontype SET lesson = ? WHERE userId = ?";
                db.query(updateQuery, [lesson, userId], (updateErr) => {
                    if (updateErr) {
                        return res.status(500).json({ success: false, message: "Error updating lesson data", error: updateErr });
                    }
                    res.json({ success: true, message: "Lesson data updated successfully" });
                });
            } else {
                // Insert new lesson data
                const insertQuery = "INSERT INTO lessontype (lesson, userId) VALUES (?, ?)";
                db.query(insertQuery, [lesson, userId], (insertErr) => {
                    if (insertErr) {
                        return res.status(500).json({ success: false, message: "Error creating lesson data", error: insertErr });
                    }
                    res.json({ success: true, message: "Lesson data created successfully" });
                });
            }
        });
    });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});