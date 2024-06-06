import { CATEGORY_LIST } from "../../consts/category-list.js";

class TriviaAPI {
    static API_CATEGORY_ENDPOINT = 'https://opentdb.com/api_category.php';
    static API_TOKEN_ENDPOINT = 'https://opentdb.com/api_token.php?command=request';

    static fetchQuestionCategories() {
        return new Promise((resolve, reject) => {
            fetch(TriviaAPI.API_CATEGORY_ENDPOINT)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`Failed to fetch categories (${response.status} ${response.statusText})`);
                    }
                    return response.json();
                })
                .then(data => {
                    const categories = data.trivia_categories;
                    const filteredCategories = categories.filter(category => {
                        return CATEGORY_LIST.includes(category.name);
                    });
                    resolve(filteredCategories);
                })
                .catch(error => {
                    console.error('Error fetching question categories:', error);
                    reject(error);
                });
        });
    }

    static fetchSessionToken() {
        return new Promise((resolve, reject) => {
            fetch(TriviaAPI.API_TOKEN_ENDPOINT)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`Failed to fetch session token (${response.status} ${response.statusText})`);
                    }
                    return response.json();
                })
                .then(data => {
                    const token = data.token;
                    resolve(token);
                })
                .catch(error => {
                    console.error('Error fetching session token:', error);
                    reject(error);
                });
        });
    }

    static fetchQuestion(sessionToken, categoryId) {
        const apiUrl = `https://opentdb.com/api.php?amount=1&category=${categoryId}&token=${sessionToken}`;

        return new Promise((resolve, reject) => {
            fetch(apiUrl)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`Failed to fetch question (${response.status} ${response.statusText})`);
                    }
                    return response.json();
                })
                .then(data => {
                    if (data.response_code === 0 && data.results.length > 0) {
                        resolve(data.results[0]);
                    } else {
                        reject('No question found or invalid response');
                    }
                })
                .catch(error => {
                    console.error('Error fetching question:', error);
                    reject(error);
                });
        });
    }

}

export { TriviaAPI };

