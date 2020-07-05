const gameBoard = (function() {
    const board = ["", "", "", "", "", "", "", "", ""];
    return { board }
})();

const game = (function() {
    const _state = {
        players: [],
        currentPlayer: "",
        win: false,
        draw: false,
        end: false,
    }

    const start = () => {
        const p1 = Player("Professor", "X");
        const p2 = Player("Inspector", "O");
        _state.players = [p1, p2];

        if (_state.currentPlayer === "") {
            _state.currentPlayer = p1;
        }

        displayController.render();

        const cells = document.querySelectorAll(".cell");
        cells.forEach((el) => {
            el.addEventListener("click", function(e) {
                const index = e.target.dataset.index;
                if (!gameBoard.board[index] && _state.end === false) {
                    _state.currentPlayer.addMark(index);
                    winChecker(_state.currentPlayer, index);
                    switchPlayer(p1, p2);
                }
            });
        });
    }

    const switchPlayer = (p1, p2) => {
        if (_state.currentPlayer === p1) {
            _state.currentPlayer = p2;
        } else {
            _state.currentPlayer = p1;
        }
    }

    const winChecker = (currentPlayer, nodeIndex) => {
        const steps = [[1,3,4], [1,3], [1,2,3], [1,3], [1,2,3,4], [1,3], [1,2,3], [1,3], [1,3,4]];
        const index = Number(nodeIndex);
        const indexSteps = steps[index];
        const mark = currentPlayer.getMark();

        const win = (condition) => {
            if (condition) {
                _state.win = true;
                currentPlayer.addScore(1);
                end();
                return;
            }
        }

        indexSteps.forEach((step) => {
            // Check if step is 1 or not
            if (step === 1) {
                // Check index to determine which eqution to use
                if (index === 0 || index === 3 || index === 6) {
                    // If equation is right then currentPlayer wins
                    win((gameBoard.board[index + step] === mark) && (gameBoard.board[index + (2 * step)] === mark))                        
                } else if (index === 1 || index === 4 || index === 7) {
                    win((gameBoard.board[index + step] === mark) && (gameBoard.board[index - step] === mark))
                } else if (index === 2 || index === 5 || index === 8) {
                    win((gameBoard.board[index - step] === mark) && (gameBoard.board[index - (2 * step)] === mark))
                }
            } else {
                if (index === 0 || index === 1 || index === 2) {
                    win((gameBoard.board[index + step] === mark) && (gameBoard.board[index + (2 * step)] === mark))
                } else if (index === 3 || index === 4 || index === 5) {
                    win((gameBoard.board[index + step] === mark) && (gameBoard.board[index - step] === mark))
                } else if (index === 6 || index === 7 || index === 8) {
                    win((gameBoard.board[index - step] === mark) && (gameBoard.board[index - (2 * step)] === mark))
                }
            }
        });

        if (gameBoard.board.every((mark) => mark != "")) {
            _state.draw = true;
            end();
            return;
        }        
    }

    const end = () => {
        if (_state.win) {
            alert(`${_state.currentPlayer.getName()} win, score ${_state.players[0].getScore()} : ${_state.players[1].getScore()}`);
        } else {
            alert("draw");
        }
        _state.end = true;
    }

    return { start };
})();

const displayController = (function() {
    const render = () => {        
        const cells = document.querySelectorAll(".cell");
        cells.forEach((el, i) => {
            el.textContent = gameBoard.board[i];
        });
    }
    return { render }
})();

const Player = (name, mark) => {
    let _score = 0;
    const getName = () => name;
    const getMark = () => mark;
    const getScore = () => _score;
    
    const addScore = (increment) => _score += increment;
    const addMark = (index) => {
        gameBoard.board[index] = mark;
        displayController.render();        
    }

    return { getName, addMark, getMark, getScore, addScore };
}

game.start();