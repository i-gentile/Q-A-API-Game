import { Encoder } from '../utils/encoder.js';
import { Randomizer } from '../utils/randomizer.js';

class UserInterface {
    constructor() {
        this.newGameButton = document.querySelector('.js-new');
        this.cancelButton = document.querySelector('.js-cancel');
        this.pointsDisplay = document.querySelector('.js-points');
        this.questionDisplay = document.querySelector('.js-question');
        this.scoreBox = document.querySelector('.js-score');
        this.usernameInput = document.querySelector('.js-username');
        this.saveButton = document.querySelector('.js-save');
        this.discardButton = document.querySelector('.js-discard');
        this.scoreMessage = document.querySelector('.points');
        this.currentQuestion = null;

        this.setInitialState();
    }

    setInitialState() {
        this.toggleNewGameButton(true);
        this.toggleCancelButton(false);
        this.hideQuestion();
        this.hideScoreBox();
        this.scoreMessage.classList.add('d-none');
    }

    toggleNewGameButton(show) {
        this.newGameButton.classList.toggle('d-none', !show);
    }

    toggleCancelButton(show) {
        this.cancelButton.classList.toggle('d-none', !show);
    }

    updatePoints(points) {
        if (points !== null) {
            this.scoreMessage.classList.remove('d-none');
            this.scoreMessage.textContent = `Current score: ${points} points.`;
        } else {
            this.scoreMessage.classList.add('d-none');
        }
    }

    displayQuestion(question) {
        this.currentQuestion = question;
        const questionText = Encoder.htmlEntitiesDecode(question.question);
        const allAnswers = Randomizer.randomizeArray([...question.incorrect_answers, question.correct_answer]);
        const answersHtml = allAnswers.map(answer => `
            <li class="question__option" data-value="${Encoder.htmlEntitiesEncode(answer)}">${Encoder.htmlEntitiesDecode(answer)}</li>
        `).join('');
        this.questionDisplay.innerHTML = `
            <h3 class="question__statement">${questionText}</h3>
            <ul class="question__answers">
                ${answersHtml}
            </ul>
        `;
        this.showQuestion();
    }

    showQuestion() {
        this.questionDisplay.classList.remove('d-none');
    }

    hideQuestion() {
        this.questionDisplay.classList.add('d-none');
    }

    showScoreBox() {
        this.scoreBox.classList.remove('d-none');
    }

    hideScoreBox() {
        this.scoreBox.classList.add('d-none');
    }

    showFinalScoreMessage(score) {
        this.scoreMessage.textContent = `Final score: ${score} points.`;
        this.scoreMessage.classList.remove('d-none');
    }

    hideFinalScoreMessage() {
        this.scoreMessage.classList.add('d-none');
    }

    getCurrentQuestion() {
        return this.currentQuestion;
    }

    updateRanking(scores) {
        const rankingList = document.querySelector('.js-list');
        const emptyMessage = document.querySelector('.js-empty');
        
        if (scores.length === 0) {
            emptyMessage.classList.remove('d-none');
            rankingList.innerHTML = '';
        } else {
            emptyMessage.classList.add('d-none');
            rankingList.innerHTML = scores.map((score, index) => `
                <li class="scoreboard__item">
                    <p class="scoreboard__pos">${index + 1}</p>
                    <p class="scoreboard__name">${score.name}</p>
                    <p class="scoreboard__points">${score.score} pts</p>
                </li>
            `).join('');
        }
    }
}

export { UserInterface };
