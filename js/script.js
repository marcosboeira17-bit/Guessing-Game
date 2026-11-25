
// HTML ELEMENTS

const question = document.getElementById("question");
const score = document.getElementById("score");
const progress = document.getElementById("progress");
const category = document.getElementById("category");
const clues = document.getElementById("clues");
const answer = document.getElementById("answer");
const message = document.getElementById("message");

const checkBtn = document.getElementById("checkBtn");
const hintBtn = document.getElementById("hintBtn");
const nextBtn = document.getElementById("nextBtn");
const restartBtn = document.getElementById("restartBtn");


// GAME VARIABLES

let gameWords = [];
let currentQuestion = 0;
let currentHint = 0;
let totalScore = 0;
let answered = false;
let gameFinished = false;


// SHUFFLE WORDS

function shuffleWords(array) {

    const shuffled = [...array];

    for (let i = shuffled.length - 1; i > 0; i--) {

        const j = Math.floor(Math.random() * (i + 1));

        [shuffled[i], shuffled[j]] =
            [shuffled[j], shuffled[i]];
    }

    return shuffled;
}


// NORMALIZE ANSWERS

function normalizeText(text) {

    return text
        .trim()
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
}


// START GAME

function startGame() {

    gameWords = shuffleWords(words);

    currentQuestion = 0;
    currentHint = 0;
    totalScore = 0;
    answered = false;
    gameFinished = false;

    score.textContent = "0 pts";

    loadQuestion();
}


// LOAD QUESTION

function loadQuestion() {

    const word = gameWords[currentQuestion];

    currentHint = 0;
    answered = false;

    question.textContent =
        `${currentQuestion + 1} / ${gameWords.length}`;

    category.textContent = word.category;

    progress.style.width =
        `${(currentQuestion / gameWords.length) * 100}%`;

    clues.innerHTML = "";

    showHint();

    answer.value = "";
    answer.disabled = false;

    message.textContent = "";
    message.className = "";

    checkBtn.disabled = false;
    hintBtn.disabled = false;
    nextBtn.disabled = true;

    nextBtn.textContent =
        currentQuestion === gameWords.length - 1
            ? "Finish Game"
            : "Next Word →";

    answer.focus();
}


// SHOW HINT

function showHint() {

    const word = gameWords[currentQuestion];

    const clue = document.createElement("p");

    clue.textContent =
        `Clue ${currentHint + 1}: ${word.hints[currentHint]}`;

    clues.appendChild(clue);
}


// MORE HINTS

function moreHints() {

    if (answered || gameFinished) return;

    const word = gameWords[currentQuestion];

    if (currentHint < word.hints.length - 1) {

        currentHint++;

        showHint();
    }

    if (currentHint === word.hints.length - 1) {

        hintBtn.disabled = true;
    }
}


// CHECK ANSWER

function checkAnswer() {

    if (answered || gameFinished) return;

    const userAnswer = normalizeText(answer.value);

    if (userAnswer === "") {

        message.textContent = "Please enter an answer.";

        message.className = "incorrect";

        return;
    }

    const word = gameWords[currentQuestion];

    const validAnswers = [

        word.english,

        word.portuguese,

        ...(word.alternatives || [])

    ].map(normalizeText);


    if (validAnswers.includes(userAnswer)) {

        answered = true;

        totalScore += 10;

        score.textContent = `${totalScore} pts`;

        message.textContent =
            `Correct! 🎉 ${word.english} = ${word.portuguese}`;

        message.className = "correct";

        answer.disabled = true;
        checkBtn.disabled = true;
        hintBtn.disabled = true;
        nextBtn.disabled = false;

        progress.style.width =
            `${((currentQuestion + 1) / gameWords.length) * 100}%`;

    } else {

        message.textContent = "Incorrect! Try again.";

        message.className = "incorrect";

        answer.focus();
        answer.select();
    }
}


// NEXT QUESTION

function nextQuestion() {

    if (!answered || gameFinished) return;

    currentQuestion++;

    if (currentQuestion >= gameWords.length) {

        finishGame();

    } else {

        loadQuestion();
    }
}


// FINISH GAME

function finishGame() {

    gameFinished = true;

    category.textContent = "Game Completed";

    question.textContent =
        `${gameWords.length} / ${gameWords.length}`;

    clues.innerHTML = `
        <h2>🏆 Congratulations!</h2>
        <p>You completed the Guessing Game!</p>
        <p>Final Score: ${totalScore} points</p>
        <p>Great job! Keep learning English.</p>
    `;

    message.textContent = "You did it!";

    message.className = "correct";

    progress.style.width = "100%";

    answer.value = "";
    answer.disabled = true;

    checkBtn.disabled = true;
    hintBtn.disabled = true;
    nextBtn.disabled = true;

    restartBtn.textContent = "↻ Play Again";
}


// BUTTON EVENTS

checkBtn.addEventListener("click", checkAnswer);

hintBtn.addEventListener("click", moreHints);

nextBtn.addEventListener("click", nextQuestion);

restartBtn.addEventListener("click", function () {

    restartBtn.textContent = "↻ Restart Game";

    startGame();
});


// ENTER KEY

answer.addEventListener("keydown", function (event) {

    if (event.key === "Enter") {

        checkAnswer();
    }
});


// INITIALIZE GAME

startGame();
