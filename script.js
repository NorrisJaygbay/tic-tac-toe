let boxes = document.querySelectorAll(".box");
let main_grid = document.querySelector('.main-grid');
let turn = "X";
let isGameOver = false;
let gameMode = "human"; // Default game mode set to Human vs. Human
let selection = document.querySelector('.selection');
let score_Board = document.querySelector('.score-Board');
let game_Draw = document.querySelector('.game-Draw');
let welcome_Page = document.querySelector('.for-Welcome-page');
let display_Welcome_Pagebutton = document.querySelector('.welcome-Play-button');
let Win_Page = document.querySelector('.for-Win-page');
let change_Gamemode = document.querySelector('.change-Game-mode');

let audio1 = new Audio('popup1.mp3');
let audio2 = new Audio('popup2.mp3');
let audio3 = new Audio('clapping1.mp3');
let audio4 = new Audio('gamedraw.mp3');

let humanXWins = 0;
let humanOWins = 0;
let humanWins = 0;
let aiWins = 0;
let human_vs_human_gameDraw = 0;
let human_vs_computer_gameDraw = 0;

display_Welcome_Pagebutton.addEventListener('click', () => {
    welcome_Page.classList.toggle('for-Welcome-page-toggle');
})

document.getElementById('gameMode').addEventListener('change', (e) => {
    gameMode = e.target.value; 
    updateGameMode();
    playAgain();
});
change_Gamemode.addEventListener('click', ()=>{
    welcome_Page.classList.toggle('for-Welcome-page-toggle');
})

function updateGameMode() {
    if(gameMode === "hard"){
        selection.innerHTML=`Player 1 <span class="span_VS">VS</span> Computer`;
        score_Board.innerHTML = `<p><span>Player 1: </span><span class="span_VS" id="humanWins">${humanWins}</span> || <span>Computer: </span><span class="span_VS" id="aiWins">${aiWins}</span></p>`;
        game_Draw.innerHTML = `Draw Game: <span class="span_VS">${human_vs_computer_gameDraw}</span>`;
    } else if(gameMode === "human"){
        selection.innerHTML=`Player 1 <span class="span_VS">VS</span> Player 2`;
        score_Board.innerHTML = `<p><span>Player 1: </span><span class="span_VS" id="humanXWins">${humanXWins}</span> || <span>Player 2: </span><span class="span_VS" id="humanOWins">${humanOWins}</span></p>`;
        game_Draw.innerHTML = `Draw Game: <span class="span_VS">${human_vs_human_gameDraw}</span>`;
    }
}

boxes.forEach(e => {
    e.innerHTML = "";
    e.addEventListener("click", () => {
        if (!isGameOver && e.innerHTML === "") {
            e.innerHTML = turn;
            checkWin();
            checkDraw();
            changeTurn();
            if ((gameMode === "hard") && turn === "O" && !isGameOver) {
                setTimeout(() => aiMove(gameMode), 500);
            }
        }
    });
});

function changeTurn() {
    if (turn === "X") {
        turn = "O";
        audio1.play();
        document.querySelector(".bg").style.left = "85px";
    } else {
        turn = "X";
        audio2.play();
        document.querySelector(".bg").style.left = "0";
    }
}

function checkWin() {
    let winConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ]
    for (let i = 0; i < winConditions.length; i++) {
        let v0 = boxes[winConditions[i][0]].innerHTML;
        let v1 = boxes[winConditions[i][1]].innerHTML;
        let v2 = boxes[winConditions[i][2]].innerHTML;

        if (v0 != "" && v0 === v1 && v0 === v2) {
            isGameOver = true;
            main_grid.classList.add('main-gridone');
            let winner = (turn === "X") ? "Player 1" : "Player 2";
            if (gameMode === "hard") {
                winner = (turn === "X") ? "Human" : "Computer";
                if (winner === "Human") {
                    humanWins++;
                    document.getElementById('humanWins').innerText = humanWins;
                    Win_Page.classList.add('win-page');
                    audio3.play();
                } else {
                    aiWins++;
                    document.getElementById('aiWins').innerText = aiWins;
                    Win_Page.classList.add('win-page');
                    audio3.play();
                }
            } else {
                if (turn === "X") {
                    humanXWins++;
                    document.getElementById('humanXWins').innerText = humanXWins;
                    Win_Page.classList.add('win-page');
                    audio3.play();
                } else {
                    humanOWins++;
                    document.getElementById('humanOWins').innerText = humanOWins;
                    Win_Page.classList.add('win-page');
                    audio3.play();
                }
            }
            document.querySelector("#results1").innerHTML = `CONGRATULATIONS!!!`;
            document.querySelector("#results").innerHTML = `${winner} wins`;
            // Win_Page.classList.toggle('win-page');
            for (let j = 0; j < 3; j++) {
                boxes[winConditions[i][j]].style.backgroundColor = "#FF6969";
                boxes[winConditions[i][j]].style.color = "#000";
            }
            return;
        }
    }
}

