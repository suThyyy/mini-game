//Get element
const output = document.getElementById("output");
const refreshButton = document.querySelector(".refresh");
const faultRes = document.querySelector(".fault");
const levelRes = document.querySelector(".level");
const timeRes = document.querySelector(".time");
const board = document.getElementById("motion-demo");

//Data
const level1Data = `
a an ant be by boy cat car cup dog day dry egg ear eat fan far fox go get gun
hat hot him ice ink its job jam joy key kid leg let low man map mix net new not
one old out pen pet put red run row sun sit sky tea ten top use van war win wet
yes you zip zoo
`;

const level2Data = `
apple after again animal book blue bread bring chair cloud clean child dance dream
drink drive earth eight early email family friend flower fruit green great glass game
house happy heart horse image inside island idea juice jungle jacket jelly knife kitchen
king kind little light learn lunch money music mouse month night north number never
orange ocean other office people phone paper plant queen quick quiet river right radio
ready school small street story table today train teach under uncle until video voice visit
water window world write young yellow zebra
`;

const level3Data = `
application achievement attention beautiful businessman background communication computer
community development developer different education environment experience financial foundation
government generation happiness hospital important information international javascript knowledge
keyboard language learning management marketing necessary networking operation organization
professional programming productivity questionnaire relationship responsibility software something
technology telephone understanding university valuable vocabulary wonderful workplace yesterday
`;

const wordLevels = {
  1: level1Data.trim().split(/\s+/),
  2: level2Data.trim().split(/\s+/),
  3: level3Data.trim().split(/\s+/),
};
//Var
let level = 1;
let totalWords = 60;
let appearFish = 0;
let killedFish = 0;
let fault = 0;
let totalTyped = 0;
let timeLeft = 60;
let speed = 1;
let appearInterval = 1500;
let playing = false;
let targetFish = null;
let spawnTimer = null;
let gameTimer = null;

//randomword
function randomWord() {
  const words = wordLevels[level];
  const fishes = document.querySelectorAll(".fish-group");
  const usedFirstLetters = [];
  fishes.forEach((fish) => {
    usedFirstLetters.push(fish.dataset.word[0].toLowerCase());
  });
  const availableWords = words.filter((word) => {
    return !usedFirstLetters.includes(word[0].toLowerCase());
  });
  if (availableWords.length === 0) {
    return null;
  }
  return availableWords[Math.floor(Math.random() * availableWords.length)];
}

//history
function addHistory(word, correct) {
  const span = document.createElement("span");
  span.textContent = word;
  span.className = correct ? "history-correct" : "history-wrong";
  output.appendChild(span);
  output.scrollTop = output.scrollHeight;
}

//createfish
function createFish() {
  const word = randomWord();
  if (word === null) {
    return false;
  }
  const fish = document.createElement("div");
  fish.className = "fish-group";
  fish.dataset.word = word;
  fish.dataset.index = 0;
  const maxX = Math.max(0, board.clientWidth - 200);
  const maxY = Math.max(0, board.clientHeight - 100);
  fish.dataset.x = Math.random() * maxX;
  fish.dataset.y = Math.random() * maxY;
  fish.dataset.dx = Math.random() < 0.5 ? -1 : 1;
  fish.dataset.dy = Math.random() < 0.5 ? -1 : 1;
  fish.innerHTML = `
    <div class="fish-word"></div>
    <img
      class="fish"
      src="https://1.bp.blogspot.com/-ihoVSTQre20/V1FZc1OGXEI/AAAAAAAAa6Q/bwaNuZy0ctkixPDYvbR3LjaWXe5s7a-5gCK4B/s1600/ikan-mys2010.gif"
      alt=""
    >
  `;
  fish.style.left = fish.dataset.x + "px";
  fish.style.top = fish.dataset.y + "px";
  board.appendChild(fish);
  renderWord(fish);
  return true;
}

//wordonfish
function renderWord(fish) {
  const word = fish.dataset.word;
  const index = Number(fish.dataset.index);
  const fishWord = fish.querySelector(".fish-word");
  const wordMarkup = [...word]
    .map((character, characterIndex) => {
      let className = "pending";
      if (characterIndex < index) {
        className = "correct";
      } else if (characterIndex === index) {
        className = "current";
      }
      return `<span class="${className}">${character}</span>`;
    })
    .join("");
  fishWord.innerHTML = wordMarkup;
}

//spawnfish
function spawnFish() {
  clearInterval(spawnTimer);
  spawnTimer = setInterval(() => {
    if (!playing) return;
    if (appearFish >= totalWords) {
      clearInterval(spawnTimer);
      return;
    }
    const created = createFish();
    if (created) {
      appearFish++;
    }
  }, appearInterval);
}

