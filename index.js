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
        const modal = document.querySelector("#modal");
        modal.addEventListener("click", function(e) {
            const names = displayController.handleModal(e);

            if (_state.players.length === 0 && names.length !== 0) {
                const p1 = Player(names[0], "X");
                const p2 = Player(names[1], "O");
    
                _state.players = [p1, p2];
                _state.currentPlayer = p1;

                displayController.displayPlayerInfo(_state.players);
            } else if (names.length !== 0) {
                _state.players[0].setName(names[0]);
                _state.players[1].setName(names[1]);

                displayController.displayPlayerInfo(_state.players);
            }

            // if (_state.currentPlayer === "") {
            //     _state.currentPlayer = p1;
            // }            
        });
        
        displayController.render();

        const cells = document.querySelectorAll(".cell");
        cells.forEach((el) => {
            el.addEventListener("click", function(e) {
                const index = e.target.dataset.index;
                if (!gameBoard.board[index] && _state.end === false) {
                    _state.currentPlayer.addMark(index);
                    winChecker(_state.currentPlayer, index);
                    switchPlayer(_state.players[0], _state.players[1]);
                }
            });
        });

        const settingBtn = document.querySelector("#setting");
        settingBtn.addEventListener("click", displayController.handleSetting);

        const restartBtn = document.querySelector("#restart");
        restartBtn.addEventListener("click", restart);
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

    const restart = () => {
        _state.win = false;
        _state.draw = false;
        _state.end = false;
        console.log(_state.win, _state.draw, _state.end);
        _state.currentPlayer = _state.players[0];
        gameBoard.board = ["", "", "", "", "", "", "", "", ""];

        displayController.render();
        displayController.hideAnnouncement();
    }

    const end = () => {
        if (_state.win) {
            displayController.displayWinner(_state.currentPlayer);
        } else {
            displayController.displayDraw();
        }
        _state.end = true;

        displayController.displayPlayerInfo(_state.players);
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

    const handleSetting = () => {
        const modal = document.querySelector("#modal");
        modal.style.display = "block";
    }

    const handleModal = (e) => {
        const modal = document.querySelector("#modal");
        let p1Name, p2Name;
        if (e.target.id === "confirm") {
            p1Name = document.querySelector("#p1input").value ? document.querySelector("#p1input").value : document.querySelector("#p1input").placeholder;
            p2Name = document.querySelector("#p2input").value ? document.querySelector("#p2input").value : document.querySelector("#p2input").placeholder;            
            modal.style.display = "none";
            return [p1Name, p2Name];
        } else if (e.target.id === "modal") {
            p1Name = document.querySelector("#p1input").placeholder;
            p2Name = document.querySelector("#p2input").placeholder;            
            modal.style.display = "none";
            return [p1Name, p2Name];
        }

        return [];
    }

    const displayPlayerInfo = (players) => {
        const p1NameNode = document.querySelector("#p1");
        const p2NameNode = document.querySelector("#p2");
        const p1ScoreNode = document.querySelector("#p1score");
        const p2ScoreNode = document.querySelector("#p2score");

        p1NameNode.textContent = players[0].getName();
        p2NameNode.textContent = players[1].getName();
        p1ScoreNode.textContent = players[0].getScore();
        p2ScoreNode.textContent = players[1].getScore();
    }

    const displayWinner = (player) => {
        const announcementNode = document.querySelector("#announcement");
        announcementNode.style.display = "block";
        announcementNode.textContent = `${player.getName()} wins!`;
    }

    const displayDraw = () => {
        const announcementNode = document.querySelector("#announcement");
        announcementNode.style.display = "block";
        announcementNode.textContent = `Draw!`;
    }

    const hideAnnouncement = () => {
        const announcementNode = document.querySelector("#announcement");
        announcementNode.style.display = "none";
    }

    return { render, handleModal, displayPlayerInfo, handleSetting, displayWinner, displayDraw, hideAnnouncement };
})();

const Player = (name, mark) => {
    let _name = name;
    let _mark = mark;
    let _score = 0;
    const getName = () => _name;
    const getMark = () => _mark;
    const getScore = () => _score;

    const setName = (newName) => _name = newName;
    
    const addScore = (increment) => _score += increment;
    const addMark = (index) => {
        gameBoard.board[index] = mark;
        displayController.render();        
    }

    return { getName, addMark, getMark, getScore, addScore, setName };
}

game.start();