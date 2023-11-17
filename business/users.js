exports.create = async function(user) {
    return await dao.users.save(user)
};

exports.favorites = async function(userId) {
    const cacheKey =  `userFavorites|userId:${userId}`;
    
    return await utils.cache.cachedResultFor(cacheKey, async () => {
        return await dao.users.favorites(userId);
    });
};