const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const app = require('../../index');
const testHelper = require('../testHelper')

chai.use(chaiHttp);

const commonArticleBody = {
  url: "https://fake.url.com",
  author: "fake autor",
  content: "fake content"
};

const commonUserBody = {
  name: 'fake name'
};

afterEach(async function () {
  ignoreCache = false;
  await mongoose.connection.db.dropDatabase();
});

describe('Article controllers', () => {
  it('Should create a new article', (done) => {
    chai.request(app)
      .post(utils.constants.baseArticlesPath)
      .send(commonArticleBody)
      .end((err, res) => {
        expect(res).to.have.status(utils.constants.successHttpCode);
        expect(res.body.status).to.equal(utils.constants.successStatus);
        expect(res.body.data).to.have.property(utils.constants.idField);
        expect(res.body.data).to.have.property(utils.constants.urlField);
        expect(res.body.data).to.have.property(utils.constants.authorField);
        expect(res.body.data).to.have.property(utils.constants.contentField);
        done();
      });
  });

  it('Should get a bad request when missing article fields', (done) => {
    ignoreCache = true;
    chai.request(app)
      .post(utils.constants.baseArticlesPath)
      .send({})
      .end((err, res) => {
        expect(res).to.have.status(utils.constants.badRequestHttpCode);
        expect(res.body.status).to.equal(utils.constants.failStatus);
        done();
      });
  });

  it('Should get an empty article list', (done) => {
    ignoreCache = true;
    chai.request(app)
      .get(utils.constants.baseArticlesPath)
      .end((err, res) => {
        expect(res).to.have.status(utils.constants.successHttpCode);
        expect(res.body.status).to.equal(utils.constants.successStatus);
        expect(res.body.data).to.have.property(utils.constants.articlesResponseAttribute);
        expect(res.body.data.articles).to.be.an('array');
        expect(res.body.data.articles.length).to.equal(0);
        done();
      });
  });

  it('Should get an empty article list on unexist page', (done) => {
    ignoreCache = true;
    chai.request(app)
      .get(`${utils.constants.baseArticlesPath}?page=100`)
      .end((err, res) => {
        expect(res).to.have.status(utils.constants.successHttpCode);
        expect(res.body.status).to.equal(utils.constants.successStatus);
        expect(res.body.data).to.have.property(utils.constants.articlesResponseAttribute);
        expect(res.body.data.pagination).to.be.an('object');
        expect(res.body.data.pagination.current_page).to.equal(100);
        done();
      });
  });

  it('Should get bad request on negative page', (done) => {
    ignoreCache = true;
    chai.request(app)
      .get(`${utils.constants.baseArticlesPath}?page=-1`)
      .end((err, res) => {
        expect(res).to.have.status(utils.constants.badRequestHttpCode);
        expect(res.body.status).to.equal(utils.constants.failStatus);
        done();
      });
  });

  it('Should get bad request on zero size', (done) => {
    ignoreCache = true;
    chai.request(app)
      .get(`${utils.constants.baseArticlesPath}?size=0`)
      .end((err, res) => {
        expect(res).to.have.status(utils.constants.badRequestHttpCode);
        expect(res.body.status).to.equal(utils.constants.failStatus);
        done();
      });
  });

  it('Should get created articles', (done) => {
    ignoreCache = true;
    testHelper.createArticle(chai, app, commonArticleBody).then((_) => {
      chai.request(app)
        .get(utils.constants.baseArticlesPath)
        .end((err, res) => {
          expect(res).to.have.status(utils.constants.successHttpCode);
          expect(res.body.status).to.equal(utils.constants.successStatus);
          expect(res.body.data).to.have.property(utils.constants.articlesResponseAttribute);
          expect(res.body.data.articles).to.be.an('array');
          expect(res.body.data.articles.length).to.equal(1);
          expect(res.body.data.articles[0].author).to.equal('fake autor');
          expect(res.body.data.pagination).to.be.an('object');
          expect(res.body.data.pagination.current_page).to.equal(1);
          done();
        });
    });
  });

  it('Should get a specific article', (done) => {
    ignoreCache = true;
    testHelper.createArticle(chai, app, commonArticleBody).then((id) => {
      chai.request(app)
        .get(`${utils.constants.baseArticlesPath}/${id}`)
        .end((err, res) => {
          expect(res).to.have.status(utils.constants.successHttpCode);
          expect(res.body.status).to.equal(utils.constants.successStatus);
          expect(res.body.data).to.have.property(utils.constants.idField);
          expect(res.body.data).to.have.property(utils.constants.urlField);
          expect(res.body.data).to.be.an('object');
          expect(res.body.data[utils.constants.idField]).to.equal(id);
          expect(res.body.data.author).to.equal('fake autor');
          done();
        });
    });
  });

  it('Should get not found when id doent exists', (done) => {
    ignoreCache = true;
    chai.request(app)
      .get(`${utils.constants.baseArticlesPath}/fakeid`)
      .end((err, res) => {
        expect(res).to.have.status(utils.constants.notFoundHttpCode);
        expect(res.body.status).to.equal(utils.constants.failStatus);
        expect(res.body.code).to.equal(utils.constants.notFoundCode);
        done();
      });
  });

  it('Should update a specific article', (done) => {
    testHelper.createArticle(chai, app, commonArticleBody).then((id) => {
      chai.request(app)
        .put(`${utils.constants.baseArticlesPath}/${id}`)
        .send({
          url: "https://fake.url.com2",
          author: "fake autor2",
          content: "fake content2"
        })
        .end((__err, __res) => {
          chai.request(app)
            .get(`${utils.constants.baseArticlesPath}/${id}`)
            .end((err, res) => {
              expect(res.body.data[utils.constants.idField]).to.equal(id);
              expect(res.body.data.author).to.equal('fake autor2');
              expect(res.body.data.content).to.equal('fake content2');
              expect(res.body.data.url).to.equal('https://fake.url.com2');
              done();
            });
        });
    });
  });

  it('Should get not found error when update unexisting article', (done) => {
    chai.request(app)
      .put(`${utils.constants.baseArticlesPath}/fakeid`)
      .send({
        url: "https://fake.url.com2",
        author: "fake autor2",
        content: "fake content2"
      })
      .end((err, res) => {
        expect(res).to.have.status(utils.constants.notFoundHttpCode);
        expect(res.body.status).to.equal(utils.constants.failStatus);
        expect(res.body.code).to.equal(utils.constants.notFoundCode);
        done();
      });
  });

  it('Should get not found error when delete unexisting article', (done) => {
    chai.request(app)
      .delete(`${utils.constants.baseArticlesPath}/fakeid`)
      .end((err, res) => {
        expect(res).to.have.status(utils.constants.notFoundHttpCode);
        expect(res.body.status).to.equal(utils.constants.failStatus);
        expect(res.body.code).to.equal(utils.constants.notFoundCode);
        done();
      });
  });

  it('Should delete an article', (done) => {
    testHelper.createArticle(chai, app, commonArticleBody).then((id) => {
      chai.request(app)
        .delete(`${utils.constants.baseArticlesPath}/${id}`)
        .end((err, res) => {
          expect(res).to.have.status(utils.constants.successHttpCode);
          expect(res.body.status).to.equal(utils.constants.successStatus);
          chai.request(app)
            .get(`${utils.constants.baseArticlesPath}/${id}`)
            .end((_err, _res) => {
              expect(_res).to.have.status(utils.constants.notFoundHttpCode);
              expect(_res.body.status).to.equal(utils.constants.failStatus);
              expect(_res.body.code).to.equal(utils.constants.notFoundCode);
              done();
            });
        });
    });
  });

  // TODO: move to its own usersTests.js file
  it('Should create an user', (done) => {
    chai.request(app)
      .post(utils.constants.baseUsersPath)
      .send({
        name: "fake name"
      })
      .end((err, res) => {
        expect(res).to.have.status(utils.constants.successHttpCode);
        expect(res.body.status).to.equal(utils.constants.successStatus);
        expect(res.body.data).to.have.property(utils.constants.idField);
        expect(res.body.data).to.have.property(utils.constants.nameField);
        done();
      });
  });

  it('Should be able to get empty list of favorites', (done) => {
    ignoreCache = true;
    testHelper.createUser(chai, app, commonUserBody).then((userId) => {
      chai.request(app)
        .get(`${utils.constants.baseUsersPath}/favorites`)
        .set(utils.constants.userIdHeaderName, userId)
        .end((err, res) => {
          expect(res).to.have.status(utils.constants.successHttpCode);
          expect(res.body.status).to.equal(utils.constants.successStatus);
          expect(res.body.data).to.be.an('array');
          expect(res.body.data.length).to.equal(0);
          done();
        });
    });
  });

  it('Should be able to add an article as favorite and get it', (done) => {
    ignoreCache = true
    testHelper.createUser(chai, app, commonUserBody).then((userId) => {
      testHelper.createArticle(chai, app, commonArticleBody).then((articleId) => {
        chai.request(app)
          .post(`${utils.constants.baseArticlesPath}/${articleId}/favorite`)
          .set(utils.constants.userIdHeaderName, userId)
          .end((err, res) => {
            expect(res).to.have.status(utils.constants.successHttpCode);
            expect(res.body.status).to.equal(utils.constants.successStatus);
            chai.request(app)
              .get(`${utils.constants.baseUsersPath}/favorites`)
              .set(utils.constants.userIdHeaderName, userId)
              .end((_err, _res) => {
                expect(_res).to.have.status(utils.constants.successHttpCode);
                expect(_res.body.status).to.equal(utils.constants.successStatus);
                expect(_res.body.data).to.be.an('array');
                expect(_res.body.data.length).to.equal(1);
                expect(_res.body.data[0][utils.constants.idField]).to.equal(articleId);
                done();
              });
          });
      });
    });
  });

  it('Should get not found when add an article as favorite with invalid userId', (done) => {
    ignoreCache = true
    userId = 'fakeId'
    testHelper.createArticle(chai, app, commonArticleBody).then((articleId) => {
      chai.request(app)
        .post(`${utils.constants.baseArticlesPath}/${articleId}/favorite`)
        .set(utils.constants.userIdHeaderName, userId)
        .end((err, res) => {
          expect(res).to.have.status(utils.constants.notFoundHttpCode);
          expect(res.body.status).to.equal(utils.constants.failStatus);
          expect(res.body.code).to.equal(utils.constants.notFoundCode);
          expect(res.body.message).to.equal(utils.constants.userOrArticleNotFoundMessage);
          done();
        });
    });
  });

  it('Should get not found when add an article as favorite with invalid articleId', (done) => {
    ignoreCache = true
    articleId = 'fakeId'
    testHelper.createUser(chai, app, commonUserBody).then((userId) => {
      chai.request(app)
        .post(`${utils.constants.baseArticlesPath}/${articleId}/favorite`)
        .set(utils.constants.userIdHeaderName, userId)
        .end((err, res) => {
          expect(res).to.have.status(utils.constants.notFoundHttpCode);
          expect(res.body.status).to.equal(utils.constants.failStatus);
          expect(res.body.code).to.equal(utils.constants.notFoundCode);
          expect(res.body.message).to.equal(utils.constants.userOrArticleNotFoundMessage);
          done();
        });
    });
  });

  it('Should be able to remove an article from favorites', (done) => {
    ignoreCache = true
    testHelper.addFavorite(chai, app).then((ids) => {
      chai.request(app)
        .post(`${utils.constants.baseArticlesPath}/${ids.articleId}/unfavorite`)
        .set(utils.constants.userIdHeaderName, ids.userId)
        .end((err, res) => {
          expect(res).to.have.status(utils.constants.successHttpCode);
          expect(res.body.status).to.equal(utils.constants.successStatus);
          chai.request(app)
            .get(`${utils.constants.baseUsersPath}/favorites`)
            .set(utils.constants.userIdHeaderName, ids.userId)
            .end((_err, _res) => {
              expect(_res).to.have.status(utils.constants.successHttpCode);
              expect(_res.body.status).to.equal(utils.constants.successStatus);
              expect(_res.body.data).to.be.an('array');
              expect(_res.body.data.length).to.equal(0);
              done();
            });
        });
    });
  });

  it('Should get not found when remove an article from favorites with invalid userId', (done) => {
    ignoreCache = true
    userId = 'fakeId'
    testHelper.createArticle(chai, app, commonArticleBody).then((articleId) => {
      chai.request(app)
        .post(`${utils.constants.baseArticlesPath}/${articleId}/unfavorite`)
        .set(utils.constants.userIdHeaderName, userId)
        .end((err, res) => {
          expect(res).to.have.status(utils.constants.notFoundHttpCode);
          expect(res.body.status).to.equal(utils.constants.failStatus);
          expect(res.body.code).to.equal(utils.constants.notFoundCode);
          expect(res.body.message).to.equal(utils.constants.userOrArticleNotFoundMessage);
          done();
        });
    });
  });

  it('Should get not found when remove an article from favorite with invalid articleId', (done) => {
    ignoreCache = true
    articleId = 'fakeId'
    testHelper.createUser(chai, app, commonUserBody).then((userId) => {
      chai.request(app)
        .post(`${utils.constants.baseArticlesPath}/${articleId}/unfavorite`)
        .set(utils.constants.userIdHeaderName, userId)
        .end((err, res) => {
          expect(res).to.have.status(utils.constants.notFoundHttpCode);
          expect(res.body.status).to.equal(utils.constants.failStatus);
          expect(res.body.code).to.equal(utils.constants.notFoundCode);
          expect(res.body.message).to.equal(utils.constants.userOrArticleNotFoundMessage);
          done();
        });
    });
  });

});