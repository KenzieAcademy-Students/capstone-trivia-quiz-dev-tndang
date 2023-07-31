// To run this assignment, right click on index.html in the Visual Studio Code file explorer to the left
// and select "Open with Live Server"

// YOUR CODE HERE!

// Declared Global Variables
let startButton = document.getElementById("startButton");

let currentQuestionAnswer;
let currentQuestionIndex;
let currentCategoryID;

let categoryIDArray = [];
let categoryNameArray = [];
let usedQuestionsArray = [];

let haveQuestionsRemaining = 0;
let userScore = 0;

// Active at Load Start
startButton.addEventListener("click", startGame);
randomAPIQuestionReference();
setTimeout(loadingScreenOff, 5000);

async function randomAPIQuestionReference() { // Retrieve random question's whose clue is valid from the jService Kenzie API
    let response;
    for (let limit = 1; limit <= 10; limit++) {
        response = await fetch (`https://jservice.kenzie.academy/api/random-clue?valid=true`)
            .then(randomQuestionResponse => randomQuestionResponse.json())
            .then(exportCategoryData => assignCategoriesToArray(exportCategoryData));
    }
    return response;
}

function retrieveAPIQuestion() { // Retrieve up to 100 Questions from jService Kenzie API limited to the Category ID returned from the randomAPIQuestion function
    const response = fetch(`https://jservice.kenzie.academy/api/clues?category=${currentCategoryID}`)
        .then(setCategoryResponse => setCategoryResponse.json())
        .then(randomQuestionData => determineQuestionData(randomQuestionData));
    return response;
}

function startGame() { // Starts the game
    renderCategorySelection();
    renderGameArea();
    let welcomeScreen = document.getElementById("gameWelcome");
    let categorySelection = document.getElementById("categorySelection");
    let checkAnswerButton = document.getElementById("submitAnswer");
    checkAnswerButton.addEventListener("click", determineAnswersCorrect);
    welcomeScreen.style.display = "none";
    categorySelection.style.display = "block"
}

function nextQuestion() { // Proceeds to the next question in the category
    let congratsScreen = document.getElementById("congratsMessage");
    let answerField = document.getElementById("userAnswer");
    congratsScreen.style.display = "none";
    answerField.value = "";
    if (haveQuestionsRemaining == 0) {
        updateCategoryScreen();
        randomAPIQuestionReference();
    } else {
        retrieveAPIQuestion();
    }
}

function restartGame() { // Refreshes the page to restart the game
    location.reload();
}

function assignCategoriesToArray(dataSet) { // From the randomAPI Questions whose clues are valid, assign IDs to an Array
    categoryIDArray.push(dataSet.categoryId);
    determineCategoryName(dataSet.categoryId);
    return dataSet;
}

function assignNameToArray(dataSet) { // From the randomAPI Questions whose clues are valid, assign Titles to an Array
    categoryNameArray.push(dataSet.title)
    return dataSet;
}

function determineCategoryName(categoryID) { // Determines the Title of a Category given a Category ID
    fetch(`https://jservice.kenzie.academy/api/categories/${categoryID}`)
        .then(response => response.json())
        .then(categoryData => assignNameToArray(categoryData));
}

function determineQuestionData(questionData) { // Determines the question and answer data to be displayed
    let currentIndex = determineUsedQuestions(questionData);
    updateClueField(questionData, currentIndex);
    currentQuestionAnswer = questionData.clues[currentIndex].answer;
    if (questionData.clues.length === 1) {
        haveQuestionsRemaining = 0;
    }
    devConsoleLogTool(questionData.clues[currentIndex]);
    return questionData;
}

function determineUsedQuestions(questionData) { // This function determines used questions via a global array managed throughout the game
    let newData = questionData.clues;
    let randomIndex;
    if (usedQuestionsArray.length > 0) {
        for (let index = 0; index < usedQuestionsArray.length; index++) {
            newData.splice(usedQuestionsArray[index], 1)
        }
        randomIndex = Math.floor(Math.random(0) * newData.length)
    } else if (usedQuestionsArray.length === 1) {
        randomIndex = 0;
    } else {
        randomIndex = Math.floor(Math.random(0) * newData.length)
    }
    usedQuestionsArray.push(randomIndex);
    return randomIndex;
}

function determineAnswersCorrect() { // Compare user answer to correct answer --- LC = Lower Case ---
    let userAnswer = document.getElementById("userAnswer").value.replace(/[^A-Z0-9]/ig, "");
    let finalUserAnswerLC = userAnswer.toLowerCase();
    let correctAnswer = currentQuestionAnswer.replace(/[^A-Z0-9]/ig, "")
    let correctAnswerLC = correctAnswer.toLowerCase();
    displayResultMessages(finalUserAnswerLC, correctAnswerLC);
}

