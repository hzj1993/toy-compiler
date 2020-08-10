export default class Token {
  constructor() {
    this.type = null;
    this.text = '';
  }
  getType() {
    return this.type;
  }
  getText() {
    return this.text;
  }
}