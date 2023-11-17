const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");

const Article = new Schema({
    author: String,
    url: String,
    content: String,
}, {timestamps: true});

Article.plugin(mongoosePaginate);
Article.plugin(aggregatePaginate);

mongoose.model(utils.constants.articleModelName, Article);
