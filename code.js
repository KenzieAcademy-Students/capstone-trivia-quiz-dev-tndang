// To run this assignment, right click on index.html in the Visual Studio Code file explorer to the left
// and select "Open with Live Server"

// YOUR CODE HERE!

// Declared Global Variables
let startButton = document.getElementById("startButton");
startButton.addEventListener("click", startGame);

let currentQuestionAnswer;
let currentQuestionIndex;
let currentCategoryID;

let categoryIDArray = [];
let categoryNameArray = [];

let userScore = 0;

randomAPIQuestion();

async function randomAPIQuestion() { // Retrieve random question's whose clue is valid from the jService Kenzie API
    for (let limit = 1; limit <= 10; limit++) {
        await fetch (`https://jservice.kenzie.academy/api/random-clue?valid=true`)
            .then(randomQuestionResponse => randomQuestionResponse.json())
            .then(exportCategoryData => assignCategoriesToArray(exportCategoryData));
    }
}

function startGame() { // Starts the game
    renderCategorySelection();
    let welcomeScreen = document.getElementById("gameWelcome");
    let categorySelection = document.getElementById("categorySelection");
    welcomeScreen.style.display = "none";
    categorySelection.style.display = "block"
    console.log(`Score: ${userScore}`);
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
    console.log(categoryIDArray);
    console.log(categoryNameArray);
}

function setCategoryID() { // Sets the game's current category and starts the game in the selected category
    let categoryScreen = document.getElementById("categorySelection");
    let gameArea = document.getElementById("gameArea");
    currentCategoryID = this.value;
    retrieveAPIQuestions();
    categoryScreen.style.display = "none";
    gameArea.style.display = "block";
    console.log(currentCategoryID);
}

function retrieveAPIQuestions() { // Retrieve up to 100 Questions from jService Kenzie API limited to the Category ID returned from the randomAPIQuestion function
    fetch(`https://jservice.kenzie.academy/api/clues?category=${currentCategoryID}`)
        .then(setCategoryResponse => setCategoryResponse.json())
        .then(randomQuestionData => renderGameQuestion(randomQuestionData));
}

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

function restartGame() { // Refreshes the page to restart the game
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
