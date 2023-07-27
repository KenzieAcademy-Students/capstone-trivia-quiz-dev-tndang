// To run this assignment, right click on index.html in the Visual Studio Code file explorer to the left
// and select "Open with Live Server"

// YOUR CODE HERE!

async function randomAPIQuestion() { // Retrieve a random question's whose clue is valid from the jService Kenzie API
    fetch (`https://jservice.kenzie.academy/api/random-clue?valid=true`)
        .then(randomQuestionResponse => randomQuestionResponse.json())
        .then(exportCategoryData => retrieveAPIQuestions(exportCategoryData));
}

async function retrieveAPIQuestions(randomCategoryData) { // Retrieve up to 100 Questions from jService Kenzie API limited to a Category ID
    console.log(randomCategoryData);
    let setCategoryId = randomCategoryData;
    fetch(`https://jservice.kenzie.academy/api/clues?category=${setCategoryId.categoryId}`)
        .then(setCategoryResponse => setCategoryResponse.json())
        .then(hundredQuestions => console.log(hundredQuestions));
    return randomCategoryData
}

randomAPIQuestion();

// Display one the Questions with an Answer Field

// Compare user answer to correct answer

// Proceed to next question after answered

// Display Congrats or Correct answer depending on answer
