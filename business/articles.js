exports.create = async function(article) {
    return await dao.articles.save(article)
};

exports.list = async function(page, size) {
    const cacheKey =  `articleList|page:${page}|size:${size}`;
    
    return await utils.cache.cachedResultFor(cacheKey, async () => {
        return await dao.articles.list(page, size);
    });
}
    
exports.find = async function(id) {
    const cacheKey = `articleFind|id:${id}`;
    return await utils.cache.cachedResultFor(cacheKey, async () => {
        return await dao.articles.find(id);
    });
}

exports.favorite = async function(userId, articleId) {
    return await dao.articles.favorite(userId, articleId);
}

exports.unfavorite = async function(userId, articleId) {
    return await dao.articles.unfavorite(userId, articleId);
}

exports.update = async function(id, article) {
    return await dao.articles.update(id, article)
}

exports.delete = async function(id) {
    // TODO: look for the article in users favorite list to remove from there too
    return await dao.articles.delete(id)
}

exports.load = async function() {
    const lastNews = await clients.newsApiClient.getLastTechNews();
    if (lastNews && lastNews.articles && lastNews.articles.length > 0) {
        lastNews.articles.forEach(async (article) => {
            await dao.articles.save({author: article.author,
                url: article.url,
                content: article.content});
        });
        return true;
    }
    return false;
}