const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");

const User = new Schema({
    name: String,
    favorites: [
        { type: mongoose.Schema.Types.ObjectId, ref: utils.constants.articleModelName }
      ]
}, {timestamps: true});

User.plugin(mongoosePaginate);
User.plugin(aggregatePaginate);

mongoose.model(utils.constants.userModelName, User);
