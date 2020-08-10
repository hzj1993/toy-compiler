// 有限状态机状态
const dfaState = {
    initial: 0, // 初始状态
    int: 1, // 变量声明关键字
    idInt1: 2,
    idInt2: 3,
    idInt3: 4,
    id: 5, // 变量标识符
    GT: 6, // 大于
    GE: 7, // 大于等于
    assignment: 8, // 等号
    plus: 9, // 加
    minus: 10, // 减
    star: 11, // 乘
    slash: 12, // 除
    semiColon: 13, // 分号
    leftParen: 14, // (
    rightParen: 15, // )
    intLiteral: 16 // 整型数字
};

// 是否字母
function isAlpha(ch) {
    return ch >= 'a' && ch <= 'z' || ch >= 'A' && ch <= 'Z';
}

// 是否是数字
function isDigit(ch) {
    return ch >= '0' && ch <= '9';
}

// 是否是空白字符
function isBlank(ch) {
    return ch === ' ' || ch === '\t' || ch === '\n';
}

// token读取器
class TokenReader {
    constructor(tokens) {
        this.tokens = tokens;
        this.pos = 0;
    }

    read() {
        return this.pos < this.tokens.length ? this.tokens[this.pos++] : null;
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

let tokens = [];
let token = {
    type: null,
    text: ''
};

function tokenize(code) {
    let pos = 0;
    let ch = code[pos];
    let state = dfaState.initial;

    while (ch !== void 0) {
        switch (state) {
            case dfaState.initial:
                state = initToken(ch);
                break;
            case dfaState.id:
                if (isAlpha(ch) || isDigit(ch)) {
                    token.text += ch;
                } else {
                    state = initToken(ch);
                }
                break;
            case dfaState.GT:
                if (ch === '=') {
                    state = dfaState.GE;
                    token.type = dfaState.GE;
                    token.text += ch;
                } else {
                    state = initToken(ch);
                }
                break;
            case dfaState.GE:
            case dfaState.assignment:
            case dfaState.plus:
            case dfaState.minus:
            case dfaState.star:
            case dfaState.slash:
            case dfaState.leftParen:
            case dfaState.rightParen:
                state = initToken(ch);
                break;
            case dfaState.intLiteral:
                if (isDigit(ch)) {
                    token.text += ch;
                } else {
                    state = initToken(ch);
                }
                break;
            case dfaState.idInt1:
                if (ch === 'a') {
                    state = dfaState.idInt2;
                    token.text += ch;
                } else if (isAlpha(ch) || isDigit(ch)) {
                    state = dfaState.id;
                    token.text += ch;
                } else {
                    state = initToken(ch);
                }
                break;
            case dfaState.idInt2:
                if (ch === 'r') {
                    state = dfaState.idInt3;
                    token.text += ch;
                } else if (isAlpha(ch) || isDigit(ch)) {
                    state = dfaState.id;
                    token.text += ch;
                } else {
                    state = initToken(ch);
                }
                break;
            case dfaState.idInt3:
                if (isBlank(ch)) {
                    token.type = dfaState.int;
                    state = initToken(ch);
                } else {
                    state = dfaState.id;
                    token.text += ch;
                }
                break;
            default:
        }
        ch = code[pos++];
    }
    if (token.text.length) {
        initToken(ch)
    }
}

function initToken(ch) {
    if (token.text.length > 0) {
        tokens.push(token);
        token = {
            type: null,
            text: ''
        };
    }

    let newState;
    if (isAlpha(ch)) {
        newState = ch === 'v' ? dfaState.idInt1 : dfaState.id;
        token.type = ch === 'v' ? dfaState.idInt1 : dfaState.id;
        token.text += ch;
    } else if (isDigit(ch)) {
        newState = dfaState.intLiteral;
        token.type = dfaState.intLiteral;
        token.text += ch;
    } else if (ch === '>') {
        newState = dfaState.GT;
        token.type = dfaState.GT;
        token.text += ch;
    } else if (ch === '+') {
        newState = dfaState.plus;
        token.type = dfaState.plus;
        token.text += ch;
    } else if (ch === '-') {
        newState = dfaState.minus;
        token.type = dfaState.minus;
        token.text += ch;
    } else if (ch === '*') {
        newState = dfaState.star;
        token.type = dfaState.star;
        token.text += ch;
    } else if (ch === '/') {
        newState = dfaState.slash;
        token.type = dfaState.slash;
        token.text += ch;
    } else if (ch === ';') {
        newState = dfaState.semiColon;
        token.type = dfaState.semiColon;
        token.text += ch;
    } else if (ch === '=') {
        newState = dfaState.assignment;
        token.type = dfaState.assignment;
        token.text += ch;
    } else {
        newState = dfaState.initial;
    }
    return newState;
}

function main(code) {
    let token = tokenize(code);
    console.log(token);
}

main('var name = 1;');