'use strict'

const UserModel = mongoose.model(utils.constants.userModelName);

const customLabelNames = {
    totalDocs: 'total_items',
    docs: 'users',
    limit: 'size',
    page: 'current_page',
    nextPage: 'next_page',
    prevPage: 'prev_page',
    totalPages: 'total_pages',
    meta: 'pagination',
  };

exports.save = async function(user) {
    let userDocument = new UserModel(user);
    let userSaved;
    try {
        userSaved = await userDocument.save();
    } catch (error) {
        return false;
    }
    return userSaved;
}

exports.favorites = async function(userId) {
    // TODO: add pagination
    let userFinded;
    try {
        userFinded = await UserModel.findById(userId).populate(utils.constants.favoritesField);
    } catch (error) {
       return false; 
    }
    
    if (!userFinded) { return false; }

    return userFinded.favorites;
}