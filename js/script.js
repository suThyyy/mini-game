//Get element
const output = document.getElementById("output");
const fishOutput = document.getElementById("fish-output");

const refreshButton = document.querySelector(".refresh");
const faultRes = document.querySelector(".fault");

const motionDemo = document.getElementById("motion-demo");
const fishGroup = document.querySelector(".fish-group");
const fishImg = document.querySelector(".fish");

//Data
const dataType = `Reading is a fundamental skill that significantly impacts personal and academic growth. It enhances vocabulary, improves comprehension, and fosters critical thinking. When individuals read regularly, they are exposed to new ideas and perspectives, which broadens their understanding of the world. Additionally, reading stimulates the brain, keeping it active and engaged, which can help prevent cognitive decline. It also provides a means of relaxation and stress reduction, as immersing oneself in a good book can be a soothing escape from daily pressures. Therefore, cultivating a habit of reading not only contributes to intellectual development but also promotes overall well-being. Effective time management is essential for achieving success and maintaining a balanced life. By prioritizing tasks and setting clear goals, individuals can maximize productivity and reduce stress. Time management involves creating schedules, setting deadlines, and avoiding procrastination. It also requires the ability to delegate tasks when necessary and to focus on one task at a time. Proper time management not only helps in completing tasks efficiently but also allows for more free time to relax and pursue personal interests. Developing good time management skills is key to achieving both professional and personal goals.`;
const arrayType = dataType.trim().split(/[,.\s]+/);

//Var
let wordIndex = Math.floor(Math.random() * arrayType.length);
let characterIndex = 0;
let hasError = false;
let fault = 0;

let x = 0;
let y = 100;

let dx = 2;
let dy = 1;

//In game
let level = 1;
let totalFish = 0;
let appearFish = 0;
let killedFish = 0;
let totalTyped = 0;
let timeLeft = 0;
let fishSpeed = 2;
let appearInterval = 1500;
let playing = false;

//wordonfish
function renderWord() {
  const currentWord = arrayType[wordIndex];
  const wordMarkup = [...currentWord]
    .map((character, index) => {
      let className = "pending";
      if (index < characterIndex) {
        className = "correct";
      } else if (index === characterIndex && hasError) {
        className = "wrong";
      } else if (index === characterIndex) {
        className = "current";
      }
      return `<span class="${className}">${character}</span>`;
    })
    .join("");
  //updateword
  fishOutput.innerHTML = wordMarkup;
}

//add history
function addHistory(word, isCorrect) {
  const span = document.createElement("span");
  span.textContent = word;
  if (isCorrect) {
    span.className = "history-correct";
  } else {
    span.className = "history-wrong";
  }
  output.appendChild(span);
  //scroll
  output.scrollTop = output.scrollHeight;
}

function resetGame() {
  wordIndex = Math.floor(Math.random() * arrayType.length);
  characterIndex = 0;
  hasError = false;
  fault = 0;
  output.innerHTML = "";
  faultRes.textContent = `Fault: ${fault}`;
  renderWord();
}

//type
document.addEventListener("keydown", (event) => {
  if (event.key.length !== 1 || arrayType.length === 0) {
    return;
  }
  const currentWord = arrayType[wordIndex];
  const expectedCharacter = currentWord[characterIndex];

  if (event.key.toLowerCase() === expectedCharacter.toLowerCase()) {
    characterIndex++;
    hasError = false;
    if (characterIndex === currentWord.length) {
      addHistory(currentWord, true);
      wordIndex = Math.floor(Math.random() * arrayType.length);
      characterIndex = 0;
    }
  } else {
    addHistory(currentWord, false);
    fault++;
    faultRes.textContent = `Fault: ${fault}`;
    wordIndex = Math.floor(Math.random() * arrayType.length);
    characterIndex = 0;
    hasError = false;
  }
  renderWord();
});

//movefish
function moveFish() {
  x += dx;
  y += dy;
  const containerWidth = motionDemo.clientWidth;
  const containerHeight = motionDemo.clientHeight;
  const fishWidth = fishGroup.offsetWidth;
  const fishHeight = fishGroup.offsetHeight;
  if (x <= 0) {
    x = 0;
    dx = -dx;
    fishImg.style.transform = "scaleX(1)";
  }

  if (x + fishWidth >= containerWidth) {
    x = containerWidth - fishWidth;
    dx = -dx;
    fishImg.style.transform = "scaleX(-1)";
  }
  if (y <= 0) {
    y = 0;
    dy = -dy;
  }
  if (y + fishHeight >= containerHeight) {
    y = containerHeight - fishHeight;
    dy = -dy;
  }
  fishGroup.style.left = x + "px";
  fishGroup.style.top = y + "px";

  requestAnimationFrame(moveFish);
}
moveFish();

refreshButton.addEventListener("click", resetGame);

resetGame();
