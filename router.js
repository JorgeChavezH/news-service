'use strict'

const heatlh = require('./controllers/health');
const articles = require('./controllers/articles');
const users = require('./controllers/users');

app.get('/health', heatlh.check)
// Articles
app.post('/articles', articles.create)
app.get('/articles', articles.index)
app.get('/articles/:id', articles.show)
app.put('/articles/:id', articles.update)
app.delete('/articles/:id', articles.delete)
app.post('/articles/:id/favorite', articles.favorite)
app.post('/articles/:id/unfavorite', articles.unfavorite)
app.post('/articles/load', articles.load)

// Users
app.post('/users', users.create)
app.get('/users/favorites', users.favorites)