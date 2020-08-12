import evaluate from './simpleScript/SimpleCalculator.js'
import SimpleParser from './simpleScript/SimpleParser.js'

let code = '1+2+3+4;';
let parser = new SimpleParser();
let nodeRoot = parser.parse(code);
let result = evaluate(nodeRoot);
console.log('最后结果：', result);
