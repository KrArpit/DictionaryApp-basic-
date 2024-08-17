const url = "https://api.dictionaryapi.dev/api/v2/entries/en/";
const input = document.querySelector(".input");
const searchButton = document.querySelector(".searchButton");
const displaySection = document.querySelector(".displaySection");
const sound = document.querySelector(".sound");

// When we click search button it will calll function -> searchWord
searchButton.addEventListener("click", searchWord);
// When we press key -> Enter(return) it will call funtion -> searchWord
input.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    input.blur();
    searchWord();
  }
});
// this function fetch api
async function searchWord() {
  try {
    displaySection.innerHTML = "";
    inputWord = input.value;
    if (inputWord.trim().includes(" ")) {
      inputWord = inputWord.split(" ")[0];
    }
    let response = await fetch(`${url}${inputWord}`);
    let newResponse = await response.json();
    // check if response give error, response.ok -> check if status in the range 200-299
    if (!response.ok) {
      throw error;
    }
    // call wordMeaning function to add HTML
    wordMeaning(newResponse);
  } catch (error) {
    // catch if any error is thrown
    displaySection.innerHTML = `<p class="errorSentence">Sorry, we couldn't find definitions for the word you were looking for.</p>`;
  }
}
// this function is used to play audio when we click on sound button
function playSound() {
  sound.play();
}

// accept response of fetch and use that to display elements in window
function wordMeaning(data) {
  data[0].meanings.forEach((e) => {
    displaySection.innerHTML += `<div class="word">
                <h3>${data[0].word}</h3>
                <button onclick='playSound()'><i class="fa-solid fa-volume-high"></i></button>
            </div>
            <div class="wordDetails">
                <p>${e.partOfSpeech}</p>
                <p>${data[0].phonetic || data[0].phonetics[1].text}</p>
                
            </div>
            <div class="wordMeaning">${e.definitions[0].definition}</div>
            <div class="wordExample">${e.definitions[0].example || ""}</div>
        </div>`;
  });

  // Here we take all examples using querySelectorAll, and if there is no example (i.e, "") we add class disable to it so we can remove border and its space
  const wordExample = document.querySelectorAll(".wordExample");
  wordExample.forEach((example) => {
    if (!example.innerHTML) {
      example.classList.add("disable");
    }
  });

  // check is audio is available, is available then check weather it contain https or not , or if not available we add class disable so that we can remove sound button.
  data[0].phonetics.forEach((e) => {
    if (e.audio) {
      document.querySelector(".word button").classList.remove("disable");
      sound.setAttribute("src", e.audio.startsWith("https") ? e.audio : `https:${e.audio}`);
    } else {
      document.querySelector(".word button").classList.add("disable");
    }
  });
};
