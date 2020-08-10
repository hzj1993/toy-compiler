export default class ASTNode {
  constructor() {
    this.parent = null;
    this.children = [];
    this.type = null;
    this.text = '';
  }
  getParent() {
    return this.parent;
  }
  getChildren() {
    return this.children;
  }
  getType() {
    return this.type;
  }
  getText() {
    return this.text;
  }
}