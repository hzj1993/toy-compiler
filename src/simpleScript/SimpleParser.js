import SimpleLexer from './SimpleLexer.js'
import ASTNodeType from './ASTNodeType.js'
import ASTNode from './ASTNode.js'
import TokenType from './TokenType.js'


export default class SimpleParser {
    parse(script) {
        let lexer = new SimpleLexer();
        let tokens = lexer.tokenize(script);
        let nodeRoot = this.prog(tokens);
        return nodeRoot;
    }

    /**
     * 解析AST总入口
     * @param tokens
     * @returns {ASTNode}
     */
    prog(tokens) {
        let node = new ASTNode(ASTNodeType.Programm);

        while (tokens.peek()) {
            let child = this.varDeclare(tokens);

            if (!child) {
                child = this.expressionStatement(tokens);
            }

            if (!child) {
                child = this.assignmentStatement(tokens);
            }

            if (child) {
                node.addChildren(child);
            } else {
                throw new Error('未知语句');
            }
        }

        return node;
    }

    /**
     * 变量声明语句，如：
     * var a;
     * var a = 2 + 3;
     *
     * @param tokens
     */
    varDeclare(tokens) {
        let node = null;
        let token = tokens.peek();
        if (token && token.getType() === TokenType.int) {
            token = tokens.read();
            if (tokens.peek().getType() === TokenType.id) {
                token = tokens.read();
                node = new ASTNode(ASTNodeType.VarDeclaration, token.getText());
                token = tokens.peek();
                if (token && token.getType() === TokenType.assignment) {
                    token = tokens.read();
                    let child = this.additive(tokens);
                    if (child) {
                        node.addChildren(child);
                    } else {
                        throw new Error('非法变量初始化, 应该使用表达式');
                    }
                }
            } else {
                throw new Error('未写入变量名');
            }

            if (token) {
                token = tokens.peek();
                if (token && token.getType() === TokenType.semiColon) {
                    token = tokens.read();
                } else {
                    throw new Error('非法语句, 缺少分号 ";"');
                }
            }
        }
        return node;
    }

    /**
     * 表达式语句
     * @param tokens
     */
    expressionStatement(tokens) {
        let pos = tokens.getPosition();
        let node = this.additive(tokens);
        if (node) {
            let token = tokens.peek();
            if (token && token.getType() === TokenType.semiColon) {
                token = tokens.read();
            } else {
                node = null;
                tokens.setPosition(pos); // 回溯
            }
        }
        return node;
    }

    /**
     * 赋值语句，如
     * a = 12;
     *
     * @param tokens
     */
    assignmentStatement(tokens) {
        let node = null;
        let token = tokens.peek();
        if (token && token.getType() === TokenType.id) {
            token = tokens.read();
            node = new ASTNode(ASTNodeType.AssignmentStmt, token.getText());
            token = tokens.peek();
            if (token && token.getType() === TokenType.assignment) {
                tokens.read();
                let child = this.additive(tokens);
                if (!child) {
                    throw new Error('非法赋值语句, 等号后面需要表达式');
                } else {
                    node.addChildren(child);
                    token = tokens.peek();
                    if (token && token.getType() === TokenType.semiColon) {
                        token = tokens.read();
                    } else {
                        throw new Error('非法语句, 缺少分号');
                    }
                }
            } else {
                tokens.unread();
                node = null;
            }
        }
        return node;
    }

    /**
     * 加法表达式
     * 加法规则：
     * additive: multiplicative (+ multiplicative)*
     * additive: multiplicative (- multiplicative)*
     *
     * @param tokens
     */
    additive(tokens) {
        let child1 = this.multiplicative(tokens);
        let node = child1;
        if (child1) {
            while (true) {
                let token = tokens.peek();
                if (token && (token.getType() === TokenType.plus || token.getType() === TokenType.minus)) {
                    token = tokens.read();
                    let child2 = this.multiplicative(tokens);
                    if (!child2) {
                        throw new Error('invalid additive expression, expecting the right part.');
                    } else {
                        node = new ASTNode(ASTNodeType.Additive, token.getText());
                        node.addChildren(child1);
                        node.addChildren(child2);
                        child1 = node;
                    }
                } else {
                    break;
                }
            }
        }
        return node;
    }

    /**
     * 乘法表达式
     * 乘法规则：
     * multiplicative: pri (* pri)*
     * multiplicative: pri (/ pri)*
     *
     * @param tokens
     */
    multiplicative(tokens) {
        let child1 = this.primary(tokens);
        let node = child1;
        if (child1) {
            while (true) {
                let token = tokens.peek();
                if (token && (token.getType() === TokenType.star || token.getType() === TokenType.slash)) {
                    token = tokens.read();
                    let child2 = this.primary(tokens);
                    if (!child2) {
                        throw new Error('invalid multiplicative expression, expecting the right part.');
                    } else {
                        node = new ASTNode(ASTNodeType.Multiplicative, token.getText());
                        node.addChildren(child1);
                        node.addChildren(child2);
                        child1 = node;
                    }
                } else {
                    break;
                }
            }
        }
        return node;
    }

    /**
     * 基础表达式
     * primary: id | Literal | (expression)
     * @param tokens
     */
    primary(tokens) {
        let node = null;
        let token = tokens.peek();
        if (token) {
            if (token.getType() === TokenType.intLiteral) {
                token = tokens.read();
                node = new ASTNode(ASTNodeType.IntLiteral, token.getText());
            } else if (token.getType() === TokenType.id) {
                token = tokens.read();
                node = new ASTNode(ASTNodeType.Identifier, token.getText());
            } else if (token.getType() === TokenType.leftParen) {
                tokens.read();
                node = this.additive(tokens);
                if (!node) {
                    throw new Error('expecting an additive expression inside parenthesis');
                } else {
                    token = tokens.peek();
                    if (token && token.getType() === TokenType.rightParen) {
                        tokens.read();
                    } else {
                        throw new Error('expecting right parenthesis');
                    }
                }
            }
        }
        return node;
    }
}