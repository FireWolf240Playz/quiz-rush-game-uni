import { startGame } from "./game.js";

// Get setup screen elements
const setupScreen = document.getElementById("setupScreen");
const gameScreen = document.getElementById("gameScreen");
const startGameBtn = document.getElementById("startGame");
const startGameContainer = document.getElementById("startGameContainer");
const difficultySelect = document.getElementById("difficulty");

// Hide Start Game button initially
startGameContainer.style.display = "none";

// 🎯 Show Start Button Only After Selecting Difficulty
difficultySelect.addEventListener("change", () => {
  startGameContainer.style.display = "block";
});

// 🏁 Start Game & Switch Screens
startGameBtn.addEventListener("click", () => {
  const gameSettings = {
    players: parseInt(document.getElementById("playerCount").value),
    topic: document.getElementById("quizTopic").value,
    difficulty: parseInt(difficultySelect.value),
  };

  // Save settings in localStorage so `game.js` can access them
  localStorage.setItem("gameSettings", JSON.stringify(gameSettings));

  // Hide setup screen, show game screen
  setupScreen.style.display = "none";
  gameScreen.style.display = "block";

  // Now call game.js logic to start the game
  startGame();
});
