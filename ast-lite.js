const fs = require('fs').promises;

const Reset = '\x1b[0m';
const Bright = '\x1b[1m';
const Dim = '\x1b[2m';
const Underscore = '\x1b[4m';
const Blink = '\x1b[5m';
const Reverse = '\x1b[7m';
const Hidden = '\x1b[8m';

const FgBlack = '\x1b[30m';
const FgRed = '\x1b[31m';
const FgGreen = '\x1b[32m';
const FgYellow = '\x1b[33m';
const FgBlue = '\x1b[34m';
const FgMagenta = '\x1b[35m';
const FgCyan = '\x1b[36m';
const FgWhite = '\x1b[37m';

const BgBlack = '\x1b[40m';
const BgRed = '\x1b[41m';
const BgGreen = '\x1b[42m';
const BgYellow = '\x1b[43m';
const BgBlue = '\x1b[44m';
const BgMagenta = '\x1b[45m';
const BgCyan = '\x1b[46m';
const BgWhite = '\x1b[47m';

function parseAttributes(attributes) {
  const cleanedAttributes = attributes.replace(' ', '');
  const attributes2 = cleanedAttributes.split('=');
  const attributeObject = {};
  for (let i = 1; i < attributes2.length; i += 2) {
    attributeObject[attributes2[i - 1]] = attributes2[i].replace('"', '').replace('"', '');
  }
  return attributeObject;
}
class ASTLite {
  async loadFile(path) {
    const file = (await fs.readFile(path)).toString();

    // Build HTML Tree
    // Example Tree:
    /**
         * {
         *  node: 'html',
         *  start: 123
         *  attributes: [''],
         *  children: [
         *      {
         *          node: 'div',
         *          attributes: ['']
         *      }
         *  ]
         * }
         */
    const tree = { children: [], attributes: {} };
    const parentList = [tree];
    let currentTag = {
      nameDone: false,
      name: '',
      contents: '',
      attributes: '',
      children: [],
      tag0Start: null,
      tag0End: null,
      tag1Start: null,
      tag1End: null,
      attributesStart: null,
      attributesEnd: null,
      contentStart: null,
      contentEnd: null,
    };

    let tagIsOpen = false;

    for (let i = 0; i < file.length; i += 1) {
      const char = file.charAt(i);
      if (char === '<') {
        tagIsOpen = true;
        currentTag.tag0Start = i;
      } else if (char === '>' && tagIsOpen) {
        tagIsOpen = false;
        if (currentTag.name.charAt(0) === '/') {
          parentList[parentList.length - 1].tag1Start = i;
          parentList[parentList.length - 1].tag1End = i;
          parentList.pop();
        } else {
          currentTag.nameDone = true;
          currentTag.tag0End = i;
          parentList[parentList.length - 1].children.push(currentTag);
          parentList.push(currentTag);
          currentTag.attributes = parseAttributes(currentTag.attributes);
        }
        currentTag = {
          nameDone: false,
          name: '',
          contents: '',
          attributes: '',
          children: [],
        };
      } else if (tagIsOpen && char === ' ' && !currentTag.nameDone) {
        currentTag.nameDone = true;
      } else if (tagIsOpen && !currentTag.nameDone) {
        currentTag.name += char;
      } else if (tagIsOpen && currentTag.nameDone) {
        if (parentList[parentList.length - 1].attributes === '') {
          parentList[parentList.length - 1].attributesStart = i;
        }
        parentList[parentList.length - 1].attributesEnd = i;
        currentTag.attributes += char;
      } else {
        if (parentList[parentList.length - 1].contents === '') {
          parentList[parentList.length - 1].contentStart = i;
        }
        parentList[parentList.length - 1].contentEnd = i;
        parentList[parentList.length - 1].contents += char;
      }
    }
    this.tree = tree;
  }

  getTagArray(tag = this.tree) {
    const tags = [];
    tags.push(tag);
    for (const child of tag.children) {
      tags.push(...this.getTagArray(child));
    }
    return tags;
  }
}

/**
 * Types of  Checks:
 * AST Check
 * HTML Tag Check
 * Attribute + Value Check
 * Line Check
 */

module.exports = {
  ASTLite,
};
