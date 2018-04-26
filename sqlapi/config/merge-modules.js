const fs = require('fs');

const merge = require('./merge.js');

const { input, output } = require('yargs')
  .usage('Usage: $0 -i <input filepath 1> [...<input filepath N>] -o <output filepath>')
  .describe('i', 'CommonJS module files to merge; files earlier in the list take precedence over files later in the list')
  .alias('i', 'input')
  .array('i')
  .describe('o', 'output CommonJS module file')
  .alias('o', 'output')
  .demand(['i', 'o'])
  .argv;

// import specified modules
const inputObjects = input.map(filename => require(`./${filename}`));
// merge imported objects; objects earlier in the array take precedence over those later in the array
const merged = merge(...inputObjects);
// write the merged object to a file
writeModule(merged, output);

function writeModule(exportedObject, outputFilename) {
  const outputString = `module.exports = ${jsFriendlyJSONStringify(exportedObject, null, 2)};\n`;
  fs.writeFileSync(outputFilename, outputString)
}

// source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify
function jsFriendlyJSONStringify(s, replacer, space) {
  return JSON.stringify(s, replacer, space).
    replace(/\u2028/g, '\\u2028').
    replace(/\u2029/g, '\\u2029');
}
