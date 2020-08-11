import { isAlpha, isDigit, isBlank } from './common.js'
import Token from './Token.js'
import TokenReader from './TokenReader.js'
import TokenType from './TokenType.js'

export default class SimpleLexer {
  constructor() {
    this.tokens = [];
    this.token = new Token();
  }
  tokenize(code) {
    let pos = 0;
    let ch = code[pos];
    let state = TokenType.initial;

    while (ch !== void 0) {
      switch (state) {
        case TokenType.initial:
          state = this.initToken(ch);
          break;
        case TokenType.id:
          if (isAlpha(ch) || isDigit(ch)) {
            this.token.text += ch;
          } else {
            state = this.initToken(ch);
          }
          break;
        case TokenType.GT:
          if (ch === '=') {
            state = TokenType.GE;
            this.token.type = TokenType.GE;
            this.token.text += ch;
          } else {
            state = this.initToken(ch);
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
          state = this.initToken(ch);
          break;
        case TokenType.intLiteral:
          if (isDigit(ch)) {
            this.token.text += ch;
          } else {
            state = this.initToken(ch);
          }
          break;
        case TokenType.idInt1:
          if (ch === 'a') {
            state = TokenType.idInt2;
            this.token.text += ch;
          } else if (isAlpha(ch) || isDigit(ch)) {
            state = TokenType.id;
            this.token.text += ch;
          } else {
            state = this.initToken(ch);
          }
          break;
        case TokenType.idInt2:
          if (ch === 'r') {
            state = TokenType.idInt3;
            this.token.text += ch;
          } else if (isAlpha(ch) || isDigit(ch)) {
            state = TokenType.id;
            this.token.text += ch;
          } else {
            state = this.initToken(ch);
          }
          break;
        case TokenType.idInt3:
          if (isBlank(ch)) {
            this.token.type = TokenType.int;
            state = this.initToken(ch);
          } else {
            state = TokenType.id;
            this.token.text += ch;
          }
          break;
        default:
      }
      ch = code[++pos];
    }
    if (this.token.text.length) {
      this.initToken(ch)
    }
    return new TokenReader(this.tokens);
  }
  initToken(ch) {
    if (this.token.text.length > 0) {
      this.tokens.push(this.token);
      this.token = new Token();
    }

    let newState;
    if (isAlpha(ch)) {
      newState = ch === 'v' ? TokenType.idInt1 : TokenType.id;
      this.token.type = ch === 'v' ? TokenType.idInt1 : TokenType.id;
      this.token.text += ch;
    } else if (isDigit(ch)) {
      newState = TokenType.intLiteral;
      this.token.type = TokenType.intLiteral;
      this.token.text += ch;
    } else if (ch === '>') {
      newState = TokenType.GT;
      this.token.type = TokenType.GT;
      this.token.text += ch;
    } else if (ch === '+') {
      newState = TokenType.plus;
      this.token.type = TokenType.plus;
      this.token.text += ch;
    } else if (ch === '-') {
      newState = TokenType.minus;
      this.token.type = TokenType.minus;
      this.token.text += ch;
    } else if (ch === '*') {
      newState = TokenType.star;
      this.token.type = TokenType.star;
      this.token.text += ch;
    } else if (ch === '/') {
      newState = TokenType.slash;
      this.token.type = TokenType.slash;
      this.token.text += ch;
    } else if (ch === ';') {
      newState = TokenType.semiColon;
      this.token.type = TokenType.semiColon;
      this.token.text += ch;
    } else if (ch === '=') {
      newState = TokenType.assignment;
      this.token.type = TokenType.assignment;
      this.token.text += ch;
    } else {
      newState = TokenType.initial;
    }
    return newState;
  }
}

