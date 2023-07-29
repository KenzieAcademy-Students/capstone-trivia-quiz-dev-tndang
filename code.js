// To run this assignment, right click on index.html in the Visual Studio Code file explorer to the left
// and select "Open with Live Server"

// YOUR CODE HERE!

let startButton = document.getElementById("startButton");
startButton.addEventListener("click", startGame);

function startGame() { // Starts the game 
    let welcomeScreen = document.getElementById("gameWelcome");
    let submitAnswer = document.getElementById("submitAnswer");
    let gameScreen = document.getElementById("gameArea");
    welcomeScreen.style.display = "none";
    gameScreen.style.display = "block"
    console.log(`Score: ${userScore}`);
    submitAnswer.addEventListener("click", checkUserAnswer);
}

async function randomAPIQuestion() { // Retrieve a random question's whose clue is valid from the jService Kenzie API
    fetch (`https://jservice.kenzie.academy/api/random-clue?valid=true`)
        .then(randomQuestionResponse => randomQuestionResponse.json())
        .then(exportCategoryData => retrieveAPIQuestions(exportCategoryData));
}

async function retrieveAPIQuestions(randomCategoryData) { // Retrieve up to 100 Questions from jService Kenzie API limited to the Category ID returned from the randomAPIQuestion function
    let setCategoryId = randomCategoryData.categoryId;
    fetch(`https://jservice.kenzie.academy/api/clues?category=${setCategoryId}`)
        .then(setCategoryResponse => setCategoryResponse.json())
        .then(randomQuestionData => renderGameQuestion(randomQuestionData));
    return randomCategoryData;
}

randomAPIQuestion();

let currentQuestionAnswer;
let currentQuestionIndex;
let userScore = 0;

function selectedQuestion(dataSet) { // This function will take in the set of questions returned from the API and select a question to be rendered from that set
    console.log(dataSet);
    let result = dataSet;
    let arrayIndex = Math.floor(Math.random(0) * result.clues.length - 1);
    currentQuestionIndex = arrayIndex;
    currentQuestionAnswer = JSON.stringify(result.clues[arrayIndex].answer);
    return JSON.stringify(result.clues[arrayIndex].question)
}

function checkUserAnswer() { // Compare user answer to correct answer
    let userAnswer = document.getElementById("userAnswer").value.replace(/[^A-Z0-9]/ig, "");
    let finalUserAnswerLC = userAnswer.toLowerCase();
    let correctAnswer = currentQuestionAnswer.replace(/[^A-Z0-9]/ig, "")
    let correctAnswerLC = correctAnswer.toLowerCase();
    displayResultMessages(finalUserAnswerLC, correctAnswerLC);
}

function nextQuestion() {
    let congratsScreen = document.getElementById("congratsMessage");
    congratsScreen.style.display = "none";
}

function restartGame() {
    location.reload();
}

function renderGameQuestion(questionData) {// Display one of the Questions from the random category with an Answer Field
    let question = selectedQuestion(questionData);
    let gameArea = document.getElementById("gameContent");
    let answerField = document.createElement("input");
    let submitAnswer = document.createElement("button");
    gameArea.append(question);
    gameArea.append(answerField);
    answerField.type = "text";
    answerField.id = "userAnswer";
    gameArea.append(submitAnswer);
    submitAnswer.id = "submitAnswer";
    submitAnswer.innerText = "Check Answer";
    return questionData;
}

// Proceed to next question after answered

function displayResultMessages(userAnswer, correctAnswer) { // Display Congrats or Correct answer depending on answer
    let congratsScreen = document.getElementById("congratsMessage");
    let gameOverScreen = document.getElementById("gameOverMessage");
    let nextButton = document.getElementById("nextButton");
    let restartButton = document.getElementById("restartButton");
    if (userAnswer === correctAnswer) {
        userScore++;
        congratsScreen.style.display = "block";
        nextButton.addEventListener("click", nextQuestion);
        console.log(`Score: ${userScore}`)
    } else {
        gameOverScreen.style.display = "block";
        console.log(`You Answered: ${userAnswer}\nThe Correct Answer is: ${correctAnswer}`);   
        restartButton.addEventListener("click", restartGame)

    }
}
