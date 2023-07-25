// To run this assignment, right click on index.html in the Visual Studio Code file explorer to the left
// and select "Open with Live Server"

// YOUR CODE HERE!

// Select a category for the questions from the jService Kenzie API


async function retrieveAPIQuestions() { // Retrieve 100 Questions from jService Kenzie API
    let randomCategoryID = fetch (`https://jservice.kenzie.academy/api/random-clue?valid=true`)
        .then(response => response.json())
        .then(data => console.log(data));
    let response = fetch(`https://jservice.kenzie.academy/api/clues?category=${randomCategoryID}`)
        .then(response => response.json())
        .then(data => console.log(data));
}

retrieveAPIQuestions();

// Display one the Questions with an Answer Field

// Compare user answer to correct answer

// Proceed to next question after answered

// Display Congrats or Correct answer depending on answer
