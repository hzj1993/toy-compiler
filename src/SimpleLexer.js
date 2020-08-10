import { isAlpha, isDigit, isBlank } from './common.js'
import Token from './Token.js'
import TokenReader from './TokenReader.js'
import TokenType from './TokenType.js'


let tokens = [];
let token = new Token();

export function tokenize(code) {
  let pos = 0;
  let ch = code[pos];
  let state = TokenType.initial;

  while (ch !== void 0) {
    switch (state) {
      case TokenType.initial:
        state = initToken(ch);
        break;
      case TokenType.id:
        if (isAlpha(ch) || isDigit(ch)) {
          token.text += ch;
        } else {
          state = initToken(ch);
        }
        break;
      case TokenType.GT:
        if (ch === '=') {
          state = TokenType.GE;
          token.type = TokenType.GE;
          token.text += ch;
        } else {
          state = initToken(ch);
        }
        break;
      case TokenType.GE:
      case TokenType.assignment:
      case TokenType.plus:
      case TokenType.minus:
      case TokenType.star:
      case TokenType.slash:
      case TokenType.leftParen:
      case TokenType.rightParen:
        state = initToken(ch);
        break;
      case TokenType.intLiteral:
        if (isDigit(ch)) {
          token.text += ch;
        } else {
          state = initToken(ch);
        }
        break;
      case TokenType.idInt1:
        if (ch === 'a') {
          state = TokenType.idInt2;
          token.text += ch;
        } else if (isAlpha(ch) || isDigit(ch)) {
          state = TokenType.id;
          token.text += ch;
        } else {
          state = initToken(ch);
        }
        break;
      case TokenType.idInt2:
        if (ch === 'r') {
          state = TokenType.idInt3;
          token.text += ch;
        } else if (isAlpha(ch) || isDigit(ch)) {
          state = TokenType.id;
          token.text += ch;
        } else {
          state = initToken(ch);
        }
        break;
      case TokenType.idInt3:
        if (isBlank(ch)) {
          token.type = TokenType.int;
          state = initToken(ch);
        } else {
          state = TokenType.id;
          token.text += ch;
        }
        break;
      default:
    }
    ch = code[++pos];
  }
  if (token.text.length) {
    initToken(ch)
  }
  return new TokenReader(tokens);
}

function initToken(ch) {
  if (token.text.length > 0) {
    tokens.push(token);
    token = new Token();
  }

  let newState;
  if (isAlpha(ch)) {
    newState = ch === 'v' ? TokenType.idInt1 : TokenType.id;
    token.type = ch === 'v' ? TokenType.idInt1 : TokenType.id;
    token.text += ch;
  } else if (isDigit(ch)) {
    newState = TokenType.intLiteral;
    token.type = TokenType.intLiteral;
    token.text += ch;
  } else if (ch === '>') {
    newState = TokenType.GT;
    token.type = TokenType.GT;
    token.text += ch;
  } else if (ch === '+') {
    newState = TokenType.plus;
    token.type = TokenType.plus;
    token.text += ch;
  } else if (ch === '-') {
    newState = TokenType.minus;
    token.type = TokenType.minus;
    token.text += ch;
  } else if (ch === '*') {
    newState = TokenType.star;
    token.type = TokenType.star;
    token.text += ch;
  } else if (ch === '/') {
    newState = TokenType.slash;
    token.type = TokenType.slash;
    token.text += ch;
  } else if (ch === ';') {
    newState = TokenType.semiColon;
    token.type = TokenType.semiColon;
    token.text += ch;
  } else if (ch === '=') {
    newState = TokenType.assignment;
    token.type = TokenType.assignment;
    token.text += ch;
  } else {
    newState = TokenType.initial;
  }
  return newState;
}
