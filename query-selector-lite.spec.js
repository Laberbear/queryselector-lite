const Document = require('./query-selector-lite');

describe('queryselectorlite', () => {
  const testCases = [
    {
      file: 'test.html',
      test: [
        'h3',
        '.abcdef',
        '#testid',
      ],
    },
  ];
  for (const testCase of testCases) {
    for (const test of testCase.test) {
      it(`should test querySelector ${test} in file ${testCase.file}`, async () => {
        const doc = new Document();
        await doc.load(testCase.file);
        expect(doc.querySelector(test)).toMatchSnapshot();
      });
      it(`should test querySelectorAll ${test} in file ${testCase.file}`, async () => {
        const doc = new Document();
        await doc.load(testCase.file);
        expect(doc.querySelectorAll(test)).toMatchSnapshot();
      });
    }
  }
});