'use strict'

const { util } = require("chai");

/**
 * @swagger
 * /articles:
 *   post:
 *     summary: Create an article
 *     description: Create an article based on the request body.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               author:
 *                 type: string
 *                 description: The news author's name
 *               content:
 *                 type: string
 *                 description: The news content
 *               url:
 *                 type: string
 *                 description: The news url to read the full content
 *     responses:
 *       200:
 *         description: Created successful
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Server error
 */
exports.create = async function (req, res) {
    const article = req.body;
    // TODO: Improve validation through models
    const valid = utils.validations.articleBody(article)
    if (!valid) {
        return res.status(utils.constants.badRequestHttpCode)
            .send({ status: utils.constants.failStatus, code: utils.constants.badRequestCode, message: utils.constants.invalidArticleMessage, data: null });
    }
    const response = await business.articles.create(article);
    res.send({ status: utils.constants.successStatus, data: response });
};

/**
 * @swagger
 * /articles:
 *   get:
 *     summary: Retrieve a paginated article list
 *     description: Retrieve a paginated article list based on the page and size from query params.
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: int
 *         default: 1
 *         description: The page number
 *       - in: query
 *         name: size
 *         schema:
 *           type: int
 *         default: 20
 *         description: The number of items a page should have
 *     responses:
 *       200:
 *         description: Successful request
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Server error
 */
exports.index = async function (req, res) {
    const page = req.query.page || 1;
    const size = req.query.size || 20;
    const pageValid = utils.validations.isGreaterThan0(page);
    const sizeValid = utils.validations.isGreaterThan0(size);
    if (!pageValid || !sizeValid) {
        return res.status(utils.constants.badRequestHttpCode).send({ status: utils.constants.failStatus, code: utils.constants.badRequestCode, message: utils.constants.invalidParamsMessage, data: null });
    }

    const response = await business.articles.list(page, size);
    res.send({ status: utils.constants.successStatus, data: response });
};

/**
 * @swagger
 * /articles/:id:
 *   get:
 *     summary: Retrieve a specific article
 *     description: Retrieve a specific article based on the id from query params.
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: string
 *         description: The article id you are looking for
 *     responses:
 *       200:
 *         description: Successful request
 *       400:
 *         description: Bad Request
 *       404:
 *         description: Not Found
 *       500:
 *         description: Server error
 */
exports.show = async function (req, res) {
    const id = req.params.id;
    const response = await business.articles.find(id);
    if (response) {
        res.send({ status: utils.constants.successStatus, data: response });
    } else {
        // TODO: improve this with exception classes
        res.status(utils.constants.notFoundHttpCode).send({ status: utils.constants.failStatus, code: utils.constants.notFoundCode, message: utils.constants.articleNotFoundMessage, data: null });
    }
};

/**
 * @swagger
 * /articles/:id:
 *   put:
 *     summary: Update a specific article
 *     description: Update a specific article based on the id from query params and the request body.
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: string
 *         description: The article id you want to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               author:
 *                 type: string
 *                 description: The news author's name
 *               content:
 *                 type: string
 *                 description: The news content
 *               url:
 *                 type: string
 *                 description: The news url to read the full content
 *     responses:
 *       200:
 *         description: Successful request
 *       400:
 *         description: Bad Request
 *       404:
 *         description: Not Found
 *       500:
 *         description: Server error
 */
exports.update = async function (req, res) {
    const id = req.params.id;
    const article = req.body;
    const response = await business.articles.update(id, article);
    if (response) {
        res.send({ status: utils.constants.successStatus, data: response });
    } else {
        // TODO: improve this with exception classes
        res.status(utils.constants.notFoundHttpCode).send({ status: utils.constants.failStatus, code: utils.constants.notFoundCode, message: utils.constants.articleNotFoundMessage, data: null });
    }
};
/**
 * @swagger
 * /articles/:id:
 *   delete:
 *     summary: Delete an article
 *     description: Delete an article based in the id sent in the query param.
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: string
 *         description: The article id you want to delete
 *     responses:
 *       200:
 *         description: Deleted successful
 *       400:
 *         description: Bad Request
 *       404:
 *         description: Not Found
 *       500:
 *         description: Server error
 */
exports.delete = async function (req, res) {
    const id = req.params.id;
    const response = await business.articles.delete(id);
    if (response) {
        res.send({ status: utils.constants.successStatus, data: response });
    } else {
        // TODO: improve this with exception classes
        res.status(utils.constants.notFoundHttpCode).send({ status: utils.constants.failStatus, code: utils.constants.notFoundCode, message: utils.constants.articleNotFoundMessage, data: null });
    }
};

/**
 * @swagger
 * /articles/:id/favorite:
 *   post:
 *     summary: Mark an article as favorite
 *     description: Mark an article as favorite to the user comming in the user header.
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: string
 *         description: The article id you want to add to favorites
 *       - in: header
 *         name: user-id
 *         schema:
 *           type: string
 *         description: The user id that is adding the article to favorites
 *     responses:
 *       200:
 *         description: Request successful
 *       400:
 *         description: Bad Request
 *       404:
 *         description: Not Found
 *       500:
 *         description: Server error
 */
exports.favorite = async function (req, res) {
    const userId = req.headers[utils.constants.userIdHeaderName];
    const articleId = req.params.id;
    const result = await business.articles.favorite(userId, articleId);
    if (result) {
        res.send({ status: utils.constants.successStatus, data: null });
    } else {
        // TODO: improve this with exception classes
        res.status(utils.constants.notFoundHttpCode).send({ status: utils.constants.failStatus, code: utils.constants.notFoundCode, message: utils.constants.userOrArticleNotFoundMessage, data: null });
    }
};

/**
 * @swagger
 * /articles/:id/unfavorite:
 *   post:
 *     summary: Remove the mark of favorite from an article
 *     description: Remove the mark of favorite from an article to the user comming in the user header.
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: string
 *         description: The article id you want to remove from favorites
 *       - in: header
 *         name: user-id
 *         schema:
 *           type: string
 *         description: The user id that is removing the article from favorites
 *     responses:
 *       200:
 *         description: Request successful
 *       400:
 *         description: Bad Request
 *       404:
 *         description: Not Found
 *       500:
 *         description: Server error
 */
exports.unfavorite = async function (req, res) {
    const userId = req.headers[utils.constants.userIdHeaderName];
    const articleId = req.params.id;
    const result = await business.articles.unfavorite(userId, articleId);
    if (result) {
        res.send({ status: utils.constants.successStatus, data: null });
    } else {
        // TODO: improve this with exception classes
        res.status(utils.constants.notFoundHttpCode).send({ status: utils.constants.failStatus, code: utils.constants.notFoundCode, message: utils.constants.userOrArticleNotFoundMessage, data: null });
    }
};

/**
 * @swagger
 * /articles/load:
 *   post:
 *     summary: Load from newsapi.org all the last month articles related to tech
 *     description: Load from newsapi.org all the last month articles related to tech
 *     responses:
 *       200:
 *         description: Request successful
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Server error
 */
exports.load = async function (req, res) {
    const result = await business.articles.load();

    res.send({ status: utils.constants.successStatus, data: result });
};