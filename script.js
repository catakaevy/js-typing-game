const RANDOM_SENTENCE_URL_API = "https://api.quotable.io/random";
const typeDisplay = document.getElementById("typeDisplay");
const typeInput = document.getElementById("typeInput");
const timer = document.getElementById("timer");

const typeSound = new Audio("./audio/typing-sound.mp3")
const typeWrongSound = new Audio("./audio/wrong.mp3")
const typeCorrectSound = new Audio("./audio/correct.mp3")


// Judge if inputText is correct or not
typeInput.addEventListener("input", () => {

    // Adding the typing sound
    typeSound.play();
    typeSound.currentTime = 0; // reset the time to sync sounds when you typed

    // Random sentence from API
    const sentenceArray = typeDisplay.querySelectorAll("span");
    // Input sentence from typing input
    const arrayValue = typeInput.value.split("");
    // Compare both sentences

    let correct = true;

    sentenceArray.forEach((characterSpan, index) => {
        if (arrayValue[index] == null) {
            characterSpan.classList.remove("correct");
            characterSpan.classList.remove("incorrect");
            correct = false;
        } else if(characterSpan.innerText == arrayValue[index]) {
            characterSpan.classList.add("correct");
            characterSpan.classList.remove("incorrect");
        } else {
            characterSpan.classList.add("incorrect");
            characterSpan.classList.remove("correct");
            // Set up the wrong sound
            typeWrongSound.play();
            typeWrongSound.currentTime = 0;
        }
    });
    if (correct) {
        // Set up the correct sound
        typeCorrectSound.play();
        typeCorrectSound.currentTime = 0;
        RenderNextSentence();
    }
})

// Get the content from API
function GetRandomSentence() {
    return fetch(RANDOM_SENTENCE_URL_API)
    .then((response) => response.json())
    .then((data) => data.content);
}

// Show it on the screen async after Getting RandomSentence 
async function RenderNextSentence() {
    const sentence = await GetRandomSentence(); // to wait await is req
    typeDisplay.innerText = "";
    
    // divide the sentence by each characters and assign <span>
    let OneText = sentence.split("") // convert to ArrayList
    OneText.forEach((character) => {
        const characterSpan = document.createElement("span");
        characterSpan.innerText = character;
        // add elem in the html Id
        typeDisplay.appendChild(characterSpan);
        // characterSpan.classList.add("correct"); // refer to CSS class "correct"
    });

    // delete the letters in text box
    typeInput.value = "";

    // Adding the limit number for timer
    let originTime = 0;
    if (sentence.length < 30) originTime = 20;
    else if (sentence.length >= 30 && sentence.length <= 120) originTime = 30;
    else if (sentence.length > 120) originTime = 45;
    else originTime = 60;
    startTimer(originTime);
}

let startTime;
function startTimer(originTime){
    const setTimer = originTime;
    timer.innerText = setTimer;
    startTime = new Date();
    // every one second the timer show the limit time on the screen
    setInterval(() => {
        timer.innerText = setTimer - getTimerTime();
        if (timer.innerText <= 0) TimeUp();
    }, 1000);
}

function getTimerTime() {
    return Math.floor((new Date() - startTime) / 1000);
}

function TimeUp() {
    RenderNextSentence();
}

RenderNextSentence();

