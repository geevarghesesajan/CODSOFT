const board = document.getElementById("board");
const status = document.getElementById("status");
const restartBtn = document.getElementById("restart");
const difficultySelect = document.getElementById("difficulty");

let cells = [];
let currentPlayer = "X";
let isGameOver = false;

function createBoard() {
  board.innerHTML = "";
  cells = [];

  for (let i = 0; i < 9; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.dataset.index = i;
    cell.addEventListener("click", handleClick);
    board.appendChild(cell);
    cells.push(cell);
  }

  currentPlayer = "X";
  isGameOver = false;
  status.textContent = "Your turn!";
}

function handleClick(e) {
  const cell = e.target;
  const index = parseInt(cell.dataset.index);

  if (cell.textContent || isGameOver) return;

  cell.textContent = currentPlayer;
  if (checkWin(currentPlayer)) {
    status.textContent = `${currentPlayer} wins!`;
    isGameOver = true;
    return;
  }

  if (isBoardFull()) {
    status.textContent = "It's a draw!";
    isGameOver = true;
    return;
  }

  currentPlayer = "O";
  status.textContent = "AI's turn...";
  setTimeout(() => {
    aiMove();
  }, 400);
}

function aiMove() {
  let move;
  const difficulty = difficultySelect.value;

  if (difficulty === "easy") {
    move = getRandomMove();
  } else if (difficulty === "medium") {
    move = minimax(getBoardState(), "O", 2).index; // depth limited
  } else {
    move = minimax(getBoardState(), "O").index;
  }

  if (move !== undefined) {
    cells[move].textContent = currentPlayer;
    if (checkWin(currentPlayer)) {
      status.textContent = `${currentPlayer} wins!`;
      isGameOver = true;
      return;
    }

    if (isBoardFull()) {
      status.textContent = "It's a draw!";
      isGameOver = true;
      return;
    }

    currentPlayer = "X";
    status.textContent = "Your turn!";
  }
}

function getBoardState() {
  return cells.map(cell => cell.textContent || "");
}

function getRandomMove() {
  const emptyCells = cells
    .map((cell, i) => (!cell.textContent ? i : null))
    .filter(i => i !== null);
  return emptyCells[Math.floor(Math.random() * emptyCells.length)];
}

function checkWin(player) {
  const winPatterns = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];

  return winPatterns.some(pattern =>
    pattern.every(index => cells[index].textContent === player)
  );
}

function isBoardFull() {
  return cells.every(cell => cell.textContent);
}

function minimax(newBoard, player, depthLimit = Infinity, depth = 0) {
  const availSpots = newBoard
    .map((val, i) => (val === "" ? i : null))
    .filter(i => i !== null);

  if (checkWinner(newBoard, "X")) return { score: -10 + depth };
  if (checkWinner(newBoard, "O")) return { score: 10 - depth };
  if (availSpots.length === 0) return { score: 0 };

  if (depth >= depthLimit) return { score: 0 };

  const moves = [];

  for (let i = 0; i < availSpots.length; i++) {
    const move = {};
    move.index = availSpots[i];
    newBoard[availSpots[i]] = player;

    const result = minimax(
      newBoard,
      player === "O" ? "X" : "O",
      depthLimit,
      depth + 1
    );
    move.score = result.score;

    newBoard[availSpots[i]] = "";
    moves.push(move);
  }

  let bestMove;
  if (player === "O") {
    let bestScore = -Infinity;
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score > bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score < bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  }

  return moves[bestMove];
}

function checkWinner(board, player) {
  const winPatterns = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];
  return winPatterns.some(pattern =>
    pattern.every(i => board[i] === player)
  );
}

restartBtn.addEventListener("click", createBoard);
difficultySelect.addEventListener("change", createBoard);

createBoard();
