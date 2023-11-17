const isBlank = function (value) {
    return value == null || value == undefined || value == '' || value.length == 0 || value == {};
};

exports.articleBody = function (article) {
    if (isBlank(article)) {
        return false;
    }

    if (typeof article !== 'object') {
        return false;
      }
    
      if (!article.hasOwnProperty(utils.constants.urlField) || !article.hasOwnProperty(utils.constants.authorField) || !article.hasOwnProperty(utils.constants.contentField)) {
        return false;
      }
    
      if (typeof article.url === 'undefined' || typeof article.author === 'undefined' || typeof article.content === 'undefined') {
        return false;
      }
    
      return true;
};

exports.isGreaterThan0 = function (str) {
    const isOnlyDigits = /^\d+$/.test(str);
    const number = parseInt(str, 10);
  
    const result = isOnlyDigits && Number.isInteger(number) && number > 0;
  
    return result;
  }

exports.isBlank;