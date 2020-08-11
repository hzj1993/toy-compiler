export default class ASTNode {
  constructor(type, text) {
    this.parent = null;
    this.children = [];
    this.type = type;
    this.text = text || '';
  }
  addChildren(node) {
    if (node) {
      this.children.push(node);
      node.parent = this;
    }
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