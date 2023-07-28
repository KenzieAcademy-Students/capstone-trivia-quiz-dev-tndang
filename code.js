// To run this assignment, right click on index.html in the Visual Studio Code file explorer to the left
// and select "Open with Live Server"

// YOUR CODE HERE!

let startButton = document.getElementById("startButton");
startButton.addEventListener("click", startGame);

async function randomAPIQuestion() { // Retrieve a random question's whose clue is valid from the jService Kenzie API
    fetch (`https://jservice.kenzie.academy/api/random-clue?valid=true`)
        .then(randomQuestionResponse => randomQuestionResponse.json())
        .then(exportCategoryData => retrieveAPIQuestions(exportCategoryData));
}

async function retrieveAPIQuestions(randomCategoryData) { // Retrieve up to 100 Questions from jService Kenzie API limited to a Category ID
    let setCategoryId = randomCategoryData.categoryId;
    fetch(`https://jservice.kenzie.academy/api/clues?category=${setCategoryId}`)
        .then(setCategoryResponse => setCategoryResponse.json())
        .then(randomQuestionData => renderGameQuestion(randomQuestionData));
    return randomCategoryData;
}

randomAPIQuestion();

function startGame() { // Starts the game
    startButton.remove();
}



function renderGameQuestion(questionData) {// Display one of the Questions from the random category with an Answer Field
    let question = selectedQuestion(questionData);
    document.write(question);
    return questionData;
}

function selectedQuestion(dataSet) { // This function will take in the set of questions returned from the API and select a question to be rendered from that set
    console.log(dataSet);
    let result = dataSet;
    let arrayIndex = Math.floor(Math.random(0) * result.clues.length - 1);
    return JSON.stringify(result.clues[arrayIndex].question)
}

// Compare user answer to correct answer

// Proceed to next question after answered

// Display Congrats or Correct answer depending on answer
