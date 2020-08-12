import ASTNodeType from './ASTNodeType.js'

export default function evaluate(node, indent = '') {
    let child1, child2, value1, value2;
    let result = 0;
    console.log(indent + "Calculating: " + node.getType());
    switch (node.getType()) {
        case ASTNodeType.Programm:
            let childs = node.getChildren();
            for (let child of childs) {
                result = evaluate(child, indent + '\t');
            }
            break;
        case ASTNodeType.Additive:
            child1 = node.getChildren()[0];
            value1 = evaluate(child1, indent + '\t');
            child2 = node.getChildren()[1];
            value2 = evaluate(child2, indent + '\t');
            if (node.getText() === '+') {
                result = value1 + value2;
            } else {
                result = value1 - value2;
            }
            break;
        case ASTNodeType.Multiplicative:
            child1 = node.getChildren()[0];
            value1 = evaluate(child1, indent + '\t');
            child2 = node.getChildren()[1];
            value2 = evaluate(child2, indent + '\t');
            if (node.getText() === '*') {
                result = value1 * value2;
            } else {
                result = value1 / value2;
            }
            break;
        case ASTNodeType.IntLiteral:
            result = Number(node.getText());
            break;
        default:
    }
    console.log(indent + "Result: " + result);
    return result;
}