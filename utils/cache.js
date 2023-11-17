exports.cachedResultFor = async function(cacheKey, operation) {
    const cacheResult = await cache.get(cacheKey);
    
    if (cacheResult && !ignoreCache) {
        logger.info('A cached result was retrieved.', {cacheKey: cacheKey});
        return JSON.parse(cacheResult);
    }

    const result = await operation();
    cache.set(cacheKey, JSON.stringify(result), 'EX', config.cache.lifeTimeInSeconds);
    return result;
}