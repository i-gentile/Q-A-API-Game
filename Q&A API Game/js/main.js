// Your app starting point here

import { UserInterface } from './modules/interface/user-interface.js';
import { Game } from './modules/game/game.js';

document.addEventListener('DOMContentLoaded', () => {
    const userInterface = new UserInterface();
    const game = new Game(userInterface);

    game.init()
        .then(() => {
            userInterface.newGameButton.addEventListener('click', () => {
                game.startNewGame();
            });

            userInterface.cancelButton.addEventListener('click', () => {
                game.cancelGame();
            });

            userInterface.questionDisplay.addEventListener('click', (event) => {
                if (event.target.classList.contains('question__option')) {
                    const selectedAnswer = event.target.dataset.value;
                    game.handleAnswerSelection(selectedAnswer);
                }
            });

            userInterface.saveButton.addEventListener('click', () => {
                const playerName = userInterface.usernameInput.value;
                game.saveScore(playerName);
            });

            userInterface.discardButton.addEventListener('click', () => {
                game.cancelGame();
            });
        })
        .catch(error => {
            console.error('Error initializing the game:', error);
        });
});
