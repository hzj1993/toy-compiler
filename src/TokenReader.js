// token读取器
export default class TokenReader {
  constructor(tokens) {
    this.tokens = tokens;
    this.pos = 0;
  }

  read() {
    return this.pos < this.tokens.length ? this.tokens[++this.pos] : null;
  }

  unread() {
    this.pos > 0 && this.pos--;
  }

  peek() {
    return this.pos < this.tokens.length ? this.tokens[this.pos] : null;
  }

  getPosition() {
    return this.pos;
  }

  setPosition(position) {
    if (position >= 0 && position < this.tokens.length) {
      this.pos = position;
    }
  }
}