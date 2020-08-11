import SimpleParser from './simpleScript/SimpleParser.js'

let parser = new SimpleParser()
let script = 'var name = 1;';
let node = parser.parse(script);
console.log(node);