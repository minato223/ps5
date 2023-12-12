// Keys
const gamesContainerTranslateXKey = "--games-container-translateX";
const gameTranslateYKey = "--game-translateX";
const gameAnimationSpaceKey = "--game-animation-space";
const selectedGameRatioKey = "--selected-game-ratio";
const selectedScaleKey = "--selected-scale";
const selectedWidthKey = "--selected-width";
const selectedHeightKey = "--selected-height";
// Dom elements
const loader = document.querySelector(".loader");
const gamesContainer = document.querySelector(".games");
const games = document.querySelectorAll(".games .game");
const gamesWrapper = document.querySelector(".games-wrapper");
const time = document.querySelector(".time");
const fadOutContainers = document.querySelectorAll(".fade-out");
const gameNameContainer = document.querySelector(".game-name");
const timePlayedContainer = document.querySelector(".time-played .title");
const progressContainer = document.querySelector(".progress .title");
const navigationContainer = document.querySelector(".navigation .center");
const navigationItemsContainer = navigationContainer.querySelectorAll("span");
const r1 = document.querySelector(".r1");
const l1 = document.querySelector(".l1");
const goRight = document.querySelector(".js-goRight");
const goLeft = document.querySelector(".js-goLeft");
// Constant
const marginX = 20;
const timeout = 200;
const selectedScale = 1.1;
//Variables
let currentNavIndex = Array.from(navigationItemsContainer).findIndex((span) =>
  span.classList.contains("active")
);
let currentIndex = 0;
//Functions
function setupGameAnimation() {
  games.forEach((game, index) => {
    const ratio = game.clientWidth;
    let margin = ratio * index + index * marginX;
    game.style.setProperty(gameTranslateYKey, `${margin}px`);
    setTimeout(() => {
      const multiplier = games.length - 1;
      game.style.setProperty(gameAnimationSpaceKey, `${multiplier}px`);
      game.classList.add("animating");
    }, timeout * 1.5 * index);
  });
  document.body.style.setProperty(selectedGameRatioKey, `${marginX}px`);
  document.body.style.setProperty(selectedScale, 1.1);
  toggleActiveClass();
  let cursorContainer = document.createElement("div");
  cursorContainer.classList.add("active-cursor");
  let currentActiveGame = document.querySelector(".game.selected");
  const cursorWidth = Math.round(
    currentActiveGame.clientWidth * selectedScale + 1
  );
  const cursorHeigth = Math.round(
    currentActiveGame.clientHeight * selectedScale + 2
  );
  document.body.style.setProperty(selectedWidthKey, `${cursorWidth}px`);
  document.body.style.setProperty(selectedHeightKey, `${cursorHeigth}px`);
  gamesWrapper.appendChild(cursorContainer);
  setupTimer();
}
function toggleActiveClass() {
  gamesContainer.querySelector(".game.selected")?.classList.remove("selected");
  games[currentIndex]?.classList.add("selected");
}
function scaleCurrentGame() {
  games[currentIndex]?.classList.remove("displayed");
  for (let index = 0; index < currentIndex; index++) {
    games[index].classList.add("displayed");
  }
}
function updateDomContent() {
  const currentGame = gamesContainer.querySelector(".game.selected");
  let src = currentGame?.querySelector(" img")?.getAttribute("src");
  document.body.style.backgroundImage = `url("${src}")`;
  if (currentIndex >= 0 && currentIndex < games.length) {
    fadOutContainers.forEach((container) => {
      container.classList.add("active");
    });
    let playedTime = `${Math.round(Math.random() * 10)}h ${Math.min(
      Math.round(Math.random() * 100),
      59
    )}min`;
    setTimeout(() => {
      gameNameContainer.innerHTML = currentGame.dataset.name;
      timePlayedContainer.innerHTML = playedTime;
      progressContainer.innerHTML = `${Math.round(Math.random() * 100)}%`;
      fadOutContainers.forEach((container) => {
        container.classList.remove("active");
      });
    }, timeout * 2);
  }
}
function navigate() {
  const ratio = gamesContainer.firstElementChild.clientWidth;
  document.body.style.setProperty(
    gamesContainerTranslateXKey,
    `-${ratio * currentIndex + currentIndex * marginX}px`
  );
  toggleActiveClass();
  scaleCurrentGame();
  updateDomContent();
}
function goNext() {
  if (currentIndex < games.length - 1) {
    currentIndex++;
  }
  navigate();
}
function goPrev() {
  if (currentIndex > 0) {
    currentIndex--;
  }
  navigate();
}
function getCurrentTime() {
  const now = new Date();
  let hours = now.getHours();
  const minutes = now.getMinutes();
  const period = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12;

  return `${hours}:${String(minutes).padStart(2, "0")} ${period}`;
}
function setupTimer() {
  time.innerHTML = getCurrentTime();
}
function navNext() {
  navigationItemsContainer[currentNavIndex].classList.remove("active");
  currentNavIndex = (currentNavIndex + 1) % navigationItemsContainer.length;
  navigationItemsContainer[currentNavIndex].classList.add("active");
}
function navPrev() {
  navigationItemsContainer[currentNavIndex].classList.remove("active");
  currentNavIndex =
    (currentNavIndex - 1 + navigationItemsContainer.length) %
    navigationItemsContainer.length;
  navigationItemsContainer[currentNavIndex].classList.add("active");
}
//Functions Call
window.addEventListener("load", function () {
  loader.classList.add("hidden");
  setTimeout(() => {
    setupGameAnimation();
  }, timeout);
  document.addEventListener("keydown", (event) => {
    const { key } = event;
    if (key === "ArrowLeft") {
      goPrev();
    }
    if (key === "ArrowRight") {
      goNext();
    }
  });

  const timer = setInterval(() => {
    setupTimer();
  }, 60 * 1000);

  window.addEventListener("resize", () => {
    window.location.reload();
  });
  goRight.addEventListener("click", goNext);
  goLeft.addEventListener("click", goPrev);
  r1.addEventListener("click", navNext);
  l1.addEventListener("click", navPrev);
});
