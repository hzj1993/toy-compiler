// 有限状态机状态
export default {
  initial: 0, // 初始状态
  int: 1, // 变量声明关键字
  idInt1: 2,
  idInt2: 3,
  idInt3: 4,
  id: 5, // 变量标识符
  GT: 6, // >
  GE: 7, // >=
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