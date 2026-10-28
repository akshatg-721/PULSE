const reels = [
  "De9csE3C7Y-",
  "DfBo_TrxeFX"
];

const reel = document.querySelector("#reel");
const count = document.querySelector("#reel-count");
const previous = document.querySelector("#previous");
const next = document.querySelector("#next");
let currentReel = 0;

function showReel(index) {
  currentReel = index;
  reel.src = `https://www.instagram.com/reel/${reels[currentReel]}/embed`;
  reel.title = `Instagram reel ${currentReel + 1}`;
  count.textContent = `Reel ${currentReel + 1} of ${reels.length}`;
  previous.disabled = currentReel === 0;
  next.disabled = currentReel === reels.length - 1;
}

previous.addEventListener("click", () => showReel(currentReel - 1));
next.addEventListener("click", () => showReel(currentReel + 1));
