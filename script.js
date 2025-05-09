const board = document.getElementById("board");
    const msg = document.getElementById("msg");
    const restart = document.getElementById("restart");
    let gameBoard = ["", "", "", "", "", "", "", "", ""];
    let human = "X";
    let ai = "O";
    let gameOver = false;

    function renderBoard() {
      board.innerHTML = "";
      gameBoard.forEach((val, index) => {
        const btn = document.createElement("button");
        btn.classList.add("box");
        btn.innerText = val;
        btn.disabled = val !== "" || gameOver;

        // 🔁 Background color logic
        if (val === "X") {
          btn.style.backgroundColor = "#90ee90"; // light green
        } else if (val === "O") {
          btn.style.backgroundColor = "#ffb6c1"; // light pink
        } else {
          btn.style.backgroundColor = "#b943fd"; // default purple
        }

        btn.addEventListener("click", () => playerMove(index));
        board.appendChild(btn);
      });
    }

    function playerMove(index) {
      if (gameBoard[index] === "" && !gameOver) {
        gameBoard[index] = human;
        renderBoard();
        if (checkWinner(gameBoard, human)) {
          endGame("You win! (Strange 😅)");
        } else if (isDraw(gameBoard)) {
          endGame("It's a draw!");
        } else {
          setTimeout(() => {
            const bestMove = minimax(gameBoard, ai).index;
            gameBoard[bestMove] = ai;
            renderBoard();
            if (checkWinner(gameBoard, ai)) {
              endGame("Computer wins!");
            } else if (isDraw(gameBoard)) {
              endGame("It's a draw!");
            }
          }, 300);
        }
      }
    }

    function checkWinner(board, player) {
      const winPatterns = [
        [0,1,2], [3,4,5], [6,7,8],
        [0,3,6], [1,4,7], [2,5,8],
        [0,4,8], [2,4,6]
      ];
      return winPatterns.some(pattern =>
        pattern.every(i => board[i] === player)
      );
    }

    function isDraw(board) {
      return board.every(cell => cell !== "");
    }

    function minimax(newBoard, player) {
      const availSpots = newBoard.map((val, idx) => val === "" ? idx : null).filter(v => v !== null);

      if (checkWinner(newBoard, human)) return { score: -10 };
      if (checkWinner(newBoard, ai)) return { score: 10 };
      if (availSpots.length === 0) return { score: 0 };

      const moves = [];

      for (let i = 0; i < availSpots.length; i++) {
        const move = {};
        move.index = availSpots[i];
        newBoard[availSpots[i]] = player;

        if (player === ai) {
          move.score = minimax(newBoard, human).score;
        } else {
          move.score = minimax(newBoard, ai).score;
        }

        newBoard[availSpots[i]] = "";
        moves.push(move);
      }

      let bestMove;
      if (player === ai) {
        let bestScore = -Infinity;
        moves.forEach((move, i) => {
          if (move.score > bestScore) {
            bestScore = move.score;
            bestMove = i;
          }
        });
      } else {
        let bestScore = Infinity;
        moves.forEach((move, i) => {
          if (move.score < bestScore) {
            bestScore = move.score;
            bestMove = i;
          }
        });
      }

      return moves[bestMove];
    }

    function endGame(result) {
      msg.innerText = result;
      gameOver = true;
      renderBoard();
    }

    restart.addEventListener("click", () => {
      gameBoard = ["", "", "", "", "", "", "", "", ""];
      gameOver = false;
      msg.innerText = "Your turn (You = X)";
      renderBoard();
    });

    renderBoard();