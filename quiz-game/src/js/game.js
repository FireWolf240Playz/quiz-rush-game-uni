// Retrieve game settings from localStorage
let gameSettings = JSON.parse(localStorage.getItem("gameSettings"));

// Variables to manage the game state
let players = [];
let currentPlayerIndex = 0;
let currentQuestionIndex = 0;
let questions = [];
let score = {};
let timeLeft = 10;
let timerInterval;

// Create player names dynamically
players = Array.from(
  { length: gameSettings.players },
  (_, i) => `Player ${i + 1}`,
);
players.forEach((player) => (score[player] = 0));

// 🎯 Load Questions from JSON
async function loadQuestions() {
  try {
    let response = await fetch("/questions.json"); // Make sure this file is in `public/`
    let data = await response.json();

    // Get only the required number of questions based on difficulty and number of players
    questions = data[gameSettings.topic].slice(
      0,
      gameSettings.difficulty * gameSettings.players,
    );

    displayQuestion(); // Start game with first question
  } catch (error) {
    console.error("Error loading questions:", error);
  }
}

// 🎯 Display Current Question
function displayQuestion() {
  clearInterval(timerInterval);
  timeLeft = 10;

  let currentQuestion = questions[currentQuestionIndex];
  let currentPlayer = players[currentPlayerIndex];

  // Update UI with current player's name
  document.getElementById("playerName").textContent = currentPlayer;

  // Display the question
  document.getElementById("question-text").textContent =
    currentQuestion.question;

  // Get answer buttons container
  let answerButtons = document.getElementById("answer-buttons");
  answerButtons.innerHTML = ""; // Clear previous buttons

  // Create answer buttons dynamically
  currentQuestion.options.forEach((option, index) => {
    let btn = document.createElement("button");
    btn.classList.add("answer-btn");
    btn.textContent = option;
    btn.onclick = () => checkAnswer(index);
    answerButtons.appendChild(btn);
  });

  // Start Timer
  startTimer();
}

// ⏳ Start Timer for Each Turn
function startTimer() {
  document.getElementById("timeLeft").textContent = timeLeft;

  timerInterval = setInterval(() => {
    timeLeft--;
    document.getElementById("timeLeft").textContent = timeLeft;

    if (timeLeft === 0) {
      clearInterval(timerInterval);
      nextTurn(); // Move to next player if time runs out
    }
  }, 1000);
}

// ✅ Check Answer and Award Points
function checkAnswer(selectedIndex) {
  clearInterval(timerInterval); // Stop timer when answer is selected

  let currentQuestion = questions[currentQuestionIndex];
  let currentPlayer = players[currentPlayerIndex];

  if (selectedIndex === currentQuestion.correctIndex) {
    score[currentPlayer] += currentQuestion.points; // Award points
  }

  nextTurn();
}

// 🔄 Move to Next Player or Next Question
function nextTurn() {
  currentPlayerIndex = (currentPlayerIndex + 1) % players.length;

  if (currentPlayerIndex === 0) {
    currentQuestionIndex++;
  }

  if (currentQuestionIndex < questions.length) {
    displayQuestion();
  } else {
    endGame();
  }
}

// 🏆 End Game and Display Final Scores
function endGame() {
  let resultText = "<h2>Game Over! Final Scores:</h2>";
  Object.entries(score).forEach(([player, points]) => {
    resultText += `<p>${player}: ${points} points</p>`;
  });

  document.getElementById("gameScreen").innerHTML = resultText;
}

// 🏁 Start the game after loading questions
export async function startGame() {
  await loadQuestions();
}

// Ensure game starts when game screen is loaded
document.addEventListener("DOMContentLoaded", async () => {
  await startGame();
});
