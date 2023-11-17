'use strict'

const ArticleModel = mongoose.model(utils.constants.articleModelName);

const UserModel = mongoose.model(utils.constants.userModelName);

const customLabelNames = {
    totalDocs: 'total_items',
    docs: 'articles',
    limit: 'size',
    page: 'current_page',
    nextPage: 'next_page',
    prevPage: 'prev_page',
    totalPages: 'total_pages',
    meta: 'pagination',
};

const listAggregation = [
    { $project: { author: 1, url: 1, content: 1 } }
];

exports.save = async function (article) {
    let articleDocument = new ArticleModel(article);
    let articleSaved;
    try {
        articleSaved = await articleDocument.save();
    } catch (error) {
        return false;
    }
    return articleSaved;
}

exports.list = async function (page, size) {
    const agregate = ArticleModel.aggregate(listAggregation);
    const articlesFinded = await ArticleModel.aggregatePaginate(agregate, { page: page, limit: size, customLabels: customLabelNames });

    return articlesFinded;
}

exports.find = async function (id) {
    let articleFinded;
    try {
        articleFinded = await ArticleModel.findById(id);
    } catch (error) {
        return false;
    }

    return articleFinded;
}

exports.update = async function (id, article) {
    let updatedArticle;
    try {
        updatedArticle = await ArticleModel.findByIdAndUpdate(id, article, { new: true });
    } catch (error) {
        return false;
    }

    return updatedArticle;
}

exports.delete = async function (id) {
    let deletedArticle;
    try {
        deletedArticle = await ArticleModel.findByIdAndDelete(id);
    } catch (error) {
        return false;
    }

    return deletedArticle != null;
}

exports.favorite = async function (userId, articleId) {
    let user;
    let article;

    try {
        article = await ArticleModel.findById(articleId)
    } catch (error) {
        logger.info(utils.constants.articleNotFoundMessage, articleId);
    }

    try {
        user = await UserModel.findById(userId);
    } catch (error) {
        logger.info(utils.constants.userNotFoundMessage, userId);
    }
    

    if (!user || !article) {
        return false;
    }

    user.favorites.push(articleId);
    await user.save();

    return true;
}

exports.unfavorite = async function (userId, articleId) {
    let user;
    let article;
    try {
        user = await UserModel.findById(userId);
    } catch (error) {
        logger.info(utils.constants.userNotFoundMessage, userId);
    }
    try {
        article = await ArticleModel.findById(articleId);
    } catch (error) {
        logger.info(utils.constants.articleNotFoundMessage, articleId);
    }

    if (!user || !article) {
        return false;
    }

    user.favorites.pull(articleId);
    await user.save();

    return true;
}