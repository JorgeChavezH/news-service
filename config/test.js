module.exports = {
    api: {
      port: process.env.PORT || 3000,
    },
    cache: {
      lifeTimeInSeconds: 2,
      host: '127.0.0.1',
      port: 6379
    },
    db: {
      uri: "mongodb://127.0.0.1:27017/news-db-test",
    },
    newsApi: { // TODO: Move to secrets
      apiKey: 'b2d00e9a8fb6456f89126d00664b3ade'
    }
  };
  