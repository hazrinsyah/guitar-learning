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

// Function to Open Modal
function openModal(lesson) {
  const modal = document.getElementById("modal");
  const modalContent = document.getElementById("modal-content");

  let content = "";

  switch (lesson) {
      case "barre-chords":
          content = `
              <h2>🎸 Barre Chords</h2>
              <p>Master barre chords to play any chord shape across the fretboard.</p>
              <h3>🎯 Techniques</h3>
              <ul>
                  <li><strong>F Major Barre Chord</strong>: Use your index finger to bar all strings on the 1st fret.</li>
                  <li><strong>B Minor Barre Chord</strong>: Bar the 2nd fret and form a minor shape.</li>
                  <li><strong>Practice Tips</strong>: Start slow and focus on clean notes.</li>
              </ul>
              <button onclick="playAudio('barre-chords.mp3')">🎵 Play Example</button>
          `;
          break;

      case "alternate-picking":
          content = `
              <h2>🎸 Alternate Picking</h2>
              <p>Improve your speed and accuracy with alternate picking techniques.</p>
              <h3>🎯 Exercises</h3>
              <ul>
                  <li><strong>Down-Up Picking</strong>: Alternate between downstrokes and upstrokes.</li>
                  <li><strong>String Skipping</strong>: Practice picking across non-adjacent strings.</li>
                  <li><strong>Metronome Practice</strong>: Use a metronome to build speed gradually.</li>
              </ul>
              <button onclick="playAudio('alternate-picking.mp3')">🎵 Play Example</button>
          `;
          break;

      case "fingerstyle":
          content = `
              <h2>🎸 Fingerstyle Patterns</h2>
              <p>Learn intermediate fingerstyle patterns for richer sound.</p>
              <h3>🎯 Patterns</h3>
              <ul>
                  <li><strong>Travis Picking</strong>: Alternate bass notes with fingerpicked melodies.</li>
                  <li><strong>Arpeggio Patterns</strong>: Play chord notes individually for a flowing sound.</li>
                  <li><strong>Thumb Independence</strong>: Practice thumb patterns while fingers play melodies.</li>
              </ul>
              <button onclick="playAudio('fingerstyle.mp3')">🎵 Play Example</button>
          `;
          break;

      case "improvisation":
          content = `
              <h2>🎸 Improvisation Basics</h2>
              <p>Start improvising using scales and simple techniques.</p>
              <h3>🎯 Tips</h3>
              <ul>
                  <li><strong>Pentatonic Scale</strong>: Use the minor pentatonic scale for solos.</li>
                  <li><strong>Call and Response</strong>: Create musical phrases that "answer" each other.</li>
                  <li><strong>Backing Tracks</strong>: Practice improvising over backing tracks.</li>
              </ul>
              <button onclick="playAudio('improvisation.mp3')">🎵 Play Example</button>
          `;
          break;
  }

  modalContent.innerHTML = content;
  modal.style.display = "flex";
}

// Function to Close Modal
function closeModal() {
  document.getElementById("modal").style.display = "none";
}

// Function to Play Audio
function playAudio(audioFile) {
  let audio = new Audio(audioFile);
  audio.play();
}

// Close modal when clicking outside the content
window.onclick = function(event) {
  const modal = document.getElementById("modal");
  if (event.target === modal) {
      modal.style.display = "none";
  }
};

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    updateNavLinks();
});