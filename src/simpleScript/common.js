// 是否字母
export function isAlpha(ch) {
  return ch >= 'a' && ch <= 'z' || ch >= 'A' && ch <= 'Z';
}

// 是否是数字
export function isDigit(ch) {
  return ch >= '0' && ch <= '9';
}

// 是否是空白字符
export function isBlank(ch) {
  return ch === ' ' || ch === '\t' || ch === '\n';
}