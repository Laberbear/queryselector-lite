/**
 * Test file to see whether importing the library works
 */

const Document = require('queryselector-lite');

async function test() {
  const doc = new Document();
  await doc.load('./test.html');
  console.log(doc.querySelector('h3'));
}

test();