function checkDraw() {
    if (!isGameOver) {
        let isDraw = true;
        boxes.forEach(e => {
            if (e.innerHTML === "") isDraw = false;
        });
        if (isDraw) {
            isGameOver = true;
            if (gameMode === "hard") {
                human_vs_computer_gameDraw++;
                game_Draw.innerHTML = `Draw Game: <span class="span_VS">${human_vs_computer_gameDraw}</span>`;
                // Win_Page.classList.add('win-page');
            } else {
                human_vs_human_gameDraw++;
                game_Draw.innerHTML = `Draw Game: <span class="span_VS">${human_vs_human_gameDraw}</span>`;
                // Win_Page.classList.add('win-page');
            }
            main_grid.classList.add('main-gridone');

            Win_Page.classList.add('win-page');
            document.querySelector("#results1").innerHTML = "";
            document.querySelector("#results").innerHTML = "Game Draw!!!";
            // document.querySelector("#play-again").style.display = "inline";
            audio4.play();
        }
    }
}

function aiMove(mode) {
    let availableBoxes = [...boxes].filter(box => box.innerHTML === "");
    let chosenBox;
    if (mode === "hard") {
        // Hard mode: optimal move using minimax algorithm
        let bestScore = -Infinity;
        availableBoxes.forEach(box => {
            box.innerHTML = turn;
            let score = minimax(boxes, 0, false);
            box.innerHTML = "";
            if (score > bestScore) {
                bestScore = score;
                chosenBox = box;
            }
        });
    }
    
    chosenBox.innerHTML = turn;
    checkWin();
    checkDraw();
    changeTurn();
}

const scores = {
    X: -1,
    O: 1,
    tie: 0
};

function minimax(board, depth, isMaximizing) {
    let result = checkWinner(board);
    if (result !== null) {
        return scores[result];
    }

    if (isMaximizing) {
        let bestScore = -Infinity;
        board.forEach(box => {
            if (box.innerHTML === "") {
                box.innerHTML = "O";
                let score = minimax(board, depth + 1, false);
                box.innerHTML = "";
                bestScore = Math.max(score, bestScore);
            }
        });
        return bestScore;
    } else {
        let bestScore = Infinity;
        board.forEach(box => {
            if (box.innerHTML === "") {
                box.innerHTML = "X";
                let score = minimax(board, depth + 1, true);
                box.innerHTML = "";
                bestScore = Math.min(score, bestScore);
            }
        });
        return bestScore;
    }
}

function checkWinner(board) {
    let winConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];
    for (let i = 0; i < winConditions.length; i++) {
        let [a, b, c] = winConditions[i];
        if (board[a].innerHTML && board[a].innerHTML === board[b].innerHTML && board[a].innerHTML === board[c].innerHTML) {
            return board[a].innerHTML;
        }
    }
    let openSpots = [...board].filter(box => box.innerHTML === "").length;
    if (openSpots === 0) return "tie";
    return null;
}

document.getElementById("play-again").addEventListener("click", playAgain);

function playAgain() {
    isGameOver = false;
    turn = "X";
    document.querySelector(".bg").style.left = "0";
    document.querySelector("#results").innerHTML = "Who will win!!";
    Win_Page.classList.remove('win-page');
    // document.querySelector("#play-again").style.display = "none";
    main_grid.classList.remove('main-gridone');
    audio3.pause();
    boxes.forEach(e => {
        e.innerHTML = "";
        e.style.backgroundColor = "";
        e.style.color = "";
    });
}

// Set the default game mode to Human vs. Human
document.getElementById('gameMode').value = "human";

// Initialize the game mode display and score board
updateGameMode();


