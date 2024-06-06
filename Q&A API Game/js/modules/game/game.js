import { TriviaAPI } from '../utils/apis/trivia-api.js';
import { Encoder } from '../utils/encoder.js';

class Game {
    constructor(userInterface) {
        this.userInterface = userInterface;
        this.sessionToken = '';
        this.categoryIds = [];
        this.currentScore = 0;
        this.currentQuestionIndex = 0;
        this.maxQuestions = 5;
        this.questionAnswered = false;
    }

    init() {
        const ranking = this.getRankingFromCookie();
        this.userInterface.updateRanking(ranking);
        
        return TriviaAPI.fetchQuestionCategories()
            .then(categories => {
                this.categoryIds = categories.map(category => category.id);
                return TriviaAPI.fetchSessionToken();
            })
            .then(token => {
                this.sessionToken = token;
            })
            .catch(error => {
                console.error('Error initializing game:', error);
            });
    }

    startNewGame() {
        this.currentScore = 0;
        this.currentQuestionIndex = 0;
        this.userInterface.updatePoints(this.currentScore);
        this.userInterface.toggleNewGameButton(false);
        this.userInterface.toggleCancelButton(true);
        this.nextQuestion();
    }

    cancelGame() {
        this.userInterface.toggleNewGameButton(true);
        this.userInterface.toggleCancelButton(false);
        this.userInterface.hideQuestion();
        this.userInterface.hideScoreBox();
        this.userInterface.updatePoints(null);
        this.userInterface.hideFinalScoreMessage();
        this.currentQuestion = null;
    }

    nextQuestion() {
        if (this.currentQuestionIndex >= this.maxQuestions) {
            this.endGame();
            return;
        }

        const categoryId = this.categoryIds[this.currentQuestionIndex % this.categoryIds.length];
        TriviaAPI.fetchQuestion(this.sessionToken, categoryId)
            .then(question => {
                this.userInterface.displayQuestion(question);
                this.currentQuestion = question;
                this.currentQuestionIndex++;
                this.questionAnswered = false;
            })
            .catch(error => {
                console.error('Error fetching question:', error);
            });
    }

    handleAnswerSelection(selectedAnswer) {
        if (this.questionAnswered) return;

        const currentQuestion = this.currentQuestion;
        const correctAnswer = Encoder.htmlEntitiesDecode(currentQuestion.correct_answer);

        if (selectedAnswer === correctAnswer) {
            this.currentScore += 2;
            this.userInterface.updatePoints(this.currentScore);
        }

        this.questionAnswered = true;

        if (this.currentQuestionIndex < this.maxQuestions) {
            this.nextQuestion();
        } else {
            this.endGame();
        }
    }

    endGame() {
        this.userInterface.hideQuestion();
        this.userInterface.showScoreBox();
        this.userInterface.updatePoints(null);
        this.userInterface.showFinalScoreMessage(this.currentScore);
        this.currentQuestion = null;
    }

    getRankingFromCookie() {
        const rankingCookie = document.cookie.split('; ').find(cookie => cookie.startsWith('ranking='));
        if (rankingCookie) {
            return JSON.parse(rankingCookie.split('=')[1]);
        } else {
            return [];
        }
    }

    saveRankingToCookie(ranking) {
        document.cookie = `ranking=${JSON.stringify(ranking)}; max-age=${60 * 60 * 24 * 30}; path=/`;
    }

    saveScore(playerName) {
        if (playerName.trim()) {
            const scores = this.getRankingFromCookie();
            scores.push({ name: playerName, score: this.currentScore });
            scores.sort((a, b) => b.score - a.score);
            this.saveRankingToCookie(scores);
            this.userInterface.updateRanking(scores);
        }
        this.cancelGame();
    }
}

export { Game };
