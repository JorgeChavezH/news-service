'use strict'

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create an user
 *     description: Create an user based on the request body.
 *     responses:
 *       200:
 *         description: Created successful
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Server error
 */
exports.create = async function(req, res) {
    const user = req.body;
    const response = await business.users.create(user);
    res.send({ status: utils.constants.successStatus, data: response });
};

/**
 * @swagger
 * /users/favorites:
 *   get:
 *     summary: List the favorites articles
 *     description: List the favorites articles based on the user id from the header
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
exports.favorites = async function(req, res) {
    const userId = req.headers[utils.constants.userIdHeaderName];
    const response = await business.users.favorites(userId);

    if (response) {
        res.send({ status: utils.constants.successStatus, data: response });    
    } else {
        // TODO: improve this with exception classes
        res.status(utils.constants.notFoundHttpCode).send({ status: utils.constants.failStatus, code: utils.constants.notFoundCode, message: utils.constants.userNotFoundMessage, data: null });
    }
};