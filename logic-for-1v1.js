// ======================
// Shared state
// ======================
const role = window.PLAYER_ROLE || "p1"; // "p1" or "p2"

const moves = JSON.parse(localStorage.getItem("moves")) || {
  player1: "None",
  player2: "None",
};
localStorage.setItem("moves", JSON.stringify(moves));

// score is per page in this version (like your original)
// (If you want shared score between pages, tell me and I'll store it in localStorage too.)
const player1Score = { Wins: 0};
const player2Score = { Wins: 0};

// prevents double scoring when get called multiple times (poll + storage)
const roundState = JSON.parse(localStorage.getItem("roundState")) || {
  resolved: false,
};
localStorage.setItem("roundState", JSON.stringify(roundState));

function setResolved(val) {
  roundState.resolved = val;
  localStorage.setItem("roundState", JSON.stringify(roundState));
}

let waitIntervalId = null;

// ======================
// Utilities
// ======================
function getLatestMoves() {
  const latest = JSON.parse(localStorage.getItem("moves")) || {
    player1: "None",
    player2: "None",
  };
  moves.player1 = latest.player1;
  moves.player2 = latest.player2;
}

function bothSelected() {
  return moves.player1 !== "None" && moves.player2 !== "None";
}

// ======================
// PURE result (NO scoring here)
// ======================
function decideWinner(p1, p2) {
  if (p1 === "None") return { done: false, msg: "Player 1 hasn't selected a move yet!" };
  if (p2 === "None") return { done: false, msg: "Player 2 hasn't selected a move yet!" };

  if (p1 === p2) return { done: true, winner: "draw", msg: "It's a Draw" };

  if (p1 === "Rock" && p2 === "Scissors") return { done: true, winner: "p1", msg: "Player 1 Wins! Player 2 Loses!" };
  if (p1 === "Rock" && p2 === "Paper")    return { done: true, winner: "p2", msg: "Player 1 Loses! Player 2 Wins!" };

  if (p1 === "Paper" && p2 === "Rock")    return { done: true, winner: "p1", msg: "Player 1 Wins! Player 2 Loses!" };
  if (p1 === "Paper" && p2 === "Scissors")return { done: true, winner: "p2", msg: "Player 1 Loses! Player 2 Wins!" };

  if (p1 === "Scissors" && p2 === "Paper")return { done: true, winner: "p1", msg: "Player 1 Wins! Player 2 Loses!" };
  if (p1 === "Scissors" && p2 === "Rock") return { done: true, winner: "p2", msg: "Player 1 Loses! Player 2 Wins!" };

  return { done: true, winner: "draw", msg: "Error: invalid moves" };
}

// ======================
// Score only ONCE
// ======================
function finalizeRoundOnce() {
  getLatestMoves();

  const result = decideWinner(moves.player1, moves.player2);

  // not done yet -> just show message
  if (!result.done) {
    render(result.msg);
    return;
  }

  // done -> update score only once
  if (!roundState.resolved) {
    if (result.winner === "p1") {
      player1Score.Wins++;
      player2Score.Loses++;
    } else if (result.winner === "p2") {
      player1Score.Loses++;
      player2Score.Wins++;
    }
    setResolved(true);
  }

  render(result.msg);
}

// ======================
// UI rules (hide opponent until both picked)
// ======================
function render(message = "") {
  let showP1 = "None";
  let showP2 = "None";

  if (!message) message = "Pick your move.";

  if (!bothSelected()) {
    // Not both selected -> hide opponent
    if (role === "p1") {
      // Player1 sees own move, opponent loading
      showP1 = moves.player1;
      showP2 = "None";

      if (moves.player1 !== "None" && moves.player2 === "None") message = "Waiting for Player 2...";
      if (moves.player1 === "None" && moves.player2 === "None") message = "Both players are loading...";
      if (moves.player1 === "None" && moves.player2 !== "None") message = "Player 2 is ready. Pick your move!";
    } else {
      // Player2 before picking -> both loading
      if (moves.player2 === "None") {
        showP1 = "None";
        showP2 = "None";
        message = "Both players are loading...";
      } else {
        // Player2 after picking -> show own move only, opponent hidden
        showP1 = "None";
        showP2 = moves.player2;

        if (moves.player1 === "None") message = "Waiting for Player 1...";
      }
    }
  } else {
    // Both selected -> reveal both
    showP1 = moves.player1;
    showP2 = moves.player2;
  }

  document.querySelector(".js-score-player1").innerHTML =
    `Wins🏆: ${player1Score.Wins}`;

  document.querySelector(".js-score-player2").innerHTML =
    `Wins🏆: ${player2Score.Wins}`;

  document.querySelector(".js-user-moves").innerHTML =
    `Player 1:<br> ${getImage(showP1)} </br>`;

  document.querySelector(".js-computer-moves").innerHTML =
    `Player 2:<br> ${getImage(showP2)} </br>`;

  document.getElementById("js-result").innerHTML = message;
}

// ======================
// Waiting / polling
// ======================
function waitForBothMoves() {
  clearInterval(waitIntervalId);

  waitIntervalId = setInterval(() => {
    getLatestMoves();
    render(); // keep UI updated while waiting

    if (bothSelected()) {
      clearInterval(waitIntervalId);
      finalizeRoundOnce();
    }
  }, 250);
}

// ======================
// Moves (these are called from your HTML buttons)
// ======================
function makeMovep1(move) {
  getLatestMoves();
  moves.player1 = move;
  localStorage.setItem("moves", JSON.stringify(moves));

  render("Waiting for Player 2...");
  waitForBothMoves();
}

function makeMovep2(move) {
  getLatestMoves();
  moves.player2 = move;
  localStorage.setItem("moves", JSON.stringify(moves));

  render(); // role rules will show correct waiting view
  waitForBothMoves();
}

// ======================
// Storage event (instant update on other page)
// ======================
window.addEventListener("storage", (e) => {
  if (e.key === "moves" && e.newValue) {
    getLatestMoves();
    render();
    if (bothSelected()) finalizeRoundOnce();
  }
});

// ======================
// Reset
// ======================
function reset() {
  moves.player1 = "None";
  moves.player2 = "None";
  localStorage.setItem("moves", JSON.stringify(moves));

  setResolved(false); // allow scoring next round
  render("Game reset. Pick your move.");
}

// ======================
// Images
// ======================
function getImage(result) {
  if (result === "Rock") return `<img src="images/rock.png" class="move-emoji">`;
  if (result === "Paper") return `<img src="images/paper.png" class="move-emoji">`;
  if (result === "Scissors") return `<img src="images/scissors.png" class="move-emoji">`;

  return `<dotlottie-wc
    src="https://lottie.host/6e1e1f9a-bb76-49fc-b1b9-4846b5595241/7zTRqdzpYC.lottie"
    style="width: 100px;height: 100px"
    autoplay
    loop
  ></dotlottie-wc>`;
}

// ======================
// Link (player1 only)
// ======================
function showLink() {
  const el = document.getElementById("linkBox");
  if (!el) return;
  el.value = "https://just-learningg.github.io/Simple-Rock-Paper-Scissors-game/player2.html";
}

// ======================
// On load
// ======================
window.addEventListener("load", () => {
  getLatestMoves();
  render();
  if (role === "p1") showLink();
});