function displayResultMessages(userAnswer, correctAnswer) { // Display Congrats or Correct answer depending on answer
    let congratsScreen = document.getElementById("congratsMessage");
    let gameOverScreen = document.getElementById("gameOverMessage");
    let nextButton = document.getElementById("nextButton");
    let restartButton = document.getElementById("restartButton");
    let correctAnswerDisplay = document.getElementById("correctAnswer");
    let endScoreDisplay = document.getElementById("endScore");
    if (userAnswer === correctAnswer) {
        userScore++;
        updatePointsRender();
        congratsScreen.style.display = "block";
        nextButton.addEventListener("click", nextQuestion);
    } else {
        gameOverScreen.style.display = "block";
        correctAnswerDisplay.innerText = `The Correct Answer was: \n${currentQuestionAnswer.toUpperCase()}`
        endScoreDisplay.innerText = `FINAL SCORE: ${userScore}`;
        restartButton.addEventListener("click", restartGame)
    }
}

function loadingScreenOff() { // This function removes the loading screen
    let loadingScreen = document.getElementById("loadingScreen");
    loadingScreen.remove();
}

function renderCategorySelection() { // Renders Category Buttons to the Catergory Selection Screen after Random Categories have been determined
    for (let amount = 0; amount < categoryIDArray.length; amount++) {
        let categoryButton = document.createElement("button");
        let buttonLocation = document.getElementById("categoryContent");
        buttonLocation.append(categoryButton)
        categoryButton.id = `category${amount}`;
        categoryButton.className = "categoryButton";
        categoryButton.innerText = `${categoryNameArray[amount]}`;
        categoryButton.value = categoryIDArray[amount];
        categoryButton.onclick = setCategoryID;
        }
}

function renderGameArea() {// Display the Questions the question game area with the current question/clue and an Answer Field
    let gameArea = document.getElementById("gameContent");
    let categoryTitle = document.createElement("h3");
    let clueField = document.createElement("h5");
    let answerField = document.createElement("input");
    let submitAnswer = document.createElement("button");
    let scoreDisplay = document.createElement("h3");
    gameArea.append(categoryTitle);
    categoryTitle.id = "currentCategory";
    categoryTitle.innerText = ""
    gameArea.append(clueField);
    clueField.id = "clue";
    clueField.innerText = "";
    gameArea.append(answerField);
    answerField.type = "text";
    answerField.id = "userAnswer";
    gameArea.append(submitAnswer);
    submitAnswer.id = "submitAnswer";
    submitAnswer.innerText = "Check Answer";
    gameArea.append(scoreDisplay);
    scoreDisplay.id = "gameFooterScore";
    scoreDisplay.innerText = `SCORE: ${userScore}`;
}

function setCategoryID() { // Sets the game's current category and starts the game in the selected category
    let categoryScreen = document.getElementById("categorySelection");
    let gameArea = document.getElementById("gameArea");
    currentCategoryID = this.value;
    retrieveAPIQuestion();
    categoryScreen.style.display = "none";
    gameArea.style.display = "block";
    haveQuestionsRemaining = 1;
}

function updateCategoryScreen() { // This function will update the Category Selection Screen when the user answers all the questions in a category
    let gameArea = document.getElementById("gameArea");
    let categoryScreen = document.getElementById("categorySelection");
    let selectCategoryText = document.getElementById("selectCategoryText");
    gameArea.style.display = "none";
    categoryScreen.style.display = "block";
    selectCategoryText.innerText = "SELECT ANOTHER CATEGORY";
    categoryIDArray = [];
    usedQuestionsArray = [];
}

function updateClueField(questionData, questionIndex) { // Update Question/Clue HTML element on the page
    let clueField = document.getElementById("clue");
    let categoryTitle = document.getElementById("currentCategory");
    clueField.innerText = `${questionData.clues[questionIndex].question.toUpperCase()}`;
    categoryTitle.innerText = `CATEGORY - ${questionData.clues[questionIndex].category.title}`;
}

function updatePointsRender() { // This funtion will update the point render in the game
    let scoreGameScreen = document.getElementById("gameFooterScore");
    scoreGameScreen.innerText = `SCORE: ${userScore}`;
    console.log(`Score: ${userScore}`)
}

// ---------------------------------------------------------------------------------------

function devConsoleLogTool(theTest) { // A dev tool function to return an object in the console with details of a test
    let developerView = {
        devCheatSheet: {        
            theCategoryID: theTest.categoryId,
            theCategoryTitle: theTest.category.title,
            theCurrentClue: theTest.question,
            theCurrentAnswer: theTest.answer,
            theCurrentScore: userScore,
        }
    }
    console.log(developerView);
}