//movefish
function moveFish() {
  if (playing) {
    const fishes = document.querySelectorAll(".fish-group");
    fishes.forEach((fish) => {
      let x = Number(fish.dataset.x);
      let y = Number(fish.dataset.y);
      let dx = Number(fish.dataset.dx);
      let dy = Number(fish.dataset.dy);
      x += dx * speed;
      y += dy * speed;
      if (x <= 0 || x + fish.offsetWidth >= board.clientWidth) {
        dx = -dx;
      }
      if (y <= 0 || y + fish.offsetHeight >= board.clientHeight) {
        dy = -dy;
      }
      if (x < 0) {
        x = 0;
      }
      if (x + fish.offsetWidth > board.clientWidth) {
        x = board.clientWidth - fish.offsetWidth;
      }
      if (y < 0) {
        y = 0;
      }
      if (y + fish.offsetHeight > board.clientHeight) {
        y = board.clientHeight - fish.offsetHeight;
      }
      fish.dataset.x = x;
      fish.dataset.y = y;
      fish.dataset.dx = dx;
      fish.dataset.dy = dy;
      fish.style.left = x + "px";
      fish.style.top = y + "px";
      const fishImg = fish.querySelector(".fish");
      if (dx > 0) {
        fishImg.style.transform = "scaleX(1)";
      } else {
        fishImg.style.transform = "scaleX(-1)";
      }
    });
  }

  requestAnimationFrame(moveFish);
}

//findfish
function findFish(key) {
  const fishes = document.querySelectorAll(".fish-group");
  for (const fish of fishes) {
    if (fish.dataset.word[0].toLowerCase() === key.toLowerCase()) {
      return fish;
    }
  }

  return null;
}

//type
document.addEventListener("keydown", (event) => {
  if (!playing) return;
  if (event.key.length !== 1) return;
  if (targetFish === null) {
    targetFish = findFish(event.key);
    if (targetFish === null) {
      return;
    }
  }

  const word = targetFish.dataset.word;
  let index = Number(targetFish.dataset.index);
  const expectedCharacter = word[index];
  if (event.key.toLowerCase() === expectedCharacter.toLowerCase()) {
    index++;
    targetFish.dataset.index = index;
    renderWord(targetFish);
    if (index === word.length) {
      addHistory(word, true);
      killedFish++;
      totalTyped++;
      targetFish.remove();
      targetFish = null;
      checkLevel();
    }
  } else {
    addHistory(word, false);
    fault++;
    totalTyped++;
    faultRes.textContent = `Fault: ${fault}`;
    targetFish.remove();
    targetFish = null;
    checkLevel();
  }
});

//timer
function startTimer() {
  clearInterval(gameTimer);
  timeRes.textContent = `Time: ${timeLeft}s`;
  gameTimer = setInterval(() => {
    if (!playing) return;
    timeLeft--;
    timeRes.textContent = `Time: ${timeLeft}s`;
    if (timeLeft <= 0) {
      gameOver();
    }
  }, 1000);
}

//checklevel
function checkLevel() {
  if (totalTyped < totalWords) {
    return;
  }
  const faultRate = fault / totalTyped;
  if (totalTyped === totalWords && faultRate <= 0.1 && timeLeft > 0) {
    nextLevel();
  } else {
    gameOver();
  }
}

//nextlevel
function nextLevel() {
  clearInterval(spawnTimer);
  clearInterval(gameTimer);
  level++;
  if (level > 3) {
    playing = false;
    alert(
      `Bạn đã hoàn thành tất cả level!
Correct: ${killedFish}
Fault: ${fault}`,
    );
    return;
  }
  alert(
    `Qua màn!
Level tiếp theo: ${level}`,
  );
  startLevel();
}

//gameover
function gameOver() {
  if (!playing) return;
  playing = false;
  clearInterval(spawnTimer);
  clearInterval(gameTimer);
  const faultRate = totalTyped === 0 ? 0 : fault / totalTyped;
  alert(
    `GAME OVER
Level: ${level}
Completed: ${totalTyped}/${totalWords}
Correct: ${killedFish}
Fault: ${fault}
Fault rate: ${(faultRate * 100).toFixed(2)}%
Time left: ${timeLeft}s`,
  );
}

//startlevel
function startLevel() {
  board.innerHTML = "";
  appearFish = 0;
  killedFish = 0;
  fault = 0;
  totalTyped = 0;
  targetFish = null;
  timeLeft = 60;
  speed = 1 + (level - 1) * 0.3;
  appearInterval = 900 - (level - 1) * 200;
  if (appearInterval < 500) {
    appearInterval = 500;
  }
  playing = true;
  levelRes.textContent = `Level ${level}`;
  faultRes.textContent = `Fault: 0`;
  timeRes.textContent = `Time: ${timeLeft}s`;
  createFish();
  appearFish++;
  spawnFish();
  startTimer();
}

//resetgame
function resetGame() {
  clearInterval(spawnTimer);
  clearInterval(gameTimer);
  playing = false;
  level = 1;
  output.innerHTML = "";
  board.innerHTML = "";
  startLevel();
}
refreshButton.addEventListener("click", resetGame);
moveFish();
startLevel();
