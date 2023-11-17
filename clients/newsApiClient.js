'use strict'

const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const BASE_PATH = 'https://newsapi.org/v2';
const DEFAULT_SEARCH = 'tech';
const API_KEY = config.newsApi.apiKey;
const DEFAULT_PAGE_SIZE = 20;

exports.getLastTechNews = async function() {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 30);

    const isoDateString = yesterday.toISOString();
    const path = `${BASE_PATH}/everything?q=${DEFAULT_SEARCH}&apiKey=${API_KEY}&from=${isoDateString}&pageSize=${DEFAULT_PAGE_SIZE}`;

    const response = await fetch(path);
    if (response.ok) {
        return response.json();
    }

    return false;
}