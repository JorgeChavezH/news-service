const commonArticleBody = {
    url: "https://fake.url.com",
    author: "fake autor",
    content: "fake content"
};

const commonUserBody = {
    name: 'fake name'
};

const createArticle = function (chai, app, body) {
    return new Promise((resolve, reject) => {
        chai.request(app)
            .post(utils.constants.baseArticlesPath)
            .send(body)
            .end((err, res) => {
                if (err) { reject(err); }
                resolve(res.body.data[utils.constants.idField]);
            });
    });
};
exports.createArticle = createArticle;

const createUser = function (chai, app, body) {
    return new Promise((resolve, reject) => {
        chai.request(app)
            .post(utils.constants.baseUsersPath)
            .send(body)
            .end((err, res) => {
                if (err) { reject(err); }
                resolve(res.body.data[utils.constants.idField]);
            });
    });
};

exports.createUser = createUser;

exports.addFavorite = function (chai, app) {
    return new Promise((resolve, reject) => {
        createUser(chai, app, commonUserBody).then((userId) => {
            createArticle(chai, app, commonArticleBody).then((articleId) => {
                chai.request(app)
                    .post(`${utils.constants.baseArticlesPath}/${articleId}/favorite`)
                    .set(utils.constants.userIdHeaderName, userId)
                    .end((err, res) => {
                        if (res.body.status == utils.constants.successStatus) {
                            resolve({userId: userId, articleId: articleId});
                        } else {reject();}
                    });
            });
        });
    });
}
