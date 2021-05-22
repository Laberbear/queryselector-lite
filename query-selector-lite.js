const { ASTLite } = require('./ast-lite');

function searchForTagName(tagName, tag) {
  return tag.name === tagName;
}
function searchForId(id, tag) {
  return tag.attributes.id === id.substring(1);
}
function searchForClass(className, tag) {
  return tag.attributes.class === className.substring(1);
}

function interpretSubquery(query) {
  const operator = query[0];
  switch (operator) {
    case '.':
      return (tag) => searchForClass(query, tag);
    case '#':
      return (tag) => searchForId(query, tag);
    default:
      return (tag) => searchForTagName(query, tag);
  }
}

class Document {
  async load(filePath) {
    this.ast = new ASTLite();
    await this.ast.loadFile(filePath);
  }

  querySelector(query) {
    return this.querySelectorAll(query)[0];
  }

  querySelectorAll(query) {
    const selectorFn = interpretSubquery(query);
    const filteredTags = this.ast.getTagArray().filter(selectorFn);
    return filteredTags;
  }
}

module.exports = Document;
