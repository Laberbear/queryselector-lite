# queryselector-lite

Provides an extremely light weight query selector functionality for non browser environment (node.js).
Can also be used within browsers of course.

The main usage for this is for node.js web scrapers to become a little bit less brittle. The alternatives to this is using the giant JSDOM library or do some hard to maintain RegEx.

## Currently Supported Selectors:
```
Basic Selectors:
.classes
#ids
div

Grouping Selectors:
h3,div,.classes
```

## API Reference:
```
const Document = require('queryselector-lite');

async function main() {
  const doc = new Document();
  await doc.load(PATH_TO_HTML_FILE);
  console.log(doc.querySelector('h3'));
  console.log(doc.querySelectorAll('h3'));
  console.log(doc.querySelectorAll('div,h3'));
}

main();
```